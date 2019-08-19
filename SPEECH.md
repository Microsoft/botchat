# Using Cognitive Services Speech Services

This guide is for integrating speech-to-text and text-to-speech functionality of Azure Cognitive Services.

We assume you have already set up a bot and have Web Chat running on a page.

> Sample code in this article are optimized for modern browsers. You may need to use a transpiler  (e.g. [Babel](https://babeljs.io/)) to target broader range of browsers.

## Browser requirements

In order to use speech functionality in Web Chat, browser would need to provide minimum media capabilities, including recording from microphone and playing audio clips.

### Speech-to-text

Speech-to-text requires:

- [WebRTC support](https://caniuse.com/#feat=rtcpeerconnection) in browser
   - All modern browsers, excluding Internet Explorer 11
- Hosted over HTTPS
- User permission explicitly given for microphone access

On iOS, Safari is the only browser that support WebRTC. Both Chrome and Edge on iOS does not support WebRTC. Moreover, native apps built using `WKWebView` do not support WebRTC. This would include apps built using Cordova/PhoneGap and React Native.

### Text-to-speech

Text-to-speech requires:

- [Web Audio API support](https://caniuse.com/#feat=audio-api) in browser
   - All modern browsers, excluding Internet Explorer 11

#### Special considerations for Safari on Mac OS and iOS

To play an audio clip, Safari requires additional permission granted *implicitly* by the user. The user would need to perform an interaction (click/tap/type) before any audio clips can be played.

Web Chat will play a very short and silent audio clip when the user tap on the send button. This will enable Web Chat to play any audio clip during the browser session. If you customize Web Chat to perform any text-to-speech operations before any user gestures, Web Chat will be blocked by Safari.

In order to workaround with this requirement, you can present a splash screen with a tap-to-continue button, which would ready the engine by sending an empty utterance.

## Setting up Web Chat

Web Chat is bundled with Web Speech API adapter for Cognitive Services.

### Setting up your Azure subscription

You will need to obtain a subscription key for your Azure Cognitive Services subscription. Please follow instructions on [this page](https://azure.microsoft.com/en-us/try/cognitive-services/my-apis/#speech) to obtain a subscription key.

To prevent leaking your subscription key, you should build/host a server which use your subscription key to generate authorization token, and send only the authorization token to client. You can find [more information about authorization token in this article](https://docs.microsoft.com/en-us/azure/cognitive-services/authentication).

> To use the [voices powered by deep neural network](https://azure.microsoft.com/en-us/blog/microsoft-s-new-neural-text-to-speech-service-helps-machines-speak-like-people/), you might need to have a subscription in "West US 2" region.

### Integrating Web Chat into your page

This integration code is excerpted from a [sample named "Integrating with Cognitive Services Speech Services"](https://github.com/microsoft/BotFramework-WebChat/tree/master/samples/06.c.cognitive-services-speech-services-js).

> To focus on the integration code, we simplified from the original by using subscription key instead of authorization token. You should always use authorization token for production systems.

```js
const {
  createCognitiveServicesSpeechServicesPonyfillFactory,
  createDirectLine,
  renderWebChat
} = window.WebChat;

renderWebChat({
  directLine: createDirectLine({
    secret: 'YOUR_DIRECT_LINE_SECRET'
  }),
  language: 'en-US',
  webSpeechPonyfillFactory: await createCognitiveServicesSpeechServicesPonyfillFactory({
    region: 'YOUR_REGION',
    subscriptionKey: 'YOUR_SUBSCRIPTION_KEY'
  })
}, document.getElementById('webchat'));
```

After adding the ponyfill factory, you should be able to see microphone button in Web Chat.

## Additional features

These features are for improving the overall user experiences.

- [Selecting different voice](#selecting-difference-voice)
- [Custom Speech](#custom-speech)
- [Custom Voice](#custom-voice)
- [Text-to-speech audio format](#text-to-speech-audio-format)
- [Inverse text normalization option](#inverse-text-normalization-option)
- [Disabling telemetry](#disabling-telemetry)
- [Using authorization token](#using-authorization-token)
- [Using two subscription keys for speech-to-text and text-to-speech](#using-two-subscription-keys-for-speech-to-text-and-text-to-speech)

### Selecting different voice

(TBD)

### Custom Speech

Custom Speech is a trained model to improve recognition of words that are not in the default recognition model. For example, you can use it to improve accuracy when recognizing trademarks or people names.

First, you will need to set up a Custom Speech project. Please follow [this article to create a new Custom Speech project](https://docs.microsoft.com/en-us/azure/cognitive-services/speech-service/how-to-custom-speech).

After your Custom Speech project is set up and a model is published to a deployment endpoint, in the "Deployment" tab, save the "Endpoint ID".

You will then modify your integration code as below.

```diff
  renderWebChat({
    directLine: createDirectLine({
      secret: 'YOUR_DIRECT_LINE_SECRET'
    }),
    language: 'en-US',
    webSpeechPonyfillFactory: await createCognitiveServicesSpeechServicesPonyfillFactory({
      region: 'YOUR_REGION',
+     speechRecognitionEndpointId: 'YOUR_ENDPOINT_ID',
      subscriptionKey: 'YOUR_SUBSCRIPTION_KEY'
    })
  }, document.getElementById('webchat'));
```

### Custom Voice

Custom Voice is a trained model for providing your user with an unique voice when performing text-to-speech.

First, you will need to set up a Custom Voice project. Please follow [this article to create a new Custom Voice project](https://docs.microsoft.com/en-us/azure/cognitive-services/speech-service/how-to-custom-voice).

After your Custom Voice project is set up and a model is published to a deployment endpoint, in the "Deployment" tab, save the "Model / Voice name" and "Endpoint URL".

You will then modify your integration code as below.

```diff
  renderWebChat({
    directLine: createDirectLine({
      secret: 'YOUR_DIRECT_LINE_SECRET'
    }),
    language: 'en-US',
    webSpeechPonyfillFactory: await createCognitiveServicesSpeechServicesPonyfillFactory({
      region: 'YOUR_REGION',
+     speechSynthesisDeploymentId: 'YOUR_DEPLOYMENT_ID',
      subscriptionKey: 'YOUR_SUBSCRIPTION_KEY'
    })
  }, document.getElementById('webchat'));
```

(TBD)

### Text-to-speech audio format

To conserve bandwidth, you can set the text-to-speech audio format to a format that consume less bandwidth by modifying your integration code as below.

```diff
  renderWebChat({
    directLine: createDirectLine({
      secret: 'YOUR_DIRECT_LINE_SECRET'
    }),
    language: 'en-US',
    webSpeechPonyfillFactory: await createCognitiveServicesSpeechServicesPonyfillFactory({
      region: 'YOUR_REGION',
+     speechSynthesisOutputFormat: 'audio-24khz-48kbitrate-mono-mp3',
      subscriptionKey: 'YOUR_SUBSCRIPTION_KEY'
    })
  }, document.getElementById('webchat'));
```

Please refer to [this article for list of supported audio formats](https://docs.microsoft.com/en-us/azure/cognitive-services/speech-service/rest-text-to-speech#audio-outputs).

### Inverse text normalization option

Inverse text normalization (a.k.a. ITN), is an option to modify how the engine is normalizing text. For example, when the end-user say, "I would like to order 2 4-piece of chicken nuggets." It could be recognized as "two four piece" (default) or "2 four piece" (ITN).

You can read more about [various text normalization options in this article](https://github.com/MicrosoftDocs/azure-docs/blob/master/articles/cognitive-services/Speech-Service/rest-speech-to-text.md#response-parameters).

You will modify your integration code as below.

```diff
  renderWebChat({
    directLine: createDirectLine({
      secret: 'YOUR_DIRECT_LINE_SECRET'
    }),
    language: 'en-US',
    webSpeechPonyfillFactory: await createCognitiveServicesSpeechServicesPonyfillFactory({
      region: 'YOUR_REGION',
      subscriptionKey: 'YOUR_SUBSCRIPTION_KEY',
+     textNormalization: 'itn'
    })
  }, document.getElementById('webchat'));
```

> You can pass `"display"` (default), `"itn"`, `"lexical"`, and `"maskeditn"`.

### Disabling telemetry

By default, [Azure Cognitive Services are collecting telemetry for service performance](https://github.com/Microsoft/cognitive-services-speech-sdk-js#data--telemetry). If you prefer to disable telemetry, modify the code as below.

```diff
  renderWebChat({
    directLine: createDirectLine({
      secret: 'YOUR_DIRECT_LINE_SECRET'
    }),
    language: 'en-US',
    webSpeechPonyfillFactory: await createCognitiveServicesSpeechServicesPonyfillFactory({
+     enableTelemtry: false,
      region: 'YOUR_REGION',
      subscriptionKey: 'YOUR_SUBSCRIPTION_KEY',
    })
  }, document.getElementById('webchat'));
```

### Using authorization token

In our sample, we are using subscription key. If you prfer to use authorization token, you can pass a Promise function that could be potentially a network call.

```diff
  async function fetchAuthorizationToken() {
    const res = await fetch('/api/speechtoken');

    if (res.ok) {
      return await res.text();
    } else {
      throw new Error('Failed to retrieve authorization token for Cognitive Services.');
    }
  }

  renderWebChat({
    directLine: createDirectLine({
      secret: 'YOUR_DIRECT_LINE_SECRET'
    }),
    language: 'en-US',
    webSpeechPonyfillFactory: await createCognitiveServicesSpeechServicesPonyfillFactory({
+     // Note we are passing the function, but not the result of the function call, there is no () behind it
+     authorizationToken: fetchAuthorizationToken,
      region: 'YOUR_REGION',
-     subscriptionKey: 'YOUR_SUBSCRIPTION_KEY',
    })
  }, document.getElementById('webchat'));
```

The function passed to `fetchAuthorizationToken` will be called *every time* a token is needed. If simplicity, token caching is not handled in this sample code. You should add caching based on the validity of the token.

### Using two subscription keys for speech-to-text and text-to-speech

In some cases, you may need to use two different Cognitive Services subscription, one for speech-to-text and one for text-to-speech. You could create two ponyfills and merge them together as another ponyfill.

```diff
+ const speechToTextPonyfillFactory = await createCognitiveServicesSpeechServicesPonyfillFactory({
+   region: 'YOUR_STT_REGION',
+   subscriptionKey: 'YOUR_STT_SUBSCRIPTION_KEY',
+ });

+ const textToSpeechPonyfillFactory = await createCognitiveServicesSpeechServicesPonyfillFactory({
+   region: 'YOUR_TTS_REGION',
+   subscriptionKey: 'YOUR_TTS_SUBSCRIPTION_KEY',
+ });

  renderWebChat({
    directLine: createDirectLine({
      secret: 'YOUR_DIRECT_LINE_SECRET'
    }),
    language: 'en-US',
-   webSpeechPonyfillFactory: await createCognitiveServicesSpeechServicesPonyfillFactory({
-     region: 'YOUR_REGION',
-     subscriptionKey: 'YOUR_SUBSCRIPTION_KEY',
-   })
    webSpeechPonyfillFactory: options => {
      const { SpeechGrammarList, SpeechRecognition } = speechToTextPonyfillFactory(options);
      const { speechSynthesis, SpeechSynthesisUtterance } = textToSpeechPonyfillFactory(options);

      return {
        SpeechGrammarList,
        SpeechRecognition,
        speechSynthesis,
        SpeechSynthesisUtterance
      };
    }
  }, document.getElementById('webchat'));
```

> Note: it is correct that `speechSynthesis` is in camel-casing, while others are in Pascal-casing.
