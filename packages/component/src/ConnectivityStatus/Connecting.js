import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { useState } from 'react';

import ScreenReaderText from '../ScreenReaderText';
import SpinnerAnimation from './Assets/SpinnerAnimation';
import useDirection from '../hooks/useDirection';
import useForceRender from '../hooks/internal/useForceRender';
import useLocalize from '../hooks/useLocalize';
import useStyleOptions from '../hooks/useStyleOptions';
import useStyleSet from '../hooks/useStyleSet';
import useTimer from '../hooks/internal/useTimer';
import WarningNotificationIcon from './Assets/WarningNotificationIcon';

const ConnectivityStatusConnecting = ({ reconnect }) => {
  const [{ slowConnectionAfter }] = useStyleOptions();
  const [
    { connectivityNotification: connectivityNotificationStyleSet, warningNotification: warningNotificationStyleSet }
  ] = useStyleSet();
  const [direction] = useDirection();
  const [initialRenderAt] = useState(() => Date.now());
  const connectivityStatusLabelText = useLocalize('ConnectivityStatus');
  const initialConnectionText = useLocalize('INITIAL_CONNECTION_NOTIFICATION');
  const interruptedConnectionText = useLocalize('INTERRUPTED_CONNECTION_NOTIFICATION');
  const slowConnectionText = useLocalize('SLOW_CONNECTION_NOTIFICATION');
  const forceRender = useForceRender();

  useTimer(initialRenderAt + slowConnectionAfter, forceRender);

  const now = Date.now();
  const slow = now >= initialRenderAt + slowConnectionAfter;

  return slow ? (
    <React.Fragment>
      <ScreenReaderText text={connectivityStatusLabelText + slowConnectionText} />
      <div
        aria-hidden={true}
        className={classNames('webchat__connectivityStatus', warningNotificationStyleSet + '')}
        dir={direction}
      >
        <WarningNotificationIcon />
        {slowConnectionText}
      </div>
    </React.Fragment>
  ) : (
    <React.Fragment>
      <ScreenReaderText
        text={connectivityStatusLabelText + (reconnect ? interruptedConnectionText : initialConnectionText)}
      />
      <div
        aria-hidden={true}
        className={classNames('webchat__connectivityStatus', connectivityNotificationStyleSet + '')}
        dir={direction}
      >
        <SpinnerAnimation />
        {reconnect ? interruptedConnectionText : initialConnectionText}
      </div>
    </React.Fragment>
  );
};

ConnectivityStatusConnecting.defaultProps = {
  reconnect: false
};

ConnectivityStatusConnecting.propTypes = {
  reconnect: PropTypes.bool
};

export default ConnectivityStatusConnecting;
