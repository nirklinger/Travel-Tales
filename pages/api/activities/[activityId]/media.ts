import { createApiHandler } from '../../../../server/middlewares/api-handler';
import { NextApiRequest, NextApiResponse } from 'next';
import { StatusCodes } from 'http-status-codes';

import { uploadActivityMediaToServer } from '../../../../server/services/activities';

const uploadActivityMedia = async (req: NextApiRequest, res: NextApiResponse) => {
    const activityId = Number(req.query.activityId);
    const activityPhoto = req.body;
    await uploadActivityMediaToServer(activityId, activityPhoto);
  
    res.status(StatusCodes.OK);
};


export default createApiHandler().post<NextApiRequest, NextApiResponse>(uploadActivityMedia);
