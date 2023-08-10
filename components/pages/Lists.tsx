import Store from '../../store';
import * as selectors from '../../store/selectors';
import { useRecoilValue } from 'recoil';
import { tales } from '../../states/explore';

import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonList,
  IonButton,
  useIonRouter,
} from '@ionic/react';

const TaleEntry = ({ tale, ...props }) => (
  <IonItem routerLink={`/tabs/tale/${tale.trip_id}`} className="list-entry">
    <IonLabel>{tale.title}</IonLabel>
  </IonItem>
);

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

const MyTales = () => {
  const router = useIonRouter();

  return (
    <IonPage>
      <IonHeader translucent={true}>
        <IonToolbar>
          <IonTitle>My Tales</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen={true}>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">My Tales</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonList>
          <AllTales onSelect={() => {}} />
        </IonList>
      </IonContent>
      <IonButton href={'/tabs/tale/create'}>Create New Tale</IonButton>
    </IonPage>
  );
};

export default MyTales;
