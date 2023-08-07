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
  useIonModal,
} from '@ionic/react';
import Notifications from '../Notifications';
import { useCallback, useMemo, useState } from 'react';
import { notificationsOutline } from 'ionicons/icons';
import { useRecoilValue } from 'recoil';
import { activitiesWithCategoriesSelector, categoriesSelector } from '../../../states/explore';
import { useIonRouter } from '@ionic/react';
import { Tale } from '../../../types/types';
import ActivitiesTape from '../../ui/ActivitiesTape';
import ActivityModal from './ActivityModal';

const ThingsToDo = () => {
  const activities = useRecoilValue(activitiesWithCategoriesSelector);
  const categories = useRecoilValue(categoriesSelector);
  const [searchedTales, setSearchedTales] = useState<Tale[]>([]);
  const [presentActivity, setPresentActivity] = useState<number>();
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchText, setSearchText] = useState('');
  const router = useIonRouter();
  const [present, dismiss] = useIonModal(ActivityModal, {
    id: 'activityModal',
    activity: activities.find(act => act.id === presentActivity),
    onDismiss: (data: string, role: string) => dismiss(data, role),
  });

  const handleActivityClick = useCallback(
    (activityId: number) => {
      setPresentActivity(activityId);
      present();
    },
    [present, setPresentActivity]
  );

  const activitiesByCategoties = useMemo(
    () =>
      categories.map(category => {
        const categoryActivities = activities.filter(act => act.categories.includes(category.id));
        return (
          <div key={category.id}>
            <h2>{category.name}</h2>
            <ActivitiesTape activities={categoryActivities} onActivityClick={handleActivityClick} />
          </div>
        );
      }),
    [activities, categories]
  );

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
            <IonTitle size="large">Things To Do</IonTitle>
          </IonToolbar>
        </IonHeader>
        <Notifications open={showNotifications} onDidDismiss={() => setShowNotifications(false)} />
        <IonItem>
          <IonInput
            onIonChange={() => {}}
            value={searchText}
            placeholder="find your next activity!"
          ></IonInput>
        </IonItem>
        <div className="flex flex-col">{activitiesByCategoties}</div>
      </IonContent>
    </IonPage>
  );
};

export default ThingsToDo;
