import { fetchWrapper } from '../utils/fetchWrapper';
import { StatusCodes } from 'http-status-codes';
import { Activities, Trips, Users } from '../types/db-schema-definitions';
import { LocalFile, NewTrip, StoryResponse, Tale, TalesResponse } from '../types/types';

export async function fetchTales(): Promise<Tale[]> {
  const res = await fetchWrapper.get('/api/tales');
  if (!res.ok) {
    switch (res.status) {
      case StatusCodes.NOT_FOUND:
        throw new Error('no current tales exists');
        break;
      default:
        throw new Error('could not fetch tales');
    }
  }
  const { tales } = (await res.json()) as TalesResponse;
  return tales.map(tale => ({
    ...tale,
    author: `${tale.name}`,
    start_date: new Date(tale.start_date),
    end_date: new Date(tale.end_date),
  }));
}

export async function fetchTaleStory(taleId: number): Promise<StoryResponse> {
  const res = await fetchWrapper.get(`/api/tales/${taleId}/story`);
  if (!res.ok) {
    switch (res.status) {
      case StatusCodes.NOT_FOUND:
        throw new Error('no current tales exists');
        break;
      default:
        throw new Error('could not fetch tales');
    }
  }
  return (await res.json()) as StoryResponse;
}

export const createTale = async (taleToCreate: NewTrip): Promise<any> => {
  const res = await fetchWrapper.post('/api/tales', taleToCreate);
  if (!res.ok) {
    switch (res.status) {
      default:
        throw new Error('could not create a new tale');
    }
  }
  const newTaleId = await res.json();
  return newTaleId.trip_id;
};

export const search = async (searchText: string): Promise<Tale[]> => {
  const res = await fetchWrapper.get(`/api/activities/search`, { search: searchText });
  if (!res.ok) {
    switch (res.status) {
      default:
        throw new Error('could not search activity');
    }
  }
  const { tales } = (await res.json()) as TalesResponse;
  return tales.map(tale => ({
    ...tale,
    author: `${tale.name}`,
    start_date: new Date(tale.start_date),
    end_date: new Date(tale.end_date),
  }));
};

export const updateTaleCoverPhoto = async (taleId: number, coverPhoto: LocalFile): Promise<any> => {
  const reqBody = {taleId, coverPhoto};
  const res = await fetchWrapper.put(`/api/tales/${taleId}/coverPhoto`, reqBody);

  const { url } = await res.json();
  
  return url;
}

