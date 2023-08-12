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
import {
  Camera,
  CameraResultType,
  CameraSource,
  GalleryPhoto,
  GalleryPhotos,
  Photo,
} from '@capacitor/camera';
import { Filesystem } from '@capacitor/filesystem';
import { Directory } from '@capacitor/filesystem';
import { LocalFile } from '../../../types/types';

const IMAGE_DIR = 'stored-images';

interface ImageUploadProps {
  isMultiUpload: boolean;
  trigger: string;
  onUpload: (photo: File[]) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ isMultiUpload, trigger, onUpload }) => {
  const [photos, setPhotos] = useState<LocalFile[]>([]);
  const modal = useRef<HTMLIonModalElement>(null);

  useEffect(() => {
    loadPhoto();
  }, []);

  const selectPhoto = async () => {
    return await Camera.getPhoto({
      quality: 100,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Photos,
    });
  };

  const selectPhotos = async () => {
    const photosToConvert = await Camera.pickImages({
      quality: 100,
      limit: 10,
    });
    if (photosToConvert) {
      return await convertObjectsToBase64(photosToConvert.photos);
    }
  };

  async function convertObjectsToBase64(objects: GalleryPhoto[]) {
    const convertedObjects = [];
    for (const obj of objects) {
      const { format, webPath } = obj;
      const base64String = await convertToBase64(webPath);
      convertedObjects.push({ format, base64String });
    }
    return convertedObjects;
  }

  const convertToBase64 = async webPath => {
    const response = await fetch(webPath);
    const blob = await response.blob();

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        resolve(base64String);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const selectPhotoHandler = async () => {
    if (isMultiUpload) {
      const photos = await selectPhotos();
      await savePhotos(photos);
      console.log(`finished with saving photos`);
    } else {
      const photo = await selectPhoto();
      await savePhoto(photo);
    }
    await loadPhoto();
  };

  const savePhoto = async (photo: Photo) => {
    const fileName = new Date().getTime() + '.jpeg';
    await Filesystem.writeFile({
      directory: Directory.Data,
      path: `${IMAGE_DIR}/${fileName}`,
      data: photo.base64String,
    });
  };

  const savePhotos = async (photos: Photo[]) => {
    let index = 0;
    await Promise.all(
      photos.map(async photo => {
        index = index + 1;
        const fileName = new Date().getTime() + index + '.jpeg';
        await Filesystem.writeFile({
          directory: Directory.Data,
          path: `${IMAGE_DIR}/${fileName}`,
          data: photo.base64String,
        });
      })
    );
  };

  const loadPhoto = async () => {
    Filesystem.readdir({
      directory: Directory.Data,
      path: IMAGE_DIR,
    }).then(
      result => {
        Promise.all(
          result.files.map(async file => {
            const readFile = await Filesystem.readFile({
              directory: Directory.Data,
              path: `${IMAGE_DIR}/${file.name}`,
            });
            return {
              name: file.name,
              path: `${IMAGE_DIR}/${file.name}`,
              data: `data:image/jpeg;base64,${readFile.data}`,
            };
          })
        ).then(newPhotos => setPhotos(newPhotos));
      },
      async err => {
        console.log(`error - ${err}`);
        await Filesystem.mkdir({
          directory: Directory.Data,
          path: IMAGE_DIR,
        });
      }
    );
  };

  const deletePhotoHandler = async () => {
    const imageDirectory = await Filesystem.readdir({
      directory: Directory.Data,
      path: IMAGE_DIR,
    });
    if (imageDirectory.files.length > 0) {
      await Filesystem.rmdir({
        directory: Directory.Data,
        path: IMAGE_DIR,
        recursive: true,
      });
      await Filesystem.mkdir({
        directory: Directory.Data,
        path: IMAGE_DIR,
      });
    }
    console.log(imageDirectory.files.length);
    setPhotos([]);
  };

  const uploadPhotoHandler = useCallback(async () => {
    const files = photos.map(photo => new File([photo.data], photo.name));
    onUpload(files);
    // fetch specific activity media
    // return s3 images paths
  }, [photos, onUpload]);

  function onWillDismiss(ev: CustomEvent<OverlayEventDetail>) {
    deletePhotoHandler();
    if (ev.detail.role === 'confirm') {
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
          {(photos.length === 0 || isMultiUpload) && (
            <IonItem>
              <IonToolbar color="primary">
                <IonButton fill="clear" expand="full" color="light" onClick={selectPhotoHandler}>
                  <IonIcon icon={cameraOutline}></IonIcon>
                  {isMultiUpload ? 'Select Activity Photo' : 'Select A Cover Photo'}
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
