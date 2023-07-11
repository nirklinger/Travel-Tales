import { fetchWrapper } from '../utils/fetchWrapper';
import { StatusCodes } from 'http-status-codes';
import { CategoriesResponse } from '../types/types';

export const fetchCategories = async () => {
  const res = await fetchWrapper.get('/api/categories');

  if (!res.ok) {
    switch (res.status) {
      case StatusCodes.NOT_FOUND:
        throw new Error('no current categories exists');
        break;
      default:
        throw new Error('could not fetch categories');
    }
  }
  return (await res.json()) as CategoriesResponse;
};
