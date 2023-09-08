import { FC } from 'react';
import { StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

import { Screen } from '@/components/Screen';
import { useAuthStore } from '@/store';

const Home: FC = () => {
  const { user } = useAuthStore(state => ({ user: state.user }));

  return (
    <Screen style={style.screen}>
      <Text variant={'titleLarge'}>{user?.displayName}</Text>
    </Screen>
  );
};

const style = StyleSheet.create({
  screen: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
});

export { Home };
