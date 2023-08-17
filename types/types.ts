import {
  Activities,
  ActivityMedia,
  Categories,
  MediaType,
  TripDestinations,
  Trips,
  Users,
} from './db-schema-definitions';
import { GeocodingFeature } from '@maptiler/client';

export type StoryResponse = {
  destinations: ParsedDestination[];
  activities: ActivitiesWithMedia[];
};

export type ActivitiesSearchResponse = { activitiesIds: number[] };

export type TalesSearchResponse = { talesIds: number[] };

export type ParsedDestination = Omit<TripDestinations, 'geo_location'> & {
  geo_location?: GeocodingFeature | null;
};

export type ActivitiesWithMedia = Activities & { media: Omit<ActivityMedia, 'activity_id'>[] };

export type ActivityWithMediaWithCategories = ActivitiesWithMedia & {
  categories: number[];
  trip_id: number;
  geo_location?: GeocodingFeature | null;
};

export type NewActivitiesWithMedia = Omit<ActivitiesWithMedia, 'id'>;

export type NewTripDestination = Omit<ParsedDestination, 'id'>;

export type CreateNewDestinationResponse = { id: number };

export type CreateNewActivityResponse = { id: number };

export type GetActivitiesResponse = {
  activities: ActivitiesWithMedia[];
};

export type ActivityMediaUploadRes = {
  uploadedMedia: { activity_id: number; media_type: MediaType; media_url: string }[];
};

export type TaleCoverPhotoUploadRes = {
  coverPhotoUrl: string;
};

export type UserProfilePhotoUploadRes = {
  profilePhotoUrl: string;
};

export type TalesResponse = {
  tales: (Trips & Users)[];
};

export type ActivitiesResponse = {
  activities: ActivityWithMediaWithCategories[];
};

export type FetchedCategory = Omit<Categories, 'content_tokens' | 'embeddings'>;

export type CategoriesResponse = {
  categories: FetchedCategory[];
};

export type CreateTaleResponse = {
  trip_id: number;
};

export type ActivityEmbedding = {
  content: string;
  content_tokens: number;
  embedding: number[];
  activity_id: number;
};

export type CategoryEmbedding = {
  id: number;
  name: string;
  similarity: number;
};

export interface Tale extends Trips, Users {
  author: string;
}

export interface Photo {
  filePath: string;
  webviewPath?: string;
}

export interface LocalFile {
  name: string;
  path: string;
  data: string;
}

export type NewTrip = Omit<Trips, 'trip_id' | 'cover_photo_url'>;

export type Override<T1, T2> = Omit<T1, keyof T2> & T2;

export type ExternalUser = Omit<Users, 'user_id'> & {
  external_id: string;
};
