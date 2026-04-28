import { CalendarDays, ChevronRight, WalletCards } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/shared/theme/colors';

type Props = {
  status: 'TRIAL' | 'ACTIVE' | 'EXPIRED';
  startDate: string;
  endDate: string;
  progress: number;
  onPress?: () => void;
};

export function AccountSubscriptionCard({
  status,
  startDate,
  endDate,
  progress,
  onPress,
}: Props) {
  const statusLabel =
    status === 'ACTIVE' ? 'Actif' : status === 'TRIAL' ? 'Essai gratuit' : 'Expiré';

  const safeProgress = Math.max(0, Math.min(progress, 100));

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.topRow}>
        <View style={styles.iconBox}>
          <WalletCards size={24} color="#FFFFFF" strokeWidth={2.4} />
        </View>

        <ChevronRight size={22} color="#DDFBFA" strokeWidth={2.5} />
      </View>

      <Text style={styles.label}>Abonnement CERAPRO</Text>
      <Text style={styles.status}>{statusLabel}</Text>

      <View style={styles.dateRow}>
        <CalendarDays size={16} color="#E7FFFF" strokeWidth={2.4} />
        <Text style={styles.dateText}>
          {startDate} → {endDate}
        </Text>
      </View>

      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${safeProgress}%` }]} />
      </View>

      <Text style={styles.progressText}>{safeProgress}% de période utilisée</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 18,
    backgroundColor: colors.primary,
    borderRadius: 26,
    padding: 22,
  },

  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  iconBox: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  label: {
    marginTop: 18,
    color: '#DDFBFA',
    fontSize: 14,
    fontWeight: '800',
  },

  status: {
    marginTop: 6,
    color: '#FFFFFF',
    fontSize: 31,
    fontWeight: '900',
    letterSpacing: -0.8,
  },

  dateRow: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },

  dateText: {
    color: '#E7FFFF',
    fontSize: 13,
    fontWeight: '800',
  },

  progressTrack: {
    marginTop: 18,
    height: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.25)',
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
  },

  progressText: {
    marginTop: 9,
    color: '#E7FFFF',
    fontSize: 12,
    fontWeight: '800',
  },

  pressed: {
    opacity: 0.74,
  },
});