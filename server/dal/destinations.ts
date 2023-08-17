import { NewTripDestination } from '../../types/types';
import { Table, TripDestinations } from '../../types/db-schema-definitions';
import { getConnection } from '../db/connections';

export const insertNewDestination = async (newTripDestination: NewTripDestination) => {
  const isNotFirstDestination = await checkIfTripHasDestinations(newTripDestination.trip_id);
  const connection = getConnection();
  const destinationToInsert = {...newTripDestination, sequential_number: isNotFirstDestination ? null : 1};
  const destinationId = await connection
    .insert(destinationToInsert, 'id')
    .into(Table.TripDestinations);
  return destinationId[0];
};

const checkIfTripHasDestinations  = async (tripId: number) => {
  const connection = getConnection();
  const existingDestinations = await connection
    .select<any>(`${Table.TripDestinations}.*`)
    .from(Table.TripDestinations)
    .where('trip_id', tripId);
  
  return existingDestinations.length > 0;
}

export const updateDestinationById = async (id: number, patches: Partial<NewTripDestination>) => {
  const connection = getConnection();
  const { geo_location, ...toPatch } = patches;
  let tripPatches: Partial<TripDestinations> = toPatch;

  if (geo_location) {
    tripPatches.geo_location = JSON.stringify(patches.geo_location);
  }

  const changes = await connection(Table.TripDestinations)
    .where('id', id)
    .update(patches, Object.keys(patches));
  return changes[0];
};

export const deleteDestinationAndActivity = async (destinationId: number) => {
  const connection = getConnection();
  return connection(Table.TripDestinations).where('id', destinationId).delete(); // DELETE has cascade options deleting its media records
};
