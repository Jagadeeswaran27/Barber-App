import { IonContent, IonRefresher, IonRefresherContent } from '@ionic/react';

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
}

export function PullToRefresh({ onRefresh, children }: PullToRefreshProps) {
  return (
    <IonContent className="ion-no-padding">
      <IonRefresher slot="fixed" onIonRefresh={async (e) => {
        await onRefresh();
        e.detail.complete();
      }}>
        <IonRefresherContent />
      </IonRefresher>
      {children}
    </IonContent>
  );
}