import { fetchWrapper } from '../utils/fetchWrapper';
import { StatusCodes } from 'http-status-codes';
import { Tale, TalesResponse } from '../types/types';


export async function fetchUserTalesById(userId: string): Promise<Tale[]> {
  const res = await fetchWrapper.get(`/api/users/${userId}/tales`);
  if (!res.ok) {
    switch (res.status) {
      case StatusCodes.NOT_FOUND:
        throw new Error('no current tales exists');
        break;
      default:
        throw new Error('could not fetch tales');
    }
  }
  const tales = (await res.json()) as TalesResponse;
    
  return tales.map(tale => ({
    ...tale,
    author: `${tale.first_name} ${tale.last_name}`,
    start_date: new Date(tale.start_date),
    end_date: new Date(tale.end_date),
  }));
}