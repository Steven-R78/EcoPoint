import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LoginScreen } from './src/presentation/views/login/Login';
import { RegisterScreen } from './src/presentation/views/register/Register';
import { CitizenTabs } from './src/presentation/navigator/CitizenTabs';
import { PointDetailScreen } from './src/presentation/views/points/detail/PointDetail';
import { CameraCaptureScreen } from './src/presentation/views/camera/CameraCapture';
import { PersonalInfoScreen } from './src/presentation/views/profile/info/PersonalInfo';
import { AdminUsersScreen } from './src/presentation/views/admin/users/AdminUsers';
import { UserDetailScreen } from './src/presentation/views/admin/users/detail/UserDetail';
import { AdminCreateUserScreen } from './src/presentation/views/admin/users/create/CreateUser';
import { AdminEditUserScreen } from './src/presentation/views/admin/users/edit/EditUser';
import {
  AdminCreatePointScreen,
  AdminEditPointScreen,
} from './src/presentation/views/admin/points/PointForm';
import { RoleModeProvider } from './src/presentation/hooks/RoleModeContext';
import { RootStackParamList } from './src/presentation/navigator/types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <SafeAreaProvider>
      <RoleModeProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="LoginScreen">
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
            <Stack.Screen
              name="RegisterScreen"
              component={RegisterScreen}
              options={{ headerShown: false, title: 'Registro' }}
            />
            <Stack.Screen name="CitizenScreen" component={CitizenTabs} />
            <Stack.Screen name="PointDetailScreen" component={PointDetailScreen} />
            <Stack.Screen name="CameraCaptureScreen" component={CameraCaptureScreen} />
            <Stack.Screen name="PersonalInfoScreen" component={PersonalInfoScreen} />
            <Stack.Screen name="AdminUsersScreen" component={AdminUsersScreen} />
            <Stack.Screen name="UserDetailScreen" component={UserDetailScreen} />
            <Stack.Screen name="AdminCreateUserScreen" component={AdminCreateUserScreen} />
            <Stack.Screen name="AdminEditUserScreen" component={AdminEditUserScreen} />
            <Stack.Screen name="AdminCreatePointScreen" component={AdminCreatePointScreen} />
            <Stack.Screen name="AdminEditPointScreen" component={AdminEditPointScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </RoleModeProvider>
    </SafeAreaProvider>
  );
};

export default App;
