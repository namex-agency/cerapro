import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useState } from 'react';
import { useFocusEffect, useRouter } from 'expo-router';

import { HomeHeader } from '@/features/home/components/HomeHeader';
import { HomeKpiCard } from '@/features/home/components/HomeKpiCard';
import { getMe } from '@/shared/api/client';
import { CeraproRefreshScreen } from '@/shared/layout/CeraproRefreshScreen';
import { HomeKpiData } from '@/shared/types/home.types';

const homeKpiData: HomeKpiData = {
  balance: 129760,
  margin: 41500,
  pv: 310,
  commissions: 19300,
  debts: 12000,
  contacts: 86,
  actionsToDo: 24,
};

function buildUserFullName(user: any) {
  const firstName = user?.firstName?.trim() ?? '';
  const lastName = user?.lastName?.trim() ?? '';
  const fullName = `${firstName} ${lastName}`.trim();

  return fullName || 'Longricheur';
}

export default function HomeScreen() {
  const router = useRouter();

  const [userName, setUserName] = useState('Longricheur');
  const [kycLabel, setKycLabel] = useState('Mise à jour KYC');
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);

  const loadUser = useCallback(async () => {
    try {
      const storedUser = await AsyncStorage.getItem('cerapro_user');

      if (storedUser) {
        const user = JSON.parse(storedUser);

        setUserName(buildUserFullName(user));
        setKycLabel(
          user?.isKycVerified ? 'KYC vérifié' : 'Mise à jour KYC',
        );
      }

      const data = await getMe();
      setUnreadNotificationsCount(data.notificationsUnread ?? 0);
    } catch (error) {
      console.log('Erreur API:', error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadUser();
    }, [loadUser]),
  );

  return (
    <CeraproRefreshScreen onRefresh={loadUser}>
      <HomeHeader
        userName={userName}
        kycLabel={kycLabel}
        onPressProfile={() => router.push('/account')}
        onPressNotifications={() => router.push('/notifications')}
        unreadNotificationsCount={unreadNotificationsCount}
      />

      <HomeKpiCard data={homeKpiData} />
    </CeraproRefreshScreen>
  );
}