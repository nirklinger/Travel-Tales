import { IonIcon, IonLabel, IonTextarea, useIonAlert } from '@ionic/react';
import { parseDuration } from '../../../../utils/converters';
import PostgresInterval from 'postgres-interval';
import { timeOutline, trash } from 'ionicons/icons';
import ImageTape from '../../../ui/ImageTape';
import React, { useState } from 'react';
import { ActivitiesWithMedia } from '../../../../types/types';

interface ActivityProps {
  activity: ActivitiesWithMedia;
  canEdit: boolean;
}

export function Activity({ activity, canEdit }: ActivityProps) {
  const [presentAlert] = useIonAlert();
  return (
    <div
      className={
        'border border-gray-400 rounded-md bg-blue-50 lg:shadow-lg md:shadow-lg px-4 mx-2 py-4'
      }
      key={activity.id}
    >
      <div className={'flex flex-row gap-2 text-lg items-center font-medium'}>
        {canEdit && (
          <IonIcon
            onClick={() =>
              presentAlert({
                header: 'Delete Activity!',
                subHeader: 'Once Deleted, all activity media is deleted as well',
                message: 'Are you sure you want to delete Activity',
                buttons: [
                  {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {
                      // setHandlerMessage('Alert canceled');
                    },
                  },
                  {
                    text: 'Delete',
                    role: 'confirm',
                    handler: () => {
                      // delete api
                    },
                  },
                ],
                onDidDismiss: (e: CustomEvent) => {
                  //setRoleMessage(`Dismissed with role: ${e.detail.role}`),
                },
              })
            }
            className={'cursor-pointer hover:shadow-lg'}
            color={'danger'}
            icon={trash}
          />
        )}
        <IonLabel>{activity.name}</IonLabel>
        <div className={'flex flex-row gap-1 items-center'}>
          <IonLabel>
            {parseDuration(activity.duration as PostgresInterval.IPostgresInterval)}
          </IonLabel>
          <IonIcon color={'tertiary'} icon={timeOutline} />
        </div>
      </div>
      <div className={'mb-4'}>
        <IonTextarea
          color={canEdit ? 'purple' : ''}
          autoGrow={true}
          value={activity.description}
          readonly={!canEdit}
        ></IonTextarea>
      </div>
      <ImageTape media={activity.media} />
    </div>
  );
}
