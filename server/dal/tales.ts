import fs from 'fs';
import path from 'path';
import { getConnection } from '../db/connections';
import {
  Activities,
  ActivityMedia,
  Table,
  TripDestinations,
  Trips,
  Users,
} from '../../types/db-schema-definitions';
import { LocalFile, NewTrip, ParsedDestination } from '../../types/types';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { logger } from '../../utils/server-logger';
import formidable from 'formidable';

const DEFAULT_COVER_PHOTO = '/Tales/Default.jpg';
const BUCKET_NAME = 'travel-tales-s3';
const S3_REGION = 'us-east-1';
const PUBLIC_FOLDER = 'public';
const TALES_FOLDER = 'Tales';
const S3_URL = 'https://travel-tales-s3.s3.amazonaws.com';
const isDevEnvironment = process.env.NODE_ENV === 'development';
const client = new S3Client({
  region: S3_REGION,
});

export async function getTales() {
  const connection = getConnection();
  const tales = await connection
    .select<(Trips & Users)[]>([`${Table.Trips}.*`, `${Table.Users}.*`])
    .from(Table.Trips)
    .join(Table.UsersTrips, `${Table.Trips}.trip_id`, `${Table.UsersTrips}.trip_id`)
    .join(Table.Users, `${Table.Users}.user_id`, `${Table.UsersTrips}.user_id`);
  if (!isDevEnvironment) {
    const envFitTales = tales.map(taleObj => {
      return { ...taleObj, cover_photo_url: `${S3_URL}${taleObj.cover_photo_url}` };
    });
    return envFitTales;
  }
  return tales;
}

export async function getTalesByUserId(userId: string) {
  const connection = getConnection();
  const isDevEnvironment = process.env.NODE_ENV === 'development';
  const tales = await connection
    .select<(Trips & Users)[]>([`${Table.Trips}.*`, `${Table.Users}.*`])
    .from(Table.Trips)
    .join(Table.UsersTrips, `${Table.Trips}.trip_id`, `${Table.UsersTrips}.trip_id`)
    .join(Table.Users, `${Table.Users}.user_id`, `${Table.UsersTrips}.user_id`)
    .where(`${Table.Users}.user_id`, userId);
  if (!isDevEnvironment) {
    const envFitTales = tales.map(taleObj => {
      return { ...taleObj, cover_photo_url: `${S3_URL}${taleObj.cover_photo_url}` };
    });
    return envFitTales;
  }

  return tales;
}

export const insertNewTale = async (tale: NewTrip) => {
  const newTale: Omit<Trips, 'trip_id'> = {
    title: tale.title,
    catch_phrase: tale.catch_phrase,
    cover_photo_url: DEFAULT_COVER_PHOTO,
    created_by: tale.created_by,
    start_date: tale.start_date,
    end_date: tale.end_date,
  };
  const connection = getConnection();
  const taleId = await connection.insert(newTale, 'trip_id').into(Table.Trips);
  const userLinkObj = { user_id: tale.created_by, trip_id: taleId[0].trip_id };
  const userLink = await connection.insert(userLinkObj).into(Table.UsersTrips);
  return taleId[0];
};

export const saveTaleCoverPhoto = async (coverPhoto: LocalFile) => {
  const base64Data = coverPhoto.data.replace(/^data:image\/jpeg;base64,/, '');
  const buffer = Buffer.from(base64Data, 'base64');
  saveCoverPhoto(buffer, coverPhoto.name);
};

const saveCoverPhoto = async (buffer: Buffer, fileName: string) => {
  if (!isDevEnvironment) {
    const ImageFilePath = path.join('public', 'img');
    const filePath = path.join(ImageFilePath, fileName);

    await fs.promises.writeFile(filePath, buffer);
  } else {
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileName,
      Body: buffer,
      ContentType: 'image/jpeg',
    });
    try {
      logger.info(
        `############################################# aws response: #############################################`
      );
      const response = await client.send(command);
      logger.info(response);
    } catch (err) {
      logger.error({ err });
    }
  }
};

export async function getTaleDestinations(taleId: number) {
  const connection = getConnection();
  const destinations = await connection
    .select<ParsedDestination[]>(`${Table.TripDestinations}.*`)
    .from(Table.TripDestinations)
    .where('trip_id', taleId);
  return destinations;
}

export async function getTaleActivities(taleId: number) {
  const connection = getConnection();
  const activities = await connection
    .select<Activities[]>(`${Table.Activities}.*`)
    .from(Table.Activities)
    .join(
      Table.TripDestinations,
      `${Table.TripDestinations}.id`,
      `${Table.Activities}.destination_id`
    )
    .where(`${Table.TripDestinations}.trip_id`, taleId);
  return activities;
}

