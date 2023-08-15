import { useState, useEffect, useCallback, SetStateAction, Dispatch } from 'react';
import {
  IonButton,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonInput,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from '@ionic/react';
import { signOut } from 'next-auth/react';
import Image from 'next/image';
import { debounce } from 'lodash';

import Card from '../../ui/Card';
import { Users } from '../../../types/db-schema-definitions';
import { Tale } from '../../../types/types';
import { fetchUserTalesById, fetchUserByExternalId, updateProfile } from '../../../managers/user-manager';
import TripCard from '../../ui/TripCard';
import { Session } from 'next-auth';

interface UserProfilePageProps {
  session: Session;
}

const UserProfilePage: React.FC<UserProfilePageProps> = ({session}) => {
  const [userName, setUserName] = useState(`${session.profile.first_name} ${session.profile.last_name}`)
  const [edit, setEdit] = useState(false);
  const router = useIonRouter();
  const [userTales, setUserTales] = useState<Tale[]>([]);
  const defaultAvatarImage = '/Users/default.svg';

  useEffect(() => {
    const fetchUserTales = async () => {
      const fetchedUserTales = await fetchUserTalesById(session.profile.user_id);
      setUserTales(fetchedUserTales);
    }

    fetchUserTales();
  }, [session.profile.user_id]);


  const selectTale = useCallback((id: number) => {
    router.push(`/tabs/tale/${id}`);
  }, []);

  const updateUserProfile = useCallback(
    debounce(changes => updateProfile(session.profile.user_id, changes), 2000),
    [session.profile?.user_id]);

  const handleUserNameChange = useCallback(
    e => {
      const partsOfName = e.detail.value.trim().split(' ');
      const firstName = partsOfName[0];
      const lastName = partsOfName.slice(1).join(' ');
      setUserName(e.detail.value)
      updateUserProfile({ first_name: firstName, last_name: lastName });
    },
    [updateUserProfile]
  );



  const userNameField = edit ? (
    <div>
      <IonInput placeholder="enter your username" onIonChange={handleUserNameChange} value={userName}/>
    </div>
  ) : (
    <div>
      {`${userName}`}
    </div>
  );

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
              onClick={()=>{}}
            />
          </div>
          <IonCardHeader>
            <IonCardTitle>{userNameField}</IonCardTitle>
            <IonCardSubtitle>
              <IonButton onClick={() => setEdit(prevValue => !prevValue)} fill={'clear'}>{edit ? 'Done' : 'Edit Profile'}</IonButton>
              <IonButton onClick={() => signOut()} fill={'clear'}>Sign out</IonButton>
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

export default UserProfilePage;
