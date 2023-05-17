import { NextApiRequest, NextApiResponse } from 'next';
import { CreateNewActivityResponse, NewActivitiesWithMedia, Override } from '../../../types/types';
import { StatusCodes } from 'http-status-codes';
import { createApiHandler } from '../../../server/middlewares/api-handler';
import { createNewActivity } from '../../../server/services/activities';

type createActivityRequest = Override<NextApiRequest, { body: NewActivitiesWithMedia }>;

const createActivity = async (
  req: createActivityRequest,
  res: NextApiResponse<CreateNewActivityResponse>
) => {
  const taleId = await createNewActivity(req.body);
  res.status(StatusCodes.CREATED).send(taleId);
};

export default createApiHandler().post<NextApiRequest, NextApiResponse<CreateNewActivityResponse>>(
  createActivity
);
