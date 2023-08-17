import {
  IonItem,
  IonLabel,
} from '@ionic/react';
import { useSession } from 'next-auth/react';
import GuestProfilePage from './GuestProfilePage';
import UserProfilePage from './UserProfilePage';
import { useEffect, useState } from 'react';
import { fetchUserByExternalId } from '../../../managers/user-manager';
import { Users } from '../../../types/db-schema-definitions';

const TaleEntry = ({ tale, ...props }) => (
  <IonItem routerLink={`/tabs/tale/${tale.trip_id}`} className="list-entry">
    <IonLabel>{tale.title}</IonLabel>
  </IonItem>
);

const Explore = () => {
  const [isUserValid, setIsUserValid] = useState(false);
  const { data: session, status } = useSession();
  const AUTHENTICATED = 'authenticated';
  
  useEffect(() => {
    const isUserLoggedIn = (status === AUTHENTICATED) && (session?.profile?.user_id !== undefined);
    setIsUserValid(isUserLoggedIn);
  },[session?.profile?.user_id]);


  return (
    <>
      {isUserValid ? <UserProfilePage session={session} /> : <GuestProfilePage />}
    </>
  );
};

export default Explore;
