import { useMemo } from 'react';

import useGlobalize from './internal/useGlobalize';
import useLocalizeCallback from './useLocalizeCallback';

export default function useLocalizeRelativeTimeCallback() {
  const localize = useLocalizeCallback();
  const globalize = useGlobalize();

  return useMemo(() => {
    const relativeTimeFormatter = globalize.relativeTimeFormatter.bind(globalize);

    return dateOrString => {
      const date = new Date(dateOrString);
      const dateTime = date.getTime();

      if (isNaN(dateTime)) {
        return dateOrString;
      }

      const now = Date.now();
      const deltaInMs = now - dateTime;
      const deltaInMinutes = Math.floor(deltaInMs / 60000);
      const deltaInHours = Math.floor(deltaInMs / 3600000);

      if (deltaInMinutes < 1) {
        return localize('ACTIVITY_STATUS_TIMESTAMP_JUST_NOW');
      } else if (deltaInMinutes === 1) {
        return localize('ACTIVITY_STATUS_TIMESTAMP_ONE_MINUTE_AGO');
      } else if (deltaInHours < 1) {
        return relativeTimeFormatter('minute')(-deltaInMinutes);
      } else if (deltaInHours === 1) {
        return localize('ACTIVITY_STATUS_TIMESTAMP_ONE_HOUR_AGO');
      } else if (deltaInHours < 5) {
        return relativeTimeFormatter('hour')(-deltaInHours);
      } else if (deltaInHours <= 24) {
        return localize('ACTIVITY_STATUS_TIMESTAMP_TODAY');
      } else if (deltaInHours <= 48) {
        return localize('ACTIVITY_STATUS_TIMESTAMP_YESTERDAY');
      }

      return getLocaleString(date, 'en-US');
    };
  }, [localize, globalize]);
}
