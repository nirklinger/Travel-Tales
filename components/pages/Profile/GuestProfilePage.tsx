import { useState } from 'react';
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
  IonCard,
  IonCardTitle,
  IonCardContent,
  IonCardHeader,
  IonRouterLink,
} from '@ionic/react';
import Notifications from '../Notifications';
import { notificationsOutline } from 'ionicons/icons';
import { signIn } from 'next-auth/react';
import Image from 'next/image';
import Logo from '../../../public/img/Logo.png';

const GuestProfilePage = () => {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <div className={'flex flex-row'}>
            <IonRouterLink routerLink="/tabs/explore">
              <Image className="lg:h-20 lg:w-36 h-14 w-24" src={Logo} alt="Travel-Tales-Logo" />
            </IonRouterLink>
            <IonTitle>Profile</IonTitle>
          </div>
          <IonButtons slot="start">
            <IonMenuButton />
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
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Welcome!</IonCardTitle>
            <IonCardContent>Please sign in to access your Travel Tales profile!</IonCardContent>
            <IonButton onClick={() => signIn()}>Sign in</IonButton>
          </IonCardHeader>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default GuestProfilePage;
