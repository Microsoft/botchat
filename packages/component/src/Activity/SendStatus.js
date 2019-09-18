import { Constants } from 'botframework-webchat-core';
import PropTypes from 'prop-types';
import React from 'react';

import { useLocalize } from '../Localization/Localize';
import connectToWebChat from '../connectToWebChat';
import ScreenReaderText from '../ScreenReaderText';
import useStyleSet from '../hooks/useStyleSet';
import useWebChat from '../useWebChat';

const {
  ActivityClientState: { SEND_FAILED, SENDING }
} = Constants;

const connectSendStatus = (...selectors) => {
  console.warn(
    'Web Chat: connectSendStatus() will be removed on or after 2021-09-27, please use useSendStatus() instead.'
  );

  return connectToWebChat(
    ({ focusSendBox, language, postActivity }, { activity }) => ({
      language,
      retrySend: evt => {
        evt.preventDefault();

        postActivity(activity);

        // After clicking on "retry", the button will be gone and focus will be lost (back to document.body)
        // We want to make sure the user stay inside Web Chat
        focusSendBox();
      }
    }),
    ...selectors
  );
};

const useSendStatus = ({ activity }) => {
  const { focusSendBox, postActivity } = useWebChat();

  return {
    retrySend: evt => {
      evt.preventDefault();

      postActivity(activity);

      // After clicking on "retry", the button will be gone and focus will be lost (back to document.body)
      // We want to make sure the user stay inside Web Chat
      focusSendBox();
    }
  };
};

const SendStatus = ({ activity }) => {
  const { retrySend } = useSendStatus({ activity });
  const { channelData: { state } = {} } = activity;
  const styleSet = useStyleSet();
  // TODO: [P4] Currently, this is the only place which use a templated string
  //       We could refactor this into a general component if there are more templated strings
  const localizedSending = useLocalize('Sending');
  const localizedSendStatus = useLocalize('SendStatus');
  const retryText = useLocalize('Retry');
  const sendFailedText = useLocalize('SEND_FAILED_KEY');
  const sendFailedRetryMatch = /\{Retry\}/u.exec(sendFailedText);

  return (
    <React.Fragment>
      <ScreenReaderText text={localizedSendStatus + localizedSending} />
      <span aria-hidden={true} className={styleSet.sendStatus}>
        {state === SENDING ? (
          localizedSending
        ) : state === SEND_FAILED ? (
          sendFailedRetryMatch ? (
            <React.Fragment>
              {sendFailedText.substr(0, sendFailedRetryMatch.index)}
              <button onClick={retrySend} type="button">
                {retryText}
              </button>
              {sendFailedText.substr(sendFailedRetryMatch.index + sendFailedRetryMatch[0].length)}
            </React.Fragment>
          ) : (
            <button onClick={retrySend} type="button">
              {sendFailedText}
            </button>
          )
        ) : (
          false
        )}
      </span>
    </React.Fragment>
  );
};

SendStatus.propTypes = {
  activity: PropTypes.shape({
    channelData: PropTypes.shape({
      state: PropTypes.string
    })
  }).isRequired
};

export default SendStatus;

export { connectSendStatus, useSendStatus };
