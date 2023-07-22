import { LocalFile, NewActivitiesWithMedia, NewTripDestination } from '../types/types';
import { fetchWrapper } from '../utils/fetchWrapper';
import { IPostgresInterval } from 'postgres-interval';
import { Activities } from '../types/db-schema-definitions';

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

export const uploadActivityMedias = async (activityId: number, photos: LocalFile[]) => {
  photos.forEach(photo => 
    uploadActivityMedia(activityId, photo)
    )
}

const uploadActivityMedia = async (activityId: number, photo:LocalFile) => {
  const res = await fetchWrapper.post(`/api/activities/${activityId}/media`, photo);
  if (!res.ok) {
    switch (res.status) {
      default:
        throw new Error('could not upload activity media');
    }
  }
}
