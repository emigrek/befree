import { useNavigation } from '@react-navigation/native';
import { FC, useLayoutEffect } from 'react';

import { SettingsList } from './SettingsList';
import { useSettings } from './useSettings';

import { Loading } from '@/components/screens/Loading';
import { useAddiction } from '@/hooks/addiction/useAddiction';
import {
  ModalStackNavigationProp,
  SettingsScreenProps,
} from '@/navigation/types';

interface SettingsProps {
  addiction: Addiction;
}

const Settings: FC<SettingsProps> = ({ addiction }) => {
  const settings = useSettings({ addiction });
  const navigation = useNavigation<ModalStackNavigationProp>();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: addiction.name,
    });
  }, [addiction, navigation]);

  return <SettingsList settings={settings} />;
};

const SettingsScreen: FC<SettingsScreenProps> = ({ route }) => {
  const { id } = route.params;
  const addiction = useAddiction({ id });

  if (!addiction) {
    return <Loading />;
  }

  return <Settings addiction={addiction} />;
};

export { SettingsScreen };