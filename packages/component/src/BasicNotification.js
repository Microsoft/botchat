/* eslint no-magic-numbers: ["error", { "ignore": [2, 5, 36] }] */
/* eslint react/forbid-dom-props: "off" */
/* eslint react/no-danger: "off" */

import { css } from 'glamor';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import random from 'math-random';
import React, { useCallback, useMemo } from 'react';

import DismissIcon from './Notification/DismissIcon';
import NotificationIcon from './Notification/NotificationIcon';
import ScreenReaderText from './ScreenReaderText';
import useDismissNotification from './hooks/useDismissNotification';
import useInternalRenderMarkdownInline from './hooks/internal/useInternalRenderMarkdownInline';
import useLocalize from './hooks/useLocalize';
import useStyleSet from './hooks/useStyleSet';

const ROOT_CSS = css({
  display: 'flex',

  '& .webchat__notification__text': {
    flex: 1
  }
});

function randomId() {
  return random()
    .toString(36)
    .substr(2, 5);
}

const BasicNotification = ({ notification: { alt, id, level, message } }) => {
  const [{ notification: notificationStyleSet }] = useStyleSet();
  const contentId = useMemo(() => `webchat__notification__${randomId()}`, []);
  const dismissButtonText = useLocalize('NOTIFICATION_DISMISS_BUTTON');
  const dismissNotification = useDismissNotification();
  const notificationTitleAlt = useLocalize('NOTIFICATION_TITLE_ALT');
  const renderMarkdownInline = useInternalRenderMarkdownInline();

  const handleDismiss = useCallback(() => dismissNotification(id), [dismissNotification, id]);
  const html = useMemo(() => ({ __html: renderMarkdownInline(message) }), [renderMarkdownInline, message]);

  return (
    <div
      aria-describedby={contentId}
      aria-label={notificationTitleAlt}
      className={classNames(ROOT_CSS + '', notificationStyleSet + '', {
        'webchat__notification--error': level === 'error',
        'webchat__notification--info': level === 'info',
        'webchat__notification--success': level === 'success',
        'webchat__notification--warn': level === 'warn'
      })}
      role="dialog"
    >
      <div aria-hidden={true} className="webchat__notification__iconBox">
        <NotificationIcon className="webchat__notification__icon" level={level} />
      </div>
      {!!alt && <ScreenReaderText text={alt} />}
      <div aria-hidden={!!alt} className="webchat__notification__text" dangerouslySetInnerHTML={html} id={contentId} />
      <button
        aria-label={dismissButtonText}
        className="webchat__notification__dismissButton"
        onClick={handleDismiss}
        type="button"
      >
        <div aria-hidden={true} className="webchat__notification__dismissButtonFocus">
          <DismissIcon />
        </div>
      </button>
    </div>
  );
};

BasicNotification.propTypes = {
  notification: PropTypes.shape({
    alt: PropTypes.string,
    id: PropTypes.string.isRequired,
    level: PropTypes.oneOf(['error', 'warn', 'info', 'success']).isRequired,
    message: PropTypes.string.isRequired
  }).isRequired
};

export default BasicNotification;
