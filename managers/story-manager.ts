import { NewActivitiesWithMedia, NewTripDestination } from '../types/types';
import { fetchWrapper } from '../utils/fetchWrapper';
import { IPostgresInterval } from 'postgres-interval';

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

export const createDestination = async (destToCreate: NewTripDestination): Promise<number> => {
  const res = await fetchWrapper.post('/api/destinations', { ...destToCreate });
  if (!res.ok) {
    switch (res.status) {
      default:
        throw new Error('could not create a new destination');
    }
  }
  const newDestination = await res.json();
  return newDestination.id;
};

export const deleteDestination = async (destinationId: number): Promise<void> => {
  const res = await fetchWrapper.delete(`/api/destinations/${destinationId}`);
  if (!res.ok) {
    switch (res.status) {
      default:
        throw new Error('could not create a new destination');
    }
  }
};
