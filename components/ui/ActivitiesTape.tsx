import TripCard from './TripCard';
import { MediaType } from '../../types/db-schema-definitions';
import Image from 'next/image';
import ActivityCard from './ActivityCard';
import { ActivityWithMediaWithCategories } from '../../types/types';

function ActivitiesTape({
  activities,
  onActivityClick,
}: {
  activities: ActivityWithMediaWithCategories[];
  onActivityClick: (id: number) => void;
}) {
  if (!activities.length) return;
  return (
    <div className="flex flex-row overflow-scroll gap-4 w-full">
      {activities
        .sort((a, b) => b.media.length - a.media.length)
        .map(activity => (
          <div key={activity.id} className={'flex-shrink-0 w-64 lg:w-72'}>
            <ActivityCard activity={activity} onClick={() => onActivityClick(activity.id)} />
          </div>
        ))}
    </div>
  );
}

export default ActivitiesTape;
