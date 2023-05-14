import { NextApiRequest, NextApiResponse } from 'next';
import { CreateNewDestinationResponse, NewTripDestination, Override } from '../../../types/types';
import { StatusCodes } from 'http-status-codes';
import { createApiHandler } from '../../../server/middlewares/api-handler';
import { createNewDestination } from '../../../server/services/destinations';

type createDestinationRequest = Override<NextApiRequest, { body: NewTripDestination }>;

const createDestination = async (
  req: createDestinationRequest,
  res: NextApiResponse<CreateNewDestinationResponse>
) => {
  const taleId = await createNewDestination(req.body);
  res.status(StatusCodes.CREATED).send(taleId);
};

export default createApiHandler().post<
  NextApiRequest,
  NextApiResponse<CreateNewDestinationResponse>
>(createDestination);
