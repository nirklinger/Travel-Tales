import { Redirect, Route } from 'react-router-dom';
import { IonRouterOutlet, IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/react';
import { cog, list, search, personCircleOutline, trailSign } from 'ionicons/icons';

import Lists from './Lists';
import MyTales from './MyTales';
import ListDetail from './ListDetail';
import Settings from './Settings';
import Explore from './Explore';
import { Suspense } from 'react';
import TaleOverview from './TaleOverview';
import CreateTale from './CreateTale';
import Profile from './Profile';
import ThingsToDo from './ThingsToDo';

const Tabs = () => {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route
          path="/tabs/things-to-do"
          render={() => (
            <Suspense>
              <ThingsToDo />
            </Suspense>
          )}
          exact={true}
        />
        <Route
          path="/tabs/explore"
          render={() => (
            <Suspense>
              <Explore />
            </Suspense>
          )}
          exact={true}
        />
        <Route
          path="/tabs/tale/:taleId"
          render={() => (
            <Suspense>
              <TaleOverview />
            </Suspense>
          )}
          exact={false}
        />
        <Route path="/tabs/tale/create" exact={true} render={() => <CreateTale />} />
        <Route
          path="/tabs/tales"
          render={() => (
            <Suspense>
              <MyTales />
            </Suspense>
          )}
          exact={true}
        />
        <Route path="/tabs/profile" render={() => <Profile />} exact={true} />
        <Route path="/tabs/tales/:listId" render={() => <ListDetail />} exact={true} />
        <Route path="/tabs/settings" render={() => <Settings />} exact={true} />
        <Route path="/tabs" render={() => <Redirect to="/tabs/explore" />} exact={true} />
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        <IonTabButton tab="tab1" href="/tabs/explore">
          <IonIcon icon={search} />
          <IonLabel>Explore</IonLabel>
        </IonTabButton>
        <IonTabButton tab="tab2" href="/tabs/things-to-do">
          <IonIcon icon={trailSign} />
          <IonLabel>Things to do</IonLabel>
        </IonTabButton>
        <IonTabButton tab="tab3" href="/tabs/tales">
          <IonIcon icon={list} />
          <IonLabel>My Tales</IonLabel>
        </IonTabButton>
        <IonTabButton tab="tab3" href="/tabs/profile">
          <IonIcon icon={personCircleOutline} />
          <IonLabel>Profile</IonLabel>
        </IonTabButton>
        <IonTabButton tab="tab4" href="/tabs/settings">
          <IonIcon icon={cog} />
          <IonLabel>Settings</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default Tabs;
