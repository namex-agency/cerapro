import {
  BellRing,
  CalendarCheck,
  CheckCheck,
  ChevronLeft,
  CreditCard,
  Megaphone,
  PackageCheck,
} from 'lucide-react-native';
import { Stack, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { getNotifications, markNotificationAsRead } from '@/shared/api/client';
import { colors } from '@/shared/theme/colors';

type NotificationFilter = 'ALL' | 'UNREAD' | 'READ';

type NotificationSource =
  | 'SYSTEM'
  | 'ADMIN'
  | 'ORDER'
  | 'MINI_SITE_ORDER'
  | 'SALE'
  | 'PAYMENT'
  | 'WALLET'
  | 'WITHDRAWAL'
  | 'SUBSCRIPTION'
  | 'KYC'
  | 'PRODUCT'
  | 'CONTACT'
  | 'ACTION'
  | 'DEBT'
  | 'ACCOUNTING'
  | 'LONGRICH_MATIN'
  | 'COACH'
  | 'SECURITY';

type ApiNotification = {
  id: string;
  source: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  userId?: string;
  createdAt?: string;
};

type AppNotification = {
  id: string;
  source: NotificationSource;
  title: string;
  message: string;
  time: string;
  read: boolean;
  route?: string;
};

const notificationIcons = {
  SYSTEM: Megaphone,
  ADMIN: Megaphone,
  ORDER: PackageCheck,
  MINI_SITE_ORDER: PackageCheck,
  SALE: PackageCheck,
  PAYMENT: CreditCard,
  WALLET: CreditCard,
  WITHDRAWAL: CreditCard,
  SUBSCRIPTION: CreditCard,
  KYC: BellRing,
  PRODUCT: PackageCheck,
  CONTACT: BellRing,
  ACTION: CalendarCheck,
  DEBT: CreditCard,
  ACCOUNTING: CreditCard,
  LONGRICH_MATIN: BellRing,
  COACH: BellRing,
  SECURITY: BellRing,
};

const notificationRoutes: Partial<Record<NotificationSource, string>> = {
  SUBSCRIPTION: '/account-subscription',
  KYC: '/account-kyc',
  SECURITY: '/account-password',
};

function normalizeSource(source: string): NotificationSource {
  const allowedSources: NotificationSource[] = [
    'SYSTEM',
    'ADMIN',
    'ORDER',
    'MINI_SITE_ORDER',
    'SALE',
    'PAYMENT',
    'WALLET',
    'WITHDRAWAL',
    'SUBSCRIPTION',
    'KYC',
    'PRODUCT',
    'CONTACT',
    'ACTION',
    'DEBT',
    'ACCOUNTING',
    'LONGRICH_MATIN',
    'COACH',
    'SECURITY',
  ];

  return allowedSources.includes(source as NotificationSource)
    ? (source as NotificationSource)
    : 'SYSTEM';
}

function mapApiNotification(notification: ApiNotification): AppNotification {
  const source = normalizeSource(notification.source);

  return {
    id: notification.id,
    source,
    title: notification.title,
    message: notification.message,
    time: notification.time,
    read: notification.read,
    route: notificationRoutes[source],
  };
}

export default function NotificationsScreen() {
  const router = useRouter();

  const [filter, setFilter] = useState<NotificationFilter>('ALL');
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);

      const data: ApiNotification[] = await getNotifications();
      setNotifications(data.map(mapApiNotification));
    } catch (error) {
      console.log('Erreur chargement notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const unreadCount = notifications.filter((item) => !item.read).length;

  const filteredNotifications = useMemo(() => {
    if (filter === 'UNREAD') return notifications.filter((item) => !item.read);
    if (filter === 'READ') return notifications.filter((item) => item.read);
    return notifications;
  }, [filter, notifications]);

  const handleNotificationPress = async (notification: AppNotification) => {
    try {
      if (!notification.read) {
        const result = await markNotificationAsRead(notification.id);

        if (result?.success) {
          setNotifications((current) =>
            current.map((item) =>
              item.id === notification.id ? { ...item, read: true } : item
            )
          );
        }
      }

      if (notification.route) {
        router.push(notification.route as never);
      }
    } catch (error) {
      console.log('Erreur markAsRead:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const unreadItems = notifications.filter((item) => !item.read);

      for (const notification of unreadItems) {
        await markNotificationAsRead(notification.id);
      }

      setNotifications((current) =>
        current.map((item) => ({ ...item, read: true }))
      );
    } catch (error) {
      console.log('Erreur markAll:', error);
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.screen}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Pressable
              onPress={() => router.back()}
              style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
            >
              <ChevronLeft size={30} color={colors.primaryDark} strokeWidth={2.6} />
            </Pressable>

            <View style={styles.titleArea}>
              <Text style={styles.title}>Notifications</Text>
              <Text style={styles.subtitle}>
                {unreadCount} non lue{unreadCount > 1 ? 's' : ''}
              </Text>
            </View>

            <Pressable
              onPress={handleMarkAllAsRead}
              style={({ pressed }) => [styles.markAllButton, pressed && styles.pressed]}
            >
              <CheckCheck size={21} color={colors.primaryDark} strokeWidth={2.5} />
            </Pressable>
          </View>

          <View style={styles.filters}>
            <FilterButton label="Tous" count={notifications.length} active={filter === 'ALL'} onPress={() => setFilter('ALL')} />
            <FilterButton label="Non lus" count={unreadCount} active={filter === 'UNREAD'} onPress={() => setFilter('UNREAD')} />
            <FilterButton label="Lus" count={notifications.length - unreadCount} active={filter === 'READ'} onPress={() => setFilter('READ')} />
          </View>

          {loading ? (
            <View style={styles.loadingBox}>
              <ActivityIndicator size="large" color={colors.primaryDark} />
              <Text style={styles.loadingText}>Chargement des notifications...</Text>
            </View>
          ) : filteredNotifications.length > 0 ? (
            filteredNotifications.map((item) => (
              <NotificationItem
                key={item.id}
                notification={item}
                onPress={() => handleNotificationPress(item)}
              />
            ))
          ) : (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyTitle}>Aucune notification</Text>
              <Text style={styles.emptyText}>Les alertes apparaîtront ici.</Text>
            </View>
          )}
        </ScrollView>
      </View>
    </>
  );
}

function FilterButton({
  label,
  count,
  active,
  onPress,
}: {
  label: string;
  count: number;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.filterButton,
        active && styles.filterButtonActive,
        pressed && styles.pressed,
      ]}
    >
      <Text style={[styles.filterText, active && styles.filterTextActive]}>
        {label}
      </Text>

      <View style={[styles.filterCount, active && styles.filterCountActive]}>
        <Text style={[styles.filterCountText, active && styles.filterCountTextActive]}>
          {count}
        </Text>
      </View>
    </Pressable>
  );
}

