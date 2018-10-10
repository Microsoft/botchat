import { css } from 'glamor';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import { Context as TypeFocusSinkContext } from '../Utils/TypeFocusSink';
import { localize } from '../Localization/Localize';
import connectWithContext from '../connectWithContext';

const ROOT_CSS = css({
  display: 'flex',

  '& > input': {
    flex: 1
  }
});

class TextBoxWithSpeech extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange({ target: { value } }) {
    const { props } = this;

    props.scrollToBottom();
    props.setSendBox(value, 'keyboard');
  }

  handleSubmit(event) {
    const { props } = this;
    const { sendBox } = props;

    event.preventDefault();

    // Consider clearing the send box only after we received POST_ACTIVITY_PENDING
    // E.g. if the connection is bad, sending the message essentially do nothing but just clearing the send box

    if (sendBox) {
      props.scrollToBottom();
      props.submitSendBox('keyboard');
    }
  }

  render() {
    const { props } = this;

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
          <TypeFocusSinkContext.Consumer>
            { ({ sendFocusRef }) =>
              <input
                disabled={ props.disabled }
                onChange={ this.handleChange }
                placeholder={ localize('Type your message', props.language) }
                ref={ sendFocusRef }
                type="text"
                value={ props.sendBox }
              />
            }
          </TypeFocusSinkContext.Consumer>
        }
      </form>
    );
  }
}

TextBoxWithSpeech.defaultProps = {
  disabled: false
};

TextBoxWithSpeech.propTypes = {
  disabled: PropTypes.bool
};

export default connectWithContext(
  ({ input: { sendBox }, settings: { language } }) => ({ language, sendBox }),
  ({
    disabled,
    scrollToBottom,
    setSendBox,
    stopSpeakingActivity,
    submitSendBox,
    styleSet
  }) => ({
    disabled,
    scrollToBottom,
    setSendBox,
    stopSpeakingActivity,
    submitSendBox,
    styleSet
  })
)(TextBoxWithSpeech)
