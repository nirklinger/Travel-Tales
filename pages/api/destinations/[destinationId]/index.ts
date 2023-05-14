import { NextApiRequest, NextApiResponse } from 'next';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { createApiHandler } from '../../../../server/middlewares/api-handler';
import { Override } from '../../../../types/types';
import { deleteDestination } from '../../../../server/services/destinations';

type DeleteDestinationRequest = Override<NextApiRequest, { query: { destinationId: string } }>;

const delDestination = async (req: DeleteDestinationRequest, res: NextApiResponse) => {
  await deleteDestination(Number(req.query.destinationId));
  res.status(StatusCodes.OK).send(ReasonPhrases.OK);
};

export default createApiHandler().delete<DeleteDestinationRequest, NextApiResponse>(delDestination);