function NotificationItem({
  notification,
  onPress,
}: {
  notification: AppNotification;
  onPress: () => void;
}) {
  const Icon = notificationIcons[notification.source] ?? BellRing;
  const isUnread = !notification.read;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.item,
        isUnread && styles.itemUnread,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.iconBox}>
        <Icon size={22} color={colors.primaryDark} strokeWidth={2.4} />
      </View>

      <View style={styles.itemText}>
        <View style={styles.itemTop}>
          <Text style={styles.itemTitle}>{notification.title}</Text>

          {isUnread && (
            <View style={styles.itemCounter}>
              <Text style={styles.itemCounterText}>1</Text>
            </View>
          )}
        </View>

        <Text style={styles.itemMessage}>{notification.message}</Text>

        <View style={styles.footerRow}>
          <Text style={styles.itemTime}>{notification.time}</Text>

          <Text style={styles.actionHint}>
            {isUnread ? 'Toucher pour lire' : 'Toucher pour ouvrir'}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 20, paddingTop: 54, paddingBottom: 38 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
  backButton: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center', marginRight: 8 },
  titleArea: { flex: 1 },
  title: { fontSize: 29, fontWeight: '900', color: colors.text },
  subtitle: { fontSize: 13, fontWeight: '700', color: colors.textMuted },
  markAllButton: { width: 46, height: 46, borderRadius: 16, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center' },
  filters: { flexDirection: 'row', gap: 9, marginBottom: 16 },
  filterButton: { flexDirection: 'row', alignItems: 'center', gap: 7, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 999, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  filterButtonActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  filterText: { fontSize: 13, fontWeight: '900', color: colors.textMuted },
  filterTextActive: { color: '#FFF' },
  filterCount: { minWidth: 22, height: 22, borderRadius: 11, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center' },
  filterCountActive: { backgroundColor: '#FFF' },
  filterCountText: { fontSize: 11, fontWeight: '900', color: colors.primaryDark },
  filterCountTextActive: { color: colors.primaryDark },
  loadingBox: { marginTop: 30, backgroundColor: colors.surface, borderRadius: 24, padding: 22, borderWidth: 1, borderColor: colors.border, alignItems: 'center' },
  loadingText: { marginTop: 10, fontSize: 13, fontWeight: '700', color: colors.textMuted },
  item: { backgroundColor: colors.surface, borderRadius: 22, padding: 15, marginBottom: 12, borderWidth: 1, borderColor: colors.border, flexDirection: 'row', gap: 13 },
  itemUnread: { borderColor: colors.primary, backgroundColor: colors.primaryLight },
  iconBox: { width: 44, height: 44, borderRadius: 15, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center' },
  itemText: { flex: 1 },
  itemTop: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  itemTitle: { flex: 1, fontSize: 15, fontWeight: '900', color: colors.text },
  itemCounter: { minWidth: 20, height: 20, borderRadius: 10, backgroundColor: colors.danger, alignItems: 'center', justifyContent: 'center' },
  itemCounterText: { color: '#FFF', fontSize: 10, fontWeight: '900' },
  itemMessage: { marginTop: 4, fontSize: 13, fontWeight: '700', color: colors.textMuted },
  footerRow: { marginTop: 8, flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  itemTime: { fontSize: 12, fontWeight: '800', color: colors.primaryDark },
  actionHint: { fontSize: 12, fontWeight: '800', color: colors.textMuted },
  emptyBox: { marginTop: 30, backgroundColor: colors.surface, borderRadius: 24, padding: 22, borderWidth: 1, borderColor: colors.border, alignItems: 'center' },
  emptyTitle: { fontSize: 18, fontWeight: '900', color: colors.text },
  emptyText: { fontSize: 13, fontWeight: '700', color: colors.textMuted },
  pressed: { opacity: 0.7 },
});