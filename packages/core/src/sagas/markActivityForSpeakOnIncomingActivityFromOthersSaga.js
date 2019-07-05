import { put, takeEvery } from 'redux-saga/effects';

import { INCOMING_ACTIVITY } from '../actions/incomingActivity';
import markActivity from '../actions/markActivity';
import speakableActivity from '../definitions/speakableActivity';
import startDictate from '../actions/startDictate';
import whileConnected from './effects/whileConnected';
import whileSpeakIncomingActivity from './effects/whileSpeakIncomingActivity';

function* markActivityForSpeakAndStartDictate({ payload: { activity } }) {
  yield put(markActivity(activity, 'speak', true));

  // We will start dictate as soon as we receive an activity.
  // Although we start dictate, the UI will not record on the microphone until all activities that mark to speak, is all spoken.
  yield put(startDictate());
}

function* markActivityForSpeakOnIncomingActivityFromOthers(userID) {
  yield takeEvery(
    ({ payload, type }) =>
      type === INCOMING_ACTIVITY && speakableActivity(payload.activity) && payload.activity.from.id !== userID,
    markActivityForSpeakAndStartDictate
  );
}

export default function* markActivityForSpeakOnIncomingActivityFromOthersSaga() {
  yield whileConnected(function* markActivityForSpeakOnIncomingActivityFromOthersSaga({ userID }) {
    yield whileSpeakIncomingActivity(markActivityForSpeakOnIncomingActivityFromOthers.bind(null, userID));
  });
}
