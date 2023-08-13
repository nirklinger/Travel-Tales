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
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [validatedUser, setValidatedUser] = useState<Users>();
  const { data: session, status } = useSession();
  const AUTHENTICATED = 'authenticated';

  useEffect(() => {
    const validateUserData = async () => {
      const res = await fetchUserByExternalId(session.profile.sub);
      const user = await res.json();
      setValidatedUser(user);
      setIsUserLoggedIn(true);
    }

    if(status === AUTHENTICATED) {
      validateUserData();
    }
    else {
      setIsUserLoggedIn(false);
    }
  }, [status]);

  return (
    <>
      {isUserLoggedIn ? <UserProfilePage validatedUser={validatedUser} setValidatedUser={setValidatedUser}/> : <GuestProfilePage />}
    </>
  );
};

export default Explore;
