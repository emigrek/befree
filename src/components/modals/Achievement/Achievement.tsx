import { format } from 'date-fns';
import { FC } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Portal, useTheme } from 'react-native-paper';
import { ZoomIn, ZoomOut } from 'react-native-reanimated';

import { Confetti, ConfettiVariant } from '@/components/animations';
import { LoadingScreen } from '@/components/screens';
import { AchievementModal } from '@/components/ui/AchievementModal';
import { useAddiction } from '@/hooks/addiction';
import i18n from '@/i18n';
import { AchievementScreenProps } from '@/navigation/types';
import { Addiction, Goals } from '@/structures';

interface AchievementProps {
  addiction: Addiction;
  goalType: Goals;
}

const Achievement: FC<AchievementProps> = ({ addiction, goalType }) => {
  const achievement = addiction.achievements.getAchievement(goalType);
  const { colors } = useTheme();

  if (!achievement) {
    return null;
  }

  return (
    <Portal>
      <View style={[style.container]}>
        <AchievementModal
          entering={ZoomIn.duration(600)}
          exiting={ZoomOut}
          style={{ backgroundColor: colors.elevation.level1 }}
        >
          <AchievementModal.Title>
            {i18n.t(['labels', 'freeFor'])}
          </AchievementModal.Title>
          <AchievementModal.Icon
            name={i18n.t(['goals', achievement.goal.goalType]).toUpperCase()}
            color={colors.primary}
            size={100}
            fontSize={15}
          />
          <AchievementModal.Name variant="headlineLarge">
            {addiction.name}
          </AchievementModal.Name>
          <AchievementModal.Date>
            {format(achievement.goal.goalAt, 'HH:mm, dd/MM/yyyy')}
          </AchievementModal.Date>
        </AchievementModal>
      </View>
      <Confetti
        variant={ConfettiVariant.ToTop}
        style={{
          position: 'absolute',
          width: Dimensions.get('screen').width,
          height: Dimensions.get('screen').height,
          pointerEvents: 'none',
          zIndex: 0,
        }}
        resizeMode="cover"
        loop={false}
        autoPlay
      />
    </Portal>
  );
};

const AchievementScreen: FC<AchievementScreenProps> = ({ route }) => {
  const { addictionId, goalType } = route.params;
  const addiction = useAddiction({ id: addictionId });

  if (!addiction) {
    return <LoadingScreen />;
  }

  return <Achievement addiction={addiction} goalType={goalType} />;
};

export { AchievementScreen };

const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
