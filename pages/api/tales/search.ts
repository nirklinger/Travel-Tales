import { NextApiRequest, NextApiResponse } from 'next';
import {
  CreateNewActivityResponse,
  NewActivitiesWithMedia,
  Override,
  GetActivitiesResponse,
  TalesResponse,
  TalesSearchResponse,
} from '../../../types/types';
import { StatusCodes } from 'http-status-codes';
import { createApiHandler } from '../../../server/middlewares/api-handler';
import {
  createNewActivity,
  searchActivitiesBySemantics,
} from '../../../server/services/activities';
import { getTalesByActivityIds } from '../../../server/dal/tales';

type searchTalesRequest = Override<NextApiRequest, { query: { search: string } }>;

const searchTales = async (req: searchTalesRequest, res: NextApiResponse<TalesSearchResponse>) => {
  const search = req.query.search;
  const acts = await searchActivitiesBySemantics(search);
  const tales = await getTalesByActivityIds(acts.map(act => act.activity_id));
  const talesIds = tales.map(tale => tale.trip_id);
  res.status(StatusCodes.OK).send({ talesIds });
};

export default createApiHandler().get<NextApiRequest, NextApiResponse<TalesSearchResponse>>(
  searchTales
);
