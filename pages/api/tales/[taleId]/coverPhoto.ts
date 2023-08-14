import { createApiHandler } from '../../../../server/middlewares/api-handler';
import { NextApiRequest, NextApiResponse } from 'next';
import { StatusCodes } from 'http-status-codes';
import { updateTaleCoverPhoto } from '../../../../server/services/tales';
import { IncomingForm } from 'formidable';
import { TaleCoverPhotoUploadRes } from '../../../../types/types';

const updateCoverPhoto = async (
  req: NextApiRequest,
  res: NextApiResponse<TaleCoverPhotoUploadRes>
) => {
  const taleId = Number(req.query.taleId);
  const form = new IncomingForm();
  const [fields, files] = await form.parse(req);
  const coverPhoto = files['coverPhoto']?.[0];
  const coverPhotoUrl = await updateTaleCoverPhoto(taleId, coverPhoto);

  res.status(StatusCodes.OK).json({ coverPhotoUrl });
};

export default createApiHandler().put<NextApiRequest, NextApiResponse<TaleCoverPhotoUploadRes>>(
  updateCoverPhoto
);

export const config = {
  api: {
    bodyParser: false,
  },
};
