import React, { MutableRefObject, useEffect, useMemo, useState } from 'react';
import {
  IonAccordionGroup,
  IonFab,
  IonFabButton,
  IonIcon,
  IonReorderGroup,
  ItemReorderEventDetail,
  useIonRouter,
} from '@ionic/react';
import { NewTripDestination, ParsedDestination } from '../../../../types/types';
import { Destination } from './Destination';
import { add } from 'ionicons/icons';
import { currentTale, currentTaleIdState, currentTaleStory } from '../../../../states/explore';
import { useRecoilRefresher_UNSTABLE, useRecoilValue } from 'recoil';
import { createDestination, deleteDestination } from '../../../../managers/destination-manager';

type StoryProps = {
  isEditMode?: boolean;
  contentRef: MutableRefObject<HTMLElement | null>;
};

function AddDestination({ handleAddDestination }) {
  return (
    <div className={'w-14 h-14 ml-2 p-2'}>
      <IonFab>
        <IonFabButton className={'rounded-md'} color={'tertiary'} onClick={handleAddDestination}>
          <IonIcon icon={add}></IonIcon>
        </IonFabButton>
      </IonFab>
    </div>
  );
}

function Story({ isEditMode, contentRef }: StoryProps) {
  const story = useRecoilValue(currentTaleStory);
  const taleId = useRecoilValue(currentTaleIdState);
  const tale = useRecoilValue(currentTale);
  const [destinations, setDestinations] = useState<ParsedDestination[]>([]);
  const router = useIonRouter();
  const activityIdQuery = new URLSearchParams(router.routeInfo.search?.replace('?', '')).get(
    'activity-id'
  );
  const tripDurationInDays = Math.floor(
    (tale.end_date.getTime() - tale.start_date.getTime()) / (1000 * 60 * 60 * 24)
  );

  useEffect(() => {
    setDestinations(story.destinations);
  }, [story]);

  const scrollTo = (activityId: number, destinationId: number) => {
    const destination = document.getElementById(`destination-${destinationId}`);

    if (!destination || !contentRef.current) {
      return;
    }

    destination.click();

    const activity = document.getElementById(`activity-${activityId}`);

    if (!activity || !contentRef.current) {
      return;
    }

    setTimeout(() => {
      const y = activity.offsetTop + destination.offsetTop;
      (contentRef.current as any).scrollToBottom(y);
    }, 500);
  };

  useEffect(() => {
    const activityId = Number(activityIdQuery);
    if (!Number.isNaN(activityId)) {
      const destinationId = story.activities.find(act => act.id === activityId)?.destination_id;

      if (!destinationId) return;

      const destination = document.getElementById(`destination-${destinationId}`);

      if (!destination) {
        return;
      }

      destination.click();
      scrollTo(activityId, destinationId);
    }
  }, [story, activityIdQuery, scrollTo]);

  function handleReorder(event: CustomEvent<ItemReorderEventDetail>) {
    event.detail.complete();
  }

  async function handleDeleteDestination(id: number) {
    await deleteDestination(id);
    setDestinations([...destinations.filter(act => act.id !== id)]);
  }

  async function handleAddDestination() {
    const day = Math.min(
      Math.max(...destinations.map(dest => dest.last_day)) + 1,
      tripDurationInDays
    );
    const sequential_number = Math.max(...destinations.map(dest => dest.sequential_number), 0) + 1;
    const dest: NewTripDestination = {
      trip_id: taleId,
      first_day: day,
      last_day: day,
      name: '',
      geo_location: null,
      sequential_number,
    };

    const newDestId = await createDestination(dest);
    setDestinations([{ ...dest, id: newDestId }, ...destinations]);
  }

  const destinationsToRender = useMemo(
    () =>
      destinations
        .slice()
        .sort((dest1, dest2) => dest1.sequential_number - dest2.sequential_number)
        .map(dest => {
          const destActivities = story.activities
            .filter(act => act.destination_id === dest.id)
            .sort((act1, act2) => act1.sequential_number - act2.sequential_number);
          return (
            <Destination
              key={dest.id}
              destination={dest}
              activities={destActivities}
              isEditMode={isEditMode}
              tripDurationInDays={tripDurationInDays}
              onDeleteDestination={() => handleDeleteDestination(dest.id)}
            />
          );
        }),
    [story, destinations, isEditMode]
  );

  return (
    <>
      {isEditMode && <AddDestination handleAddDestination={handleAddDestination} />}
      <IonAccordionGroup multiple>
        <IonReorderGroup onIonItemReorder={handleReorder} disabled={!isEditMode}>
          {...destinationsToRender}
        </IonReorderGroup>
      </IonAccordionGroup>
    </>
  );
}
export default Story;
