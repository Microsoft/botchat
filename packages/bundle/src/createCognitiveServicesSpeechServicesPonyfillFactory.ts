import { AudioConfig } from 'microsoft-cognitiveservices-speech-sdk';
import { WebSpeechPonyfillFactory } from 'botframework-webchat-api';
import createPonyfill from 'web-speech-cognitive-services/lib/SpeechServices';

import CognitiveServicesCredentials from './types/CognitiveServicesCredentials';
import createAudioContext from './speech/createAudioContext';
import MicrophoneAudioInputStream from './speech/MicrophoneAudioInputStream';

type CognitiveServicesAudioOutputFormat =
  | 'audio-16khz-128kbitrate-mono-mp3'
  | 'audio-16khz-32kbitrate-mono-mp3'
  | 'audio-16khz-64kbitrate-mono-mp3'
  | 'audio-24khz-160kbitrate-mono-mp3'
  | 'audio-24khz-48kbitrate-mono-mp3'
  | 'audio-24khz-96kbitrate-mono-mp3'
  | 'audio-48khz-192kbitrate-mono-mp3'
  | 'audio-48khz-96kbitrate-mono-mp3'
  | 'ogg-16khz-16bit-mono-opus'
  | 'ogg-24khz-16bit-mono-opus'
  | 'ogg-48khz-16bit-mono-opus'
  | 'raw-16khz-16bit-mono-pcm'
  | 'raw-16khz-16bit-mono-truesilk'
  | 'raw-24khz-16bit-mono-pcm'
  | 'raw-24khz-16bit-mono-truesilk'
  | 'raw-48khz-16bit-mono-pcm'
  | 'raw-8khz-8bit-mono-alaw'
  | 'raw-8khz-8bit-mono-mulaw'
  | 'riff-16khz-16bit-mono-pcm'
  | 'riff-24khz-16bit-mono-pcm'
  | 'riff-48khz-16bit-mono-pcm'
  | 'riff-8khz-8bit-mono-alaw'
  | 'riff-8khz-8bit-mono-mulaw'
  | 'webm-16khz-16bit-mono-opus'
  | 'webm-24khz-16bit-mono-opus';

export default function createCognitiveServicesSpeechServicesPonyfillFactory({
  audioConfig,
  audioContext,
  audioInputDeviceId,
  credentials,
  enableTelemetry,
  speechRecognitionEndpointId,
  speechSynthesisDeploymentId,
  speechSynthesisOutputFormat,
  textNormalization
}: {
  audioConfig?: AudioConfig;
  audioContext?: AudioContext;
  audioInputDeviceId?: string;
  credentials: CognitiveServicesCredentials;
  enableTelemetry?: boolean;
  speechRecognitionEndpointId?: string;
  speechSynthesisDeploymentId?: string;
  speechSynthesisOutputFormat?: CognitiveServicesAudioOutputFormat;
  textNormalization?: 'display' | 'itn' | 'lexical' | 'maskeditn';
}): WebSpeechPonyfillFactory {
  if (!window.navigator.mediaDevices && !audioConfig) {
    console.warn(
      'botframework-webchat: Your browser does not support Web Audio or the page is not loaded via HTTPS or localhost. Cognitive Services Speech Services is disabled. However, you may pass a custom AudioConfig to enable speech in this environment.'
    );

    return () => ({});
  }

  if (audioConfig) {
    if (audioInputDeviceId) {
      console.warn(
        'botframework-webchat: "audioConfig" and "audioInputDeviceId" cannot be set at the same time; ignoring "audioInputDeviceId".'
      );
    }

    if (audioContext) {
      console.warn(
        'botframework-webchat: "audioConfig" and "audioContext" cannot be set at the same time; ignoring "audioContext" for speech recognition.'
      );
    }
  } else {
    // WORKAROUND: We should prevent AudioContext object from being recreated because they may be blessed and UX-wise expensive to recreate.
    //             In Cognitive Services SDK, if they detect the "end" function is falsy, they will not call "end" but "suspend" instead.
    //             And on next recognition, they will re-use the AudioContext object.

    audioContext || (audioContext = createAudioContext());
    audioConfig = AudioConfig.fromStreamInput(
      new MicrophoneAudioInputStream({
        audioConstraints: audioInputDeviceId ? { deviceId: audioInputDeviceId } : true,
        audioContext,
        telemetry: enableTelemetry ? true : undefined
      })
    );
  }

  return ({ referenceGrammarID } = {}) => {
    const { SpeechGrammarList, SpeechRecognition, speechSynthesis, SpeechSynthesisUtterance } = createPonyfill({
      audioConfig,
      audioContext,
      credentials,
      enableTelemetry,
      referenceGrammars: referenceGrammarID ? [`luis/${referenceGrammarID}-PRODUCTION`] : [],
      speechRecognitionEndpointId,
      speechSynthesisDeploymentId,
      speechSynthesisOutputFormat,
      textNormalization
    });

    return {
      resumeAudioContext: () => audioContext.state === 'suspended' && audioContext.resume(),
      SpeechGrammarList,
      SpeechRecognition,
      speechSynthesis,
      SpeechSynthesisUtterance
    };
  };
}
