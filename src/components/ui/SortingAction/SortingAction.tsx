import { useNavigation } from '@react-navigation/native';
import { StyleSheet } from 'react-native';
import { Appbar } from 'react-native-paper';

import { ModalStackNavigationProp } from '@/navigation/types';

const SortingAction = () => {
  const navigation = useNavigation<ModalStackNavigationProp>();

  const handleActionPress = () => {
    navigation.navigate('Sorting');
  };

  return (
    <Appbar.Action
      style={style.action}
      icon={'sort'}
      onPress={handleActionPress}
    />
  );
};

const style = StyleSheet.create({
  action: {
    margin: 0,
  },
});

export { SortingAction };
