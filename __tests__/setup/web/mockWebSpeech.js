const { defineEventAttribute } = (EventTarget = window.EventTargetShim);
const NULL_FN = () => 0;

function createSpeechRecognitionResults(isFinal, transcript) {
  const results = [
    [
      {
        confidence: 0.9,
        transcript
      }
    ]
  ];

  results[0].isFinal = isFinal;

  return results;
}

function createProducerConsumer() {
  const consumers = [];
  const queue = [];

  return {
    cancel() {
      queue = [];
    },
    consume(consumer) {
      consumers.push(consumer);
      queue.length && consumers.shift()(...queue.shift());
    },
    hasConsumer() {
      return !!consumers.length;
    },
    peek() {
      return queue[0];
    },
    produce(...args) {
      queue.push(args);
      consumers.length && consumers.shift()(...queue.shift());
    }
  };
}

const speechRecognitionQueue = createProducerConsumer();
const speechSynthesisQueue = createProducerConsumer();

class SpeechRecognition extends EventTarget {
  constructor() {
    super();

    this.grammars = null;
    this.lang = 'en-US';
    this.continuous = false;
    this.interimResults = false;
    this.maxAlternatives = 1;
    this.serviceURI = 'mock://microsoft.com/web-speech-recognition';

    this.abort = this.stop = NULL_FN;
  }

  start() {
    speechRecognitionQueue.consume((command, ...args) => {
      this[command](...args);
    });
  }

  microphoneMuted() {
    this.abort = this.stop = NULL_FN;

    this.dispatchEvent({ type: 'start' });
    this.dispatchEvent({ type: 'audiostart' });
    this.dispatchEvent({ type: 'audioend' });
    this.dispatchEvent({ type: 'error', error: 'no-speech' });
    this.dispatchEvent({ type: 'end' });
  }

  birdTweet() {
    this.abort = this.stop = NULL_FN;

    this.dispatchEvent({ type: 'start' });
    this.dispatchEvent({ type: 'audiostart' });
    this.dispatchEvent({ type: 'soundstart' });
    this.dispatchEvent({ type: 'soundend' });
    this.dispatchEvent({ type: 'audioend' });
    this.dispatchEvent({ type: 'end' });
  }

  unrecognizableSpeech() {
    this.abort = this.stop = NULL_FN;

    this.dispatchEvent({ type: 'start' });
    this.dispatchEvent({ type: 'audiostart' });
    this.dispatchEvent({ type: 'soundstart' });
    this.dispatchEvent({ type: 'speechstart' });
    this.dispatchEvent({ type: 'speechend' });
    this.dispatchEvent({ type: 'soundend' });
    this.dispatchEvent({ type: 'audioend' });
    this.dispatchEvent({ type: 'end' });
  }

  airplaneMode() {
    this.abort = this.stop = NULL_FN;

    this.dispatchEvent({ type: 'start' });
    this.dispatchEvent({ type: 'audiostart' });
    this.dispatchEvent({ type: 'audioend' });
    this.dispatchEvent({ type: 'error', error: 'network' });
    this.dispatchEvent({ type: 'end' });
  }

  accessDenied() {
    this.abort = this.stop = NULL_FN;

    this.dispatchEvent({ type: 'error', error: 'not-allowed' });
    this.dispatchEvent({ type: 'end' });
  }

  abortAfterAudioStart() {
    this.abort = () => {
      this.dispatchEvent({ type: 'audioend' });
      this.dispatchEvent({ type: 'error', error: 'aborted' });
      this.dispatchEvent({ type: 'end' });
    };

    this.stop = NULL_FN;

    this.dispatchEvent({ type: 'start' });
    this.dispatchEvent({ type: 'audiostart' });
  }

  recognize(transcript) {
    this.abort = this.stop = NULL_FN;

    this.dispatchEvent({ type: 'start' });
    this.dispatchEvent({ type: 'audiostart' });
    this.dispatchEvent({ type: 'soundstart' });
    this.dispatchEvent({ type: 'speechstart' });

    this.interimResults &&
      this.dispatchEvent({ type: 'result', results: createSpeechRecognitionResults(false, transcript) });

    this.dispatchEvent({ type: 'speechend' });
    this.dispatchEvent({ type: 'soundend' });
    this.dispatchEvent({ type: 'audioend' });

    this.dispatchEvent({ type: 'result', results: createSpeechRecognitionResults(true, transcript) });
    this.dispatchEvent({ type: 'end' });
  }

