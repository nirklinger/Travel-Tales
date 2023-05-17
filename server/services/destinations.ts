import { NewTripDestination } from '../../types/types';
import { deleteActivityAndMedia } from '../dal/activities';
import {
  deleteDestinationAndActivity,
  insertNewDestination,
  updateDestinationById,
} from '../dal/destinations';

export const createNewDestination = async (destination: NewTripDestination) => {
  const destinationId = await insertNewDestination(destination);
  return destinationId;
};

export const deleteDestination = async (destinationId: number) => {
  return deleteDestinationAndActivity(destinationId);
};

export const updateDestination = async (id: number, patches: Partial<NewTripDestination>) => {
  const changes = await updateDestinationById(id, patches);
  return changes;
};
