import { NewTripDestination } from '../../types/types';
import { Table } from '../../types/db-schema-definitions';
import { getConnection } from '../db/connections';

export const insertNewDestination = async (newTripDestination: NewTripDestination) => {
  const connection = getConnection();
  const destinationId = await connection
    .insert(newTripDestination, 'id')
    .into(Table.TripDestinations);
  return destinationId[0];
};

export const updateDestinationById = async (id: number, patches: Partial<NewTripDestination>) => {
  const connection = getConnection();
  const changes = await connection(Table.TripDestinations)
    .where('id', id)
    .update(patches, Object.keys(patches));
  return changes[0];
};

export const deleteDestinationAndActivity = async (destinationId: number) => {
  const connection = getConnection();
  return connection(Table.TripDestinations).where('id', destinationId).delete(); // DELETE has cascade options deleting its media records
};
