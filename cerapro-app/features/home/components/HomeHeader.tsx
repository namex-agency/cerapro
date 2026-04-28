import { Bell, User } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/shared/theme/colors';

type Props = {
  onPressProfile?: () => void;
  onPressNotifications?: () => void;
  unreadNotificationsCount?: number;
};

export function HomeHeader({
  onPressProfile,
  onPressNotifications,
  unreadNotificationsCount = 0,
}: Props) {
  const hasUnreadNotifications = unreadNotificationsCount > 0;
  const displayCount =
    unreadNotificationsCount > 99 ? '99+' : String(unreadNotificationsCount);

  return (
    <View style={styles.container}>
      <Pressable
        style={({ pressed }) => [
          styles.profileArea,
          pressed && styles.pressed,
        ]}
        onPress={onPressProfile}
        hitSlop={12}
        accessibilityRole="button"
        accessibilityLabel="Ouvrir le compte"
      >
        <User size={28} color={colors.primaryDark} strokeWidth={2.2} />

        <View style={styles.profileTextArea}>
          <Text style={styles.userName}>Eric Namo</Text>

          <View style={styles.kycBadge}>
            <Text style={styles.kycText}>Mise à jour KYC</Text>
          </View>
        </View>
      </Pressable>

      <Pressable
        style={({ pressed }) => [
          styles.notificationArea,
          pressed && styles.pressed,
        ]}
        onPress={onPressNotifications}
        hitSlop={12}
        accessibilityRole="button"
        accessibilityLabel={`Ouvrir les notifications. ${unreadNotificationsCount} notification(s) non lue(s).`}
      >
        <Bell size={29} color={colors.primaryDark} strokeWidth={2.2} />

        {hasUnreadNotifications ? (
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationBadgeText}>{displayCount}</Text>
          </View>
        ) : null}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 22,
    paddingTop: 54,
    paddingBottom: 18,
    backgroundColor: colors.background,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  profileArea: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },

  profileTextArea: {
    justifyContent: 'center',
  },

  userName: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.5,
    lineHeight: 30,
  },

  kycBadge: {
    marginTop: 6,
    alignSelf: 'flex-start',
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 13,
    paddingVertical: 5,
    borderRadius: 999,
  },

  kycText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primaryDark,
  },

  notificationArea: {
    position: 'relative',
    padding: 4,
  },

  notificationBadge: {
    position: 'absolute',
    top: -4,
    right: -8,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
    borderWidth: 2,
    borderColor: colors.background,
  },

  notificationBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
    lineHeight: 12,
  },

  pressed: {
    opacity: 0.6,
  },
});