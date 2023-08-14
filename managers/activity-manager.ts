import {
  ActivitiesResponse,
  NewActivitiesWithMedia,
  LocalFile,
  ActivitiesSearchResponse,
  ActivityMediaUploadRes,
} from '../types/types';
import { fetchWrapper } from '../utils/fetchWrapper';
import { IPostgresInterval } from 'postgres-interval';
import { Activities } from '../types/db-schema-definitions';
import { StatusCodes } from 'http-status-codes';

export const createActivity = async (activityToCreate: NewActivitiesWithMedia): Promise<number> => {
  const duration = (activityToCreate.duration as IPostgresInterval).toPostgres();
  const res = await fetchWrapper.post('/api/activities', { ...activityToCreate, duration });
  if (!res.ok) {
    switch (res.status) {
      default:
        throw new Error('could not create a new activity');
    }
  }
  const newActivity = await res.json();
  return newActivity.id;
};

export const deleteActivity = async (activityId: number): Promise<void> => {
  const res = await fetchWrapper.delete(`/api/activities/${activityId}`);
  if (!res.ok) {
    switch (res.status) {
      default:
        throw new Error('could not create a new activity');
    }
  }
};

export const patchActivity = async (
  activityId: number,
  patch: Partial<Omit<Activities, 'id'>>
): Promise<void> => {
  const res = await fetchWrapper.patch(`/api/activities/${activityId}`, patch);
  if (!res.ok) {
    switch (res.status) {
      default:
        throw new Error('could not update activity');
    }
  }
};

export const fetchActivitiesCategories = async (): Promise<ActivitiesResponse> => {
  const res = await fetchWrapper.get('/api/activities');

  if (!res.ok) {
    switch (res.status) {
      case StatusCodes.NOT_FOUND:
        throw new Error('no current activities exists');
        break;
      default:
        throw new Error('could not fetch activities');
    }
  }
  return (await res.json()) as ActivitiesResponse;
};

export const uploadActivityMedias = async (activityId: number, photos: File[]) => {
  const formData = new FormData();
  formData.append('activityId', activityId.toString());
  photos.forEach(photo => formData.append('uploadPhotos', photo));

  // Don't use fetchWrapper we want the content type to be set automatically
  const res = await fetch(`/api/activities/${activityId}/media`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    switch (res.status) {
      default:
        throw new Error('could not upload activity media');
    }
  }

  return ((await res.json()) as ActivityMediaUploadRes)?.uploadedMedia;
};

const uploadActivityMedia = async (activityId: number, photo: LocalFile) => {
  const res = await fetchWrapper.post(`/api/activities/${activityId}/media`, photo);
  if (!res.ok) {
    switch (res.status) {
      default:
        throw new Error('could not upload activity media');
    }
  }
};

export const search = async (searchText: string): Promise<number[]> => {
  const res = await fetchWrapper.get(`/api/activities/search`, { search: searchText });
  if (!res.ok) {
    switch (res.status) {
      default:
        throw new Error('could not search activities');
    }
  }
  const { activitiesIds } = (await res.json()) as ActivitiesSearchResponse;
  return activitiesIds;
};
