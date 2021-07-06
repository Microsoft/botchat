export default function getUserMedia(constraints: MediaStreamConstraints): Promise<MediaStream> {
  const { navigator } = window;

  if (typeof navigator.mediaDevices !== 'undefined') {
    return navigator.mediaDevices.getUserMedia(constraints);
  }

  if (typeof navigator.getUserMedia !== 'undefined') {
    return new Promise((resolve, reject) => navigator.getUserMedia(constraints, resolve, reject));
  }

  throw new Error('This browser does not support Web Audio API.');
}
