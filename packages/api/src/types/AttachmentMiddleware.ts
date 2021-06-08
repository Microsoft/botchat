import { ReactNode } from 'react';

import DirectLineActivity from './external/DirectLineActivity';
import DirectLineAttachment from './external/DirectLineAttachment';

type AttachmentProps = {
  activity: DirectLineActivity;
  attachment: DirectLineAttachment;
};

type RenderAttachment = (props?: AttachmentProps) => ReactNode;

type AttachmentEnhancer = (next: RenderAttachment) => RenderAttachment;
type AttachmentMiddleware = () => AttachmentEnhancer;

export default AttachmentMiddleware;

export type { RenderAttachment };
