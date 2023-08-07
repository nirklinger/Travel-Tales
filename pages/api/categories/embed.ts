import { createApiHandler } from '../../../server/middlewares/api-handler';
import { NextApiRequest, NextApiResponse } from 'next';
import { CreateNewActivityResponse } from '../../../types/types';
import { embedAllCategories } from '../../../server/services/embedding';

async function embedCategories(req: NextApiRequest, res: NextApiResponse) {
  // Dont run for now ... await embedAllCategories();
  res.status(200).send('OK');
}

export default createApiHandler().post<NextApiRequest, NextApiResponse>(embedCategories);
