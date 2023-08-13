import {
  getTaleActivities,
  getTaleActivityMedia,
  getTaleDestinations,
  getTales,
  getTalesByUserId,
  insertNewTale,
  uploadTaleCoverPhoto,
  updateTaleDbCoverPhoto,
  getTaleOwnerByTaleId,
  getTaleOwnerIdByTaleId
} from '../dal/tales';
import { ActivitiesWithMedia, LocalFile, NewTrip } from '../../types/types';
import { getUserByExternalId } from '../dal/users';

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
}

export const updateTaleCoverPhoto = async (taleId: number, newCoverPhoto: LocalFile) => {
  await uploadTaleCoverPhoto(taleId, newCoverPhoto);
  const newPath = await updateTaleDbCoverPhoto(taleId);
  return newPath;
};

export const checkIfUserIsTaleOwnerByExternalId = async (taleId: number, userExternalId: string) => {
  const taleOwnerId = await getTaleOwnerIdByTaleId(taleId);
  const users = await getUserByExternalId(userExternalId);
  const user = users[0];

  console.log(`taleOwnerId - ${taleOwnerId} - ${JSON.stringify(taleOwnerId)}`);

  console.log(`users = ${users} - ${JSON.stringify(users)}`);

  console.log(`user = ${user} - ${JSON.stringify(user)}`);

  console.log(`taleOwnerId.user_id === user.user_id = ${taleOwnerId.user_id === user.user_id}`);

  return taleOwnerId.user_id === user.user_id;
}

