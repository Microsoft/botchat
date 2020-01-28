import { css } from 'glamor';
import { Panel as ScrollToBottomPanel } from 'react-scroll-to-bottom';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { useCallback, useMemo } from 'react';

import ScrollToEndButton from './Activity/ScrollToEndButton';
import SpeakActivity from './Activity/Speak';
import useActivities from './hooks/useActivities';
import useRenderActivity from './hooks/useRenderActivity';
import useRenderAttachment from './hooks/useRenderAttachment';
import useStyleOptions from './hooks/useStyleOptions';
import useStyleSet from './hooks/useStyleSet';

const ROOT_CSS = css({
  overflow: 'hidden',
  position: 'relative'
});

const PANEL_CSS = css({
  display: 'flex',
  flexDirection: 'column',
  WebkitOverflowScrolling: 'touch'
});

const FILLER_CSS = css({
  flex: 1
});

const LIST_CSS = css({
  listStyleType: 'none'
});

function useMemoize(fn) {
  return useMemo(() => {
    let cache = [];

    return run => {
      const nextCache = [];
      const result = run((...args) => {
        const { result } = cache.find(
          ({ args: cachedArgs }) =>
            args.length === cachedArgs.length && args.every((arg, index) => Object.is(arg, cachedArgs[index]))
        ) || { result: fn(...args) };

        nextCache.push({ args, result });

        return result;
      });

      cache = nextCache;

      return result;
    };
  }, [fn]);
}

const BasicTranscript = ({ className }) => {
  const [{ activities: activitiesStyleSet, activity: activityStyleSet }] = useStyleSet();
  const [{ hideScrollToEndButton }] = useStyleOptions();
  const [activities] = useActivities();
  const renderAttachment = useRenderAttachment();
  const renderActivity = useRenderActivity(renderAttachment);
  const renderActivityElement = useCallback(
    (activity, nextActivity) => {
      const element = renderActivity({
        activity,
        nextActivity
      });

      return element;
    },
    [renderActivity]
  );

  const memoizeRenderActivityElement = useMemoize(renderActivityElement);

  const activityElementsWithMetadata = useMemo(
    () =>
      memoizeRenderActivityElement(renderActivityElement => {
        const { result: activityElementsWithMetadata } = [...activities].reverse().reduce(
          ({ nextActivity, result }, activity, index) => {
            const element = renderActivityElement(activity, nextActivity);

            // Until the activity pass thru middleware, we never know if it is going to show up.
            // If the activity does not render, it will not be spoken if text-to-speech is enabled.
            if (element) {
              result = [
                {
                  activity,
                  element,
                  key: (activity.channelData && activity.channelData.clientActivityID) || activity.id || index,

                  // TODO: [P2] We should use core/definitions/speakingActivity for this predicate instead
                  shouldSpeak: activity.channelData && activity.channelData.speak
                },
                ...result
              ];

              nextActivity = activity;
            }

            return { nextActivity, result };
          },
          { nextActivity: undefined, result: [] }
        );

        return activityElementsWithMetadata;
      }),
    [activities, memoizeRenderActivityElement]
  );

  return (
    <div className={classNames(ROOT_CSS + '', className + '')} role="log">
      <ScrollToBottomPanel className={PANEL_CSS + ''}>
        <div className={FILLER_CSS} />
        <ul
          aria-atomic="false"
          aria-live="polite"
          aria-relevant="additions text"
          className={classNames(LIST_CSS + '', activitiesStyleSet + '')}
          role="list"
        >
          {activityElementsWithMetadata.map(({ activity, element, key, shouldSpeak }) => (
            <li
              // Because of differences in browser implementations, aria-label=" " is used to make the screen reader not repeat the same text multiple times in Chrome v75 and Edge 44
              aria-label=" "
              className={activityStyleSet + ''}
              key={key}
              role="listitem"
            >
              {element}
              {shouldSpeak && <SpeakActivity activity={activity} />}
            </li>
          ))}
        </ul>
      </ScrollToBottomPanel>
      {!hideScrollToEndButton && <ScrollToEndButton />}
    </div>
  );
};

BasicTranscript.defaultProps = {
  className: ''
};

BasicTranscript.propTypes = {
  className: PropTypes.string
};

export default BasicTranscript;
