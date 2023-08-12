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
import { useRecoilValue, useSetRecoilState } from 'recoil';
import {
  activitiesWithCategoriesSelector,
  categoriesSelector,
  focusOnActivity,
} from '../../../states/explore';
import { useIonRouter } from '@ionic/react';
import ActivitiesTape from '../../ui/ActivitiesTape';
import ActivityModal from './ActivityModal';
import { OverlayEventDetail } from '@ionic/core/components';
import { search } from '../../../managers/activity-manager';
import { debounce } from 'lodash';

const ThingsToDo = () => {
  const activities = useRecoilValue(activitiesWithCategoriesSelector);
  const categories = useRecoilValue(categoriesSelector);
  const [filteredActivities, setFilteredActivities] = useState<number[]>([]);
  const [presentActivity, setPresentActivity] = useState<number>();
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchText, setSearchText] = useState('');
  const setFocusOnActivity = useSetRecoilState(focusOnActivity);
  const router = useIonRouter();

  const onGoToStory = useCallback(
    (taleId: number, activityId: number) => {
      setFocusOnActivity(activityId);
      router.push(`/tabs/tale/${taleId}`);
    },
    [setFocusOnActivity]
  );

  const [present, dismiss] = useIonModal(ActivityModal, {
    id: 'activityModal',
    activity: activities.find(act => act.id === presentActivity),
    onDismiss: (data: number, role: string) => dismiss(data, role),
  });

  const filterActivities = useCallback(
    debounce(async searchText => {
      const activitiesIds = await search(searchText);
      setFilteredActivities(activitiesIds);
    }, 2000),
    [setFilteredActivities]
  );

  const handleSearchChange = useCallback(
    e => {
      const search = e.detail.value || '';
      setSearchText(search);
      if (!search) {
        setFilteredActivities([]);
        return;
      }
      filterActivities(search);
    },
    [setSearchText, filterActivities, setFilteredActivities]
  );

  const handleActivityClick = useCallback(
    (activityId: number) => {
      setPresentActivity(activityId);
      present({
        onDidDismiss: (ev: CustomEvent<OverlayEventDetail>) => {
          if (ev.detail.role === 'confirm') {
            onGoToStory(ev.detail.data, activityId);
          }
        },
      });
    },
    [present, setPresentActivity, onGoToStory]
  );

  const activitiesByCategoties = useMemo(
    () =>
      categories.map(category => {
        const categoryActivities = activities.filter(
          act =>
            (!filteredActivities.length ||
              !searchText.length ||
              filteredActivities.includes(act.id)) &&
            act.categories.includes(category.id)
        );
        return (
          <div key={category.id}>
            <h2>{category.name}</h2>
            <ActivitiesTape activities={categoryActivities} onActivityClick={handleActivityClick} />
          </div>
        );
      }),
    [activities, categories, filteredActivities, searchText]
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
            onIonChange={handleSearchChange}
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
