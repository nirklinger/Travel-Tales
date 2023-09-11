import { Activity } from './Activity';
import {
  IonAccordion,
  IonButton,
  IonIcon,
  IonInput,
  IonItem,
  IonReorder,
  IonSelect,
  IonSelectOption,
  useIonAlert,
} from '@ionic/react';
import { location as locationIcon, todayOutline, trash } from 'ionicons/icons';
import React, { useCallback, useState } from 'react';
import {
  ActivitiesWithMedia,
  NewActivitiesWithMedia,
  ParsedDestination,
} from '../../../../types/types';
import parse from 'postgres-interval';
import { createActivity, deleteActivity } from '../../../../managers/activity-manager';
import { patchDestination } from '../../../../managers/destination-manager';
import { debounce } from 'lodash';
import { GeocodingFeature } from '@maptiler/client';
import LocationInputModal from './LocationInputModal';

interface DestinationProps {
  onDeleteDestination: () => void;
  activities: ActivitiesWithMedia[];
  destination: ParsedDestination;
  tripDurationInDays: number;
  isEditMode?: boolean;
}

export function Destination({
  activities: readOnlyActivities,
  destination: readonlyDestination,
  isEditMode,
  tripDurationInDays,
  onDeleteDestination,
}: DestinationProps) {
  const [presentAlert] = useIonAlert();
  const [destination, setDestination] = useState<ParsedDestination>(readonlyDestination);
  const [activities, setActivities] = useState<ActivitiesWithMedia[]>(readOnlyActivities);

  async function handleDeleteActivity(id: number) {
    await deleteActivity(id);
    setActivities([...activities.filter(act => act.id !== id)]);
  }

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
          handler: () => {},
        },
        {
          text: 'Delete',
          role: 'confirm',
          handler: () => onDeleteDestination(),
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
      should_embed: false,
      day_index: 0,
      sequential_number: activities.length,
      media: [],
    };

    const newActivityId = await createActivity(activity);
    setActivities([{ ...activity, id: newActivityId }, ...activities]);
  }

  const updateDestination = useCallback(
    debounce(changes => patchDestination(destination.id, changes), 2000),
    [destination.id]
  );

  const handleDestinationLocationChange = useCallback(
    (geo_location: GeocodingFeature) => {
      if (!geo_location) {
        return;
      }
      const changes = { geo_location };
      setDestination({ ...destination, geo_location });
      patchDestination(destination.id, changes);
    },
    [setDestination, destination]
  );

  const handleDestinationNameChange = useCallback(
    e => {
      setDestination({ ...destination, name: e.detail.value });
      updateDestination({ name: e.detail.value });
    },
    [setDestination, destination, updateDestination]
  );

  const handleDestinationDayChange = useCallback(
    (isFisrtDay, day) => {
      if (isFisrtDay) {
        setDestination({ ...destination, first_day: day });
        updateDestination({ first_day: day });
      } else {
        setDestination({ ...destination, last_day: day });
        updateDestination({ last_day: day });
      }
    },
    [setDestination, destination, updateDestination]
  );

  const actsToRender = activities.map(act => (
    <Activity
      key={act.id}
      activity={act}
      canEdit={isEditMode}
      onDeleteActivity={() => handleDeleteActivity(act.id)}
    />
  ));

  const destinationName = isEditMode ? (
    <div className={'w-max-10 text-xl font-medium'}>
      <IonInput
        placeholder="Enter destination name"
        onIonChange={handleDestinationNameChange}
        value={destination.name}
      ></IonInput>
    </div>
  ) : (
    <h1>{destination.name || '<Name missing>'}</h1>
  );

  const days = isEditMode ? (
    <div className={'flex flex-row'}>
      <IonItem>
        <IonSelect
          id={'firstDay'}
          value={destination.first_day}
          placeholder="first day"
          onIonChange={({ detail }) => handleDestinationDayChange(true, detail.value)}
        >
          {Array(tripDurationInDays)
            .fill(1)
            .map((_, i) => i + 1)
            .map(day => (
              <IonSelectOption key={`firstDay-${day}`} value={day}>
                {day}
              </IonSelectOption>
            ))}
        </IonSelect>
      </IonItem>
      <IonItem>
        <IonSelect
          id={'lastDay'}
          value={destination.last_day}
          placeholder="last day"
          onIonChange={({ detail }) => handleDestinationDayChange(false, detail.value)}
        >
          {Array(tripDurationInDays)
            .fill(1)
            .map((_, i) => i + 1)
            .map(day => (
              <IonSelectOption key={`lastDay-${day}`} value={day}>
                {day}
              </IonSelectOption>
            ))}
        </IonSelect>
      </IonItem>
    </div>
  ) : (
    <span className={'underline italic'}>
      days: {destination.first_day}-{destination.last_day}
    </span>
  );

  const location = isEditMode ? (
    <LocationInputModal
      destination={destination}
      onSaveNewLocation={handleDestinationLocationChange}
    />
  ) : (
    <>
      <span>{destination?.geo_location?.place_name}</span>
      <IonIcon color={'tertiary'} icon={locationIcon} />
    </>
  );

  return (
    <IonAccordion value={`${destination.name}-${destination.id}`}>
      <IonItem slot="header" id={`destination-${destination.id}`}>
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
        <div
          className={` flex ${
            isEditMode ? 'flex-col py-2' : 'flex-row gap-2 md:gap-4 items-center'
          }`}
        >
          {destinationName}
          <div
            className={
              'h-full -mb-4 flex flex-row items-center gap-1 text-xs lg:text-lg font-medium'
            }
          >
            {days}
            <IonIcon color={'tertiary'} icon={todayOutline} />
          </div>
        </div>
        <div
          className={
            'h-full -mb-4 ml-1 flex flex-row items-center gap-1 text-xs lg:text-lg font-medium'
          }
        >
          {location}
        </div>
        <IonReorder slot="end"></IonReorder>
      </IonItem>
      <div className="flex flex-col gap-8 bg-gray-50 dark:bg-gray-800 py-4" slot="content">
        <>
          {isEditMode && (
            <IonButton onClick={handleAddActivity} fill={'outline'}>
              Add an activity
            </IonButton>
          )}
          {...actsToRender}
        </>
      </div>
    </IonAccordion>
  );
}
