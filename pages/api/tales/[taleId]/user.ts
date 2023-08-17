import { createApiHandler } from '../../../../server/middlewares/api-handler';
import { NextApiRequest, NextApiResponse } from 'next';
import { StatusCodes } from 'http-status-codes';
import { checkIfUserIsTaleOwnerByExternalId } from '../../../../server/services/tales';

async function checkTaleOwnership(req: NextApiRequest, res: NextApiResponse) {
  const taleId = Number(req.query.taleId);
  const userExternalId = req.query.external_id as string;
  const isUserTaleOwner = await checkIfUserIsTaleOwnerByExternalId(taleId, userExternalId);

  res.status(StatusCodes.OK).send(isUserTaleOwner);
}

export default createApiHandler().get<NextApiRequest, NextApiResponse>(checkTaleOwnership);
