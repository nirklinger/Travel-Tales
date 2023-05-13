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
import { pencil, close, cameraOutline, closeOutline, trash, cloudUpload } from 'ionicons/icons';
import { OverlayEventDetail } from '@ionic/core/components';
import { useRecoilState, useRecoilValue } from 'recoil';
import { currentTale, currentTaleIdState, currentTaleStory } from '../../../states/explore';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Story from './Story';
import Link from 'next/link';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Filesystem } from '@capacitor/filesystem';
import { Directory } from '@capacitor/filesystem';
import { LocalFile } from '../../../types/types';

enum Segments {
  thingsToDo = 'Things To Do',
  story = 'Story',
}

const IMAGE_DIR = 'stored-images';

const TaleOverview = () => {
  const [edit, setEdit] = useState(false);
  const [currentTaleId, setCurrentTaleId] = useRecoilState(currentTaleIdState);
  const taleStory = useRecoilValue(currentTaleStory);
  const tale = useRecoilValue(currentTale);
  const [segment, setSegment] = useState<Segments>(Segments.story);
  const [coverPhoto, setCoverPhoto] = useState<LocalFile>({ name: '', path: '', data: '' });

  const modal = useRef<HTMLIonModalElement>(null);
  let { taleId } = useParams();

  useEffect(() => () => setCurrentTaleId(null), []);
  useEffect(() => {
    loadPhoto();
  }, []);

  const selectPhoto = useCallback(async () => {
    const photo = await Camera.getPhoto({
      quality: 100,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Photos,
    });
    if (photo) {
      savePhoto(photo);
    }
  }, []);

  const savePhoto = async (photo: Photo) => {
    const fileName = new Date().getTime() + '.jpeg';
    const savedFile = await Filesystem.writeFile({
      directory: Directory.Data,
      path: `${IMAGE_DIR}/${fileName}`,
      data: photo.base64String,
    });
    loadPhoto();
  };

  const loadPhoto = useCallback(async () => {
    Filesystem.readdir({
      directory: Directory.Data,
      path: IMAGE_DIR,
    })
      .then(
        result => {
          console.log(`reading directory, result: ${JSON.stringify(result.files)}`);
          const fileNames = result.files.map(file => {
            return file.name;
          });
          initPhoto();
          if (fileNames.length > 0) {
            loadFileData(fileNames);
          }
        },
        async err => {
          console.log(`error - ${err}`);
          await Filesystem.mkdir({
            directory: Directory.Data,
            path: IMAGE_DIR,
          });
        }
      )
      .then(() => {});
  }, []);

  const loadFileData = useCallback(async (fileNames: string[]) => {
    const fileName = fileNames[fileNames.length - 1];
    const filePath = `${IMAGE_DIR}/${fileName}`;
    const readFile = await Filesystem.readFile({
      directory: Directory.Data,
      path: filePath,
    });
    setCoverPhoto({
      name: fileName,
      path: filePath,
      data: `data:image/jpeg;base64,${readFile.data}`,
    });
  }, []);

  const initPhoto = useCallback(async () => {
    setCoverPhoto({ name: '', path: '', data: '' });
  }, []);

  const deletePhotoHandler = useCallback(async () => {
    await Filesystem.deleteFile({
      directory: Directory.Data,
      path: coverPhoto.path,
    });
    loadPhoto();
  }, [coverPhoto, loadPhoto]);

  if (currentTaleId != taleId) setCurrentTaleId(Number(taleId));

  if (!tale) {
    return <div>no tail</div>;
  }

  function onWillDismiss(ev: CustomEvent<OverlayEventDetail>) {
    if (ev.detail.role === 'confirm') {
    }
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
            {edit ? 'Save' : 'Edit'}
          </IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent className={''}>
        <div className="relative">
          <img
            className="lg:h-96 lg:w-3/6 m-auto object-cover sm:h-full sm:w-48"
            src={cover_photo_url}
          />
          <IonFabButton className="absolute bottom-0 right-0">
            <IonIcon
              id="open-modal"
              icon={pencil}
              onClick={() => {
                console.log('edit');
              }}
            />
          </IonFabButton>
        </div>
        <div className={'w-full'}>
          <IonSegment
            onIonChange={event => setSegment(event.detail.value as Segments)}
            value={segment}
          >
            <IonSegmentButton value={Segments.story}>
              <IonLabel>{Segments.story}</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value={Segments.thingsToDo}>
              <IonLabel>{Segments.thingsToDo}</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </div>
        {segment === Segments.story && <Story isEditMode={edit} story={taleStory} />}
        <IonModal ref={modal} trigger="open-modal" onWillDismiss={ev => onWillDismiss(ev)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Select New Cover Photo</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => modal.current?.dismiss()}>
                  <IonIcon icon={close}></IonIcon>
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
          {coverPhoto.name.length > 0 ? (
            <div>
              <img 
                className=""
                src={coverPhoto.data}
              />
              <IonButtons slot='center'>
                <IonButton onClick={deletePhotoHandler}>
                  Cancel <IonIcon icon={trash}></IonIcon>
                </IonButton>
                <IonButton>
                  Upload <IonIcon icon={cloudUpload}></IonIcon>
                </IonButton>
              </IonButtons>
            </div>
              ) : (
                <IonItem>
                  <IonToolbar color="primary">
                    <IonButton fill="clear" expand="full" color="light" onClick={selectPhoto}>
                      <IonIcon icon={cameraOutline}></IonIcon>
                      Select A Cover Photo
                    </IonButton>
                  </IonToolbar>
                </IonItem>
              )}
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default TaleOverview;
