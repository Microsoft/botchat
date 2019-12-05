// Currently, we use a triple-buffer approach.
const NUM_BUFFER = 3;

function zeroBuffer(buffer) {
  const channels = buffer.numberOfChannels;

  for (let channel = 0; channel < channels; channel++) {
    const audioData = buffer.getChannelData(channel);

    [].fill.call(audioData, 0);
  }
}

function copyBuffer(buffer, multiChannelArrayBuffer) {
  const channels = buffer.numberOfChannels;

  for (let channel = 0; channel < channels; channel++) {
    buffer.copyToChannel(multiChannelArrayBuffer[channel], channel);
  }
}

// This is a multi-buffering player. Users can keep pushing buffer to us.
// We will realize the buffer as BufferSource and queue it to AudioContext.
// We will queue as soon, and as much as possible.
// We do not support progressive buffering (push partial buffer) and do not have plan for it.

export default function createMultiBufferingPlayer(audioContext, { channels, samplesPerSec }, numSamplePerBuffer) {
  const freeBuffers = new Array(NUM_BUFFER)
    .fill()
    .map(() => audioContext.createBuffer(channels, numSamplePerBuffer, samplesPerSec));
  let queuedBufferSources = [];
  let nextSchedule;

  const queue = [];

  const playNext = () => {
    if (typeof nextSchedule !== 'number') {
      nextSchedule = audioContext.currentTime;
    }

    const bufferSource = audioContext.createBufferSource();
    const multiChannelArrayBuffer = queue.shift();

    if (typeof multiChannelArrayBuffer === 'function') {
      // If the queued item is a function, it is because the user called "flush".
      // The "flush" function will callback when all queued buffer before the "flush" call had played.
      multiChannelArrayBuffer();
    } else if (multiChannelArrayBuffer) {
      const nextBuffer = freeBuffers.shift();

      // If all buffers are currently occupied, prepend the data back to the queue.
      // When one of the buffer finish, it will call playNext() again to pick up things from the queue.
      if (!nextBuffer) {
        queue.unshift(multiChannelArrayBuffer);

        return;
      }

      zeroBuffer(nextBuffer);
      copyBuffer(nextBuffer, multiChannelArrayBuffer);

      bufferSource.buffer = nextBuffer;
      bufferSource.connect(audioContext.destination);
      bufferSource.start(nextSchedule);

      // We will remember all BufferSource that is currently queued at the AudioContext, thru bufferSource.start().
      // This is for cancelAll() to effectively cancel all BufferSource queued at the AudioContext.
      queuedBufferSources.push(bufferSource);

      nextSchedule += nextBuffer.duration;

      bufferSource.addEventListener('ended', () => {
        queuedBufferSources = queuedBufferSources.filter(target => target !== bufferSource);

        // Declare this buffer is free to pick up on next round.
        freeBuffers.push(nextBuffer);
        playNext();
      });
    }
  };

  return {
    cancelAll: () => {
      queue.splice(0);

      // Although all buffer are cleared, there are still some BufferSources queued at the AudioContext that need to be stopped.
      queuedBufferSources.forEach(bufferSource => bufferSource.stop());
    },
    flush: () => new Promise(resolve => queue.push(resolve)),
    push: multiChannelArrayBuffer => {
      queue.push(multiChannelArrayBuffer);

      playNext();
    }
  };
}
