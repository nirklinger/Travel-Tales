import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonContent,
  IonMenuButton,
  IonItem,
  IonInput,
  IonCard,
  IonCardTitle,
  IonCardContent,
  IonCardHeader,
  IonAvatar,
  IonImg,
  IonCardSubtitle,
  IonLabel,
} from '@ionic/react';
import Image from 'next/image';
import Notifications from '../Notifications';
import { useCallback, useEffect, useState } from 'react';
import { notificationsOutline } from 'ionicons/icons';
import { useIonRouter } from '@ionic/react';
import { signOut } from 'next-auth/react';
import Card from '../../ui/Card';
import { useRecoilValue } from 'recoil';
import { tales } from '../../../states/explore';
import { Tale } from '../../../types/types';
import TripCard from '../../TripCard';


const TaleEntry = ({ tale, ...props }) => (
  <IonItem routerLink={`/tabs/tale/${tale.trip_id}`} className="list-entry">
    <IonLabel>{tale.title}</IonLabel>
  </IonItem>
);

interface UserProfilePageProps {
  session: any
}

const UserProfilePage: React.FC<UserProfilePageProps> = ({session}) => {
  const [userTales, setUserTales] = useState<Tale[]>([]);
  const tripList = useRecoilValue(tales);
  const [showNotifications, setShowNotifications] = useState(false);
  const [avatarImage, setAvatarImage] = useState<string>();
  const [userAttributeData, setUserAttributeData] = useState<any>();
  const [searchedTales, setSearchedTales] = useState<Tale[]>([]);
  const router = useIonRouter();
  const defaultAvatarImage = 'https://ionicframework.com/docs/img/demos/avatar.svg';
  /********************************/ const monkeyImage =
    'https://media.npr.org/assets/img/2017/09/12/macaca_nigra_self-portrait-3e0070aa19a7fe36e802253048411a38f14a79f8-s1100-c50.jpg';
  
  /*  const imageAttributeName = 'image';
  const client = new CognitoIdentityProviderClient({
    region: 'us-east-1',
  });

  useEffect(() => {
    console.log(session);
  }, []);

  */

  useEffect(() => {
    console.log(session);
    console.log(tripList);
  },[]);
 
  useEffect(() => {
    const loadUserDataFromSession = () => {
      const userPhoto = session.profile.image !== undefined ? session.profile.image : defaultAvatarImage;
      setAvatarImage(defaultAvatarImage);
     };

    loadUserDataFromSession();

  }, [session]);

  const selectTale = useCallback((id: number) => {
    router.push(`/tabs/tale/${id}`);
  }, []);

  const updateUserProfilePhoto = () => {
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Profile</IonTitle>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonButtons slot="end">
            <IonButton onClick={() => setShowNotifications(true)}>
              <IonIcon icon={notificationsOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding" fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Profile</IonTitle>
          </IonToolbar>
        </IonHeader>
        <Notifications open={showNotifications} onDidDismiss={() => setShowNotifications(false)} />
        <Card className="my-4 w-full mx-auto cursor-pointer">
          <div className="h-52 w-full relative">
            <Image
              className="rounded-t-xl object-cover min-w-full min-h-full max-w-full max-h-full"
              src={avatarImage}
              fill
              alt={` profile's picture`}
              onClick={updateUserProfilePhoto}
            />
          </div>
          <IonCardHeader>
            <IonCardTitle>{'ors'}</IonCardTitle>
            <IonCardSubtitle>
              <IonButton onClick={() => signOut()}>Sign out</IonButton>
            </IonCardSubtitle>
          </IonCardHeader>
        </Card>
        <IonButton href={'/tabs/tale/create'}>Create New Tale</IonButton>
        <IonTitle>My Tales:</IonTitle>

      </IonContent>
    </IonPage>
  );
};

export default UserProfilePage;
