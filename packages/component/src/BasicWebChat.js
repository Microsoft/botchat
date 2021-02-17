/* eslint no-magic-numbers: ["error", { "ignore": [0, 1, 2] }] */
/* eslint react/no-unsafe: off */

import { hooks } from 'botframework-webchat-api';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import AccessKeySinkSurface from './Utils/AccessKeySink/Surface';
import BasicConnectivityStatus from './BasicConnectivityStatus';
import createSendBoxRenderer from './Middleware/createSendBoxRenderer';
import BasicToaster from './BasicToaster';
import BasicTranscript from './BasicTranscript';
import useStyleSet from './hooks/useStyleSet';
import useStyleToEmotionObject from './hooks/internal/useStyleToEmotionObject';

const { useStyleOptions } = hooks;

const ROOT_STYLE = {
  display: 'flex',
  flexDirection: 'column'
};

const CONNECTIVITY_STATUS_STYLE = {
  flexShrink: 0
};

const SEND_BOX_CSS = {
  flexShrink: 0
};

const TOASTER_STYLE = {
  flexShrink: 0
};

const TRANSCRIPT_STYLE = {
  flex: 1
};

const BasicWebChat = ({ className, ...props }) => {
  const [{ root: rootStyleSet }] = useStyleSet();
  const [options] = useStyleOptions();
  const styleToEmotionObject = useStyleToEmotionObject();

  const connectivityStatusClassName = styleToEmotionObject(CONNECTIVITY_STATUS_STYLE) + '';
  const rootClassName = styleToEmotionObject(ROOT_STYLE) + '';
  const sendBoxClassName = styleToEmotionObject(SEND_BOX_CSS) + '';
  const toasterClassName = styleToEmotionObject(TOASTER_STYLE) + '';
  const transcriptClassName = styleToEmotionObject(TRANSCRIPT_STYLE) + '';

  return (
    <AccessKeySinkSurface className={classNames(rootClassName, rootStyleSet + '', (className || '') + '')}
      role="complementary"
    >
      {!options.hideToaster && <BasicToaster className={toasterClassName} />}
      <BasicTranscript className={transcriptClassName} />
      <BasicConnectivityStatus className={connectivityStatusClassName} />
      {!options.hideSendBox && createSendBoxRenderer(props.sendBoxMiddleware)({ sendBoxClassName })}
    </AccessKeySinkSurface>
  );
};

export default BasicWebChat;

BasicWebChat.defaultProps = {
  className: '',
  sendBoxMiddleware: undefined
};

BasicWebChat.propTypes = {
  className: PropTypes.string,
  sendBoxMiddleware: PropTypes.func
};
