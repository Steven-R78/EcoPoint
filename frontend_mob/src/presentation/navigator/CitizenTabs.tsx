import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { NavigationProp } from '@react-navigation/native';
import { CitizenTabBar } from '../components/CitizenTabBar';
import { PointsScreen } from '../views/points/Points';
import { MapScreen } from '../views/map/Map';
import { CameraScreen } from '../views/camera/Camera';
import { ProfileInfoScreen } from '../views/profile/info/ProfileInfo';
import { AdminUsersScreen } from '../views/admin/users/AdminUsers';
import { useRoleMode } from '../hooks/RoleModeContext';
import { CitizenTab, RootStackParamList } from './types';

interface Props extends NativeStackScreenProps<RootStackParamList, 'CitizenScreen'> {}
type AppNav = NavigationProp<RootStackParamList>;

export const CitizenTabs = ({ navigation }: Props) => {
  const nav = navigation as unknown as AppNav;
  const [tab, setTab] = useState<CitizenTab>('points');
  const [mapAsking, setMapAsking] = useState(false);
  const { isAdminMode, refresh } = useRoleMode();

  useEffect(() => {
    refresh();
  }, []);

  useEffect(() => {
    if (isAdminMode && tab === 'map') setTab('users');
    if (!isAdminMode && tab === 'users') setTab('map');
    if (tab !== 'map') setMapAsking(false);
  }, [isAdminMode, tab]);

  return (
    <SafeAreaView
      style={styles.shell}
      edges={tab === 'camera' ? [] : ['top', 'left', 'right']}
    >
      <View style={styles.body}>
        {tab === 'points' && (
          <PointsScreen navigation={nav} onOpenProfile={() => setTab('profile')} />
        )}
        {tab === 'map' && !isAdminMode && (
          <MapScreen
            navigation={nav}
            onOpenProfile={() => setTab('profile')}
            onOpenList={() => setTab('points')}
            onAskingChange={setMapAsking}
          />
        )}
        {tab === 'users' && isAdminMode && <AdminUsersScreen navigation={nav} embedded />}
        {tab === 'camera' && (
          <CameraScreen onClose={() => setTab('points')} onAskingChange={setMapAsking} />
        )}
        {tab === 'profile' && <ProfileInfoScreen navigation={nav} />}
      </View>
      {!(mapAsking || tab === 'camera') && (
        <SafeAreaView edges={['bottom']} style={styles.tabSafe}>
          <CitizenTabBar tab={tab} onChange={setTab} isAdminMode={isAdminMode} />
        </SafeAreaView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  shell: { flex: 1, backgroundColor: '#fff' },
  body: { flex: 1, backgroundColor: '#FCFCFC' },
  tabSafe: { backgroundColor: '#fff' },
});
