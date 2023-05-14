import { NextApiRequest, NextApiResponse } from 'next';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { deleteActivity } from '../../../../server/services/activities';
import { createApiHandler } from '../../../../server/middlewares/api-handler';
import { Override } from '../../../../types/types';

type DeleteActivityRequest = Override<NextApiRequest, { query: { activityId: string } }>;

const delActivity = async (req: DeleteActivityRequest, res: NextApiResponse) => {
  await deleteActivity(Number(req.query.activityId));
  res.status(StatusCodes.OK).send(ReasonPhrases.OK);
};

export default createApiHandler().delete<DeleteActivityRequest, NextApiResponse>(delActivity);
