import { Users } from '../../types/db-schema-definitions';
import { ExternalUser } from '../../types/types';
import { PROFILE_PHOTO_FILE_NAME, UpdateUserProfile, getUserByExternalId, insertUserToDb, uploadUserProfilePhoto } from '../dal/users';
import formidable from 'formidable';


export async function validateUserService(userToValidate: ExternalUser) {
    let user = await getUserByExternalId(userToValidate.external_id);
    if (user.length === 0) {
        await insertUserToDb(userToValidate);
        user = await getUserByExternalId(userToValidate.external_id);
    }

    return user[0];
}

export async function insertUserOnFirstSignIn(userToInsert: Omit<ExternalUser, 'avatar_photo'>){
    const externalUser = {...userToInsert, avatar_photo: '/Users/default.svg' }
    await insertUserToDb(externalUser);
    const user = await getUserByExternalId(userToInsert.external_id);

    return user[0];
}

export async function getUserByExternalIdService(externalId: string) {
    const users = await getUserByExternalId(externalId);

    return users[0];
}

export async function updateUserProfileService(userId: number, userDataToUpdate: Partial<Users>) {
    await UpdateUserProfile(userId, userDataToUpdate);
}

export const updateUserProfilePhoto = async (userId: number, newProfilePhoto: formidable.File) => {
    const userProfilePhotoUrl = `/Users/${userId}/${PROFILE_PHOTO_FILE_NAME}`;
    await uploadUserProfilePhoto(userId, newProfilePhoto);
    return await UpdateUserProfile(userId, {avatar_photo: userProfilePhotoUrl});
  };