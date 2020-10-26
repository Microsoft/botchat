// We will check buffered duration for 5 times of each 300ms interval.
// If all 3 checks return the same buffered length, we will consider the buffering has stabilized.
const BUFFERED_CHECK_INTERVAL = 300;
const NUM_BUFFERED_CHECK = 15;
const WAIT_FOR_ANIMATION = 2000;

function sleep(duration) {
  return new Promise(resolve => setTimeout(resolve, duration));
}

export default function mediaBuffered(mediaElement) {
  return {
    message: 'for media to finish buffering',
    fn: async () => {
      const initialBufferedDuration = mediaElement.buffered.length && mediaElement.buffered.end(0);

      if (!initialBufferedDuration) {
        return false;
      }

      for (let index = 0; index < NUM_BUFFERED_CHECK; index++) {
        const bufferedDuration = mediaElement.buffered.length && mediaElement.buffered.end(0);

        if (
          mediaElement.readyState !== HTMLMediaElement.HAVE_ENOUGH_DATA ||
          bufferedDuration !== initialBufferedDuration
        ) {
          return false;
        }

        await sleep(BUFFERED_CHECK_INTERVAL);
      }

      // TODO: [P3] #3557 If the result is positive, audio finished buffering, we still need to wait for an unknown time to refresh the UI.
      //       Will be great if we can remove this sleep.
      await sleep(WAIT_FOR_ANIMATION);

      return true;
    }
  };
}
