import {
  put,
  takeEvery
} from 'redux-saga/effects';

import whileConnected from './effects/whileConnected';

import { POST_ACTIVITY_PENDING } from '../actions/postActivity';
import { SET_SEND_BOX } from '../actions/setSendBox';
import { START_DICTATE } from '../actions/startDictate';
import stopSpeakingActivity from '../actions/stopSpeakingActivity';

export default function* () {
  yield whileConnected(function* () {
    yield takeEvery(
      ({ meta, payload, type }) => (
        type === START_DICTATE

        || (
          type === SET_SEND_BOX
          && payload.text
        )

        // We want to stop speaking activity when the user click on a card action
        // But currently there are no actions generated out of a card action
        // So, right now, we are using best-effort by listening to POST_ACTIVITY_PENDING with a "message" event
        || (
          type === POST_ACTIVITY_PENDING
          && meta.via !== 'speech'
          && payload.activity.type === 'message'
        )
      ),
      function* () {
        yield put(stopSpeakingActivity());
      }
    );
  });
}
