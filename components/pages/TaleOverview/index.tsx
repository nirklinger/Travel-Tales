import {
  IonButtons,
  IonContent,
  IonHeader,
  IonLabel,
  IonPage,
  IonSegment,
  IonSegmentButton,
  IonTitle,
  IonToolbar,
  IonBackButton,
  IonNavLink,
  IonItem,
  useIonRouter,
  IonButton,
} from '@ionic/react';
import { useSession } from 'next-auth/react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { currentTale, currentTaleIdState, currentTaleStory } from '../../../states/explore';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Story from './Story';
import Map from './Map';

enum Segments {
  viewOnMap = 'View on map',
  story = 'Story',
}

const TaleOverview = () => {
  const [edit, setEdit] = useState(false);
  const [currentTaleId, setCurrentTaleId] = useRecoilState(currentTaleIdState);
  const tale = useRecoilValue(currentTale);
  const [segment, setSegment] = useState<Segments>(Segments.story);
  let { taleId } = useParams();
  const { data: session, status } = useSession();


  useEffect(() => () => setCurrentTaleId(null), []);

  if (currentTaleId != taleId) setCurrentTaleId(Number(taleId));

  if (!tale) {
    return <div>no tail</div>;
  }

  const { title, catch_phrase, author, avatar_photo, cover_photo_url } = tale;
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tabs/explore"></IonBackButton>
          </IonButtons>
          <IonTitle className={'lg:text-center'}>{title + (edit ? ' (Edit Mode)' : '')}</IonTitle>
          {session && <IonButton fill={'clear'} slot={'end'} onClick={() => setEdit(!edit)}>
          {edit ? 'Done' : 'Edit'}
          </IonButton>}
        </IonToolbar>
      </IonHeader>
      <IonContent className={''}>
        {segment === Segments.story && (
          <img
            className="lg:h-96 lg:w-3/6 m-auto object-cover sm:h-full sm:w-48"
            src={cover_photo_url}
          />
        )}
        <div className={'w-full'}>
          <IonSegment
            onIonChange={event => setSegment(event.detail.value as Segments)}
            value={segment}
          >
            <IonSegmentButton value={Segments.story}>
              <IonLabel>{Segments.story}</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value={Segments.viewOnMap}>
              <IonLabel>{Segments.viewOnMap}</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </div>
        {segment === Segments.story && <Story isEditMode={edit} />}
        {segment === Segments.viewOnMap && <Map />}
      </IonContent>
    </IonPage>
  );
};

export default TaleOverview;
