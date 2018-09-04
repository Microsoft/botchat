import { css } from 'glamor';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import { Context as TypeFocusSinkContext } from '../Utils/TypeFocusSink';
import { withStyleSet } from '../Context';
import IconButton from './IconButton';
import MicrophoneButton from './MicrophoneButton';
import Context from '../Context';
import SendIcon from './Assets/SendIcon';

const ROOT_CSS = css({
  display: 'flex'
});

const IDLE = 0;
const STARTING = 1;
const DICTATING = 2;

class TextBoxWithSpeech extends React.Component {
  constructor(props) {
    super(props);

    this.handleDictate = this.handleDictate.bind(this);
    this.handleDictateClick = this.handleDictateClick.bind(this);
    this.handleDictateError = this.handleDictateError.bind(this);
    this.handleDictating = this.handleDictating.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      interims: [],
      dictateState: IDLE
    };
  }

  handleDictate({ transcript }) {
    const { props } = this;

    if (transcript) {
      props.sendMessage(transcript);
      props.onSendBoxChange('');
    }

    props.sendTyping(false);
    props.startSpeaking();

    this.setState(() => ({ dictateState: IDLE }));
  }

  handleDictateClick() {
    this.setState(() => ({
      dictateState: STARTING
    }));
  }

  handleDictateError() {
    const { props } = this;

    props.sendTyping(false);

    this.setState(() => ({
      dictateState: IDLE,
      interims: []
    }));
  }

  handleDictating({ interims }) {
    const { props } = this;

    props.scrollToBottom();
    props.sendTyping();

    this.setState(() => ({
      dictateState: DICTATING,
      interims
    }));
  }

  handleSubmit(event) {
    const { props } = this;
    const { sendBoxValue } = props;

    event.preventDefault();

    // Consider clearing the send box only after we received POST_ACTIVITY_PENDING
    // E.g. if the connection is bad, sending the message essentially do nothing but just clearing the send box
    if (sendBoxValue) {
      props.scrollToBottom();
      props.sendMessage(sendBoxValue);
      props.onSendBoxChange('');
      props.sendTyping(false);
      props.stopSpeaking();
    }
  }

  render() {
    const { props, state } = this;

    return (
      <form
        className={ classNames(
          ROOT_CSS + '',
          props.styleSet.sendBoxTextBox + '',
          (props.className || '') + '',
        ) }
        onSubmit={ this.handleSubmit }
      >
        {
          state.dictateState === IDLE ?
            <TypeFocusSinkContext.Consumer>
              { ({ sendFocusRef }) =>
                <input
                  disabled={ props.disabled }
                  onChange={ ({ target: { value } }) => {
                    props.onSendBoxChange(value);
                    value && props.sendTyping();
                  } }
                  placeholder="Type your message"
                  ref={ sendFocusRef }
                  type="text"
                  value={ props.sendBoxValue }
                />
              }
            </TypeFocusSinkContext.Consumer>
          : state.dictateState === STARTING ?
            <div className="status">Starting...</div>
          : state.interims.length ?
            <p className="dictation">
              {
                state.interims.map((interim, index) => <span key={ index }>{ interim }</span>)
              }
            </p>
          :
            <div className="status">Listening...</div>
        }
        {
          props.speech ?
            <MicrophoneButton
              disabled={ props.disabled }
              onClick={ this.handleDictateClick }
              onDictate={ this.handleDictate }
              onDictateClick={ this.handleDictateClick }
              onDictating={ this.handleDictating }
              onError={ this.handleDictateError }
            />
          :
            <IconButton>
              <SendIcon />
            </IconButton>
        }
      </form>
    );
  }
}

TextBoxWithSpeech.defaultProps = {
  speech: true
};

TextBoxWithSpeech.propTypes = {
  disabled: PropTypes.bool,
  speech: PropTypes.bool
};

export default ({
  className,
  disabled,
  speech
}) =>
  <Context.Consumer>
    {
      ({
        onSendBoxChange,
        scrollToBottom,
        sendBoxValue,
        sendMessage,
        sendTyping,
        startSpeaking,
        stopSpeaking,
        styleSet
      }) =>
        <TextBoxWithSpeech
          className={ className }
          disabled={ disabled }
          onSendBoxChange={ onSendBoxChange }
          scrollToBottom={ scrollToBottom }
          sendBoxValue={ sendBoxValue }
          sendMessage={ sendMessage }
          sendTyping={ sendTyping }
          speech={ speech }
          startSpeaking={ startSpeaking }
          stopSpeaking={ stopSpeaking }
          styleSet={ styleSet }
        />
    }
  </Context.Consumer>
