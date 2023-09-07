import {
  InputChangeEventDetail,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonPage,
  IonRadio,
  IonRadioGroup,
  IonTextarea,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { closeOutline, locationOutline, timeOutline } from 'ionicons/icons';

import { ActivityWithMediaWithCategories } from '../../../types/types';
import { parseDuration } from '../../../utils/converters';
import PostgresInterval from 'postgres-interval';
import Image from 'next/image';
import React from 'react';

interface ActivityModalProps {
  activity: ActivityWithMediaWithCategories;
  onDismiss: (data?: string | null | undefined | number, role?: string) => void;
}

export default function ActivityModal({ activity, onDismiss }: ActivityModalProps) {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton color="tertiary" onClick={() => onDismiss(activity.trip_id, 'confirm')}>
              Go to story
            </IonButton>
          </IonButtons>
          <IonButtons slot="end">
            <IonButton onClick={() => onDismiss(null, 'cancel')} strong={true}>
              <IonIcon icon={closeOutline}></IonIcon>
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div className={'text-2xl font-semibold'}> {activity.name} </div>
        {(activity.duration as PostgresInterval.IPostgresInterval)?.hours && (
          <div className={'flex flex-row gap-1 items-center font-semibold text-gray-600'}>
            <IonLabel>
              {parseDuration(activity.duration as PostgresInterval.IPostgresInterval)}
            </IonLabel>
            <IonIcon color={'tertiary'} icon={timeOutline} />
          </div>
        )}
        <div className="font-bold py-0 text-sm text-gray-400 dark:text-gray-500 flex flex-row items-center">
          <label>{activity.geo_location?.place_name}</label>
          <IonIcon color={'tertiary'} icon={locationOutline} />
        </div>
        <div className={'my-4'}>
          <IonTextarea autoGrow={true} value={activity.description} readonly={true}></IonTextarea>
        </div>
        <div
          className={
            'grid grid-flow-row gap-2 text-neutral-600 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 h-full'
          }
        >
          {activity.media.map(media => (
            <div key={media.media_url} className={'flex-shrink-0 w-full h-48 lg:h-96'}>
              <div className=" rounded-md overflow-hidden relative w-full h-full">
                <Image
                  fill
                  style={{ objectFit: 'cover' }}
                  src={media.media_url}
                  alt={media.media_type}
                />
              </div>
            </div>
          ))}
        </div>
      </IonContent>
    </IonPage>
  );
}
