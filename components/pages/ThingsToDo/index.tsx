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
} from '@ionic/react';
import Notifications from '../Notifications';
import { useCallback, useState } from 'react';
import { notificationsOutline } from 'ionicons/icons';
import { useRecoilValue } from 'recoil';
import {
  activitiesWithCategoriesSelector,
  categoriesSelector,
  currentTale,
  tales,
} from '../../../states/explore';
import { useIonRouter } from '@ionic/react';
import { debounce } from 'lodash';
import parse from 'postgres-interval';
import { search } from '../../../managers/tales-manager';
import { Tale } from '../../../types/types';
import ActivityCard from '../../ui/ActivityCard';

const ThingsToDo = () => {
  const activities = useRecoilValue(activitiesWithCategoriesSelector);
  const categories = useRecoilValue(categoriesSelector);
  const [searchedTales, setSearchedTales] = useState<Tale[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchText, setSearchText] = useState('');
  const router = useIonRouter();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Things To Do</IonTitle>
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
            <IonTitle size="large">Explore</IonTitle>
          </IonToolbar>
        </IonHeader>
        <Notifications open={showNotifications} onDidDismiss={() => setShowNotifications(false)} />
        <IonItem>
          <IonInput
            onIonChange={() => {}}
            value={searchText}
            placeholder="Where you wanna go?"
          ></IonInput>
        </IonItem>
        <div className="grid grid-flow-row gap-8 text-neutral-600 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {activities.map(activity => (
            <ActivityCard key={activity.id} activity={activity} onClick={() => {}} />
          ))}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ThingsToDo;
