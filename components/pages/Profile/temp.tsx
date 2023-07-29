import { useState, useEffect, useCallback } from 'react';
import {
  IonButton,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from '@ionic/react';
import { signOut } from 'next-auth/react';
import Image from 'next/image';

import Card from '../../ui/Card';
import { Tale } from '../../../types/types';
import { fetchUserTalesById } from '../../../managers/user-manager';
import TripCard from '../../TripCard';

interface UserProfilePageProps {
  session: any;
}

const TempPage: React.FC<UserProfilePageProps> = ({ session }) => {
  const router = useIonRouter();
  const [userTales, setUserTales] = useState<Tale[]>([]);
  const defaultAvatarImage = 'https://ionicframework.com/docs/img/demos/avatar.svg';

  useEffect(() => {
    const fetchUserTales = async () => {
        const fetchedUserTales = await fetchUserTalesById(session.profile.sub);
        setUserTales(fetchedUserTales);
    }

    fetchUserTales();
  },[]);

  const selectTale = useCallback((id: number) => {
    router.push(`/tabs/tale/${id}`);
  }, []);

  const updateUserProfilePhoto = () => {};

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Profile</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <Card className="my-4 w-full mx-auto cursor-pointer">
          <div className="h-52 w-full relative">
            <Image
              className="rounded-t-xl object-cover min-w-full min-h-full max-w-full max-h-full"
              src={defaultAvatarImage}
              fill
              alt={` profile's picture`}
              onClick={updateUserProfilePhoto}
            />
          </div>
          <IonCardHeader>
            <IonCardTitle>{session.profile.name}</IonCardTitle>
            <IonCardSubtitle>
              <IonButton onClick={() => signOut()}>Sign out</IonButton>
            </IonCardSubtitle>
          </IonCardHeader>
        </Card>
        <div className="justify-center text-center	flex-col">
          <IonButton
            onClick={() => {
              router.push(`/tabs/tale/create`);
            }}
          >
            Create New Tale
          </IonButton>
          <IonTitle>Your Tales:</IonTitle>
        </div>
        {userTales.length > 0 ? <div className="grid grid-flow-row gap-8 text-neutral-600 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {userTales.map((tale, index) => (
            <TripCard {...tale} key={index} onClick={() => selectTale(tale.trip_id)} />
          ))}
        </div> : <p>No Tales To Show</p>}
        
      </IonContent>
    </IonPage>
  );
};

export default TempPage;
