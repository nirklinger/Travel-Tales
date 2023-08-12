import { NextApiRequest, NextApiResponse } from 'next';
import { ActivitiesSearchResponse, Override, TalesResponse } from '../../../types/types';
import { StatusCodes } from 'http-status-codes';
import { createApiHandler } from '../../../server/middlewares/api-handler';
import { searchActivitiesBySemantics } from '../../../server/services/activities';

type searchActivitiesRequest = Override<NextApiRequest, { query: { search: string } }>;

const searchActivities = async (
  req: searchActivitiesRequest,
  res: NextApiResponse<ActivitiesSearchResponse>
) => {
  const search = req.query.search;
  const acts = await searchActivitiesBySemantics(search);
  const activitiesIds = acts.map(act => act.activity_id);
  res.status(StatusCodes.OK).send({ activitiesIds });
};

export default createApiHandler().get<NextApiRequest, NextApiResponse<ActivitiesSearchResponse>>(
  searchActivities
);
