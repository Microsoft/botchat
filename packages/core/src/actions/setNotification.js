const SET_NOTIFICATION = 'WEB_CHAT/SET_NOTIFICATION';

export default function setNotification({ alt, expireAt, id, level, message }) {
  return {
    type: SET_NOTIFICATION,
    payload: { alt, expireAt, id, level, message }
  };
}

export { SET_NOTIFICATION };
