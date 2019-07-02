const { ActivityHandler, TurnContext } = require("botbuilder");
const bytes = require("bytes");

const createBotAdapter = require("./createBotAdapter");

const {
  Aborter,
  BlockBlobURL,
  SharedKeyCredential,
  StorageURL
} = require("@azure/storage-blob");

const { AZURE_STORAGE_ACCOUNT_KEY, AZURE_STORAGE_ACCOUNT_NAME } = process.env;

module.exports = () => {
  const bot = new ActivityHandler();

  // Handler for "event" activity.
  bot.onEvent(async (context, next) => {
    const {
      activity: { name, value }
    } = context;

    // Intercepts all "upload" event activities.
    if (name === "upload") {
      // For async operations that are outside of BotBuilder, we should use proactive messaging.
      const reference = TurnContext.getConversationReference(context.activity);

      // The file upload validation could take more than a second, we should send a typing indicator.
      await context.sendActivity({ type: "typing" });

      const { files } = value;
      const pipeline = StorageURL.newPipeline(
        new SharedKeyCredential(
          AZURE_STORAGE_ACCOUNT_NAME,
          AZURE_STORAGE_ACCOUNT_KEY
        )
      );

      const properties = await Promise.all(
        files.map(file => {
          // You should verify the URL if it is from the blob account and container that this service owned.

          const blockBlobURL = new BlockBlobURL(file, pipeline);

          // After the bot receive the URL, it should validate its content and associate it with user ID.
          // If the content should be kept for longer than a day, it should copy it to another blob container because we set up a rule to clean the storage daily.

          return blockBlobURL.getProperties(Aborter.timeout(5000));
        })
      );

      const adapter = createBotAdapter();

      // Resumes the conversation when everything is ready.
      await adapter.continueConversation(reference, async context => {
        await context.sendActivity({
          attachmentLayout: "carousel",
          attachments: properties.map(
            ({ contentLength, metadata: { name } }, index) => ({
              contentType: "application/vnd.microsoft.card.thumbnail",
              content: {
                buttons: [
                  {
                    // Although we send the blob URL back to the user, since it does not contains SAS, it is not actually downloadable.
                    // We put the blob URL here for completeness only. Because nevertheless, the user already obtained that URL in order to upload.
                    title: "Get blob URL",
                    type: "openurl",
                    value: files[index]
                  }
                ],
                images: [
                  {
                    alt: "",
                    url: "/document.png"
                  }
                ],
                subtitle: bytes(contentLength, { unitSeparator: " " }),
                title: name
              }
            })
          ),
          text:
            "Here is your upload summary.\n\nWe will clean up daily and will not redistribute your uploads.",
          type: "message"
        });
      });
    } else {
      await next();
    }
  });

  // Handler for "message" activity
  bot.onMessage(async (context, next) => {
    await context.sendActivity("Please upload one or more files.");
    await next();
  });

  return bot;
};
