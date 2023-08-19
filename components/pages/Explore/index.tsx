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
import { useCallback, useEffect, useMemo, useState } from 'react';
import { notificationsOutline } from 'ionicons/icons';
import TripCard from '../../ui/TripCard';
import { useRecoilRefresher_UNSTABLE, useRecoilState, useRecoilValue } from 'recoil';
import { shouldResetTalesState, tales } from '../../../states/explore';
import { useIonRouter } from '@ionic/react';
import { debounce } from 'lodash';
import { search } from '../../../managers/tales-manager';
import Image from 'next/image';
import ProfileWidget from '../Profile/ProfileWidget';

const Explore = () => {
  const [shouldResetTales, setShouldResetTales] = useRecoilState(shouldResetTalesState);
  const resetTales = useRecoilRefresher_UNSTABLE(tales);
  const tripList = useRecoilValue(tales);
  const [searchedTales, setSearchedTales] = useState<number[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchText, setSearchText] = useState('');
  const router = useIonRouter();
  const isMyPathname = router.routeInfo.pathname === '/tabs/explore';

  useEffect(() => {
    if (shouldResetTales && isMyPathname) {
      resetTales();
      setShouldResetTales(false);
    }
  }, [shouldResetTales, setShouldResetTales, isMyPathname, resetTales]);

  const searchActivities = useCallback(
    debounce(async searchText => {
      const tales = await search(searchText);
      setSearchedTales(tales);
    }, 2000),
    [setSearchedTales]
  );

  const handleSearchChange = useCallback(
    e => {
      const search = e.detail.value || '';
      setSearchText(search);
      if (!search) {
        setSearchedTales([]);
        return;
      }
      searchActivities(search);
    },
    [setSearchText, searchActivities, setSearchedTales]
  );

  const selectTale = useCallback((id: number) => {
    router.push(`/tabs/tale/${id}`);
  }, []);

  const talesToPresent = useMemo(() => {
    return searchedTales.length && searchText.length
      ? tripList.filter(tale => searchedTales.includes(tale.trip_id))
      : tripList;
  }, [searchText, searchedTales, tripList]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Explore</IonTitle>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <ProfileWidget />
          {/*<IonButtons slot="end">*/}
          {/*  <IonButton onClick={() => setShowNotifications(true)}>*/}
          {/*    <IonIcon icon={notificationsOutline} />*/}
          {/*  </IonButton>*/}
          {/*</IonButtons>*/}
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
            onIonChange={handleSearchChange}
            value={searchText}
            placeholder="Where you wanna go?"
          ></IonInput>
        </IonItem>
        <div className="grid grid-flow-row gap-8 text-neutral-600 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {talesToPresent.map((tale, index) => (
            <TripCard {...tale} key={index} onClick={() => selectTale(tale.trip_id)} />
          ))}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Explore;
