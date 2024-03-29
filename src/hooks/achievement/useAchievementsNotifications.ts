import { TriggerNotification } from '@notifee/react-native';
import { useMemo } from 'react';

import { useAddictions } from '@/hooks/addiction';
import { useTriggerNotificationsStore } from '@/store';
import { Addiction } from '@/structures';

interface UseAchievementsNotificationsProps {
  hidden?: boolean;
}

export interface AchievementNotifications {
  addiction: Addiction;
  notifications: TriggerNotification[];
}

export const useAchievementsNotifications = ({
  hidden,
}: UseAchievementsNotificationsProps) => {
  const triggerNotifications = useTriggerNotificationsStore(
    state => state.triggerNotifications,
  );
  const { addictions } = useAddictions({ hidden });

  return useMemo(() => {
    return addictions.map(addiction => {
      const notifications = triggerNotifications.filter(
        triggerNotification =>
          triggerNotification.notification?.data?.addictionId === addiction.id,
      );
      return {
        addiction,
        notifications,
      };
    });
  }, [addictions, triggerNotifications]);
};
