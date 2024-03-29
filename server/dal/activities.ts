import fs from 'fs';
import {
  ActivityEmbedding,
  NewActivitiesWithMedia,
  NewTrip,
  NewTripDestination,
  LocalFile,
} from '../../types/types';
import {
  Activities,
  ActivityCategories,
  ActivityMedia,
  Categories,
  MediaType,
  Table,
  Trips,
} from '../../types/db-schema-definitions';
import { getConnection } from '../db/connections';
import parse, { IPostgresInterval } from 'postgres-interval';
import { SCHEMA_NAME } from '../../constants';
import path from 'path';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import formidable from 'formidable';

const BUCKET_NAME = 'travel-tales-s3';
const S3_REGION = 'us-east-1';
const PUBLIC_FOLDER = 'public';
const TALES_FOLDER = 'Tales';
const S3_URL = process.env.AWS_S3_URL;
const SEARCH_PRECISION = Number(process.env.SEARCH_PRECISION) || 0.75;
const MAX_SEARCH_RESULTS = Number(process.env.MAX_SEARCH_RESULTS) || 10;
const isDevEnvironment = process.env.NODE_ENV === 'development';

const client = new S3Client({
  region: S3_REGION,
});

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
    `SELECT * FROM ${SCHEMA_NAME}.match_activities('[${searchEmbeddings.join(
      ','
    )}]', ${SEARCH_PRECISION}, ${MAX_SEARCH_RESULTS})`
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

export const selectActivitiesMedia = async () => {
  const isDevEnvironment = process.env.NODE_ENV === 'development';
  const connection = getConnection();
  const media = await connection
    .select<ActivityMedia[]>(`${Table.ActivityMedia}.*`)
    .from(Table.ActivityMedia);

  if (!isDevEnvironment) {
    return media.map(photo => ({ ...photo, media_url: S3_URL + photo.media_url }));
  }
  return media;
};

export const selectActivities = async () => {
  const connection = getConnection();
  const acts = await connection
    .select<(Activities & { trip_id: number; geo_location })[]>(
      `${Table.Activities}.*`,
      `${Table.TripDestinations}.trip_id`,
      `${Table.TripDestinations}.geo_location`
    )
    .from(Table.Activities)
    .join(
      Table.TripDestinations,
      `${Table.TripDestinations}.id`,
      `${Table.Activities}.destination_id`
    );

  return acts;
};

export const selectActivitiesCategories = async () => {
  const connection = getConnection();
  const acts = await connection
    .select<ActivityCategories[]>(`${Table.ActivityCategories}.*`)
    .from(Table.ActivityCategories);

  return acts;
};

export const uploadActivityMedia = async (
  taleId: number,
  activityId: number,
  photo: formidable.File
) => {
  const base64 = fs.readFileSync(photo.filepath, 'utf8');
  const buffer = Buffer.from(base64.replace(/^data:image\/jpeg;base64,/, ''), 'base64');

  if (isDevEnvironment) {
    const taleFolderPath = path.join(TALES_FOLDER, taleId.toString());
    const directoryPath = path.join(PUBLIC_FOLDER, taleFolderPath);
    const envFullFilePath = path.join(directoryPath, photo.originalFilename);
    await fs.promises.mkdir(directoryPath, { recursive: true });
    await fs.promises.writeFile(envFullFilePath, buffer);
  } else {
    const filePath = `Tales/${taleId.toString()}/${photo.originalFilename}`;
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: filePath,
      Body: buffer,
      ContentType: 'image/jpeg',
    });
    try {
      const response = await client.send(command);
    } catch (err) {
      console.error(err);
    }
  }
};

export const updateDbActivityMediaTable = async (
  taleId: number,
  activityId: number,
  photo: formidable.File
) => {
  const connection = getConnection();
  const activityMedia = {
    activity_id: activityId,
    media_type: MediaType.Image,
    media_url: `/Tales/${taleId}/${photo.originalFilename}`,
  };
  await connection.insert(activityMedia, 'id').into(Table.ActivityMedia);
  return activityMedia;
};
