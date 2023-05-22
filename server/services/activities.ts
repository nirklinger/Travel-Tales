import { LocalFile, NewActivitiesWithMedia } from '../../types/types';
import { deleteActivityAndMedia, insertNewActivity, updateActivityById, updateDbActivityMediaTable, uploadActivityMedia } from '../dal/activities';
import { Activities } from '../../types/db-schema-definitions';
import { fetchTaleByActivityId } from '../dal/tales';

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

export const uploadActivityMediaToServer = async (id: number, photo: LocalFile) => {
  console.log(`services - uploadActivityMediaToServer`);
  const taleId = (await fetchTaleByActivityId(id)).trip_id;
  console.log(`taleId - ${taleId}; JSON.stringify(taleId) - ${JSON.stringify(taleId)}`)
  await uploadActivityMedia(taleId, id, photo);
  await updateDbActivityMediaTable(taleId, id, photo);
}
