import React, { useEffect, useState } from 'react';
import {
  IonCard,
  IonItem,
  IonLabel,
  IonInput,
  IonDatetimeButton,
  IonModal,
  IonDatetime,
  IonButton,
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { useIonRouter } from '@ionic/react';
import { useSession } from 'next-auth/react';

import Card from '../../ui/Card';
import { LocalFile, NewTrip } from '../../../types/types';
import { createTale } from '..//..//..//managers/tales-manager';

const REDIRECT_PATH = '/tabs/tale/';
const DEFAULT_USER_ID = 1;
const IMAGE_DIR = '';

const CreateTale = () => {
  const [tripName, setTripName] = useState('');
  const [isTripNameValid, setIsTripNameValid] = useState(false);
  const [catchphrase, setCatchphrase] = useState('');
  const [isCatchphraseValid, setIsCatchphraseValid] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [showStartDateModal, setShowStartDateModal] = useState(false);
  const [endDate, setEndDate] = useState(new Date());
  const [showEndDateModal, setShowEndDateModal] = useState(false);
  const [isDatesValid, setIsDatesValid] = useState(false);
  const [isFileSelected, setIsFileSelected] = useState(false);
  const [coverPhoto, setCoverPhoto] = useState<LocalFile>({ name: '', path: '', data: '' });
  const { data: session, status } = useSession();
  const router = useIonRouter();

  useEffect(() => {
    setIsFileSelected(false);
    if (coverPhoto.name !== '') {
      setIsFileSelected(true);
    }
  }, [coverPhoto.name]);

  const validateDates = useEffect(() => {
    const isDatesValid = endDate >= startDate;

    setIsDatesValid(isDatesValid);
  }, [startDate, endDate]);

  const tripNameChangeHandler = e => {
    const newTripName = e.target.value;

    setTripName(newTripName);
    setIsTripNameValid(newTripName.trim().length > 0);
  };

  const catchphraseChangeHandler = e => {
    const newCatchphraseName = e.target.value;

    setCatchphrase(newCatchphraseName);
    setIsCatchphraseValid(newCatchphraseName.trim().length > 0);
  };

  const startDateChangeHandler = e => {
    const newDate = e.target.value;

    setStartDate(new Date(newDate));
    setShowStartDateModal(false);
  };

  const endDateChangeHandler = e => {
    const newDate = e.target.value;

    setEndDate(new Date(newDate));
    setShowEndDateModal(false);
  };

  const createTaleHandler = async () => {
    if (isTripNameValid && isCatchphraseValid && isDatesValid) {
      console.log(session);
      const newTale: NewTrip = {
        title: tripName,
        catch_phrase: catchphrase,
        created_by: session.profile.user_id,
        start_date: startDate,
        end_date: endDate,
      };
      const newTaleId = await createTale(newTale);
      router.push(`${REDIRECT_PATH}${newTaleId}`, 'forward', 'replace');
    } else {
      console.log('not inserted - validation failed');
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tabs/tales" />
          </IonButtons>
          <IonTitle>{'Creating a New Tale'}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <Card className="my-4 mx-auto">
          <form>
            <IonCard className="my-4 mx-auto p-4 gap-6 flex flex-col">
              <IonItem className="lg:shadow-md md:shadow-md" fill="outline">
                <IonLabel position="floating">Trip Name</IonLabel>
                <IonInput
                  className="h-10"
                  placeholder="Enter Trip Name..."
                  id="tripName"
                  onIonChange={tripNameChangeHandler}
                  value={tripName}
                />
              </IonItem>
              <IonItem className="lg:shadow-lg md:shadow-lg" fill="outline">
                <IonLabel position="floating">Catchphrase</IonLabel>
                <IonInput
                  placeholder="Enter Catchphrase..."
                  id="catchphrase"
                  onIonChange={catchphraseChangeHandler}
                  value={catchphrase}
                />
              </IonItem>
              <IonItem>
                <IonLabel>Start Date</IonLabel>
                <IonDatetimeButton
                  datetime="startDatetime"
                  onClick={() => {
                    setShowStartDateModal(true);
                  }}
                ></IonDatetimeButton>
                <IonModal keepContentsMounted={true} isOpen={showStartDateModal}>
                  <IonDatetime
                    id="startDatetime"
                    presentation="date"
                    showDefaultButtons={true}
                    onIonChange={startDateChangeHandler}
                  ></IonDatetime>
                </IonModal>
              </IonItem>
              <IonItem>
                <IonLabel>End Date</IonLabel>
                <IonDatetimeButton
                  datetime="endDatetime"
                  onClick={() => {
                    setShowEndDateModal(true);
                  }}
                ></IonDatetimeButton>
                <IonModal keepContentsMounted={true} isOpen={showEndDateModal}>
                  <IonDatetime
                    id="endDatetime"
                    presentation="date"
                    showDefaultButtons={true}
                    onIonChange={endDateChangeHandler}
                  ></IonDatetime>
                </IonModal>
              </IonItem>
              <IonButton onClick={createTaleHandler}>Create Your Tale</IonButton>
            </IonCard>
          </form>
        </Card>
      </IonContent>
    </IonPage>
  );
};

export default CreateTale;