  recognizeButAborted(transcript) {
    this.abort = () => {
      this.dispatchEvent({ type: 'speechend' });
      this.dispatchEvent({ type: 'soundend' });
      this.dispatchEvent({ type: 'audioend' });
      this.dispatchEvent({ type: 'error', error: 'aborted' });
      this.dispatchEvent({ type: 'end' });
    };

    this.stop = NULL_FN;

    this.dispatchEvent({ type: 'start' });
    this.dispatchEvent({ type: 'audiostart' });
    this.dispatchEvent({ type: 'soundstart' });
    this.dispatchEvent({ type: 'speechstart' });
    this.interimResults &&
      this.dispatchEvent({ type: 'result', results: createSpeechRecognitionResults(false, transcript) });
  }

  recognizeButNotConfident(transcript) {
    this.abort = this.stop = NULL_FN;

    this.dispatchEvent({ type: 'start' });
    this.dispatchEvent({ type: 'audiostart' });
    this.dispatchEvent({ type: 'soundstart' });
    this.dispatchEvent({ type: 'speechstart' });
    this.interimResults &&
      this.dispatchEvent({ type: 'result', results: createSpeechRecognitionResults(false, transcript) });
    this.dispatchEvent({ type: 'speechend' });
    this.dispatchEvent({ type: 'soundend' });
    this.dispatchEvent({ type: 'audioend' });
    this.dispatchEvent({ type: 'result', results: createSpeechRecognitionResults(false, transcript) });
    this.dispatchEvent({ type: 'end' });
  }
}

[
  'audiostart',
  'audioend',
  'end',
  'error',
  'nomatch',
  'result',
  'soundstart',
  'soundend',
  'speechstart',
  'speechend',
  'start'
].forEach(name => defineEventAttribute(SpeechRecognition.prototype, name));

class SpeechGrammarList {
  addFromString() {
    throw new Error('Not implemented');
  }

  addFromURI() {
    throw new Error('Not implemented');
  }
}

const SPEECH_SYNTHESIS_VOICES = [
  {
    default: true,
    lang: 'en-US',
    localService: true,
    name: 'Mock Voice',
    voiceURI: 'mock://web-speech/voice'
  }
];

class SpeechSynthesis extends EventTarget {
  getVoices() {
    return SPEECH_SYNTHESIS_VOICES;
  }

  cancel() {
    speechSynthesisQueue.cancel();
  }

  pause() {
    throw new Error('pause is not implemented.');
  }

  resume() {
    throw new Error('resume is not implemented.');
  }

  speak(utterance) {
    speechSynthesisQueue.produce(utterance);
  }
}

defineEventAttribute(SpeechSynthesis.prototype, 'voiceschanged');

class SpeechSynthesisUtterance extends EventTarget {
  constructor(text) {
    super();

    this.lang = SPEECH_SYNTHESIS_VOICES[0].lang;
    this.pitch = 1;
    this.rate = 1;
    this.text = text;
    this.voice = SPEECH_SYNTHESIS_VOICES[0];
    this.volume = 1;
  }
}

['boundary', 'end', 'error', 'mark', 'pause', 'resume', 'start'].forEach(name =>
  defineEventAttribute(SpeechSynthesisUtterance.prototype, name)
);

window.WebSpeechMock = {
  isRecognizing() {
    return speechRecognitionQueue.hasConsumer();
  },

  mockRecognize(...args) {
    speechRecognitionQueue.produce(...args);
  },

  mockSynthesize() {
    return new Promise(resolve => {
      speechSynthesisQueue.consume(utterance => {
        utterance.dispatchEvent({ type: 'start' });
        utterance.dispatchEvent({ type: 'end' });

        const { lang, pitch, rate, text, voice, volume } = utterance;

        resolve({ lang, pitch, rate, text, voice, volume });
      });
    });
  },

  peekSynthesize() {
    const args = speechSynthesisQueue.peek();

    if (args) {
      const { lang, pitch, rate, text, voice, volume } = args[0];

      return { lang, pitch, rate, text, voice, volume };
    }
  },

  SpeechGrammarList,
  SpeechRecognition,
  speechSynthesis: new SpeechSynthesis(),
  SpeechSynthesisUtterance
};
