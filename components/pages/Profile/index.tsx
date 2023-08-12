import {
  IonItem,
  IonLabel,
} from '@ionic/react';
import { useSession } from 'next-auth/react';
import GuestProfilePage from './GuestProfilePage';
import UserProfilePage from './UserProfilePage';

const TaleEntry = ({ tale, ...props }) => (
  <IonItem routerLink={`/tabs/tale/${tale.trip_id}`} className="list-entry">
    <IonLabel>{tale.title}</IonLabel>
  </IonItem>
);

const Explore = () => {
  const { data: session, status } = useSession();

  return (
    <>
      {session ? <UserProfilePage session={session}/> : <GuestProfilePage />}
    </>
  );
};

export default Explore;
