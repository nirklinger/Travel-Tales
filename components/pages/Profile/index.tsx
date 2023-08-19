import { IonItem, IonLabel } from '@ionic/react';
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

  const isLoggedIn = status === 'authenticated' && session?.profile?.user_id;

  return <>{isLoggedIn ? <UserProfilePage session={session} /> : <GuestProfilePage />}</>;
};

export default Explore;
