import { css } from 'glamor';
import classNames from 'classnames';
import React, { useCallback, useRef } from 'react';

import { useLocalize } from '../Localization/Localize';
import AttachmentIcon from './Assets/AttachmentIcon';
import connectToWebChat from '../connectToWebChat';
import downscaleImageToDataURL from '../Utils/downscaleImageToDataURL';
import IconButton from './IconButton';
import useStyleSet from '../hooks/useStyleSet';
import useWebChat from '../useWebChat';

const ROOT_CSS = css({
  overflow: 'hidden',
  position: 'relative',

  '& > input': {
    height: 0,
    width: 0,
    opacity: 0,
    position: 'absolute',
    left: 0,
    top: 0
  }
});

async function makeThumbnail(file, width, height, contentType, quality) {
  if (/\.(gif|jpe?g|png)$/iu.test(file.name)) {
    try {
      return await downscaleImageToDataURL(file, width, height, contentType, quality);
    } catch (error) {
      console.warn(`Web Chat: Failed to downscale image due to ${error}.`);
    }
  }
}

const connectUploadButton = (...selectors) => {
  console.warn(
    'Web Chat: connectUploadButton() will be removed on or after 2021-09-27, please use useUploadButton() instead.'
  );

  return connectToWebChat(
    ({
      disabled,
      language,
      sendFiles,
      styleSet: {
        options: {
          enableUploadThumbnail,
          uploadThumbnailContentType,
          uploadThumbnailHeight,
          uploadThumbnailQuality,
          uploadThumbnailWidth
        }
      }
    }) => ({
      disabled,
      language,
      sendFiles: async files => {
        if (files && files.length) {
          // TODO: [P3] We need to find revokeObjectURL on the UI side
          //       Redux store should not know about the browser environment
          //       One fix is to use ArrayBuffer instead of object URL, but that would requires change to DirectLineJS
          sendFiles(
            await Promise.all(
              [].map.call(files, async file => ({
                name: file.name,
                size: file.size,
                url: window.URL.createObjectURL(file),
                ...(enableUploadThumbnail && {
                  thumbnail: await makeThumbnail(
                    file,
                    uploadThumbnailWidth,
                    uploadThumbnailHeight,
                    uploadThumbnailContentType,
                    uploadThumbnailQuality
                  )
                })
              }))
            )
          );
        }
      }
    }),
    ...selectors
  );
};

const useUploadButton = () => {
  const { disabled, sendFiles } = useWebChat();
  const {
    options: {
      enableUploadThumbnail,
      uploadThumbnailContentType,
      uploadThumbnailHeight,
      uploadThumbnailQuality,
      uploadThumbnailWidth
    }
  } = useStyleSet();

  return {
    disabled,
    sendFiles: async files => {
      if (files && files.length) {
        // TODO: [P3] We need to find revokeObjectURL on the UI side
        //       Redux store should not know about the browser environment
        //       One fix is to use ArrayBuffer instead of object URL, but that would requires change to DirectLineJS
        sendFiles(
          await Promise.all(
            [].map.call(files, async file => ({
              name: file.name,
              size: file.size,
              url: window.URL.createObjectURL(file),
              ...(enableUploadThumbnail && {
                thumbnail: await makeThumbnail(
                  file,
                  uploadThumbnailWidth,
                  uploadThumbnailHeight,
                  uploadThumbnailContentType,
                  uploadThumbnailQuality
                )
              })
            }))
          )
        );
      }
    }
  };
};

const UploadButton = () => {
  const { disabled, sendFiles } = useUploadButton();
  const styleSet = useStyleSet();
  const inputRef = useRef();
  const uploadFileString = useLocalize('Upload file');
  const { current } = inputRef;

  const handleClick = useCallback(() => {
    current && current.click();
  }, [current]);

  const handleFileChange = useCallback(
    ({ target: { files } }) => {
      sendFiles(files);

      if (current) {
        current.value = null;
      }
    },
    [current, sendFiles]
  );

  return (
    <div className={classNames(ROOT_CSS + '', styleSet.uploadButton + '')}>
      <input
        aria-hidden="true"
        disabled={disabled}
        multiple={true}
        onChange={handleFileChange}
        ref={inputRef}
        role="button"
        tabIndex={-1}
        type="file"
      />
      <IconButton alt={uploadFileString} aria-label={uploadFileString} disabled={disabled} onClick={handleClick}>
        <AttachmentIcon />
      </IconButton>
    </div>
  );
};

export default UploadButton;

export { connectUploadButton, useUploadButton };
