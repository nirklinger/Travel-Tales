import { NewActivitiesWithMedia } from '../types/types';
import { fetchWrapper } from '../utils/fetchWrapper';
import { IPostgresInterval } from 'postgres-interval';

export const createActivity = async (activityToCreate: NewActivitiesWithMedia): Promise<any> => {
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
