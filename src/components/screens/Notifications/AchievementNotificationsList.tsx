import { TriggerNotification } from '@notifee/react-native';
import React, { FC, useCallback } from 'react';
import { FlatList } from 'react-native-gesture-handler';
import { Divider } from 'react-native-paper';

import { AchievementNotification } from './AchievementNotification';

import { AchievementNotifications } from '@/hooks/achievement';
import { Addiction } from '@/structures';

interface AchievementNotificationsListProps {
  notifications: AchievementNotifications[];
}

const AchievementNotificationsList: FC<AchievementNotificationsListProps> = ({
  notifications,
}) => {
  const renderItem = useCallback(
    ({
      item,
    }: {
      item: {
        addiction: Addiction;
        notifications: TriggerNotification[];
      };
    }) => <AchievementNotification {...item} />,
    [],
  );

  const renderDivider = useCallback(() => <Divider />, []);

  return (
    <FlatList
      data={notifications}
      ItemSeparatorComponent={renderDivider}
      renderItem={renderItem}
      keyExtractor={item => item.addiction.id}
    />
  );
};

export { AchievementNotificationsList };
