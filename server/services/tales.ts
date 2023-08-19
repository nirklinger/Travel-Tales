import {
  getTaleActivities,
  getTaleActivityMedia,
  getTaleDestinations,
  getTales,
  getTalesByUserId,
  insertNewTale,
  uploadTaleCoverPhoto,
  updateTaleDbCoverPhoto,
  getTaleOwnerIdByTaleId,
  updateTaleById,
} from '../dal/tales';
import { ActivitiesWithMedia, LocalFile, NewTrip } from '../../types/types';
import formidable from 'formidable';
import { getUserByExternalId } from '../dal/users';
import { Activities, Trips } from '../../types/db-schema-definitions';
import { deleteActivityAndMedia, updateActivityById } from '../dal/activities';

export async function getAllTales() {
  return getTales();
}

export async function getUsersTales(userId: string) {
  return getTalesByUserId(userId);
}

export async function getTaleStory(taleId: number) {
  const [destinations, activities, media] = await Promise.all([
    getTaleDestinations(taleId),
    getTaleActivities(taleId),
    getTaleActivityMedia(taleId),
  ]);

  const activitiesWithMedia: ActivitiesWithMedia[] = activities.map(act => {
    const actMedia = media.filter(media => media.activity_id === act.id);
    return { ...act, media: actMedia };
  });

  return {
    destinations,
    activities: activitiesWithMedia,
  };
}

export const createNewTale = async (newTale: NewTrip) => {
  const newTaleId = await insertNewTale(newTale);

  return newTaleId;
};

export const updateTaleCoverPhoto = async (taleId: number, newCoverPhoto: formidable.File) => {
  await uploadTaleCoverPhoto(taleId, newCoverPhoto);
  return await updateTaleDbCoverPhoto(taleId, newCoverPhoto.originalFilename);
};

export const checkIfUserIsTaleOwnerByExternalId = async (
  taleId: number,
  userExternalId: string
) => {
  const taleOwnerId = await getTaleOwnerIdByTaleId(taleId);
  const users = await getUserByExternalId(userExternalId);
  const user = users[0];

  return taleOwnerId.user_id === user.user_id;
};

export const updateTale = async (id: number, changes: Partial<Omit<Trips, 'trip_id'>>) => {
  const taleId = await updateTaleById(id, changes);
  return taleId;
};

export const deleteTale = async (taleId: number) => {
  return deleteTale(taleId);
};
