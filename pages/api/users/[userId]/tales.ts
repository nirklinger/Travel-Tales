import { createApiHandler } from '../../../../server/middlewares/api-handler';
import { NextApiRequest, NextApiResponse } from 'next';
import { StatusCodes } from 'http-status-codes';
import { getUsersTales } from '../../../../server/services/tales';
import { TalesResponse } from '../../../../types/types';

async function getUserTalesEndpoint(req: NextApiRequest, res: NextApiResponse<TalesResponse>) {
  const userId = req.query.userId as string;
  const tales = await getUsersTales(userId);

  res.status(StatusCodes.OK).json({ tales });
}

export default createApiHandler().get<NextApiRequest, NextApiResponse<TalesResponse>>(
  getUserTalesEndpoint
);
