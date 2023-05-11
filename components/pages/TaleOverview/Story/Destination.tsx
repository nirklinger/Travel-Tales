import { Activity } from './Activity';
import { IonAccordion, IonButton, IonIcon, IonItem, IonReorder, useIonAlert } from '@ionic/react';
import { todayOutline, trash } from 'ionicons/icons';
import React from 'react';
import { ActivitiesWithMedia, NewActivitiesWithMedia } from '../../../../types/types';
import { TripDestinations } from '../../../../types/db-schema-definitions';
import parse from 'postgres-interval';
import { createActivity } from '../../../../managers/story-manager';

interface DestinationProps {
  activities: ActivitiesWithMedia[];
  destination: TripDestinations;
  isEditMode?: boolean;
}

export function Destination({ activities, destination, isEditMode }: DestinationProps) {
  const [presentAlert] = useIonAlert();

  function handleDeleteDestination(e) {
    e.stopPropagation();
    e.preventDefault();
    presentAlert({
      header: 'Delete Destination!',
      subHeader: 'Once Deleted, all destination activities are deleted as well',
      message: 'Are you sure you want to delete Destination',
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
    });
  }

  async function handleAddActivity() {
    const activity: NewActivitiesWithMedia = {
      destination_id: destination.id,
      duration: parse('00:00:00'),
      name: '',
      description: '',
      day_index: 0,
      sequential_number: activities.length,
      media: [],
    };

    const newActivityId = await createActivity(activity);
    activities.push({ ...activity, id: newActivityId });
  }

  const actsToRender = activities.map((act, index) => (
    <Activity key={act.id} activity={act} canEdit={isEditMode} />
  ));
  return (
    <IonAccordion value={destination.name}>
      <IonItem slot="header">
        {isEditMode && (
          <div className={'text-xl'} onClickCapture={handleDeleteDestination}>
            <IonIcon
              className={
                'cursor-pointer block rounded-md hover:bg-blue-100 -mb-2 p-1 mr-1 md:p-2 md:mr-2'
              }
              color={'danger'}
              icon={trash}
            />
          </div>
        )}
        <h1>{destination.name}</h1>
        <div className={'h-full -mb-4 flex flex-row items-center gap-1 mx-4 text-lg font-medium'}>
          <span className={'underline italic'}>
            days: {destination.first_day}-{destination.last_day}
          </span>
          <IonIcon color={'tertiary'} icon={todayOutline} />
        </div>
        <IonReorder slot="end"></IonReorder>
      </IonItem>
      <div className="flex flex-col gap-8 bg-gray-50 py-4" slot="content">
        {...actsToRender}
        <IonButton onClick={handleAddActivity} fill={'outline'}>
          Add an activity
        </IonButton>
      </div>
    </IonAccordion>
  );
}
