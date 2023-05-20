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
import { useEffect, useState } from 'react';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Filesystem } from '@capacitor/filesystem';
import { Directory } from '@capacitor/filesystem';
import { LocalFile } from '../../../types/types';
import { updateTaleCoverPhoto, uploadActivityPhoto } from '../../../managers/tales-manager';

const IMAGE_DIR = 'stored-images';

interface ImageUploadProps {
  isMultiUpload: boolean;
  trigger: string;
  onUpload: (photo: LocalFile) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  isMultiUpload,
  trigger,
  onUpload,
}) => {
  const [photos, setPhotos] = useState<LocalFile[]>([]);
  const modal = useRef<HTMLIonModalElement>(null);

  useEffect(() => {
    loadPhoto();
  }, []);

  const selectPhoto = async () => {
    const photo = await Camera.getPhoto({
      quality: 100,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Photos,
    });
    if (photo) {
      savePhoto(photo);
    }
  };

  const savePhoto = async (photo: Photo) => {
    const fileName = new Date().getTime() + '.jpeg';
    const savedFile = await Filesystem.writeFile({
      directory: Directory.Data,
      path: `${IMAGE_DIR}/${fileName}`,
      data: photo.base64String,
    });
    loadPhoto();
  };

  const loadPhoto = async () => {
    Filesystem.readdir({
      directory: Directory.Data,
      path: IMAGE_DIR,
    }).then(
      result => {
        console.log(`reading directory, result: ${JSON.stringify(result.files)}`);
        Promise.all(result.files.map( async (file) => {
          const readFile = await Filesystem.readFile({
            directory: Directory.Data,
            path: `${IMAGE_DIR}/${file.name}`,
          });
          return ({
            name: file.name,
            path: `${IMAGE_DIR}/${file.name}`,
            data: `data:image/jpeg;base64,${readFile.data}`,
          });
        })).then(
          newPhotos => setPhotos(newPhotos)
        )
      },
      async err => {
        console.log(`error - ${err}`);
        await Filesystem.mkdir({
          directory: Directory.Data,
          path: IMAGE_DIR,
        });
      }
    );
  }


  const deletePhotoHandler = async () => {
    await Filesystem.rmdir({
      directory: Directory.Data,
      path: IMAGE_DIR,
      recursive: true,
    })
    setPhotos([]);
  };

  const uploadPhotoHandler = useCallback(async () => {
    console.log(`trying to upload photo - upload button clicked`);
    const promises = photos.map(photo => onUpload(photo));
  }, [photos, onUpload]);

  function onWillDismiss(ev: CustomEvent<OverlayEventDetail>) {
    /*if (coverPhoto.name !== '') {
      deletePhotoHandler();
    }*/
    if (ev.detail.role === 'confirm') {
      console.log('closing... inside');
    }
  }

  return (
    <>
      <IonModal ref={modal} trigger={trigger} onWillDismiss={ev => onWillDismiss(ev)}>
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
          <ul>
            {photos.map(photo => {
              return (
                <li key={photo.name}>
                  <img src={photo.data} />
                </li>
              );
            })}
          </ul>
          {photos.length > 0 && (
            <div>
              <IonButtons slot="center">
                <IonButton onClick={deletePhotoHandler}>
                  Cancel <IonIcon icon={trash}></IonIcon>
                </IonButton>
                <IonButton onClick={uploadPhotoHandler}>
                  Upload <IonIcon icon={cloudUpload}></IonIcon>
                </IonButton>
              </IonButtons>
            </div>
          )}
          {(photos.length === 0 || isMultiUpload ) &&
          <IonItem>
          <IonToolbar color="primary">
            <IonButton fill="clear" expand="full" color="light" onClick={selectPhoto}>
              <IonIcon icon={cameraOutline}></IonIcon>
              {isMultiUpload ? 'Select Activity Photo' : 'Select A Cover Photo'}
            </IonButton>
          </IonToolbar>
        </IonItem>
          }
        </IonContent>
      </IonModal>
    </>
  );
};

export default ImageUpload;
