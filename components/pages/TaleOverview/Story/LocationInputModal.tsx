import {
  InputChangeEventDetail,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonPage,
  IonRadio,
  IonRadioGroup,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { location as locationIcon } from 'ionicons/icons';
import React, { useEffect, useRef, useState } from 'react';
import { OverlayEventDetail } from '@ionic/core';
import { findAddress } from '../../../../managers/location-manager';
import { GeocodingFeature, GeocodingSearchResult } from '@maptiler/client';
import { debounce } from 'lodash';
import { ParsedDestination } from '../../../../types/types';

interface LocationInputModalProps {
  destination: ParsedDestination;
  onSaveNewLocation: (place: GeocodingFeature) => void;
}

export default function LocationInputModal({
  destination,
  onSaveNewLocation,
}: LocationInputModalProps) {
  const modalId = 'location-' + destination.id;
  const [places, setPlaces] = useState<GeocodingSearchResult>();
  const [choosenPlace, setChoosenPlace] = useState<GeocodingFeature>();
  const modal = useRef<HTMLIonModalElement>(null);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    setInputValue(destination?.geo_location?.place_name);
  }, []);

  async function handleDestinationLocationLookup(search: string) {
    if (search?.length) {
      const places = await findAddress(search);
      setPlaces(places);
    }
  }

  function onInputChange(e: CustomEvent<InputChangeEventDetail>) {
    const search = e.detail.value;
    setInputValue(search);
    handleDestinationLocationLookupDebounced(search);
  }

  const handleDestinationLocationLookupDebounced = debounce(
    search => handleDestinationLocationLookup(search),
    2000
  );

  function confirm() {
    modal.current?.dismiss(choosenPlace, 'confirm');
  }

  function onWillDismiss(ev: CustomEvent<OverlayEventDetail>) {
    if (ev.detail.role === 'confirm') {
      onSaveNewLocation(choosenPlace);
    }
  }

  function onPickPlace(e) {
    const placeId = e.detail.value;
    const place = places?.features?.find(place => place.id === placeId);
    setChoosenPlace(place);
  }

  return (
    <>
      <IonButton id={modalId} expand={'block'}>
        <IonIcon color={'light'} icon={locationIcon} />
      </IonButton>
      <IonModal ref={modal} trigger={modalId} onWillDismiss={ev => onWillDismiss(ev)}>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonButton onClick={() => modal.current?.dismiss()}>Cancel</IonButton>
            </IonButtons>
            <IonTitle>Destination Location Picker</IonTitle>
            <IonButtons slot="end">
              <IonButton strong={true} onClick={() => confirm()}>
                Confirm
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonItem>
            <IonLabel position="stacked">Enter place</IonLabel>
            <IonInput
              type="text"
              value={inputValue}
              placeholder="destination address"
              onIonChange={onInputChange}
            />
          </IonItem>
          {places?.features?.length && (
            <IonList>
              <IonRadioGroup onIonChange={onPickPlace}>
                {places.features.map(place => (
                  <IonItem key={place.id} className={'cursor-pointer'}>
                    <IonLabel>{place.place_name}</IonLabel>
                    <IonRadio slot="end" value={place.id}></IonRadio>
                  </IonItem>
                ))}
              </IonRadioGroup>
            </IonList>
          )}
        </IonContent>
      </IonModal>
    </>
  );
}
