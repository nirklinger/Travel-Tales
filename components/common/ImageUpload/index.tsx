import React, { useCallback, useRef } from 'react';
import {
  IonButtons,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonItem,
  IonButton,
  IonIcon,
  IonModal,
} from '@ionic/react';
import { close, cameraOutline, trash, cloudUpload } from 'ionicons/icons';
import { OverlayEventDetail } from '@ionic/core/components';
import { useEffect, useState } from 'react';
import { Camera, CameraResultType, CameraSource, GalleryPhoto, Photo } from '@capacitor/camera';
import { Filesystem } from '@capacitor/filesystem';
import { Directory } from '@capacitor/filesystem';
import { LocalFile } from '../../../types/types';
import Image from 'next/image';

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
    modal.current?.dismiss();
    // fetch specific activity media
    // return s3 images paths
  }, [photos, onUpload]);

  function onWillDismiss(ev: CustomEvent<OverlayEventDetail>) {
    deletePhotoHandler();
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
          <div
            className={
              isMultiUpload
                ? 'grid grid-flow-row gap-8 text-neutral-600 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 '
                : ''
            }
          >
            {photos.map(photo => {
              return (
                <div key={photo.name} className={isMultiUpload ? 'h-80 relative' : ''}>
                  <Image
                    className="w-min"
                    src={photo.data}
                    layout={'fill'}
                    objectFit={'contain'}
                    alt=""
                  />
                </div>
              );
            })}
          </div>
          {photos.length > 0 && (
            <div className={'flex flex-row justify-center gap-4 py-4'}>
              <IonButton onClick={deletePhotoHandler}>
                {isMultiUpload ? 'Clear All' : 'Clear'} <IonIcon icon={trash}></IonIcon>
              </IonButton>
              {isMultiUpload && (
                <IonButton onClick={selectPhotoHandler}>
                  <IonIcon icon={cameraOutline}></IonIcon>
                  Select More Photos
                </IonButton>
              )}
              <IonButton onClick={uploadPhotoHandler}>
                Upload <IonIcon icon={cloudUpload}></IonIcon>
              </IonButton>
            </div>
          )}
          {photos.length === 0 && (
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
