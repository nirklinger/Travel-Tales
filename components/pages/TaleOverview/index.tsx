import React, { useCallback, useRef } from 'react';
import {
  IonButtons,
  IonContent,
  IonHeader,
  IonLabel,
  IonPage,
  IonSegment,
  IonSegmentButton,
  IonTitle,
  IonToolbar,
  IonBackButton,
  IonButton,
  IonFabButton,
  IonIcon,
} from '@ionic/react';
import { useSession } from 'next-auth/react';
import { pencil } from 'ionicons/icons';
import {
  useRecoilRefresher_UNSTABLE,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from 'recoil';
import {
  currentTale,
  currentTaleIdState,
  currentTaleStory,
  focusOnActivity,
  focusOnDestination,
} from '../../../states/explore';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Story from './Story';
import Map from './Map';
import { LocalFile, ParsedDestination } from '../../../types/types';
import { checkIfUserIsTaleOwner, updateTaleCoverPhoto } from '../../../managers/tales-manager';
import ImageUpload from '../../common/ImageUpload';

enum Segments {
  viewOnMap = 'View on map',
  story = 'Story',
}

const IMAGE_DIR = 'stored-images';

const TaleOverview = () => {
  const [edit, setEdit] = useState(false);
  const [isUserTaleOwner, setIsUserTaleOwner] = useState(false);
  const [currentTaleId, setCurrentTaleId] = useRecoilState(currentTaleIdState);
  const resetStory = useRecoilRefresher_UNSTABLE(currentTaleStory);
  const tale = useRecoilValue(currentTale);
  const [segment, setSegment] = useState<Segments>(Segments.story);
  const [coverPhoto, setCoverPhoto] = useState<string>(tale?.cover_photo_url || '');
  const contentRef = useRef<HTMLIonContentElement>();
  const setFocusDestination = useSetRecoilState(focusOnDestination);
  const setFocusActivity = useSetRecoilState(focusOnActivity);

  const modal = useRef<HTMLIonModalElement>(null);
  let { taleId } = useParams();
  const { data: session, status } = useSession();

  const AUTHENTICATED = 'authenticated';

  useEffect(() => {
    setCoverPhoto(tale?.cover_photo_url);
  }, [tale]);

  useEffect(() => {
    const checkIfUserIsOwner = async () => {
      const userExternalId = session.profile.sub;
      const res = await checkIfUserIsTaleOwner(taleId, userExternalId);
      const isUserOwnerOfTale = await res.json();

      console.log(`isUserTaleOwner - ${isUserTaleOwner}`);
      setIsUserTaleOwner(isUserOwnerOfTale);
    };

    if (status === AUTHENTICATED) {
      checkIfUserIsOwner();
    } else {
      setIsUserTaleOwner(false);
    }
  }, [status, taleId, session?.profile.sub, isUserTaleOwner]);

  useEffect(
    () => () => {
      setCurrentTaleId(null);
      setFocusDestination(null);
      setFocusActivity(null);
      setEdit(false);
      resetStory();
    },
    []
  );

  useEffect(() => {
    if (currentTaleId != taleId) setCurrentTaleId(Number(taleId));
  }, [currentTaleId, taleId, setCurrentTaleId]);

  useEffect(() => {
    if (currentTaleId) {
      setSegment(Segments.story);
    }
  }, [currentTaleId, setSegment]);

  const uploadCoverPhoto = async (coverPhoto: File) => {
    const newCoverPhoto = await updateTaleCoverPhoto(taleId, coverPhoto);
    setCoverPhoto(newCoverPhoto);
  };

  const viewDestinationInStory = useCallback(
    (destination: ParsedDestination) => {
      setSegment(Segments.story);
      setFocusDestination(destination.id);
    },
    [setSegment, setFocusDestination]
  );

  if (!tale) {
    return <div>no tail</div>;
  }

  const { title } = tale;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tabs/explore"></IonBackButton>
          </IonButtons>
          <IonTitle className={'lg:text-center'}>{title + (edit ? ' (Edit Mode)' : '')}</IonTitle>
          {isUserTaleOwner && (
            <IonButton fill={'clear'} slot={'end'} onClick={() => setEdit(!edit)}>
              {edit ? 'Done' : 'Edit'}
            </IonButton>
          )}
        </IonToolbar>
      </IonHeader>
      <IonContent ref={contentRef} className={''}>
        {segment === Segments.story && (
          <div className="relative">
            <img
              className="lg:h-96 lg:w-3/6 m-auto object-cover sm:h-full sm:w-48"
              src={coverPhoto}
            />
            {edit && (
              <>
                <IonFabButton className="absolute bottom-0 right-0">
                  <IonIcon id="fab-trigger" icon={pencil} />
                </IonFabButton>
                <ImageUpload
                  isMultiUpload={false}
                  trigger="fab-trigger"
                  onUpload={([coverPhoto]) => uploadCoverPhoto(coverPhoto)}
                />
              </>
            )}
          </div>
        )}
        <div className={'w-full'}>
          <IonSegment
            onIonChange={event => setSegment(event.detail.value as Segments)}
            value={segment}
          >
            <IonSegmentButton value={Segments.story}>
              <IonLabel>{Segments.story}</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value={Segments.viewOnMap}>
              <IonLabel>{Segments.viewOnMap}</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </div>
        {segment === Segments.story && <Story isEditMode={edit} contentRef={contentRef} />}
        {segment === Segments.viewOnMap && <Map viewDestinationInStory={viewDestinationInStory} />}
      </IonContent>
    </IonPage>
  );
};

export default TaleOverview;
