import { css } from 'glamor';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import concatMiddleware from '../concatMiddleware';
import ImageAvatar from '../../Avatar/ImageAvatar';
import InitialsAvatar from '../../Avatar/InitialsAvatar';
import useStyleSet from '../../hooks/useStyleSet';

const ROOT_CSS = css({
  overflow: 'hidden',
  position: 'relative',

  '> *': {
    left: 0,
    position: 'absolute',
    top: 0
  }
});

const DefaultAvatar = ({ fromUser }) => {
  const [{ avatar: avatarStyleSet }] = useStyleSet();

  return (
    <div
      aria-hidden={true}
      className={classNames(
        ROOT_CSS + '',
        'webchat__defaultAvatar',
        fromUser && 'webchat__defaultAvatar--fromUser',
        avatarStyleSet + ''
      )}
    >
      <InitialsAvatar fromUser={fromUser} />
      <ImageAvatar fromUser={fromUser} />
    </div>
  );
};

DefaultAvatar.propTypes = {
  fromUser: PropTypes.bool.isRequired
};

export default function createCoreAvatarMiddleware() {
  return concatMiddleware(() => () => ({ fromUser, styleOptions }) => {
    const { botAvatarImage, botAvatarInitials, userAvatarImage, userAvatarInitials } = styleOptions;

    if (fromUser ? userAvatarImage || userAvatarInitials : botAvatarImage || botAvatarInitials) {
      // eslint-disable-next-line react/display-name
      return () => <DefaultAvatar fromUser={fromUser} />;
    }

    return false;
  });
}
