import { useCallback, useContext } from 'react';

import WebChatUIContext from '../WebChatUIContext';

export default function useRenderActivityStatus() {
  const { activityStatusRenderer } = useContext(WebChatUIContext);

  return useCallback(
    ({ activity, ...renderActivityStatusArgs }) =>
      activityStatusRenderer({
        activity,
        ...renderActivityStatusArgs
      }),
    [activityStatusRenderer]
  );
}