export async function getTaleActivityMedia(taleId: number) {
  const isDevEnvironment = process.env.NODE_ENV === 'development';
  const connection = getConnection();
  const media = await connection
    .select<ActivityMedia[]>(`${Table.ActivityMedia}.*`)
    .from(Table.Activities)
    .join(
      Table.TripDestinations,
      `${Table.TripDestinations}.id`,
      `${Table.Activities}.destination_id`
    )
    .join(Table.ActivityMedia, `${Table.Activities}.id`, `${Table.ActivityMedia}.activity_id`)
    .where(`${Table.TripDestinations}.trip_id`, taleId);
  if (!isDevEnvironment) {
    const envFitMedia = media.map(mediaObj => {
      return { ...mediaObj, media_url: `${S3_URL}${mediaObj.media_url}` };
    });
    return envFitMedia;
  }

  return media;
}

export async function getTalesByActivityIds(activityIds: number[]) {
  const connection = getConnection();
  const tales = await connection
    .distinct<(Trips & Users)[]>([`${Table.Trips}.*`, `${Table.Users}.*`])
    .from(Table.Trips)
    .join(Table.UsersTrips, `${Table.Trips}.trip_id`, `${Table.UsersTrips}.trip_id`)
    .join(Table.Users, `${Table.Users}.user_id`, `${Table.UsersTrips}.user_id`)
    .join(Table.TripDestinations, `${Table.TripDestinations}.trip_id`, `${Table.Trips}.trip_id`)
    .join(Table.Activities, `${Table.TripDestinations}.id`, `${Table.Activities}.destination_id`)
    .whereIn(`${Table.Activities}.id`, activityIds);
  return tales;
}

export const uploadTaleCoverPhoto = async (taleId: number, coverPhoto: formidable.File) => {
  logger.info(`upload cover photo dal - updating cover photo`);
  logger.info(`upload cover photo dal - isDevEnvironment ${isDevEnvironment}`);

  const base64 = fs.readFileSync(coverPhoto.filepath, 'utf8');
  const buffer = Buffer.from(base64.replace(/^data:image\/jpeg;base64,/, ''), 'base64');

  if (isDevEnvironment) {
    const taleFolderPath = path.join(TALES_FOLDER, taleId.toString());
    const directoryPath = path.join(PUBLIC_FOLDER, taleFolderPath);
    const envFullFilePath = path.join(directoryPath, coverPhoto.originalFilename);
    logger.info(`upload cover photo dal - fullFilePath: ${envFullFilePath}`);
    await fs.promises.mkdir(directoryPath, { recursive: true });
    await fs.promises.writeFile(envFullFilePath, buffer);
  } else {
    const filePath = `Tales/${taleId.toString()}/${coverPhoto.originalFilename}`;
    logger.info(`upload cover photo dal - fullFilePath: ${filePath}`);
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: filePath,
      Body: buffer,
      ContentType: 'image/jpeg',
    });
    try {
      logger.info(
        `############################################# aws response: #############################################`
      );
      const response = await client.send(command);
      logger.info(response);
    } catch (err) {
      logger.error({ err });
    }
  }
};

export const updateTaleDbCoverPhoto = async (taleId: number, fileName: string) => {
  logger.info(`updateTaleDbCoverPhoto - taleId ${taleId}`);
  const coverPhotoUrl = `/Tales/${taleId}/${fileName}`;
  logger.info(`updateTaleDbCoverPhoto - coverPhotoUrl ${coverPhotoUrl}`);
  const connection = getConnection();
  await connection(Table.Trips)
    .where(`${Table.Trips}.trip_id`, taleId)
    .update({ cover_photo_url: coverPhotoUrl });
  return coverPhotoUrl;
};

export const fetchTaleByActivityId = async (activityId: number) => {
  const connection = getConnection();
  const ids = await connection
    .select<string[]>(`${Table.Trips}.trip_id`)
    .from(Table.Trips)
    .join(Table.TripDestinations, `${Table.TripDestinations}.trip_id`, `${Table.Trips}.trip_id`)
    .join(Table.Activities, `${Table.Activities}.destination_id`, `${Table.TripDestinations}.id`)
    .where(`${Table.Activities}.id`, activityId);

  return ids[0];
};

export const getTaleOwnerIdByTaleId = async (taleId: number) => {
  const connection = getConnection();
  const userIds = await connection
    .select<{ user_id: number }[]>(`${Table.UsersTrips}.user_id`)
    .from(Table.UsersTrips)
    .where(`${Table.UsersTrips}.trip_id`, taleId);

  return userIds[0];
};

export const updateTaleById = async (id: number, patches: Partial<Omit<Trips, 'trip_id'>>) => {
  const connection = getConnection();
  const changes = await connection(Table.Trips)
    .where('trip_id', id)
    .update(patches, Object.keys(patches));
  return changes[0];
};

export const deleteTaleAndMedia = async (taleId: number) => {
  const connection = getConnection();
  return connection(Table.Trips).where('trip_id', taleId).delete(); // DELETE has cascade options deleting its destinations activities and media
};
