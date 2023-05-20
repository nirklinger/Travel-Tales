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
import Link from 'next/link';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Filesystem } from '@capacitor/filesystem';
import { Directory } from '@capacitor/filesystem';
import { LocalFile } from '../../../types/types';
import { updateTaleCoverPhoto } from '../../../managers/tales-manager';

const IMAGE_DIR = 'stored-images';

interface ImageUploadProps {
  isMultiUpload: boolean;
  taleId?: number;
  activityId?: number;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ isMultiUpload, taleId, activityId }) => {
  const [coverPhoto, setCoverPhoto] = useState<LocalFile>({ name: '', path: '', data: '' });
  const modal = useRef<HTMLIonModalElement>(null);

  useEffect(() => {
    loadPhoto();
    console.log(
      `component details: isMultiUpload - ${isMultiUpload}, taleId - ${taleId}, activityId - ${activityId}`
    );
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

  const uploadPhotoHandler = useCallback(async () => {
    console.log(`trying to upload photo - upload button clicked`);
    const taleToUpdate = {};
    const newCoverPhoto = {};
    await updateTaleCoverPhoto(taleId, coverPhoto);
  }, [coverPhoto]);

  function onWillDismiss(ev: CustomEvent<OverlayEventDetail>) {
    if (coverPhoto.name !== '') {
      deletePhotoHandler();
    }
    if (ev.detail.role === 'confirm') {
      console.log('closing... inside');
    }
  }

  return (
    <>
      {isMultiUpload ? (
        <img src='/public/img/clickHereToUpload.jpeg'
        id="open-modal">
        </img>
      ) : (
        <IonFabButton className="absolute bottom-0 right-0">
          <IonIcon id="open-modal" icon={pencil} />
        </IonFabButton>
      )}
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
              <img className="" src={coverPhoto.data} />
              <IonButtons slot="center">
                <IonButton onClick={deletePhotoHandler}>
                  Cancel <IonIcon icon={trash}></IonIcon>
                </IonButton>
                <IonButton onClick={uploadPhotoHandler}>
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
    </>
  );
};

export default ImageUpload;
