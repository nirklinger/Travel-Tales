import {
  getTaleActivities,
  getTaleActivityMedia,
  getTaleDestinations,
  getTales,
  insertNewTale,
  saveTaleCoverPhoto
} from '../dal/tales';
import { ActivitiesWithMedia, NewTrip } from '../../types/types';
import { act } from 'react-dom/test-utils';
import { Trips } from '../../types/db-schema-definitions';

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

export const createNewTale = async (newTale: Omit<Trips, 'trip_id' | 'cover_photo_url'>) => {
  const newTaleId = await insertNewTale(newTale);
  
  return newTaleId;
}


