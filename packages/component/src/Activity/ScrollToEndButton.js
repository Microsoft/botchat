import { hooks } from 'botframework-webchat-api';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { forwardRef, useCallback } from 'react';

import useScrollToEnd from '../hooks/useScrollToEnd';
import useStyleSet from '../hooks/useStyleSet';

const { useDirection, useLocalizer } = hooks;

const ScrollToEndButton = forwardRef(({ className, onClick }, ref) => {
  const [{ scrollToEndButton: scrollToEndButtonStyleSet }] = useStyleSet();
  const [direction] = useDirection();
  const localize = useLocalizer();
  const scrollToEnd = useScrollToEnd();

  const handleClick = useCallback(
    event => {
      onClick && onClick(event);
      scrollToEnd();
    },
    [onClick, scrollToEnd]
  );

  const handleKeyPress = useCallback(
    event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();

        onClick && onClick(event);
        scrollToEnd();
      }
    },
    [onClick, scrollToEnd]
  );

  const newMessageText = localize('TRANSCRIPT_NEW_MESSAGES');

  return (
    <button
      aria-label={newMessageText}
      className={classNames(
        'webchat__scrollToEndButton',
        scrollToEndButtonStyleSet + '',
        className + '',
        direction === 'rtl' ? 'webchat__overlay--rtl' : ''
      )}
      onClick={handleClick}
      onKeyPress={handleKeyPress}
      ref={ref}
      tabIndex={0}
      type="button"
    >
      {newMessageText}
    </button>
  );
});

ScrollToEndButton.defaultProps = {
  className: '',
  onClick: undefined
};

ScrollToEndButton.displayName = 'ScrollToEndButton';

ScrollToEndButton.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func
};

export default ScrollToEndButton;
