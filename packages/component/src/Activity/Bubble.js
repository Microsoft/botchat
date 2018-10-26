import classNames from 'classnames';
import React from 'react';

import connectWithContext from '../connectWithContext';

export default connectWithContext(
  ({ styleSet }) => ({ styleSet })
)(
  ({ children, className, fromUser, styleSet }) =>
    <div
      className={ classNames(
        styleSet.bubble + '',
        { 'from-user': fromUser },
        (className || '') + ''
      ) }
    >
      { children }
    </div>
)
