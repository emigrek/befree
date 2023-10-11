import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useLayoutEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';

import { Loading } from '@/components/screens/Loading';
import {
  AbsenceIndicator,
  GoalProgress,
  Image,
} from '@/components/ui/Addiction';
import { useAbsenceTime } from '@/hooks/addiction/useAbsenceTime';
import { useAddiction } from '@/hooks/addiction/useAddiction';
import { useLastRelapse } from '@/hooks/addiction/useLastRelapse';
import i18n from '@/i18n';
import {
  AddictionScreenProps,
  ModalStackNavigationProp,
} from '@/navigation/types';
import { relapseAddiction, removeAddiction } from '@/services/firestore';
import { useAuthStore, useGlobalStore } from '@/store';
import { useTheme } from '@/theme';

interface AddictionProps {
  addiction: Addiction;
}

const Addiction: React.FC<AddictionProps> = ({ addiction }) => {
  const { id } = addiction;
  const user = useAuthStore(state => state.user);
  const { colors } = useTheme();
  const navigation = useNavigation<ModalStackNavigationProp>();
  const lastRelapse = useLastRelapse({ addiction });
  const { absenceTime } = useAbsenceTime({ addiction });
  const { storeAddRelapse, storeRemoveRelapse, storeAdd, storeRemove } =
    useGlobalStore(state => ({
      storeAddRelapse: state.addRelapse,
      storeRemoveRelapse: state.removeRelapse,
      storeAdd: state.add,
      storeRemove: state.remove,
    }));

  useLayoutEffect(() => {
    if (!addiction) return;
    navigation.setOptions({
      title: addiction.name,
    });
  }, [addiction, navigation]);

  const handleRelapse = useCallback(() => {
    if (!user) return;
    const date = new Date();

    storeAddRelapse(addiction.id, date);
    relapseAddiction({
      user,
      addiction,
    }).catch(() => {
      storeRemoveRelapse(addiction.id, date);
    });
  }, [user, addiction, storeAddRelapse, storeRemoveRelapse]);

  const handleRemove = useCallback(() => {
    if (!user) return;

    navigation.navigate('BottomTabs', { screen: 'Addictions' });

    storeRemove(id);
    removeAddiction({
      user,
      id,
    }).catch(() => {
      storeAdd(addiction);
    });
  }, [user, id, storeRemove, storeAdd, addiction, navigation]);

  return (
    <View style={style.container}>
      <View style={style.imageNameContainer}>
        <Image image={addiction.image} name={addiction.name} size={200} />
        <View style={style.progress}>
          <Text variant="titleMedium">{i18n.t(['labels', 'freeFor'])}</Text>
          <AbsenceIndicator
            absenceTime={absenceTime}
            style={{ fontSize: 40, color: colors.primary }}
          />
          <GoalProgress absenceTime={absenceTime} lastRelapse={lastRelapse} />
        </View>
      </View>
      <View style={style.buttonContainer}>
        <Button
          style={style.button}
          contentStyle={style.buttonContent}
          mode="contained"
          icon="restart"
          onPress={handleRelapse}
        >
          {i18n.t(['labels', 'relapse'])}
        </Button>
        <Button
          style={style.button}
          contentStyle={style.buttonContent}
          mode="contained-tonal"
          icon="trash-can"
          onPress={handleRemove}
        >
          {i18n.t(['labels', 'remove'])}
        </Button>
      </View>
    </View>
  );
};

const AddictionScreen: React.FC<AddictionScreenProps> = ({ route }) => {
  const { id } = route.params;
  const addiction = useAddiction({ id });

  if (!addiction) {
    return <Loading />;
  }

  return <Addiction addiction={addiction} />;
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 30,
    gap: 40,
  },
  imageNameContainer: {
    marginTop: 15,
    alignItems: 'center',
    gap: 30,
  },
  button: {
    flex: 1,
  },
  buttonContent: {
    height: 50,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    gap: 20,
  },
  progress: {
    alignItems: 'center',
    gap: 5,
  },
});

export { AddictionScreen };
