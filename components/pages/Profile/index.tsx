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
} from '@ionic/react';
import Notifications from '../Notifications';
import { useCallback, useEffect, useState } from 'react';
import { notificationsOutline } from 'ionicons/icons';
import { useIonRouter } from '@ionic/react';
import { useSession, signIn, signOut } from 'next-auth/react';

const Explore = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [sessionState, setSessionState] = useState<string>();
  const router = useIonRouter();
  const { data: session, status } = useSession();
  const UNAUTHENTICATED = 'unauthenticated';

  useEffect(() => {
    setSessionState(status);
  },[status]);

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
        {session ? (
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Welcome {session.user.name}!</IonCardTitle>
              
              <IonButton onClick={() => signOut()}>Sign out</IonButton>
            </IonCardHeader>
          </IonCard>
        ) : (
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Welcome!</IonCardTitle>
              <IonCardContent>Please sign in to access your Travel Tales profile!</IonCardContent>
              <IonButton onClick={() => signIn()}>Sign in</IonButton>
            </IonCardHeader>
          </IonCard>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Explore;
