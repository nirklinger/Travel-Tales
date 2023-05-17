import { NextApiRequest, NextApiResponse } from 'next';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { deleteActivity, updateActivity } from '../../../../server/services/activities';
import { createApiHandler } from '../../../../server/middlewares/api-handler';
import { Override } from '../../../../types/types';
import { Activities } from '../../../../types/db-schema-definitions';

type DeleteActivityRequest = Override<NextApiRequest, { query: { activityId: string } }>;

const delActivity = async (req: DeleteActivityRequest, res: NextApiResponse) => {
  await deleteActivity(Number(req.query.activityId));
  res.status(StatusCodes.OK).send(ReasonPhrases.OK);
};

type PatchActivityRequest = Override<NextApiRequest, { body: Partial<Omit<Activities, 'id'>> }>;

type PatchActivityResponse = NextApiResponse<Partial<Omit<Activities, 'id'>>>;

const patchActivity = async (req: PatchActivityRequest, res: NextApiResponse) => {
  await updateActivity(Number(req.query.activityId), req.body);
  res.status(StatusCodes.OK).send(ReasonPhrases.OK);
};

export default createApiHandler()
  .patch<PatchActivityRequest, PatchActivityResponse>(patchActivity)
  .delete<DeleteActivityRequest, NextApiResponse>(delActivity);
