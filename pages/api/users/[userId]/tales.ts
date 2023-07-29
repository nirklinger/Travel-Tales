import { createApiHandler } from '../../../../server/middlewares/api-handler';
import { NextApiRequest, NextApiResponse } from 'next';
import { StatusCodes } from 'http-status-codes';
import { getUsersTales } from '../../../../server/services/tales';
import { StoryResponse } from '../../../../types/types';

async function getUserTalesEndpoint(req: NextApiRequest, res: NextApiResponse<StoryResponse>) {
  const userId = req.query.userId as string;
  const tales = await getUsersTales(userId);
  console.log(`sending back tales!!! \n ${tales}`);
  res.status(StatusCodes.OK).send(tales);
}

export default createApiHandler().get<NextApiRequest, NextApiResponse<StoryResponse>>(getUserTalesEndpoint);

