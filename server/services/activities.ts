import { NewActivitiesWithMedia } from '../../types/types';
import { deleteActivityAndMedia, insertNewActivity, updateActivityById } from '../dal/activities';
import { Activities } from '../../types/db-schema-definitions';

export const createNewActivity = async (newActivity: NewActivitiesWithMedia) => {
  const { media, ...activity } = newActivity;
  const activityId = await insertNewActivity(activity);
  return activityId;
};

export const updateActivity = async (id: number, changes: Partial<Omit<Activities, 'id'>>) => {
  const activityId = await updateActivityById(id, changes);
  return activityId;
};

export const deleteActivity = async (activityId: number) => {
  return deleteActivityAndMedia(activityId);
};
