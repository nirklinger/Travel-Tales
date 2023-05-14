import { NewTripDestination } from '../../types/types';
import { deleteActivityAndMedia } from '../dal/activities';
import { deleteDestinationAndActivity, insertNewDestination } from '../dal/destinations';

export const createNewDestination = async (destination: NewTripDestination) => {
  const destinationId = await insertNewDestination(destination);
  return destinationId;
};

export const deleteDestination = async (destinationId: number) => {
  return deleteDestinationAndActivity(destinationId);
};
