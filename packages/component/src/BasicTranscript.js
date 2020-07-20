/* eslint no-magic-numbers: ["error", { "ignore": [-1, 0, 1] }] */

import { css } from 'glamor';
import { Panel as ScrollToBottomPanel, useAnimating, useSticky } from 'react-scroll-to-bottom';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { useCallback, useMemo, useRef } from 'react';

import BasicTypingIndicator from './BasicTypingIndicator';
import Fade from './Utils/Fade';
import getTabIndex from './Utils/TypeFocusSink/getTabIndex';
import ScreenReaderActivity from './ScreenReaderActivity';
import ScrollToEndButton from './Activity/ScrollToEndButton';
import SpeakActivity from './Activity/Speak';
import useActivities from './hooks/useActivities';
import useDirection from './hooks/useDirection';
import useFocus from './hooks/useFocus';
import useLocalizer from './hooks/useLocalizer';
import useRenderActivity from './hooks/useRenderActivity';
import useRenderAttachment from './hooks/useRenderAttachment';
import useStyleOptions from './hooks/useStyleOptions';
import useStyleSet from './hooks/useStyleSet';

const ROOT_CSS = css({
  '&.webchat__basic-transcript': {
    overflow: 'hidden',
    // Make sure to set "position: relative" here to form another stacking context for the scroll-to-end button.
    // Stacking context help isolating elements that use "z-index" from global pollution.
    // https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Positioning/Understanding_z_index/The_stacking_context
    position: 'relative',

    '& .webchat__basic-transcript__filler': {
      flex: 1
    },

    '& .webchat__basic-transcript__scrollable': {
      display: 'flex',
      flexDirection: 'column',
      WebkitOverflowScrolling: 'touch'
    },

    '& .webchat__basic-transcript__transcript': {
      listStyleType: 'none'
    }
  }
});

