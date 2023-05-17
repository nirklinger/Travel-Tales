import { NewActivitiesWithMedia, NewTripDestination } from '../types/types';
import { fetchWrapper } from '../utils/fetchWrapper';
import { IPostgresInterval } from 'postgres-interval';
import { TripDestinations } from '../types/db-schema-definitions';

export const createDestination = async (destToCreate: NewTripDestination): Promise<number> => {
  const res = await fetchWrapper.post('/api/destinations', { ...destToCreate });
  if (!res.ok) {
    switch (res.status) {
      default:
        throw new Error('could not create a new destination');
    }
  }
  const newDestination = await res.json();
  return newDestination.id;
};

export const deleteDestination = async (destinationId: number): Promise<void> => {
  const res = await fetchWrapper.delete(`/api/destinations/${destinationId}`);
  if (!res.ok) {
    switch (res.status) {
      default:
        throw new Error('could not create a new destination');
    }
  }
};

export const patchDestination = async (
  destinationId: number,
  patch: Partial<NewTripDestination>
): Promise<void> => {
  const res = await fetchWrapper.patch(`/api/destinations/${destinationId}`, patch);
  if (!res.ok) {
    switch (res.status) {
      default:
        throw new Error('could not update destination');
    }
  }
};
