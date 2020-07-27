import { Constants } from 'botframework-webchat-core';
import React, { useContext, useMemo } from 'react';

import useSendTimeoutForActivity from './useSendTimeoutForActivity';
import useTimePassed from './internal/useTimePassed';
import WebChatUIContext from '../WebChatUIContext';

const {
  ActivityClientState: { SEND_FAILED, SENDING, SENT }
} = Constants;

const ActivityStatusContainer = ({ activity, hideTimestamp, nextVisibleActivity }) => {
  const { activityStatusRenderer: createActivityStatusRenderer } = useContext(WebChatUIContext);
  const getSendTimeout = useSendTimeoutForActivity();

  // SEND_FAILED from the activity is ignored, and is instead based on styleOptions.sendTimeout.
  // Note that the derived state is time-sensitive. The useTimePassed() hook is used to make sure it changes over time.
  const {
    channelData: { clientTimestamp = 0, state } = {},
    from: { role }
  } = activity;

  const activitySent = state !== SENDING && state !== SEND_FAILED;
  const fromUser = role === 'user';
  const sendTimeout = getSendTimeout({ activity });

  const pastTimeout = useTimePassed(fromUser && !activitySent ? new Date(clientTimestamp).getTime() + sendTimeout : 0);

  const sendState = activitySent || !fromUser ? SENT : pastTimeout ? SEND_FAILED : SENDING;

  return useMemo(
    () =>
      createActivityStatusRenderer({
        activity,
        hideTimestamp,
        nextVisibleActivity, // "nextVisibleActivity" is for backward compatibility, please remove this line on or after 2022-07-22.
        sameTimestampGroup: hideTimestamp, // "sameTimestampGroup" is for backward compatibility, please remove this line on or after 2022-07-22.
        sendState
      }),
    [activity, hideTimestamp, nextVisibleActivity, sendState]
  );
};

export default function useCreateActivityStatusRenderer() {
  return useMemo(
    () => ({ activity, hideTimestamp, nextVisibleActivity }) => () => (
      <ActivityStatusContainer
        activity={activity}
        hideTimestamp={hideTimestamp}
        nextVisibleActivity={nextVisibleActivity}
      />
    ),
    []
  );
}
