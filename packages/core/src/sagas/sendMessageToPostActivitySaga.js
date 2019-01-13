import {
  put,
  takeEvery
} from 'redux-saga/effects';

import whileConnected from './effects/whileConnected';

import { SEND_MESSAGE } from '../actions/sendMessage';
import postActivity from '../actions/postActivity';

export default function* () {
  yield whileConnected(function* () {
    yield takeEvery(SEND_MESSAGE, function* ({ payload: { method, text } }) {
      if (text) {
        yield put(postActivity({
          text,
          textFormat: 'plain',
          type: 'message'
        }, method));
      }
    });
  });
}
