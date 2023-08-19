import { fetchWrapper } from '../utils/fetchWrapper';
import { StatusCodes } from 'http-status-codes';
import { Activities, Trips, Users } from '../types/db-schema-definitions';
import {
  ActivityMediaUploadRes,
  LocalFile,
  NewTrip,
  StoryResponse,
  Tale,
  TaleCoverPhotoUploadRes,
  TalesResponse,
  TalesSearchResponse,
} from '../types/types';

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
    author: `${tale.first_name} ${tale.last_name}`,
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

export const search = async (searchText: string): Promise<number[]> => {
  const res = await fetchWrapper.get(`/api/tales/search`, { search: searchText });
  if (!res.ok) {
    switch (res.status) {
      default:
        throw new Error('could not search activity');
    }
  }
  const { talesIds } = (await res.json()) as TalesSearchResponse;
  return talesIds;
};

export const patchTale = async (
  taleId: number,
  patch: Partial<Omit<Trips, 'trip_id'>>
): Promise<void> => {
  const res = await fetchWrapper.patch(`/api/tales/${taleId}`, patch);
  if (!res.ok) {
    switch (res.status) {
      default:
        throw new Error('could not update tale');
    }
  }
};

export const updateTaleCoverPhoto = async (taleId: number, coverPhoto: File): Promise<string> => {
  const formData = new FormData();
  formData.append('taleId', taleId.toString());
  formData.append('coverPhoto', coverPhoto);

  // Don't use fetchWrapper we want the content type to be set automatically
  const res = await fetch(`/api/tales/${taleId}/coverPhoto`, {
    method: 'PUT',
    body: formData,
  });

  if (!res.ok) {
    switch (res.status) {
      default:
        throw new Error('could not upload cover photo');
    }
  }

  return ((await res.json()) as TaleCoverPhotoUploadRes)?.coverPhotoUrl;
};

export const checkIfUserIsTaleOwner = async (taleId: number, userExternalId: string) => {
  const res = await fetchWrapper.get(`/api/tales/${taleId}/user`, { external_id: userExternalId });
  if (!res.ok) {
    switch (res.status) {
      default:
        throw new Error('could not validate the owner of the tale');
    }
  }

  return res;
};
