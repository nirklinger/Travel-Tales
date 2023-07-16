import {
  getTaleActivities,
  getTaleActivityMedia,
  getTaleDestinations,
  getTales,
  insertNewTale,
  uploadTaleCoverPhoto,
  updateTaleDbCoverPhoto
} from '../dal/tales';
import { ActivitiesWithMedia, LocalFile, NewTrip } from '../../types/types';

export async function getAllTales() {
  return getTales();
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
  console.log(`server>services>tales - update tale cover photo`);
  console.log(`server>services>tales - taleId: ${taleId}`);
  await uploadTaleCoverPhoto(taleId, newCoverPhoto);
  await updateTaleDbCoverPhoto(taleId);
};
