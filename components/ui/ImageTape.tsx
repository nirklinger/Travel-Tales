import TripCard from './TripCard';
import { MediaType } from '../../types/db-schema-definitions';
import Image from 'next/image';
import ImageUpload from '../common/ImageUpload';
import { uploadActivityMedias } from '../../managers/activity-manager';

function ImageTape({
  media,
  isEdit,
  activityId,
}: {
  media: { media_type: MediaType | null; media_url: string }[];
  isEdit: boolean;
  activityId: number
}) {
  const uploadImage = '/img/clickHereToUpload.jpeg';

  if (!media.length && !isEdit) return;
  return (
    <div className="flex flex-row overflow-scroll gap-2 w-full h-60 ">
      {isEdit && (<>
        <div className={'flex-shrink-0 w-full md:w-60 lg:w-80 h-full border-2 rounded-md'} id={`activity-trigger-${activityId}`}>
          <div className=" rounded-md overflow-hidden relative w-full h-full">
            <Image fill style={{ objectFit: 'contain' }} src={uploadImage} alt="" />
          </div>
        </div>
        <ImageUpload isMultiUpload={true} trigger={`activity-trigger-${activityId}`} onUpload={(photos) => uploadActivityMedias(activityId, [photos])}/>
      </>
      )}
      {media.map(media => (
        <div key={media.media_url} className={'flex-shrink-0 w-full md:w-60 lg:w-80 h-full'}>
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
  );
}

export default ImageTape;
