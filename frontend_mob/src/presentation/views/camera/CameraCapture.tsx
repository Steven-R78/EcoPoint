import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigator/types';
import { CameraScreen } from './Camera';

interface Props extends NativeStackScreenProps<RootStackParamList, 'CameraCaptureScreen'> {}

export const CameraCaptureScreen = ({ navigation, route }: Props) => {
  return (
    <CameraScreen
      pointId={route.params?.pointId}
      onClose={() => navigation.goBack()}
    />
  );
};
