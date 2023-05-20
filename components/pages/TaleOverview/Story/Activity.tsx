import {
  IonDatetime,
  IonDatetimeButton,
  IonIcon,
  IonInput,
  IonLabel,
  IonModal,
  IonTextarea,
  useIonAlert,
} from '@ionic/react';
import { parseDuration } from '../../../../utils/converters';
import PostgresInterval from 'postgres-interval';
import { timeOutline, trash } from 'ionicons/icons';
import ImageTape from '../../../ui/ImageTape';
import React, { useCallback, useState } from 'react';
import { ActivitiesWithMedia } from '../../../../types/types';
import parse from 'postgres-interval';
import { debounce } from 'lodash';
import { patchActivity } from '../../../../managers/activity-manager';
import ImageUpload from '../../../common/ImageUpload';

interface ActivityProps {
  activity: ActivitiesWithMedia;
  onDeleteActivity: () => void;
  canEdit: boolean;
}

export function Activity({ activity: activityReadonly, canEdit, onDeleteActivity }: ActivityProps) {
  const [activity, setActivity] = useState<ActivitiesWithMedia>(activityReadonly);
  const [presentAlert] = useIonAlert();

  const updateActivity = useCallback(
    debounce(changes => patchActivity(activity.id, changes), 2000),
    [activity.id]
  );

  const handleActivityTimeChange = useCallback(
    e => {
      const date = new Date(e.detail.value);
      const duration = parse(date.toTimeString().split(' ')[0]);
      setActivity({ ...activity, duration });
      updateActivity({ duration: duration.toPostgres() });
    },
    [setActivity, activity, updateActivity]
  );

  const handleActivityNameChange = useCallback(
    e => {
      setActivity({ ...activity, name: e.detail.value });
      updateActivity({ name: e.detail.value });
    },
    [setActivity, activity, updateActivity]
  );

  const handleActivityDescriptionChange = useCallback(
    e => {
      setActivity({ ...activity, description: e.detail.value });
      updateActivity({ description: e.detail.value });
    },
    [setActivity, activity, updateActivity]
  );

  const activityName = canEdit ? (
    <div className={'w-max-10'}>
      <IonInput
        className={'bg-blue-50'}
        placeholder="Enter activity name"
        onIonChange={handleActivityNameChange}
        value={activity.name}
      ></IonInput>
    </div>
  ) : (
    <IonLabel>{activity.name || '<Name missing>'}</IonLabel>
  );

  const duration = canEdit ? (
    // <IonDatetime presentation={'time'} minuteValues={[0, 15, 30, 45]} hourCycle={'h23'} />
    <>
      <IonDatetimeButton color={'tertiary'} datetime={`datetime-${activity.id}`}>
        <IonLabel slot={'time-target'}>
          {parseDuration(activity.duration as PostgresInterval.IPostgresInterval)}
        </IonLabel>
      </IonDatetimeButton>
      <IonIcon color={'tertiary'} icon={timeOutline} />

      <IonModal id="hour-pick" keepContentsMounted={true}>
        <div className={'w-80 flex flex-col items-stretch bg-purple-200'}>
          <h3 className={'mx-auto'}>Set Activity duration.</h3>
          <span className={'mx-auto pb-1'}>(Hours - Minutes)</span>
          <IonDatetime
            onIonChange={e => handleActivityTimeChange(e)}
            showDefaultButtons={true}
            id={`datetime-${activity.id}`}
            presentation={'time'}
            minuteValues={[0, 15, 30, 45]}
            hourCycle={'h23'}
          />
        </div>
      </IonModal>
    </>
  ) : (
    <>
      <IonLabel>{parseDuration(activity.duration as PostgresInterval.IPostgresInterval)}</IonLabel>
      <IonIcon color={'tertiary'} icon={timeOutline} />
    </>
  );

  return (
    <div
      className={
        'border border-gray-400 rounded-md bg-blue-50 lg:shadow-lg md:shadow-lg px-4 mx-2 py-4'
      }
      key={activity.id}
    >
      <div className={'flex flex-row gap-2 text-lg items-center font-medium'}>
        {canEdit && (
          <IonIcon
            onClick={() =>
              presentAlert({
                header: 'Delete Activity!',
                subHeader: 'Once Deleted, all activity media is deleted as well',
                message: 'Are you sure you want to delete Activity',
                buttons: [
                  {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {
                      // setHandlerMessage('Alert canceled');
                    },
                  },
                  {
                    text: 'Delete',
                    role: 'confirm',
                    handler: () => {
                      onDeleteActivity();
                    },
                  },
                ],
                onDidDismiss: (e: CustomEvent) => {
                  //setRoleMessage(`Dismissed with role: ${e.detail.role}`),
                },
              })
            }
            className={'cursor-pointer hover:shadow-lg'}
            color={'danger'}
            icon={trash}
          />
        )}
        {activityName}
        <div className={'flex flex-row gap-1 items-center'}>{duration}</div>
      </div>
      <div className={'mb-4'}>
        <IonTextarea
          onIonChange={handleActivityDescriptionChange}
          placeholder={'Share you experience here...'}
          color={canEdit ? 'purple' : ''}
          autoGrow={true}
          value={activity.description}
          readonly={!canEdit}
        ></IonTextarea>
      </div>
      <ImageTape media={activity.media} />
      {canEdit && <ImageUpload isMultiUpload={true} activityId={activity.id} />}
    </div>
  );
}
