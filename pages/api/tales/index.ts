import { createApiHandler } from '../../../server/middlewares/api-handler';
import { getAllTales, createNewTale, updateTaleCoverPhoto } from '../../../server/services/tales';
import { NextApiRequest, NextApiResponse } from 'next';
import { StatusCodes } from 'http-status-codes';
import { TalesResponse,CreateTaleResponse } from '../../../types/types';

async function getTales(req: NextApiRequest, res: NextApiResponse<TalesResponse>) {
  const tales = await getAllTales();
  res.status(StatusCodes.OK).send({ tales });
}

const createTale = async (req: NextApiRequest, res: NextApiResponse<CreateTaleResponse>) => {
  const taleId = await createNewTale(req.body);
  res.status(StatusCodes.CREATED).send(taleId);
}

const updateCoverPhoto = async (req: NextApiRequest, res: NextApiResponse) => {
  await updateTaleCoverPhoto(req.body);
  res.status(StatusCodes.OK);
}

export default createApiHandler().get<NextApiRequest, NextApiResponse<TalesResponse>>(getTales)
.post<NextApiRequest, NextApiResponse<CreateTaleResponse>>(createTale)
.put<NextApiRequest, NextApiResponse>(updateCoverPhoto);

