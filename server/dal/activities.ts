import fs from 'fs';
import { LocalFile, NewActivitiesWithMedia, NewTrip, NewTripDestination } from '../../types/types';
import { Activities, MediaType, Table, Trips } from '../../types/db-schema-definitions';
import { getConnection } from '../db/connections';
import parse, { IPostgresInterval } from 'postgres-interval';
import path from 'path';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

const BUCKET_NAME = 'travel-tales-s3';
const S3_REGION = 'us-east-1';
const PUBLIC_FOLDER = 'public';
const TALES_FOLDER = 'Tales';
const S3_URL = 'https://travel-tales-s3.s3.amazonaws.com';

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

export const uploadActivityMedia = async (taleId: number, activityId:number, photo: LocalFile) => {
  const isDevEnvironment = process.env.NODE_ENV === 'development';
  const base64Data = photo.data.replace(/^data:image\/jpeg;base64,/, '');
  const buffer = Buffer.from(base64Data, 'base64');

  if (!isDevEnvironment) {
    const taleFolderPath = path.join(TALES_FOLDER, taleId.toString());
    const filePath = path.join(taleFolderPath, photo.name);
    const envFullFilePath = path.join(PUBLIC_FOLDER, filePath);
    console.log(`upload cover photo dal - fullFilePath: ${envFullFilePath}`);
    await fs.promises.writeFile(envFullFilePath, buffer);
  } else {
    const filePath = `Tales/${taleId.toString()}/${photo.name}`;
    console.log(`upload cover photo dal - fullFilePath: ${filePath}`);
    const command = new PutObjectCommand({
      Bucket: 'travel-tales-s3',
      Key: filePath,
      Body: buffer,
    });
    try {
      console.log(
        `############################################# aws response: #############################################`
      );
      const response = await client.send(command);
      console.log(response);
    } catch (err) {
      console.error(err);
    }
  }
};

export const updateDbActivityMediaTable = async (taleId: number, activityId:number, photo: LocalFile) => {
  const connection = getConnection();
  const activityMedia = {activity_id: activityId, media_type: MediaType.Image, media_url:`/Tales/${taleId}/${photo.name}`};
  await connection.insert(activityMedia,'id').into(Table.ActivityMedia);
}