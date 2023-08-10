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
import { useRecoilRefresher_UNSTABLE, useRecoilState, useRecoilValue } from 'recoil';
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
  const [currentTaleId, setCurrentTaleId] = useRecoilState(currentTaleIdState);
  const taleStory = useRecoilValue(currentTaleStory);
  const resetStory = useRecoilRefresher_UNSTABLE(currentTaleStory);
  const tale = useRecoilValue(currentTale);
  const [segment, setSegment] = useState<Segments>(Segments.story);
  const [coverPhoto, setCoverPhoto] = useState<LocalFile>({ name: '', path: '', data: '' });
  const contentRef = useRef<HTMLIonContentElement>();

  const modal = useRef<HTMLIonModalElement>(null);
  let { taleId } = useParams();

  useEffect(
    () => () => {
      setCurrentTaleId(null);
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

  useEffect(() => {
    console.log(`this is the tale obj: ${JSON.stringify(tale)}`);
  }, [tale]);

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
          <IonButton fill={'clear'} slot={'end'} onClick={() => setEdit(!edit)}>
            {edit ? 'Done' : 'Edit'}
          </IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent ref={contentRef} className={''}>
        {segment === Segments.story && (
          <div className="relative">
            <img
              className="lg:h-96 lg:w-3/6 m-auto object-cover sm:h-full sm:w-48"
              src={cover_photo_url}
            />
            {edit && (
              <>
                <IonFabButton className="absolute bottom-0 right-0">
                  <IonIcon id="fab-trigger" icon={pencil} />
                </IonFabButton>
                <ImageUpload
                  isMultiUpload={false}
                  trigger="fab-trigger"
                  onUpload={coverPhoto => updateTaleCoverPhoto(taleId, coverPhoto)}
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
        {segment === Segments.viewOnMap && <Map />}
      </IonContent>
    </IonPage>
  );
};

export default TaleOverview;
