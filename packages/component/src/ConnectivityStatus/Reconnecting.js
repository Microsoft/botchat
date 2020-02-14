import React from 'react';

import ScreenReaderText from '../ScreenReaderText';
import SpinnerAnimation from './Assets/SpinnerAnimation';
import useLocalize from '../hooks/useLocalize';
import useStyleSet from '../hooks/useStyleSet';

const ConnectivityStatusReconnecting = () => {
  const [{ connectivityNotification: connectivityNotificationStyleSet }] = useStyleSet();
  const connectivityStatusLabelText = useLocalize('ConnectivityStatus');
  const interruptedConnectionText = useLocalize('INTERRUPTED_CONNECTION_NOTIFICATION');

  return (
    <React.Fragment>
      <ScreenReaderText text={connectivityStatusLabelText + interruptedConnectionText} />
      <div aria-hidden={true} className={connectivityNotificationStyleSet + ''}>
        <SpinnerAnimation />
        {interruptedConnectionText}
      </div>
    </React.Fragment>
  );
};

export default ConnectivityStatusReconnecting;
