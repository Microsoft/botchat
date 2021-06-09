import * as ActivityClientState from './constants/ActivityClientState';
import * as DictateState from './constants/DictateState';
import clearSuggestedActions from './actions/clearSuggestedActions';
import connect from './actions/connect';
import createStore, { withDevTools as createStoreWithDevTools } from './createStore';
import DirectLineActivity from './types/external/DirectLineActivity';
import DirectLineAttachment from './types/external/DirectLineAttachment';
import DirectLineCardAction from './types/external/DirectLineCardAction';
import DirectLineJSBotConnection from './types/external/DirectLineJSBotConnection';
import DirectLineSuggestedAction from './types/external/DirectLineSuggestedAction';
import disconnect from './actions/disconnect';
import dismissNotification from './actions/dismissNotification';
import emitTypingIndicator from './actions/emitTypingIndicator';
import markActivity from './actions/markActivity';
import OneOrMany from './types/OneOrMany';
import postActivity from './actions/postActivity';
import sendEvent from './actions/sendEvent';
import sendFiles from './actions/sendFiles';
import sendMessage from './actions/sendMessage';
import sendMessageBack from './actions/sendMessageBack';
import sendPostBack from './actions/sendPostBack';
import setDictateInterims from './actions/setDictateInterims';
import setDictateState from './actions/setDictateState';
import setLanguage from './actions/setLanguage';
import setNotification from './actions/setNotification';
import setSendBox from './actions/setSendBox';
import setSendTimeout from './actions/setSendTimeout';
import setSendTypingIndicator from './actions/setSendTypingIndicator';
import singleToArray from './utils/singleToArray';
import startDictate from './actions/startDictate';
import startSpeakingActivity from './actions/startSpeakingActivity';
import stopDictate from './actions/stopDictate';
import stopSpeakingActivity from './actions/stopSpeakingActivity';
import submitSendBox from './actions/submitSendBox';
import warnOnce from './utils/warnOnce';

const Constants = { ActivityClientState, DictateState };
const version = process.env.npm_package_version;

export {
  clearSuggestedActions,
  connect,
  Constants,
  createStore,
  createStoreWithDevTools,
  disconnect,
  dismissNotification,
  emitTypingIndicator,
  markActivity,
  postActivity,
  sendEvent,
  sendFiles,
  sendMessage,
  sendMessageBack,
  sendPostBack,
  setDictateInterims,
  setDictateState,
  setLanguage,
  setNotification,
  setSendBox,
  setSendTimeout,
  setSendTypingIndicator,
  singleToArray,
  startDictate,
  startSpeakingActivity,
  stopDictate,
  stopSpeakingActivity,
  submitSendBox,
  version,
  warnOnce
};

export type {
  DirectLineActivity,
  DirectLineAttachment,
  DirectLineCardAction,
  DirectLineJSBotConnection,
  DirectLineSuggestedAction,
  OneOrMany
};
