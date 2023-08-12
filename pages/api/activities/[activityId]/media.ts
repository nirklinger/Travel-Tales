import { createApiHandler } from '../../../../server/middlewares/api-handler';
import { NextApiRequest, NextApiResponse } from 'next';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { IncomingForm } from 'formidable';

import { uploadActivityMediaToServer } from '../../../../server/services/activities';
import { ActivityMediaUploadRes } from '../../../../types/types';

const uploadActivityMedia = async (
  req: NextApiRequest,
  res: NextApiResponse<ActivityMediaUploadRes>
) => {
  console.log(`uploadActivityMedia - api`);
  const activityId = Number(req.query.activityId);
  const form = new IncomingForm();
  const [fields, files] = await form.parse(req);
  const uploadFiles = files['uploadPhotos'];
  const uploadedMedia = await uploadActivityMediaToServer(activityId, uploadFiles);
  res.status(200).json({ uploadedMedia });
};

export default createApiHandler().post<NextApiRequest, NextApiResponse>(uploadActivityMedia);

export const config = {
  api: {
    bodyParser: false,
  },
};
