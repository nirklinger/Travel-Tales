import fs from 'fs';
import path from 'path';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

import { getConnection } from '../db/connections';
import { Table, Users } from '../../types/db-schema-definitions';
import { logger } from '../../utils/server-logger';
import { CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider';
import { ExternalUser } from '../../types/types';
import formidable from 'formidable';

const USERS_FOLDER = 'Users';
export const PROFILE_PHOTO_FILE_NAME = 'profilePhoto.jpg';
const PUBLIC_FOLDER = 'public';
const BUCKET_NAME = process.env.BUCKET_NAME;
const S3_REGION = process.env.AWS_REGION;
const S3_URL = process.env.AWS_S3_URL;
const isDevEnvironment = process.env.NODE_ENV === 'development';
const client = new S3Client({
  region: S3_REGION,
});

export const getUserById = async (userId: string) => {
  const connection = getConnection();
  const users = await connection
    .select<Users[]>(`${Table.Users}.*`)
    .from(Table.Users)
    .where('user_id', userId);

  if (!isDevEnvironment) {
    return users.map(user => ({ ...user, avatar_photo: S3_URL + user.avatar_photo }));
  }
  return users;
};

export const getUserByExternalId = async (externalId: string) => {
  const isDevEnvironment = process.env.NODE_ENV === 'development';
  const connection = getConnection();
  const users = await connection
    .select<Users[]>(`${Table.Users}.*`)
    .from(Table.Users)
    .where('external_id', externalId);

  if (!isDevEnvironment) {
    const envFitUser = users.map(userObject => {
      return { ...userObject, avatar_photo: `${process.env.AWS_S3_URL}${userObject.avatar_photo}` };
    });
    return envFitUser;
  }
  return users;
};

export const insertUserToDb = async (newUser: Users | ExternalUser) => {
  console.log(`inserting user - ${JSON.stringify(newUser)}`);
  const connection = getConnection();
  await connection.insert(newUser).into(Table.Users).onConflict().ignore();
};

export const UpdateUserProfile = async (userId: number, updateData: Partial<Users>) => {
  const connection = getConnection();
  const changes = (await connection(Table.Users)
    .where('user_id', userId)
    .update(updateData, Object.keys(updateData))) as Users[];

  return changes[0];
};

export const UpdateUserAttributesCommand = async updateData => {
  const { userName, attribute } = updateData;
  const provider = new CognitoIdentityProvider({
    region: process.env.AWS_REGION,
  });
  await provider.adminUpdateUserAttributes({
    UserAttributes: [
      {
        Name: attribute.key,
        Value: attribute.value,
      },
    ],
    Username: userName,
    UserPoolId: process.env.AWS_USER_POOL_ID,
  });
};

export const uploadUserProfilePhoto = async (userId: number, profilePhoto: formidable.File) => {
  const base64 = fs.readFileSync(profilePhoto.filepath, 'utf8');
  const buffer = Buffer.from(base64.replace(/^data:image\/jpeg;base64,/, ''), 'base64');

  if (isDevEnvironment) {
    const userFolderPath = path.join(USERS_FOLDER, userId.toString());
    const directoryPath = path.join(PUBLIC_FOLDER, userFolderPath);
    const envFullFilePath = path.join(directoryPath, PROFILE_PHOTO_FILE_NAME);
    logger.info(`upload cover photo dal - fullFilePath: ${envFullFilePath}`);
    await fs.promises.mkdir(directoryPath, { recursive: true });
    await fs.promises.writeFile(envFullFilePath, buffer);
  } else {
    const filePath = `Users/${userId.toString()}/${PROFILE_PHOTO_FILE_NAME}`;
    logger.info(`upload cover photo dal - fullFilePath: ${filePath}`);
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: filePath,
      Body: buffer,
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
