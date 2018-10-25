import { Composer as DictateComposer } from 'react-dictate-button';
import React from 'react';

import { Constants } from 'botframework-webchat-core';
import connectWithContext from './connectWithContext';

const {
  DictateState: {
    DICTATING,
    IDLE,
    STARTING
  }
} = Constants;

class Dictation extends React.Component {
  constructor(props) {
    super(props);

    this.handleDictate = this.handleDictate.bind(this);
    this.handleDictating = this.handleDictating.bind(this);
    this.handleError = this.handleError.bind(this);
  }

  handleDictate({ result: { transcript } = {} }) {
    const { props } = this;

    props.setDictateInterims([]);
    props.setDictateState(IDLE);
    props.stopSpeechInput();

    if (transcript) {
      props.setSendBox(transcript, 'speech');
      props.submitSendBox('speech');
      props.startSpeakingActivity();
    }
  }

  handleDictating({ results = [] }) {
    const { props } = this;
    const interims = results.map(({ transcript }) => transcript);

    props.setDictateInterims(interims);
    props.setDictateState(DICTATING);

    // This is for two purposes:
    // 1. Set send box will also trigger send typing
    // 2. If the user cancelled out, the interim result will be in the send box so the user can update it before send
    props.setSendBox(interims.join(' '), 'speech');
  }

  handleError(event) {
    const { props } = this;

    props.setDictateState(IDLE);
    props.stopSpeechInput();

    props.onError && props.onError(event);
  }

  render() {
    const {
      props: {
        dictateState,
        disabled,
        language,
        webSpeechPonyfill = {}
      },
      handleDictate,
      handleDictating,
      handleError
    } = this;

    return (
      <DictateComposer
        lang={ language }
        onDictate={ handleDictate }
        onError={ handleError }
        onProgress={ handleDictating }
        speechRecognition={ webSpeechPonyfill.SpeechRecognition }
        speechGrammarList={ webSpeechPonyfill.SpeechGrammarList }
        started={ !disabled && (dictateState === STARTING || dictateState === DICTATING) }
      />
    );
  }
}

export default connectWithContext(
  ({
    disabled,
    input: { dictateState } = {},
    setDictateInterims,
    setDictateState,
    setSendBox,
    settings: { language } = {},
    startSpeakingActivity,
    stopSpeechInput,
    submitSendBox,
    webSpeechPonyfill
  }) => ({
    dictateState,
    disabled,
    language,
    setDictateInterims,
    setDictateState,
    setSendBox,
    startSpeakingActivity,
    stopSpeechInput,
    submitSendBox,
    webSpeechPonyfill
  })
)(Dictation)
