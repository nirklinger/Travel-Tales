import { createApiHandler } from '../../../../server/middlewares/api-handler';
import { NextApiRequest, NextApiResponse } from 'next';
import { StatusCodes } from 'http-status-codes';
import { updateUserProfilePhoto } from '../../../../server/services/users';
import { IncomingForm } from 'formidable';
import { UserProfilePhotoUploadRes } from '../../../../types/types';

const S3_URL = process.env.AWS_S3_URL;

const updateProfilePhoto = async (
  req: NextApiRequest,
  res: NextApiResponse<UserProfilePhotoUploadRes>
) => {
  const taleId = Number(req.query.userId);
  const form = new IncomingForm();
  const [fields, files] = await form.parse(req);
  const profilePhoto = files['profilePhoto']?.[0];
  const { avatar_photo: profilePhotoUrl } = await updateUserProfilePhoto(taleId, profilePhoto);
  const newPhoto =
    process.env.NODE_ENV !== 'development' ? S3_URL + profilePhotoUrl : profilePhotoUrl;
  res.status(StatusCodes.OK).json({ profilePhotoUrl: newPhoto });
};

export default createApiHandler().put<NextApiRequest, NextApiResponse<UserProfilePhotoUploadRes>>(
  updateProfilePhoto
);

export const config = {
  api: {
    bodyParser: false,
  },
};
