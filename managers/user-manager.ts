import { fetchWrapper } from '../utils/fetchWrapper';
import { StatusCodes } from 'http-status-codes';
import { Tale, TalesResponse, ExternalUser, UserProfilePhotoUploadRes } from '../types/types';
import { Users } from '../types/db-schema-definitions';

export async function fetchUserTalesById(userId: number): Promise<Tale[]> {
  const res = await fetchWrapper.get(`/api/users/${userId}/tales`);
  if (!res.ok) {
    switch (res.status) {
      case StatusCodes.NOT_FOUND:
        throw new Error('no current tales exists');
        break;
      default:
        throw new Error('could not fetch tales');
    }
  }
  const { tales } = (await res.json()) as TalesResponse;

  return tales.map(tale => ({
    ...tale,
    author: `${tale.first_name} ${tale.last_name}`,
    start_date: new Date(tale.start_date),
    end_date: new Date(tale.end_date),
  }));
}

export async function fetchUserByExternalId(external_id: string) {
  const res = await fetchWrapper.get(`/api/users/${external_id}/external`);
  if (!res.ok) {
    switch (res.status) {
      default:
        throw new Error('user external id did not found');
    }
  }

  return res;
}

export async function updateProfile(userId: number, updateData: Partial<Users>): Promise<void> {
  const res = await fetchWrapper.put(`/api/users/${userId}`, updateData);
  if (!res.ok) {
    switch (res.status) {
      default:
        throw new Error('could not update destination');
    }
  }
}

export async function updateUserProfilePhoto(userId: number, profilePhoto: File): Promise<string> {
  const formData = new FormData();
  formData.append('userId', userId.toString());
  formData.append('profilePhoto', profilePhoto);

  // Don't use fetchWrapper we want the content type to be set automatically
  const res = await fetch(`/api/users/${userId}/profilePhoto`, {
    method: 'PUT',
    body: formData,
  });

  if (!res.ok) {
    switch (res.status) {
      default:
        throw new Error('could not upload profile photo');
    }
  }

  return ((await res.json()) as UserProfilePhotoUploadRes)?.profilePhotoUrl;
}
