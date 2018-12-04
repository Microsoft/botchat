<p align="center">
  <a href="https://azure.microsoft.com/en-us/services/bot-service/">
    <img src="https://raw.githubusercontent.com/Microsoft/BotFramework-WebChat/master/doc/abs-logo.png" alt="Azure Bot Services logo" width="240" />
  </a>
</p>

<p align="center">A highly-customizable web-based client for Azure Bot Services.</p>

<p align="center">
  <a href="https://badge.fury.io/js/botframework-webchat"><img alt="npm version" src="https://badge.fury.io/js/botframework-webchat.svg" /></a>
  <a href="https://travis-ci.org/Microsoft/BotFramework-WebChat"><img alt="Build Status" src="https://travis-ci.org/Microsoft/BotFramework-WebChat.svg?branch=master" /></a>
  <a href="https://coveralls.io/github/Microsoft/BotFramework-WebChat?branch=master"><img src="https://coveralls.io/repos/github/Microsoft/BotFramework-WebChat/badge.svg?branch=master" alt="Coverage Status" /></a>
</p>

# How to use

> For previous versions of Web Chat (v3), you can find it [here](https://github.com/Microsoft/BotFramework-WebChat/tree/v3).

First, create a bot using [Azure Bot Service](https://azure.microsoft.com/en-us/services/bot-service/).
Once the bot is created, you will need to [obtain the bot's Web Chat secret](https://docs.microsoft.com/en-us/azure/bot-service/bot-service-channel-connect-webchat?view=azure-bot-service-3.0#step-1) in Azure Portal to use in the code below.

Here is how how you can add Web Chat control to you website:

```html
<!DOCTYPE html>
<html>
  <body>
    <div id="webchat"></div>
    <script src="https://cdn.botframework.com/botframework-webchat/latest/webchat.js"></script>
    <script>
      window.WebChat.renderWebChat({
        directLine: window.WebChat.createDirectLine({ secret: 'YOUR_BOT_SECRET_FROM_AZURE_PORTAL' })
      }, document.getElementById('webchat'));
    </script>
  </body>
</html>
```

![Screenshot of Web Chat](https://raw.githubusercontent.com/Microsoft/BotFramework-WebChat/master/doc/webchat-screenshot.png)

## Integrate with JavaScript

Web Chat is designed to integrate with your existing web site using JavaScript or React. Integrating with JavaScript will give you moderate styling and customizability.

### Full bundle

You can use the full, typical webchat package that contains the most typically used features.

```html
<!DOCTYPE html>
<html>
  <body>
    <div id="webchat"></div>
    <script src="https://cdn.botframework.com/botframework-webchat/latest/webchat.js"></script>
    <script>
      window.WebChat.renderWebChat({
        directLine: window.WebChat.createDirectLine({ token: 'YOUR_BOT_SECREET' })
      }, document.getElementById('webchat'));
    </script>
  </body>
</html>
```

See a working sample with full Web Chat bundle [here](https://github.com/Microsoft/BotFramework-WebChat/tree/master/samples/full-bundle/).

### Minimal bundle

Instead of using the full, typical package of Web Chat, you can choose a lighter-weight sample with fewer features. This bundle does not contain:
- Adaptive Cards
- Cognitive Services
- Markdown-It

Since Adaptive Cards is not include in this bundle, rich cards that depends on Adaptive Cards will not render, e.g. hero card, receipt card, etc. List of attachments that are not supported without Adaptive Cards can be found [here](https://github.com/Microsoft/BotFramework-WebChat/tree/master/packages/component/src/Middleware/Attachment/createAdaptiveCardMiddleware.js).

See a working sample with minimal Web Chat bundle [here](https://github.com/Microsoft/BotFramework-WebChat/tree/master/samples/minimal-bundle/).

```html
<!DOCTYPE html>
<html>
  <body>
    <div id="webchat"></div>
    <script src="https://cdn.botframework.com/botframework-webchat/latest/webchat-minimal.js"></script>
    <script>
      window.WebChat.renderWebChat({
        directLine: window.WebChat.createDirectLine({ token: 'YOUR_BOT_SECRET' })
      }, document.getElementById('webchat'));
    </script>
  </body>
</html>
```

## Integrate with React

For full customizability, you can use React to recompose components of Web Chat.

To install the production build from NPM, run `npm install botframework-webchat`.

```jsx
import DirectLine from 'botframework-directlinejs';
import React from 'react';
import ReactWebChat from 'botframework-webchat';

export default class extends React.Component {
  constructor(props) {
    super(props);

    this.directLine = new DirectLine({ token: 'YOUR_BOT_SECRET' });
  }

  render() {
    return (
      <ReactWebChat directLine={ this.directLine } />
      element
    );
  }
}
```

> You can also run `npm install botframework-webchat@master` to install a development build that sync with GitHub `master` branch.

See a working sample with Web Chat rendered by React [here](https://github.com/Microsoft/BotFramework-WebChat/tree/master/samples/integrate-with-react/).

# Customize Web Chat UI

Web Chat is designed to be customizable without forking the source code. The table below outlines what kind of customizations you can achieve when you are importing Web Chat in different ways. This list is not exhaustive.

| | CDN bundle | React |
| - | - | - |
| Change colors | Yes | Yes |
| Change sizes | Yes | Yes |
| Update/replace CSS styles | Yes | Yes |
| Listen to events | Yes | Yes |
| Interact with hosting webpage | Yes | Yes |
| Custom render activities | | Yes |
| Custom render attachments | | Yes |
| Add new UI components | | Yes |
| Recompose the whole UI | | Yes |

See more about [customizing Web Chat](https://github.com/Microsoft/BotFramework-WebChat/blob/master/SAMPLES.md) to learn more on customization.

# Building the project

> If you need to build this project for customization purpose, we strongly advise you to refer to our [samples](https://github.com/Microsoft/BotFramework-WebChat/tree/master/samples). If you cannot find any samples that could fulfill your customization needs and you don't know how to do that, please [send your dream to us](https://github.com/Microsoft/BotFramework-WebChat/issues/).
>
> Forking Web Chat for customizations means you will lose access to our latest updates. And maintaining forks also introduce chores that is substantially more complicated than version bump.

To build Web Chat, you will need to make sure both your Node.js and NPM is latest version (either LTS or current).

```sh
npm install
npm run bootstrap
npm run build
```

## Build tasks

There are 3 types of build tasks in the build process.

- `npm run build`: Build for development (instrumented code for code coverage)
   - Will bundle as `webchat-instrumented*.js`
- `npm run watch`: Build for development with watch mode loop
- `npm run prepublishOnly`: Build for production
   - Will bundle as `webchat*.js`

## Testing Web Chat for development purpose

We built a playground app for testing Web Chat so we can test certain Web Chat specific features.

```sh
cd packages/playground
npm start
```

Then browse to http://localhost:3000/, and click on one of the connection options on upper right corner.

- Official MockBot: we hosted a live demo bot for testing Web Chat features
- Emulator Core: it will connect to http://localhost:5000/v3/directline for [emulated Direct Line service](https://github.com/Microsoft/BotFramework-Emulator/tree/master/packages/emulator/cli/)

You are also advised to test the CDN bundles by copying the test harness from our samples.

## Building CDN bundle in development mode

Currently, the standard build script does not build CDN bundle (`webchat*.js`).

```sh
cd packages/bundle
npm run webpack-dev
```

> By default, this script will run in watch mode.

## Building CDN bundle in production mode

If you want to build a production CDN bundle with minification, you can follow these steps.

```sh
cd packages/bundle
npm run prepublishOnly
```

# Samples list

| Description                                                                                                                                                                                                                                                                                                                        | Link                                                                                          |
|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------|
| **[`1.a.getting-started-full-bundle`](https://github.com/Microsoft/BotFramework-WebChat/tree/master/samples/1.a.getting-started-full-bundle)**<br /><br />Introduces Web Chat embed from a CDN, and demonstrates a simple, full-featured Web Chat. This includes Adaptive Cards, Cognitive Services, and Markdown-It dependencies. | [Live demo](https://microsoft.github.io/BotFramework-WebChat/1.a.getting-started-full-bundle) |

| Sample Name                                                                                                                                | Description                                                                                                                                                                                                                         | Link                                                                                          |
|--------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------|
| [`1.a.getting-started-full-bundle`](https://github.com/Microsoft/BotFramework-WebChat/tree/master/samples/1.a.getting-started-full-bundle) | Introduces Web Chat embed from a CDN, and demonstrates a simple, full-featured Web Chat. This includes Adaptive Cards, Cognitive Services, and Markdown-It dependencies.                                                            | [Live demo](https://microsoft.github.io/BotFramework-WebChat/1.a.getting-started-full-bundle) |

| Sample Name                              | Description                                                                                                                                                                                                                         | Bot                                                                                                   | Link                                                                                                                   |
|------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------|
| 1.a.getting-started-full-bundle          | Introduces Web Chat embed from a CDN, and demonstrates a simple, full-featured Web Chat. This includes Adaptive Cards, Cognitive Services, and Markdown-It dependencies.                                                            | [Test bot](https://microsoft.github.io/BotFramework-WebChat/1.a.getting-started-full-bundle)          | [View](https://github.com/Microsoft/BotFramework-WebChat/tree/master/samples/1.a.getting-started-full-bundle)          |
| 1.b.getting-started-es5-bundle           | Introduces full-featured Web Chat embed with backwards compatibility for ES5 browsers using Web Chat's ES5 ponyfill.                                                                                                                | [Test bot](https://microsoft.github.io/BotFramework-WebChat/1.b.getting-started-es5-bundle)           | [View](https://github.com/Microsoft/BotFramework-WebChat/blob/master/samples/1.b.getting-started-es5-bundle)           |
| 1.c.getting-started-migration            | Demonstrates how to migrate from your Web Chat v3 bot to v4.                                                                                                                                                                        | [Test bot](https://microsoft.github.io/BotFramework-WebChat/1.c.getting-started-migration)            | [View](https://github.com/Microsoft/BotFramework-WebChat/blob/master/samples/1.c.getting-started-migration)            |
| 2.a.getting-started-minimal-bundle       | Introduces the minimized CDN with only basic dependencies. This does NOT include Adaptive Cards, Cognitive Services dependencies, or Markdown-It dependencies.                                                                      | [Test bot](https://microsoft.github.io/BotFramework-WebChat/2.a.getting-started-minimal-bundle)       | [View](https://github.com/Microsoft/BotFramework-WebChat/tree/master/samples/2.a.getting-started-minimal-bundle)       |
| 2.b.getting-started-minimal-markdown     | Demonstrates how to add the CDN for Markdown-It dependency on top of the minimal bundle.                                                                                                                                            | [Test bot](https://microsoft.github.io/BotFramework-WebChat/2.b.getting-started-minimal-markdown)     | [View](https://github.com/Microsoft/BotFramework-WebChat/tree/master/samples/2.b.getting-started-minimal-markdown)     |
| 3.a.host-with-react                      | Demonstrates how to create a React component that hosts the full-featured Web Chat.                                                                                                                                                 | [Test bot](https://microsoft.github.io/BotFramework-WebChat/3.a.host-with-react)                      | [View](https://github.com/Microsoft/BotFramework-WebChat/tree/master/samples/3.a.host-with-react)                      |
| 3.b.host-with-Angular5                   | Demonstrates how to create an Angular component that hosts the full-featured Web Chat.                                                                                                                                              |                                                                                                       | [not available](https://github.com/Microsoft/BotFramework-WebChat/issues/1423)                                         |
| 4.display-user-bot-initials-styling      | Demonstrates how to display initials for both Web Chat participants.                                                                                                                                                                | [Test bot](https://microsoft.github.io/BotFramework-WebChat/4.display-user-bot-initials-styling)      | [View](https://github.com/Microsoft/BotFramework-WebChat/blob/master/samples/4.display-user-bot-initials-styling)      |
| 5.a.branding-webchat-styling             | Introduces the ability to style Web Chat to match your brand. This method of custom styling will not break upon Web Chat updates.                                                                                                   | [Test bot](https://microsoft.github.io/BotFramework-WebChat/5.a.branding-webchat-styling)             | [View](https://github.com/Microsoft/BotFramework-WebChat/tree/master/samples/5.a.branding-webchat-styling)             |
| 5.b.idiosyncratic-manual-styling         | Demonstrates how to make manual style changes, and is a more complicated and time-consuming way to customize styling of Web Chat. Manual styles may be broken upon Web Chat updates.                                                | [Test bot](https://microsoft.github.io/BotFramework-WebChat/5.b.idiosyncratic-manual-styling)         | [View](https://github.com/Microsoft/BotFramework-WebChat/blob/master/samples/5.b.idiosyncratic-manual-styling/)        |
| 5.c.presentation-mode-styling            | Demonstrates how to set up Presentation Mode, which displays chat history but does not show the send box, and disables the interactivity of Adaptive Cards.                                                                         | [Test bot](https://microsoft.github.io/BotFramework-WebChat/5.c.presentation-mode-styling)            | [View](https://github.com/Microsoft/BotFramework-WebChat/blob/master/samples/5.c.presentation-mode-styling)            |
| 6.a.cognitive-services-bing-speech-js    | Introduces speech-to-text and text-to-speech ability using the (deprecated) Cognitive Services Bing Speech API and JavaScript.                                                                                                      | [Test bot](https://microsoft.github.io/BotFramework-WebChat/6.a.cognitive-services-bing-speech-js)    | [View](https://github.com/Microsoft/BotFramework-WebChat/tree/master/samples/6.a.cognitive-services-bing-speech-js)    |
| 6.b.cognitive-services-bing-speech-react | Introduces speech-to-text and text-to-speech ability using the (deprecated) Cognitive Services Bing Speech API and React.                                                                                                           | [Test bot](https://microsoft.github.io/BotFramework-WebChat/6.b.cognitive-services-bing-speech-react) | [View](https://github.com/Microsoft/BotFramework-WebChat/tree/master/samples/6.b.cognitive-services-bing-speech-react) |
| 6.d.cognitive-services-speech-services   | Introduces speech-to-text and text-to-speech ability using Cognitive Services Speech Services API.                                                                                                                                  |                                                                                                       | [not available](https://github.com/Microsoft/BotFramework-WebChat/issues/1424)                                         |
| 6.e.speech-web-browser                   | Demonstrates how to implement text-to-speech using Web Chat's browser-based Web Speech API. (link to W3C standard in the sample)                                                                                                    | [Test bot](https://microsoft.github.io/BotFramework-WebChat/6.e.speech-web-browser)                   | [View](https://github.com/Microsoft/BotFramework-WebChat/tree/master/samples/6.e.speech-web-browser)                   |
| 7.customization-timestamp-grouping       | Demonstrates how to customize timestamps by showing or hiding timestamps and changing the grouping of messages by time.                                                                                                             | [Test bot](https://microsoft.github.io/BotFramework-WebChat/7.customization-timestamp-grouping)       | [View](https://github.com/Microsoft/BotFramework-WebChat/blob/master/samples/7.customization-timestamp-grouping)       |
| 8.customization-user-highlighting        | Demonstrates how to customize the styling of activities based whether the message is from the user or the bot.                                                                                                                      | [Test bot](https://microsoft.github.io/BotFramework-WebChat/8.customization-user-highlighting)        | [View](https://github.com/Microsoft/BotFramework-WebChat/tree/master/samples/8.customization-user-highlighting)        |
| 9.customization-reaction-buttons         | Introduces the ability to create custom components for Web Chat that are unique to your bot's needs. This tutorial demonstrates the ability to add reaction emoji such as :thumbsup: and :thumbsdown: to conversational activities. | [Test bot](https://microsoft.github.io/BotFramework-WebChat/9.customization-reaction-buttons)         | [View](https://github.com/Microsoft/BotFramework-WebChat/blob/master/samples/9.customization-reaction-buttons/)        |
| 10.customization-card-components         | Demonstrates how to create custom activity card attachments, in this case GitHub repository cards.                                                                                                                                  | [Test bot](https://microsoft.github.io/BotFramework-WebChat/10.customization-card-components)         | [View](https://github.com/Microsoft/BotFramework-WebChat/tree/master/samples/10.customization-card-components)         |
| 11.customization-redux-actions           | Advanced tutorial: Demonstrates how to incorporate redux middleware into your Web Chat app by sending redux actions through the bot. This example demonstrates manual styling based on activities between bot and user.             | [Test bot](https://microsoft.github.io/BotFramework-WebChat/11.customization-redux-actions)           | [View](https://github.com/Microsoft/BotFramework-WebChat/tree/master/samples/11.customization-redux-actions)           |
| 12.customization-minimizable-web-chat    | Advanced tutorial: Demonstrates how to add the Web Chat interface to your website as a minimizable show/hide chat box.                                                                                                              | [Test bot](https://microsoft.github.io/BotFramework-WebChat/12.customization-minimizable-web-chat)    | [View](https://github.com/Microsoft/BotFramework-WebChat/tree/master/samples/12.customization-minimizable-web-chat)    |
| 13.customization-speech-ui               | Advanced tutorial: Demonstrates how to fully customize key components of your bot, in this case speech, which entirely replaces the text-based transcript UI and instead shows a simple speech button with the bot's response.      | [Test bot](https://microsoft.github.io/BotFramework-WebChat/13.customization-speech-ui)               | [View](https://github.com/Microsoft/BotFramework-WebChat/tree/master/samples/13.customization-speech-ui)               |
| 14.customization-piping-to-redux         | Advanced tutorial: Demonstrates how to pipe bot activities to your own Redux store and use your bot to control your page through bot activities and Redux.                                                                          | [Test bot](https://microsoft.github.io/BotFramework-WebChat/14.customization-piping-to-redux)         | [View](https://github.com/Microsoft/BotFramework-WebChat/tree/master/samples/14.customization-piping-to-redux)         |

# Contributions

Like us? [Star](https://github.com/Microsoft/BotFramework-WebChat/stargazers) us.

Want to make it better? [File](https://github.com/Microsoft/BotFramework-WebChat/issues) us an issue.

Don't like something you see? [Submit](https://github.com/Microsoft/BotFramework-WebChat/pulls) a pull request.
