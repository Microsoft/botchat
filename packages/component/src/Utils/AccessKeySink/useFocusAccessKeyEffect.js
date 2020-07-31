import { useEffect } from 'react';

import useContext from './internal/useContext';

function removeInline(array, item) {
  const index = array.indexOf(item);

  ~index && array.splice(index, 1);
}

export default function useFocusAccessKeyEffect(key, ref) {
  if (!key || typeof key !== 'string') {
    throw new Error('botframework-webchat: "key" must be defined and of type "string".');
  } else if (!ref || !('current' in ref)) {
    throw new Error('botframework-webchat: "ref" must be defined and has "current" property.');
  }

  const context = useContext();

  useEffect(() => {
    const entry = { keys: key.split(/\s+/gu), ref };

    context.focii.push(entry);

    return () => removeInline(context.focii, entry);
  }, [context]);
}
