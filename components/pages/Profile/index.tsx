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
} from '@ionic/react';
import Image from 'next/image';
import Notifications from '../Notifications';
import { useCallback, useEffect, useState } from 'react';
import { notificationsOutline } from 'ionicons/icons';
import { useIonRouter } from '@ionic/react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { CognitoIdentityProviderClient, UpdateUserAttributesCommand } from "@aws-sdk/client-cognito-identity-provider"; // ES Modules import
import Card from '../../ui/Card';

const Explore = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [sessionState, setSessionState] = useState<string>();
  const [avatarImage, setAvatarImage] = useState<string>();
  const [userAttributeData, setUserAttributeData] = useState<any>();
  const router = useIonRouter();
  const { data: session, status } = useSession();
  const UNAUTHENTICATED = 'unauthenticated';
  const AUTHENTICATED = 'authenticated';
  const defaultAvatarImage = 'https://ionicframework.com/docs/img/demos/avatar.svg';
  /********************************/ const monkeyImage =
    'https://media.npr.org/assets/img/2017/09/12/macaca_nigra_self-portrait-3e0070aa19a7fe36e802253048411a38f14a79f8-s1100-c50.jpg';
  const imageAttributeName = 'image';
  const client = new CognitoIdentityProviderClient({
    region: 'us-east-1',
  });


  useEffect(() => {
    console.log(session);
  }, []);

  useEffect(() => {
    setSessionState(status);
    if (status === AUTHENTICATED) {
      loadUserDataFromSession();
    }
  }, [status]);

  const loadUserDataFromSession = () => {
    const userPhoto = session.profile.image ? session.profile.image : defaultAvatarImage;
    setAvatarImage(defaultAvatarImage);
  };

  const updateUserProfilePhoto = () => {
    console.log('changing user profile photo');
    updateUserAttribute(imageAttributeName, monkeyImage);
  };

  const updateUserAttribute = async (attributeName: string, attributeData: string) => {
    const params = {
      AccessToken: session.accessToken,
      UserAttributes: [
        {
          Name: attributeName,
          Value: attributeData,
        },
      ],
    };
    console.log(params);
    const command = new UpdateUserAttributesCommand(params);
    const response = await client.send(command);
    console.log(response);
  };

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
