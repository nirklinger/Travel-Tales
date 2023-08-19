import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { IonItem, useIonRouter } from '@ionic/react';
import { useState } from 'react';

export default function ProfileWidget() {
  const { data: session, status } = useSession();
  const router = useIonRouter();
  const src = session?.profile?.avatar_photo;

  if (status !== 'authenticated' || !src) return <></>;

  const userName = `${session.profile.first_name}`;

  const goToProfile = () => router.push(`/tabs/profile`);

  return (
    <IonItem slot="end">
      <div
        className={'flex flex-row gap-1 items items-center cursor-pointer'}
        onClick={goToProfile}
      >
        <span className={'text-lg font-semibold text-gray-600'}>{userName}</span>

        <div className="w-10 h-10 relative bottom-0">
          <Image
            src={src}
            className="rounded-full object-cover min-w-full min-h-full max-w-full max-h-full"
            fill
            alt=""
          />
        </div>
      </div>
    </IonItem>
  );
}
