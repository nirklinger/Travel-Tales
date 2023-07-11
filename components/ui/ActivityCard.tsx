import Card from './Card';
import Image from 'next/image';
import { Activities } from '../../types/db-schema-definitions';
import { ActivitiesWithMedia, ActivityWithMediaWithCategories } from '../../types/types';
import { IonIcon, IonLabel } from '@ionic/react';
import { parseDuration } from '../../utils/converters';
import PostgresInterval from 'postgres-interval';
import { timeOutline } from 'ionicons/icons';
import React from 'react';
import activities from '../../pages/api/activities';

interface ActivityCardProps {
  activity: ActivityWithMediaWithCategories;
  onClick: Function;
}

const ActivityCard = ({ activity, onClick }: ActivityCardProps) => {
  const { name, description, duration, destination_id, media, id } = activity;
  return (
    <Card className="my-4 w-full mx-auto cursor-pointer" onClick={() => onClick()}>
      <div className="h-52 w-full relative">
        <Image
          className="rounded-t-xl object-cover min-w-full min-h-full max-w-full max-h-full"
          src={media[0]?.media_url}
          fill
          alt=""
        />
      </div>
      <div className="flex flex-col sm:h-72 md:h-60 px-4 py-4 bg-white rounded-b-xl dark:bg-gray-900">
        <h2 className="font-bold text-2xl text-gray-800 dark:text-gray-100">{name}</h2>
        <span className="font-bold py-0 text-s text-gray-400 dark:text-gray-500 uppercase">
          <IonLabel>{parseDuration(duration as PostgresInterval.IPostgresInterval)}</IonLabel>
          <IonIcon color={'tertiary'} icon={timeOutline} />
        </span>
        <div className="sm:text-sm flex-grow text-s text-gray-500 mr-1 my-2 dark:text-gray-400 truncate">
          {description}
        </div>
      </div>
    </Card>
  );
};

export default ActivityCard;
