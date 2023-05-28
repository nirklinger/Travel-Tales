import { NewActivitiesWithMedia } from '../../types/types';
import { deleteActivityAndMedia, insertNewActivity, updateActivityById } from '../dal/activities';
import { Activities } from '../../types/db-schema-definitions';
import { embedActivities } from './embedding';
import { generateEmbeddings } from './open-ai';

export const createNewActivity = async (newActivity: NewActivitiesWithMedia) => {
  const { media, ...activity } = newActivity;
  const activityId = await insertNewActivity(activity);
  return activityId;
};

export const updateActivity = async (id: number, changes: Partial<Omit<Activities, 'id'>>) => {
  const activityId = await updateActivityById(id, changes);
  if (changes.description) {
    await embedActivities({ id, description: changes.description });
  }
  return activityId;
};

export const deleteActivity = async (activityId: number) => {
  return deleteActivityAndMedia(activityId);
};

export const searchActivitiesBySemantics = async (search: string) => {
  const searchEmbeddings = await generateEmbeddings(search);
  const acts = await searchCosineSimilarity(searchEmbeddings);
};
