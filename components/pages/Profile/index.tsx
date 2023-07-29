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
import { useSession, signIn, signOut } from 'next-auth/react';
import {
  CognitoIdentityProviderClient,
  UpdateUserAttributesCommand,
} from '@aws-sdk/client-cognito-identity-provider'; // ES Modules import
import Card from '../../ui/Card';
import { useRecoilValue } from 'recoil';
import { tales } from '../../../states/explore';
import GuestProfilePage from './GuestProfilePage';
import TempPage from './temp';

const TaleEntry = ({ tale, ...props }) => (
  <IonItem routerLink={`/tabs/tale/${tale.trip_id}`} className="list-entry">
    <IonLabel>{tale.title}</IonLabel>
  </IonItem>
);

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

  /*useEffect(() => {
    console.log(session);
  }, []);*/

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

  const AllTales = ({ onSelect }) => {
    const myTales = useRecoilValue(tales);
    return (
      <>
        {myTales.map((tale, i) => (
          <TaleEntry tale={tale} key={i} />
        ))}
      </>
    );
  };

  return (
    <>
      {session ? <TempPage session={session}/> : <GuestProfilePage />}
    </>
  );
};

export default Explore;
