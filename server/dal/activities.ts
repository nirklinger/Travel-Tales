import {
  ActivityEmbedding,
  NewActivitiesWithMedia,
  NewTrip,
  NewTripDestination,
} from '../../types/types';
import { Activities, Table, Trips } from '../../types/db-schema-definitions';
import { getConnection } from '../db/connections';
import parse, { IPostgresInterval } from 'postgres-interval';
import { SCHEMA_NAME } from '../../constants';

export const insertNewActivity = async (newActivity: Omit<NewActivitiesWithMedia, 'media'>) => {
  const connection = getConnection();
  const activityId = await connection.insert(newActivity, 'id').into(Table.Activities);
  return activityId[0];
};

export const updateActivityById = async (id: number, patches: Partial<Omit<Activities, 'id'>>) => {
  const connection = getConnection();
  const changes = await connection(Table.Activities)
    .where('id', id)
    .update(patches, Object.keys(patches));
  return changes[0];
};

export const deleteActivityAndMedia = async (activityId: number) => {
  const connection = getConnection();
  return connection(Table.Activities).where('id', activityId).delete(); // DELETE has cascade options deleting its media records
};

export const insertActivityEmbedding = async (embedding: ActivityEmbedding) => {
  const connection = getConnection();
  await connection.schema
    .withSchema(SCHEMA_NAME)
    .raw(
      `INSERT INTO ${
        Table.ActivityEmbeddings
      } (activity_id, content, content_tokens, embedding) VALUES (${embedding.activity_id},'${
        embedding.content
      }', ${embedding.content_tokens}, '[${embedding.embedding.join(',')}]')`
    );
};

export const searchCosineSimilarity = async (
  searchEmbeddings: string
): Promise<ActivityEmbedding[]> => {};
