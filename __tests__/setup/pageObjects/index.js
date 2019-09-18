import clickMicrophoneButton from './clickMicrophoneButton';
import clickScrollToBottomButton from './clickScrollToBottomButton';
import clickSendButton from './clickSendButton';
import clickSuggestedActionButton from './clickSuggestedActionButton';
import dispatchAction from './dispatchAction';
import endSpeechSynthesize from './endSpeechSynthesize';
import errorSpeechSynthesize from './errorSpeechSynthesize';
import executePromiseScript from './executePromiseScript';
import getNotificationText from './getNotificationText';
import getNumActivitiesShown from './getNumActivitiesShown';
import getSendBoxText from './getSendBoxText';
import getStore from './getStore';
import isDictating from './isDictating';
import pingBot from './pingBot';
import putSpeechRecognitionResult from './putSpeechRecognitionResult';
import runHook from './runHook';
import sendFile from './sendFile';
import sendMessageViaMicrophone from './sendMessageViaMicrophone';
import sendMessageViaSendBox from './sendMessageViaSendBox';
import sendTextToClipboard from './sendTextToClipboard';
import startSpeechSynthesize from './startSpeechSynthesize';
import typeOnSendBox from './typeOnSendBox';

function mapMap(map, mapper) {
  return Object.keys(map).reduce((final, key) => {
    final[key] = mapper.call(map, map[key], key);

    return final;
  }, {});
}

export default function pageObjects(driver) {
  return mapMap(
    {
      clickMicrophoneButton,
      clickScrollToBottomButton,
      clickSendButton,
      clickSuggestedActionButton,
      dispatchAction,
      endSpeechSynthesize,
      errorSpeechSynthesize,
      executePromiseScript,
      getNotificationText,
      getNumActivitiesShown,
      getSendBoxText,
      getStore,
      isDictating,
      pingBot,
      putSpeechRecognitionResult,
      runHook,
      sendFile,
      sendMessageViaMicrophone,
      sendMessageViaSendBox,
      sendTextToClipboard,
      startSpeechSynthesize,
      typeOnSendBox
    },
    fn => fn.bind(null, driver)
  );
}
