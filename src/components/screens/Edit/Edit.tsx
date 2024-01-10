import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import * as Network from 'expo-network';
import React, { FC, useCallback, useLayoutEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { Appbar, Button } from 'react-native-paper';

import { Loading } from '../Loading';

import { ImageUploading } from '@/components/screens/CreationWizard';
import { Addiction } from '@/components/ui/Addiction';
import { ControlledTextInput } from '@/components/ui/ControlledTextInput';
import { useAddiction } from '@/hooks/addiction/useAddiction';
import i18n from '@/i18n';
import { EditScreenProps, ModalStackNavigationProp } from '@/navigation/types';
import { editAddiction } from '@/services/queries';
import { addictionImageRef } from '@/services/refs/image';
import { useImageUpload } from '@/services/storage';
import { useAuthStore, useGlobalStore, useNetInfoStore } from '@/store';
import { useTheme } from '@/theme';
import { NameSchema, Name as NameType } from '@/validation/name.schema';

interface EditProps {
  addiction: Addiction;
}

const Edit: FC<EditProps> = ({ addiction }) => {
  const { colors } = useTheme();
  const user = useAuthStore(state => state.user);
  const { upload, task, uploadProgress } = useImageUpload();
  const navigation = useNavigation<ModalStackNavigationProp>();
  const netState = useNetInfoStore(state => state.netState);
  const setOfflineAcknowledged = useGlobalStore(
    state => state.setOfflineAcknowledged,
  );

  const { control, watch, formState } = useForm<NameType>({
    defaultValues: {
      name: addiction.name,
    },
    mode: 'all',
    resolver: zodResolver(NameSchema),
  });
  const name = watch('name');
  const [image, setImage] = useState<string | null>(addiction.image);
  const [saving, setSaving] = useState<boolean>(false);

  const handleImageChange = async () => {
    if (!netState?.isConnected) return setOfflineAcknowledged(false);

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (result.canceled) return;

    setImage(result.assets[0].uri);
  };

  const handleImageRemove = () => {
    if (!netState?.isConnected) return setOfflineAcknowledged(true);

    setImage(null);
  };

  const handleSave = useCallback(async () => {
    if (!user) return;

    const imageChanged = image !== addiction.image;
    const nameChanged = name !== addiction.name;
    const { isInternetReachable } = await Network.getNetworkStateAsync();

    if (
      (!imageChanged && !nameChanged) ||
      (imageChanged && !nameChanged && !isInternetReachable)
    ) {
      navigation.navigate('Addiction', {
        id: addiction.id,
      });
      return;
    }

    setSaving(true);

    const newImage =
      imageChanged && image
        ? await upload(`users/${user.uid}/addictions/${addiction.id}`, image)
        : null;

    if (!newImage && imageChanged && isInternetReachable) {
      try {
        await addictionImageRef(user.uid, addiction.id).delete();
      } catch (error) {
        console.log('Cant delete image: ', error);
      }
    }

    const newAddiction = {
      name,
      image: newImage,
    };

    editAddiction({
      user,
      id: addiction.id,
      addiction: newAddiction,
    });

    setSaving(false);
    navigation.navigate('Addiction', {
      id: addiction.id,
    });
  }, [user, addiction, name, image, upload, navigation]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: addiction.name,
      headerRight: () => (
        <Appbar.Action
          color={colors.primary}
          icon="check"
          onPress={handleSave}
          disabled={saving || !formState.isValid}
        />
      ),
    });
  }, [
    navigation,
    addiction,
    handleSave,
    saving,
    formState.isValid,
    colors.primary,
  ]);

  if (task) {
    return (
      <ImageUploading
        label={i18n.t(['modals', 'edit', 'editing'])}
        progress={uploadProgress}
      />
    );
  }

  if (saving) {
    return <Loading />;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={style.screen}
    >
      <View style={style.innerContainer}>
        <Addiction.Image name={addiction.name} image={image} size={200} full />
        <View style={style.buttonContainer}>
          <Button onPress={handleImageChange} disabled={!netState?.isConnected}>
            {i18n.t(['modals', 'edit', 'changeImage'])}
          </Button>
          {image && (
            <Button
              onPress={handleImageRemove}
              disabled={!netState?.isConnected}
            >
              {i18n.t(['modals', 'edit', 'removeImage'])}
            </Button>
          )}
        </View>
        <ControlledTextInput
          control={control}
          name="name"
          label={i18n.t(['labels', 'name'])}
          defaultValue={addiction.name}
          style={style.input}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

const EditScreen: React.FC<EditScreenProps> = ({ route }) => {
  const { id } = route.params;
  const addiction = useAddiction({ id });

  if (!addiction) {
    return <Loading />;
  }

  return <Edit addiction={addiction} />;
};

const style = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 50,
    paddingHorizontal: 50,
  },
  input: {
    width: '100%',
  },
  innerContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 15,
    marginBottom: 160,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 5,
  },
});

export { EditScreen };
