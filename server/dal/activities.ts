import {
  ActivityEmbedding,
  NewActivitiesWithMedia,
  NewTrip,
  NewTripDestination,
} from '../../types/types';
import { Activities, Categories, Table, Trips } from '../../types/db-schema-definitions';
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

export const deleteActivityEmbeddings = async (activityId: number) => {
  const connection = getConnection();
  await connection(Table.ActivityEmbeddings).where('activity_id', activityId).delete();
};

export const insertActivityEmbedding = async (embedding: ActivityEmbedding) => {
  const connection = getConnection();
  await connection
    .insert({
      activity_id: embedding.activity_id,
      content: embedding.content,
      content_tokens: embedding.content_tokens,
      embedding: `[${embedding.embedding.join(',')}]`,
    })
    .into(Table.ActivityEmbeddings);
};

export const searchCosineSimilarity = async (
  searchEmbeddings: number[]
): Promise<ActivityEmbedding[]> => {
  const connection = getConnection();
  const actsEmbeddings = await connection.raw(
    `SELECT * FROM ${SCHEMA_NAME}.match_activities('[${searchEmbeddings.join(',')}]', 0.5,5)`
  );
  return actsEmbeddings.rows;
};

export const fetchAllActivitiesToEmbed = async () => {
  const connection = getConnection();
  const activities = await connection
    .select<Activities[]>(`${Table.Activities}.*`)
    .from(Table.Activities)
    .where('should_embed', true);
  return activities;
};
