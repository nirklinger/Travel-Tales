import Card from './Card';
import Image from 'next/image';
import { Activities } from '../../types/db-schema-definitions';
import { ActivitiesWithMedia, ActivityWithMediaWithCategories } from '../../types/types';
import { IonIcon, IonLabel } from '@ionic/react';
import { parseDuration } from '../../utils/converters';
import PostgresInterval from 'postgres-interval';
import { locationOutline, timeOutline } from 'ionicons/icons';
import React from 'react';

interface ActivityCardProps {
  activity: ActivityWithMediaWithCategories;
  onClick: Function;
}

const ActivityCard = ({ activity, onClick }: ActivityCardProps) => {
  const { name, description, duration, destination_id, media, id, geo_location } = activity;
  return (
    <Card className="my-4 w-full mx-auto cursor-pointer" onClick={() => onClick()}>
      <div className="h-36 w-full relative">
        <Image
          className="rounded-t-xl object-cover min-w-full min-h-full max-w-full max-h-full"
          src={media[0]?.media_url}
          fill
          alt=""
        />
      </div>
      <div className="flex flex-col h-30 px-4 py-2 bg-white rounded-b-xl dark:bg-gray-900">
        <label className="font-bold text-lg text-gray-800 dark:text-gray-100">{name}</label>
        <div className="flex-grow text-sm text-gray-500 mr-1 my-2 dark:text-gray-400 truncate">
          {description}
        </div>
        <div className={'flex flex-row justify-between'}>
          <div className="font-bold py-0 text-sm text-gray-400 dark:text-gray-500 flex flex-row items-center">
            <IonLabel>{parseDuration(duration as PostgresInterval.IPostgresInterval)}</IonLabel>
            <IonIcon color={'tertiary'} icon={timeOutline} />
          </div>
          <div className="font-bold py-0 text-sm text-gray-400 dark:text-gray-500 flex flex-row items-center">
            <label className={'w-36 truncate'}>{geo_location?.place_name}</label>
            <IonIcon color={'tertiary'} icon={locationOutline} />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ActivityCard;
