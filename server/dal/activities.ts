import { NewActivitiesWithMedia, NewTrip } from '../../types/types';
import { Table, Trips } from '../../types/db-schema-definitions';
import { getConnection } from '../db/connections';
import parse, { IPostgresInterval } from 'postgres-interval';

export const insertNewActivity = async (newActivity: Omit<NewActivitiesWithMedia, 'media'>) => {
  const connection = getConnection();
  const activityId = await connection.insert(newActivity, 'id').into(Table.Activities);
  return activityId[0];
};
