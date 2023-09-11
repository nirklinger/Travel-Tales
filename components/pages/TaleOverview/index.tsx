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
  IonTextarea,
  IonItem,
  IonDatetimeButton,
  IonModal,
  IonDatetime,
  IonRouterLink,
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
  shouldResetTalesState,
  tales,
} from '../../../states/explore';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Story from './Story';
import Map from './Map';
import { ParsedDestination, Tale } from '../../../types/types';
import {
  checkIfUserIsTaleOwner,
  patchTale,
  updateTaleCoverPhoto,
} from '../../../managers/tales-manager';
import ImageUpload from '../../common/ImageUpload';
import Image from 'next/image';
import { debounce } from 'lodash';

enum Segments {
  viewOnMap = 'View on map',
  story = 'Story',
}

const TaleOverview = () => {
  const [edit, setEdit] = useState(false);
  const [isUserTaleOwner, setIsUserTaleOwner] = useState(false);
  const [currentTaleId, setCurrentTaleId] = useRecoilState(currentTaleIdState);
  const resetStory = useRecoilRefresher_UNSTABLE(currentTaleStory);
  const taleReadonly = useRecoilValue(currentTale);
  const resetTales = useRecoilRefresher_UNSTABLE(tales);
  const [segment, setSegment] = useState<Segments>(Segments.story);
  const [coverPhoto, setCoverPhoto] = useState<string>('');
  const contentRef = useRef<HTMLIonContentElement>();
  const setFocusDestination = useSetRecoilState(focusOnDestination);
  const setFocusActivity = useSetRecoilState(focusOnActivity);
  const [tale, setTale] = useState<Tale>(null);
  const setShouldResetTales = useSetRecoilState(shouldResetTalesState);

  let { taleId } = useParams();
  const { data: session, status } = useSession();

  const AUTHENTICATED = 'authenticated';

  useEffect(() => {
    setTale(taleReadonly);
  }, [taleReadonly]);

  useEffect(() => {
    setCoverPhoto(tale?.cover_photo_url + `?t=${Date.now()}`);
  }, [tale?.cover_photo_url]);

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
    setShouldResetTales(true);
  };

  const viewDestinationInStory = useCallback(
    (destination: ParsedDestination) => {
      setSegment(Segments.story);
      setFocusDestination(destination.id);
    },
    [setSegment, setFocusDestination]
  );

  const updateTale = useCallback(
    debounce(changes => {
      setShouldResetTales(true);
      patchTale(tale.trip_id, changes);
    }, 2000),
    [tale?.trip_id, setShouldResetTales]
  );

  const handleCatchPhraseChange = useCallback(
    e => {
      setTale({ ...tale, catch_phrase: e.detail.value });
      updateTale({ catch_phrase: e.detail.value });
    },
    [setTale, tale, updateTale]
  );

  const handleStartDateChange = useCallback(
    e => {
      const start_date = new Date(e.detail.value);

      if (start_date.getTime() > tale.end_date.getTime()) {
        return;
      }

      setTale({ ...tale, start_date });
      updateTale({ start_date });
    },
    [setTale, tale, updateTale]
  );

  const handleEndDateChange = useCallback(
    e => {
      const end_date = new Date(e.detail.value);

      if (end_date.getTime() < tale.start_date.getTime()) {
        return;
      }

      setTale({ ...tale, end_date });
      updateTale({ end_date });
    },
    [setTale, tale, updateTale]
  );

  if (!tale || !taleReadonly) {
    return <div>no tail</div>;
  }

  const { title } = tale;

  const taleDates = edit ? (
    <>
      <div className={'flex flex-row'}>
        <IonButton color={'dark'} size={'small'} fill={'outline'} id={'start-date'}>
          {tale.start_date.toLocaleDateString('en-GB')}
        </IonButton>
        <IonButton color={'dark'} size={'small'} fill={'outline'} id={'end-date'}>
          {tale.end_date.toLocaleDateString('en-GB')}
        </IonButton>
      </div>
      <IonModal id={'start-date-pick'} keepContentsMounted={true} trigger={'start-date'}>
        <IonDatetime
          id="startDatetime"
          presentation="date"
          showDefaultButtons={true}
          onIonChange={handleStartDateChange}
        ></IonDatetime>
      </IonModal>
      <IonModal id={'end-date-pick'} keepContentsMounted={true} trigger={'end-date'}>
        <IonDatetime
          id="endDatetime"
          presentation="date"
          showDefaultButtons={true}
          onIonChange={handleEndDateChange}
        ></IonDatetime>
      </IonModal>
    </>
  ) : (
    <span className="font-bold text-gray-800 dark:text-gray-500 uppercase">
      {tale.start_date.toLocaleDateString('en-GB')} - {tale.end_date.toLocaleDateString('en-GB')}
    </span>
  );

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
          <div className={'relative lg:h-96 lg:w-3/6 m-auto sm:h-full sm:w-48'}>
            <Image
              unoptimized={true}
              alt={`profile's picture`}
              height={100}
              width={100}
              className="object-cover min-w-full min-h-full max-w-full max-h-full"
              src={coverPhoto}
            />
            <div
              className={
                'absolute bottom-2 left-4 bg-white bg-opacity-70 w-2/3 h-1/3 rounded-md p-2 overflow-y-scroll'
              }
            >
              {taleDates}
              <IonTextarea
                onIonChange={handleCatchPhraseChange}
                placeholder={'Cool catch phrase...'}
                color={edit ? 'purple' : ''}
                autoGrow={true}
                value={tale.catch_phrase}
                readonly={!edit}
              ></IonTextarea>
            </div>
            {edit && (
              <>
                <IonFabButton className="absolute bottom-2 right-2">
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
