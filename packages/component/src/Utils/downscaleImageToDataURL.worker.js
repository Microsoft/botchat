// This file is the entrypoint of Web Worker and is minimally transpiled through Babel.
// Do not include any dependencies here because they will not be bundled.

export default () => {
  function blobToDataURL(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onerror = ({ error, message }) => reject(error || new Error(message));
      reader.onloadend = () => resolve(reader.result);

      reader.readAsDataURL(blob);
    });
  }

  function keepAspectRatio(width, height, maxWidth, maxHeight) {
    if (width < maxWidth && height < maxHeight) {
      // Photo is smaller than both maximum dimensions, take it as-is
      return {
        height,
        width
      };
    }

    const aspectRatio = width / height;

    if (aspectRatio > maxWidth / maxHeight) {
      // Photo is wider than maximum dimension, downscale it based on maxWidth.
      return {
        height: maxWidth / aspectRatio,
        width: maxWidth
      };
    }

    // Photo is taller than maximum dimension, downscale it based on maxHeight.
    return {
      height: maxHeight,
      width: maxHeight * aspectRatio
    };
  }

  onmessage = async ({ data: { arrayBuffer, maxHeight, maxWidth, type, quality }, ports: [port] }) => {
    try {
      const imageBitmap = await createImageBitmap(
        new Blob([arrayBuffer], {
          resizeQuality: 'high'
        })
      );

      const { height, width } = keepAspectRatio(imageBitmap.width, imageBitmap.height, maxWidth, maxHeight);
      const offscreenCanvas = new OffscreenCanvas(width, height);
      const context = offscreenCanvas.getContext('2d');

      context.drawImage(imageBitmap, 0, 0, width, height);

      // Firefox quirks: 68.0.1 call named OffscreenCanvas.convertToBlob as OffscreenCanvas.toBlob.
      const blob = await (offscreenCanvas.convertToBlob || offscreenCanvas.toBlob).call(offscreenCanvas, {
        type,
        quality
      });

      port.postMessage({
        result: await blobToDataURL(blob)
      });
    } catch (err) {
      console.error(err);

      const { message, stack } = err;

      port.postMessage({
        error: { message, stack }
      });
    }
  };

  postMessage('ready');
};
