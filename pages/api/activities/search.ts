import { NextApiRequest, NextApiResponse } from 'next';
import {
  CreateNewActivityResponse,
  NewActivitiesWithMedia,
  Override,
  SearchActivitiesResponse,
} from '../../../types/types';
import { StatusCodes } from 'http-status-codes';
import { createApiHandler } from '../../../server/middlewares/api-handler';
import {
  createNewActivity,
  searchActivitiesBySemantics,
} from '../../../server/services/activities';

type searchActivitiesRequest = Override<NextApiRequest, { query: { search: string } }>;

const searchActivities = async (
  req: searchActivitiesRequest,
  res: NextApiResponse<SearchActivitiesResponse>
) => {
  const search = req.query.search;
  const acts = await searchActivitiesBySemantics(search);
};

export default createApiHandler().get<NextApiRequest, NextApiResponse<SearchActivitiesResponse>>(
  searchActivities
);
