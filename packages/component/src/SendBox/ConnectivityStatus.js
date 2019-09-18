import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';

import { useLocalize } from '../Localization/Localize';
import connectToWebChat from '../connectToWebChat';
import ErrorNotificationIcon from '../Attachment/Assets/ErrorNotificationIcon';
import ScreenReaderText from '../ScreenReaderText';
import SpinnerAnimation from '../Attachment/Assets/SpinnerAnimation';
import WarningNotificationIcon from '../Attachment/Assets/WarningNotificationIcon';
import useWebChat from '../useWebChat';
import useStyleSet from '../hooks/useStyleSet';

const CONNECTIVITY_STATUS_DEBOUNCE = 400;

const DebouncedConnectivityStatus = ({ interval, children: propsChildren }) => {
  const [children, setChildren] = useState(propsChildren);
  const [since, setSince] = useState(Date.now());

  useEffect(() => {
    const timeout = setTimeout(() => {
      setChildren(propsChildren);
      setSince(Date.now());
    }, Math.max(0, interval - Date.now() + since));

    return () => clearTimeout(timeout);
  }, [interval, propsChildren, setChildren, setSince, since]);

  return typeof children === 'function' ? children() : false;
};

DebouncedConnectivityStatus.defaultProps = {
  children: undefined
};

DebouncedConnectivityStatus.propTypes = {
  children: PropTypes.any,
  interval: PropTypes.number.isRequired
};

const connectConnectivityStatus = (...selectors) => {
  console.warn(
    'Web Chat: connectConnectivityStatus() will be removed on or after 2021-09-27, please use useConnectivityStatus() instead.'
  );

  return connectToWebChat(({ connectivityStatus, language }) => ({ connectivityStatus, language }), ...selectors);
};

const useConnectivityStatus = () => {
  const connectivityStatus = useWebChat(({ connectivityStatus }) => connectivityStatus);

  return { connectivityStatus };
};

const ConnectivityStatus = () => {
  const { connectivityStatus } = useConnectivityStatus();
  const styleSet = useStyleSet();
  const connectingSlowText = useLocalize('SLOW_CONNECTION_NOTIFICATION');
  const renderConnectingSlow = useCallback(
    () => (
      <React.Fragment>
        <ScreenReaderText text={connectingSlowText} />
        <div aria-hidden={true} className={styleSet.warningNotification}>
          <WarningNotificationIcon />
          {connectingSlowText}
        </div>
      </React.Fragment>
    ),
    [connectingSlowText, styleSet.warningNotification]
  );

  const notConnectedText = useLocalize('FAILED_CONNECTION_NOTIFICATION');

  const renderNotConnected = useCallback(
    () => (
      <React.Fragment>
        <ScreenReaderText text={notConnectedText} />
        <div aria-hidden={true} className={styleSet.errorNotification}>
          <ErrorNotificationIcon />
          {notConnectedText}
        </div>
      </React.Fragment>
    ),
    [notConnectedText, styleSet.errorNotification]
  );

  const uninitializedText = useLocalize('INITIAL_CONNECTION_NOTIFICATION');

  const renderUninitialized = useCallback(
    () => (
      <React.Fragment>
        <ScreenReaderText text={uninitializedText} />
        <div aria-hidden={true} className={styleSet.connectivityNotification}>
          <SpinnerAnimation />
          {uninitializedText}
        </div>
      </React.Fragment>
    ),
    [styleSet.connectivityNotification, uninitializedText]
  );

  const reconnectingText = useLocalize('INTERRUPTED_CONNECTION_NOTIFICATION');

  const renderReconnecting = useCallback(
    () => (
      <React.Fragment>
        <ScreenReaderText text={reconnectingText} />
        <div aria-hidden={true} className={styleSet.connectivityNotification}>
          <SpinnerAnimation />
          {reconnectingText}
        </div>
      </React.Fragment>
    ),
    [reconnectingText, styleSet.connectivityNotification]
  );

  const sagaErrorText = useLocalize('RENDER_ERROR_NOTIFICATION');

  const renderSagaError = useCallback(
    () => (
      <React.Fragment>
        <ScreenReaderText text={sagaErrorText} />
        <div className={styleSet.errorNotification}>
          <ErrorNotificationIcon />
          {sagaErrorText}
        </div>
      </React.Fragment>
    ),
    [sagaErrorText, styleSet.errorNotification]
  );

  const emptyStatusText = useLocalize('CONNECTED_NOTIFICATION');

  const renderEmptyStatus = useCallback(() => <ScreenReaderText text={emptyStatusText} />, [emptyStatusText]);

  const renderStatus = useCallback(() => {
    if (connectivityStatus === 'connectingslow') {
      return renderConnectingSlow;
    } else if (connectivityStatus === 'error' || connectivityStatus === 'notconnected') {
      return renderNotConnected;
    } else if (connectivityStatus === 'uninitialized') {
      return renderUninitialized;
    } else if (connectivityStatus === 'reconnecting') {
      return renderReconnecting;
    } else if (connectivityStatus === 'sagaerror') {
      return renderSagaError;
    }
    return renderEmptyStatus;
  }, [
    connectivityStatus,
    renderConnectingSlow,
    renderEmptyStatus,
    renderNotConnected,
    renderReconnecting,
    renderSagaError,
    renderUninitialized
  ]);

  return (
    <div aria-atomic="false" aria-live="polite" role="status">
      <DebouncedConnectivityStatus
        interval={
          connectivityStatus === 'uninitialized' || connectivityStatus === 'error' ? 0 : CONNECTIVITY_STATUS_DEBOUNCE
        }
      >
        {renderStatus}
      </DebouncedConnectivityStatus>
    </div>
  );
};

export default ConnectivityStatus;

export { connectConnectivityStatus, useConnectivityStatus };
