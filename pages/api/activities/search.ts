import { NextApiRequest, NextApiResponse } from 'next';
import {
  CreateNewActivityResponse,
  NewActivitiesWithMedia,
  Override,
  SearchActivitiesResponse,
  TalesResponse,
} from '../../../types/types';
import { StatusCodes } from 'http-status-codes';
import { createApiHandler } from '../../../server/middlewares/api-handler';
import {
  createNewActivity,
  searchActivitiesBySemantics,
} from '../../../server/services/activities';
import { getTalesByActivityIds } from '../../../server/dal/tales';

type searchActivitiesRequest = Override<NextApiRequest, { query: { search: string } }>;

const searchActivities = async (
  req: searchActivitiesRequest,
  res: NextApiResponse<TalesResponse>
) => {
  const search = req.query.search;
  const acts = await searchActivitiesBySemantics(search);
  const tales = await getTalesByActivityIds(acts.map(act => act.activity_id));
  res.status(StatusCodes.OK).send({ tales });
};

export default createApiHandler().get<NextApiRequest, NextApiResponse<TalesResponse>>(
  searchActivities
);
