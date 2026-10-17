export type RootStackParamList = {
  LoginScreen: undefined;
  RegisterScreen: undefined;
  CitizenScreen: undefined;
  PointsScreen: undefined;
  ProfileScreen: undefined;
  PointDetailScreen: { pointId: number; distanceKm?: number | null };
  CameraCaptureScreen: { pointId?: number } | undefined;
  PersonalInfoScreen: undefined;
  AdminUsersScreen: undefined;
  UserDetailScreen: { userId: number };
  AdminCreateUserScreen: undefined;
  AdminEditUserScreen: { userId: number };
  AdminCreatePointScreen: undefined;
  AdminEditPointScreen: { pointId: number };
};

export type CitizenTab = 'points' | 'map' | 'users' | 'camera' | 'profile';
