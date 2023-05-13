import React, { useMemo } from 'react';
import { IonAccordionGroup, IonReorderGroup, ItemReorderEventDetail } from '@ionic/react';
import { StoryResponse } from '../../../../types/types';
import { Destination } from './Destination';

type StoryProps = {
  story: StoryResponse;
  isEditMode?: boolean;
};

function Story({ story, isEditMode }: StoryProps) {
  function handleReorder(event: CustomEvent<ItemReorderEventDetail>) {
    // The `from` and `to` properties contain the index of the item
    // when the drag started and ended, respectively
    console.log('Dragged from index', event.detail.from, 'to', event.detail.to);

    // Finish the reorder and position the item in the DOM based on
    // where the gesture ended. This method can also be called directly
    // by the reorder group
    event.detail.complete();
  }

  const destinations = useMemo(
    () =>
      story.destinations
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
            />
          );
        }),
    [story, isEditMode]
  );

  return (
    <IonAccordionGroup multiple>
      <IonReorderGroup onIonItemReorder={handleReorder} disabled={!isEditMode}>
        {...destinations}
      </IonReorderGroup>
    </IonAccordionGroup>
  );
}
export default Story;
