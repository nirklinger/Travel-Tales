import { NextApiRequest, NextApiResponse } from 'next';
import {
  ActivitiesResponse,
  CreateNewActivityResponse,
  NewActivitiesWithMedia,
  Override,
} from '../../../types/types';
import { StatusCodes } from 'http-status-codes';
import { createApiHandler } from '../../../server/middlewares/api-handler';
import {
  createNewActivity,
  getActivitiesWithMediaWithCategories,
} from '../../../server/services/activities';

type createActivityRequest = Override<NextApiRequest, { body: NewActivitiesWithMedia }>;

const createActivity = async (
  req: createActivityRequest,
  res: NextApiResponse<CreateNewActivityResponse>
) => {
  const taleId = await createNewActivity(req.body);
  res.status(StatusCodes.CREATED).send(taleId);
};

const fetchActivitiesWithMediaWithCategories = async (
  req: NextApiRequest,
  res: NextApiResponse<ActivitiesResponse>
) => {
  const activities = await getActivitiesWithMediaWithCategories();
  res.status(StatusCodes.OK).send({ activities });
};

export default createApiHandler()
  .post<NextApiRequest, NextApiResponse<ActivitiesResponse>>(createActivity)
  .get(fetchActivitiesWithMediaWithCategories);
