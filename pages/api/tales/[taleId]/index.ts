import { NextApiRequest, NextApiResponse } from 'next';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { deleteTale, updateTale } from '../../../../server/services/tales';
import { createApiHandler } from '../../../../server/middlewares/api-handler';
import { Override } from '../../../../types/types';
import { Activities, Trips } from '../../../../types/db-schema-definitions';

type DeleteTaleRequest = Override<NextApiRequest, { query: { taleId: string } }>;

const delTale = async (req: DeleteTaleRequest, res: NextApiResponse) => {
  await deleteTale(Number(req.query.taleId));
  res.status(StatusCodes.OK).send(ReasonPhrases.OK);
};

type PatchTaleRequest = Override<NextApiRequest, { body: Partial<Omit<Trips, 'trip_id'>> }>;

type PatchTaleResponse = NextApiResponse<Partial<Omit<Activities, 'id'>>>;

const patchTale = async (req: PatchTaleRequest, res: NextApiResponse) => {
  await updateTale(Number(req.query.taleId), req.body);
  res.status(StatusCodes.OK).send(ReasonPhrases.OK);
};

export default createApiHandler()
  .patch<PatchTaleRequest, PatchTaleResponse>(patchTale)
  .delete<DeleteTaleRequest, NextApiResponse>(delTale);
