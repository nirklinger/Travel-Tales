import { useState, useEffect, useCallback } from 'react';
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
import TripCard from '../../TripCard';

interface UserProfilePageProps {
  session: any;
}

const UserProfilePage: React.FC<UserProfilePageProps> = ({ session }) => {
  const [edit, setEdit] = useState(false);
  const router = useIonRouter();
  const [userTales, setUserTales] = useState<Tale[]>([]);
  const [validatedUser, setValidatedUser] = useState<Users>(null);
  const defaultAvatarImage = '/Users/default.svg';

  useEffect(() => {
    const validateUserData = async () => {
      const res = await fetchUserByExternalId(session.profile.sub);
      const user = await res.json();
      setValidatedUser(user);
    }

    const fetchUserTales = async () => {
      if (validatedUser) {
        const fetchedUserTales = await fetchUserTalesById(validatedUser.user_id);
        setUserTales(fetchedUserTales);
      }
    }

    validateUserData();
    fetchUserTales();
  }, [session.profile.sub, validatedUser.user_id]);


  const selectTale = useCallback((id: number) => {
    router.push(`/tabs/tale/${id}`);
  }, []);

  const updateUserProfile = useCallback(
    debounce(changes => updateProfile(validatedUser.user_id, changes), 2000),
    [validatedUser?.user_id]);

  const handleUserNameChange = useCallback(
    e => {
      if (validatedUser) {
        const newUserState = {...validatedUser, name: e.detail.value};
        setValidatedUser(newUserState);
        updateUserProfile({name: e.detail.value});
      }
    },
    [validatedUser, setValidatedUser, updateUserProfile]
  );



  const userNameField = edit ? (
    <div>
      <IonInput placeholder="enter your username" onIonChange={handleUserNameChange} value={validatedUser.name}/>
    </div>
  ) : (
    <div>
      {validatedUser?.name}
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
