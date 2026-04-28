import { useCallback, useState } from 'react';
import { useFocusEffect, useRouter } from 'expo-router';
import { StyleSheet } from 'react-native';
import { CeraproRefreshScreen } from '@/shared/layout/CeraproRefreshScreen';

import { HomeHeader } from '@/features/home/components/HomeHeader';
import { HomeKpiCard } from '@/features/home/components/HomeKpiCard';
import { getMe } from '@/shared/api/client';
import { colors } from '@/shared/theme/colors';
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

export default function HomeScreen() {
  const router = useRouter();
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);

  const loadUser = useCallback(async () => {
    try {
      const data = await getMe();
      setUnreadNotificationsCount(data.notificationsUnread ?? 0);
    } catch (error) {
      console.log('Erreur API:', error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadUser();
    }, [loadUser])
  );

  return (
    <CeraproRefreshScreen onRefresh={loadUser}>
      <HomeHeader
        onPressProfile={() => router.push('/account')}
        onPressNotifications={() => router.push('/notifications')}
        unreadNotificationsCount={unreadNotificationsCount}
      />

      <HomeKpiCard data={homeKpiData} />
    </CeraproRefreshScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});