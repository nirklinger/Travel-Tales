import { Activities, ActivityMedia, TripDestinations, Trips, Users } from './db-schema-definitions';
import { GeocodingFeature } from '@maptiler/client';

export type StoryResponse = {
  destinations: ParsedDestination[];
  activities: ActivitiesWithMedia[];
};

export type ParsedDestination = Omit<TripDestinations, 'geo_location'> & {
  geo_location?: GeocodingFeature | null;
};

export type ActivitiesWithMedia = Activities & { media: Omit<ActivityMedia, 'activity_id'>[] };

export type NewActivitiesWithMedia = Omit<ActivitiesWithMedia, 'id'>;

export type NewTripDestination = Omit<ParsedDestination, 'id'>;

export type CreateNewDestinationResponse = { id: number };

export type CreateNewActivityResponse = { id: number };

export type SearchActivitiesResponse = {
  activities: ActivitiesWithMedia[];
};

export type TalesResponse = {
  tales: (Trips & Users)[];
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

export interface NewTrip extends Omit<Trips, 'trip_id' | 'cover_photo_url'> {
  cover_photo?: LocalFile;
}

export type Override<T1, T2> = Omit<T1, keyof T2> & T2;

export type ExternalUser = Omit<Users, 'user_id'> & {
  external_id: string;
};
