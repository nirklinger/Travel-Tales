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
  IonNavLink,
  IonItem,
  useIonRouter,
  IonButton,
  IonFabButton,
  IonIcon,
  IonModal,
  IonList,
  IonThumbnail,
  IonImg,
} from '@ionic/react';
import { useSession } from 'next-auth/react';
import {
  pencil,
  close,
  cameraOutline,
  closeOutline,
  trash,
  cloudUpload,
  pencilOutline,
} from 'ionicons/icons';
import { OverlayEventDetail } from '@ionic/core/components';
import { useRecoilState, useRecoilValue } from 'recoil';
import { currentTale, currentTaleIdState, currentTaleStory } from '../../../states/explore';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Story from './Story';
import Map from './Map';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Filesystem } from '@capacitor/filesystem';
import { Directory } from '@capacitor/filesystem';
import { LocalFile } from '../../../types/types';
import { updateTaleCoverPhoto } from '../../../managers/tales-manager';
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
  const taleStory = useRecoilValue(currentTaleStory);
  const tale = useRecoilValue(currentTale);
  const [segment, setSegment] = useState<Segments>(Segments.story);
  const [coverPhoto, setCoverPhoto] = useState<LocalFile>({ name: '', path: '', data: '' });

  const modal = useRef<HTMLIonModalElement>(null);
  let { taleId } = useParams();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (tale) {
      const isUserSessionValid = (status === 'authenticated') && (tale) && (tale.user_id === session.profile.sub);
      setIsUserTaleOwner(isUserSessionValid);
    }
  }, [session?.profile.sub, status, tale]);

  useEffect(() => () => setCurrentTaleId(null), []);

  if (currentTaleId != taleId) setCurrentTaleId(Number(taleId));

  if (!tale) {
    return <div>no tail</div>;
  }

  const { title, catch_phrase, author, avatar_photo, cover_photo_url } = tale;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tabs/explore"></IonBackButton>
          </IonButtons>
          <IonTitle className={'lg:text-center'}>{title + (edit ? ' (Edit Mode)' : '')}</IonTitle>
          {isUserTaleOwner && <IonButton fill={'clear'} slot={'end'} onClick={() => setEdit(!edit)}>
          {edit ? 'Done' : 'Edit'}
          </IonButton>}
        </IonToolbar>
      </IonHeader>
      <IonContent className={''}>
        {segment === Segments.story && (<div className="relative">
          <img
            className="lg:h-96 lg:w-3/6 m-auto object-cover sm:h-full sm:w-48"
            src={cover_photo_url}
          />
          {edit && <>
            <IonFabButton id='fab-trigger' className="absolute bottom-0 right-0">
              <IonIcon icon={pencil} />
            </IonFabButton>
            <ImageUpload isMultiUpload={false} trigger='fab-trigger' onUpload={(coverPhoto) => updateTaleCoverPhoto(taleId, coverPhoto)}/>
          </>
          }

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
        {segment === Segments.story && <Story isEditMode={edit} />}
        {segment === Segments.viewOnMap && <Map />}
      </IonContent>
    </IonPage>
  );
};


export default TaleOverview;
