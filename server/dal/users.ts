import { getConnection } from '../db/connections';
import {
  Activities,
  ActivityMedia,
  Table,
  TripDestinations,
  Trips,
  Users,
} from '../../types/db-schema-definitions';
import {logger} from '../../utils/server-logger'
import { UserChangeRequest } from '../../types/awsTypes';
import { CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider';
import { ExternalUser } from '../../types/types';

export const getUserById = async (userId: string) => {
    const connection = getConnection();
    const users = await connection
    .select<Users[]>(`${Table.Users}.*`)
    .from(Table.Users)
    .where('user_id', userId);

    return users;
}

export const getUserByExternalId = async (externalId: string) => {
  const isDevEnvironment = process.env.NODE_ENV === 'development';
  const connection = getConnection();
  const users = await connection
  .select<Users[]>(`${Table.Users}.*`)
  .from(Table.Users)
  .where('external_id', externalId);

  if (!isDevEnvironment) {
    const envFitUser = users.map(userObject => {
      return {...userObject, avatar_photo: `${process.env.AWS_S3_URL}${userObject.avatar_photo}`}
    });
    return envFitUser;

  }
  return users;
}

export const insertUserToDb = async (newUser: Users | ExternalUser) => {
  console.log(`inserting user - ${JSON.stringify(newUser)}`);
    const connection = getConnection();
    await connection.insert(newUser).into(Table.Users).onConflict().ignore();
}

export const UpdateUserProfile = async (userId: number, updateData: Partial<Users>) => {
  const connection = getConnection();
  const changes = await connection(Table.Users)
    .where('user_id', userId)
    .update(updateData, Object.keys(updateData));

    return changes[0];
}

export const UpdateUserAttributesCommand = async (updateData: UserChangeRequest) => {
  const { userName, attribute } = updateData;
  const provider = new CognitoIdentityProvider({
    region: process.env.AWS_REGION
  });
  await provider.adminUpdateUserAttributes({
    UserAttributes: [{
        Name: attribute.key,
        Value: attribute.value
    }],
    Username: userName,
    UserPoolId: process.env.AWS_USER_POOL_ID,
  });
}

