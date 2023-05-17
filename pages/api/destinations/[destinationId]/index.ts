import { NextApiRequest, NextApiResponse } from 'next';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { createApiHandler } from '../../../../server/middlewares/api-handler';
import { NewTripDestination, Override } from '../../../../types/types';
import { deleteDestination, updateDestination } from '../../../../server/services/destinations';

type DeleteDestinationRequest = Override<NextApiRequest, { query: { destinationId: string } }>;

const delDestination = async (req: DeleteDestinationRequest, res: NextApiResponse) => {
  await deleteDestination(Number(req.query.destinationId));
  res.status(StatusCodes.OK).send(ReasonPhrases.OK);
};

type PatchDestinationRequest = Override<NextApiRequest, { body: Partial<NewTripDestination> }>;

type PatchDestinationResponse = NextApiResponse<Partial<NewTripDestination>>;

const patchDestination = async (req: PatchDestinationRequest, res: NextApiResponse) => {
  await updateDestination(Number(req.query.destinationId), req.body);
  res.status(StatusCodes.OK).send(ReasonPhrases.OK);
};

export default createApiHandler()
  .patch<PatchDestinationRequest, PatchDestinationResponse>(patchDestination)
  .delete<DeleteDestinationRequest, NextApiResponse>(delDestination);
