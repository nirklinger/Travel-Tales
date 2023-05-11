import { NewActivitiesWithMedia } from '../../types/types';
import { insertNewActivity } from '../dal/activities';

export const createNewActivity = async (newActivity: NewActivitiesWithMedia) => {
  const { media, ...activity } = newActivity;
  const activityId = await insertNewActivity(activity);
  return activityId;
};
