import { NewActivitiesWithMedia } from '../../types/types';
import { deleteActivityAndMedia, insertNewActivity } from '../dal/activities';

export const createNewActivity = async (newActivity: NewActivitiesWithMedia) => {
  const { media, ...activity } = newActivity;
  const activityId = await insertNewActivity(activity);
  return activityId;
};

export const deleteActivity = async (activityId: number) => {
  return deleteActivityAndMedia(activityId);
};
