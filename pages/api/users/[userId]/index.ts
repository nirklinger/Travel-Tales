
import { createApiHandler } from '../../../../server/middlewares/api-handler';
import { NextApiRequest, NextApiResponse } from 'next';
import { StatusCodes } from 'http-status-codes';
import { updateUserProfileService } from '../../../../server/services/users';

const updateUserProfile = async (req: NextApiRequest, res: NextApiResponse) => {
    const userId = Number(req.query.userId);
    await updateUserProfileService(userId, req.body);
    res.status(StatusCodes.OK).send("OK");
  };

export default createApiHandler().put<NextApiRequest, NextApiResponse>(updateUserProfile);