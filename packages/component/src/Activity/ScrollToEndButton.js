import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { useCallback } from 'react';

import useDirection from '../hooks/useDirection';
import useFocus from '../hooks/useFocus';
import useLocalizer from '../hooks/useLocalizer';
import useScrollToEnd from '../hooks/useScrollToEnd';
import useStyleSet from '../hooks/useStyleSet';

const ScrollToEndButton = ({ className }) => {
  const [{ scrollToEndButton: scrollToEndButtonStyleSet }] = useStyleSet();
  const [direction] = useDirection();
  const focus = useFocus();
  const localize = useLocalizer();
  const scrollToEnd = useScrollToEnd();

  const handleClick = useCallback(() => {
    focus('sendBoxWithoutKeyboard');
    scrollToEnd();
  }, [focus, scrollToEnd]);

  const newMessageText = localize('TRANSCRIPT_NEW_MESSAGES');

  return (
    <button
      className={classNames(
        'webchat__scrollToEndButton',
        scrollToEndButtonStyleSet + '',
        className + '',
        direction === 'rtl' ? 'webchat__overlay--rtl' : ''
      )}
      onClick={handleClick}
      type="button"
    >
      {newMessageText}
    </button>
  );
};

ScrollToEndButton.defaultProps = {
  className: ''
};

ScrollToEndButton.propTypes = {
  className: PropTypes.string
};

export default ScrollToEndButton;
