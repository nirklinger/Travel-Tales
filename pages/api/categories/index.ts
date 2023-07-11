import { createApiHandler } from '../../../server/middlewares/api-handler';
import { getAllCategories, getClientCategories } from '../../../server/dal/categories';
import { NextApiResponse } from 'next';
import { CategoriesResponse } from '../../../types/types';
import { StatusCodes } from 'http-status-codes';

const fetchCategories = async (req, res: NextApiResponse<CategoriesResponse>) => {
  const categories = await getClientCategories();
  res.status(StatusCodes.OK).send({ categories });
};

export default createApiHandler().get(fetchCategories);