function useMemoize(fn) {
  return useMemo(() => {
    let cache = [];

    return run => {
      const nextCache = [];
      const result = run((...args) => {
        const { result } = [...cache, ...nextCache].find(
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

function firstTabbableDescendant(element) {
  // This is best-effort for finding a tabbable element.
  // For a comprehensive list, please refer to https://allyjs.io/data-tables/focusable.html and update this list accordingly.
  const focusables = element.querySelectorAll(
    'a[href], audio, button, details, details summary, embed, iframe, input, object, rect, select, svg[focusable], textarea, video, [tabindex]'
  );

  return [].find.call(focusables, focusable => {
    const tabIndex = getTabIndex(focusable);

    return typeof tabIndex === 'number' && tabIndex >= 0;
  });
}

function nextSiblingAll(element) {
  const {
    parentNode: { children }
  } = element;

  const elementIndex = [].indexOf.call(children, element);

  return [].slice.call(children, elementIndex + 1);
}

const BasicTranscript = ({ className }) => {
  const [{ activities: activitiesStyleSet, activity: activityStyleSet }] = useStyleSet();
  const [{ hideScrollToEndButton }] = useStyleOptions();
  const [activities] = useActivities();
  const [animatingToEnd] = useAnimating();
  const [direction] = useDirection();
  const [sticky] = useSticky();
  const focus = useFocus();
  const renderAttachment = useRenderAttachment();
  const scrollToEndButtonRef = useRef();
  const localize = useLocalizer();

  const renderActivity = useRenderActivity(renderAttachment);
  const transcriptRoleDescription = localize('TRANSCRIPT_ARIA_ROLE_ALT');
  const activityAriaLabel = localize('ACTIVITY_ARIA_LABEL_ALT');

  const handleScrollToEndButtonClick = useCallback(() => {
    const { current } = scrollToEndButtonRef;

    // After clicking on the "New messages" button, we should focus on the first unread element.
    // This is for resolving the bug https://github.com/microsoft/BotFramework-WebChat/issues/3135.
    if (current) {
      const nextSiblings = nextSiblingAll(current);

      const firstUnreadTabbable = nextSiblings.reduce(
        (result, unreadActivityElement) => result || firstTabbableDescendant(unreadActivityElement),
        0
      );

      firstUnreadTabbable ? firstUnreadTabbable.focus() : focus('sendBoxWithoutKeyboard');
    }
  }, [focus, scrollToEndButtonRef]);

  const renderActivityElement = useCallback(
    (activity, nextVisibleActivity) =>
      renderActivity({
        activity,
        nextVisibleActivity
      }),
    [renderActivity]
  );

  const memoizeRenderActivityElement = useMemoize(renderActivityElement);

  const activityElementsWithMetadata = useMemo(
    () =>
      memoizeRenderActivityElement(renderActivityElement => {
        const { result: activityElementsWithMetadata } = [...activities].reverse().reduce(
          ({ nextVisibleActivity, result }, activity, index) => {
            const element = renderActivityElement(activity, nextVisibleActivity);

            // Until the activity passes through middleware, it is unknown whether the activity will be visible.
            // If the activity does not render, it will not be spoken if text-to-speech is enabled.
            if (element) {
              const {
                channelData: { messageBack: { displayText: messageBackDisplayText } = {} } = {},
                text
              } = activity;

              const key = (activity.channelData && activity.channelData.clientActivityID) || activity.id || index;

              result = [
                {
                  activity,
                  element,
                  key,

                  // If this key changes, the content of this attachment will be reannounced.
                  liveRegionKey: key + '|' + (messageBackDisplayText || text),

                  // TODO: [P2] #2858 We should use core/definitions/speakingActivity for this predicate instead
                  shouldSpeak: activity.channelData && activity.channelData.speak
                },
                ...result
              ];

              nextVisibleActivity = activity;
            }

            return { nextVisibleActivity, result };
          },
          { nextVisibleActivity: undefined, result: [] }
        );

        return activityElementsWithMetadata;
      }),
    [activities, memoizeRenderActivityElement]
  );

  // Activity ID of the last visible activity in the list.
  const { activity: { id: lastVisibleActivityId } = {} } =
    activityElementsWithMetadata[activityElementsWithMetadata.length - 1] || {};

  const lastReadActivityIdRef = useRef(lastVisibleActivityId);

  const allActivitiesRead = lastVisibleActivityId === lastReadActivityIdRef.current;

  if (sticky) {
    // If it is sticky, the user is at the bottom of the transcript, everything is read.
    // So mark the activity ID as read.
    lastReadActivityIdRef.current = lastVisibleActivityId;
  }

  // Finds where we should render the "New messages" button, in index. Returns -1 to hide the button.
  const renderSeparatorAfterIndex = useMemo(() => {
    // Don't show the button if:
    // - All activities have been read
    // - Currently animating towards bottom
    //   - "New messages" button must not flash when: 1. Type "help", 2. Scroll to top, 3. Type "help" again, 4. Expect the "New messages" button not flashy
    // - Hidden by style options
    // - It is already at the bottom (sticky)

    // Any changes to this logic, verify:
    // - "New messages" button should persist while programmatically scrolling to mid-point of the transcript:
    //   1. Type "help"
    //   2. Type "proactive", then immediately scroll to top
    //      Expect: the "New messages" button should appear
    //   3. Run hook "useScrollTo({ scrollTop: 500 })"
    //      Expect: when the scroll is animating to 500px, the "New messages" button should kept on the screen
    // - "New messages" button must not flashy:
    //   1. Type "help"
    //   2. Scroll to top
    //      Expect: no "New messages" button is shown
    //   3. Type "help" again
    //      Expect: "New messages" button must not flash-appear

    if (allActivitiesRead || animatingToEnd || hideScrollToEndButton || sticky) {
      return -1;
    }

    return activityElementsWithMetadata.findIndex(({ activity: { id } }) => id === lastReadActivityIdRef.current);
  }, [
    activityElementsWithMetadata,
    allActivitiesRead,
    animatingToEnd,
    hideScrollToEndButton,
    lastReadActivityIdRef,
    sticky
  ]);

  return (
    <div className={classNames(ROOT_CSS + '', 'webchat__basic-transcript', className + '')} dir={direction}>
      <ScrollToBottomPanel className="webchat__basic-transcript__scrollable">
        <div aria-hidden={true} className="webchat__basic-transcript__filler" />

        {/* This <section> is for live region only. Contents are made invisible through CSS. */}
        <section
          aria-atomic={false}
          aria-live="polite"
          aria-relevant="additions"
          aria-roledescription={transcriptRoleDescription}
          role="log"
        >
          {activityElementsWithMetadata.map(({ activity, liveRegionKey }) => (
            <Fade key={liveRegionKey}>{() => <ScreenReaderActivity activity={activity} />}</Fade>
          ))}
        </section>

        <ul
          aria-roledescription={transcriptRoleDescription}
          className={classNames(activitiesStyleSet + '', 'webchat__basic-transcript__transcript')}
        >
          {activityElementsWithMetadata.map(({ activity, element, key, shouldSpeak }, index) => (
            <React.Fragment key={key}>
              <li
                aria-label={activityAriaLabel} // This will be read when pressing CAPSLOCK + arrow with screen reader
                className={classNames(activityStyleSet + '', 'webchat__basic-transcript__activity')}
              >
                {element}
                {shouldSpeak && <SpeakActivity activity={activity} />}
              </li>
              {/* We insert the "New messages" button here for tab ordering. Users should be able to TAB into the button. */}
              {index === renderSeparatorAfterIndex && (
                <ScrollToEndButton
                  aria-valuemax={activityElementsWithMetadata.length}
                  aria-valuenow={index + 1}
                  onClick={handleScrollToEndButtonClick}
                  ref={scrollToEndButtonRef}
                />
              )}
            </React.Fragment>
          ))}
        </ul>
        <BasicTypingIndicator />
      </ScrollToBottomPanel>
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

export { useMemoize };
