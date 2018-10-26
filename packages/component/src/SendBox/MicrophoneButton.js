import { css } from 'glamor';
import classNames from 'classnames';
import React from 'react';

import { Constants } from 'botframework-webchat-core';

import connectWithContext from '../connectWithContext';
import IconButton from './IconButton';
import MicrophoneIcon from './Assets/MicrophoneIcon';

const { DictateState } = Constants;

const ROOT_CSS = css({
  display: 'flex'
});

const connectMicrophoneButton = (...selectors) => connectWithContext(
  ({
    disabled,
    dictateState,
    language,
    startDictate,
    stopDictate
  }) => ({
    click: () => {
      if (dictateState === DictateState.STARTING || dictateState === DictateState.DICTATING) {
        stopDictate();
      } else {
        startDictate();
      }
    },
    dictating: dictateState === DictateState.DICTATING,
    disabled: disabled || (dictateState === DictateState.STARTING || dictateState === DictateState.STOPPING),
    language
  }),
  ...selectors
);

export default connectMicrophoneButton(
  ({ styleSet }) => ({ styleSet })
)(
  ({
    className,
    click,
    dictating,
    disabled,
    styleSet
  }) =>
    <div className={ classNames(
      styleSet.microphoneButton + '',
      ROOT_CSS + '',
      (className || '') + '',
      { dictating }
    ) }>
      <IconButton
        disabled={ disabled }
        onClick={ click }
      >
        <MicrophoneIcon />
      </IconButton>
    </div>
)

export { connectMicrophoneButton }
