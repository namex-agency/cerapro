import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/shared/theme/colors';

type FreeTrialAccessCardProps = {
  onPress: () => void;
};

export function FreeTrialAccessCard({ onPress }: FreeTrialAccessCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        pressed && styles.cardPressed,
      ]}
    >
      <View style={styles.topRow}>
        <Text style={styles.brand}>CERAPRO ACCESS</Text>
        <Text style={styles.network}>TRIAL</Text>
      </View>

      <View style={styles.chipRow}>
        <View style={styles.chip}>
          <View style={styles.chipLine} />
          <View style={styles.chipLineSmall} />
        </View>

        <Text style={styles.badge}>Recommandé</Text>
      </View>

      <Text style={styles.cardNumber}>FREE • 0007 • DAYS</Text>

      <View style={styles.bottomRow}>
        <View>
          <Text style={styles.label}>ACCÈS</Text>
          <Text style={styles.value}>Essai gratuit</Text>
        </View>

        <View style={styles.rightBlock}>
          <Text style={styles.label}>VALIDITÉ</Text>
          <Text style={styles.value}>7 jours</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <Text style={styles.description}>
        Testez CERAPRO gratuitement avant de passer à l’abonnement mensuel.
      </Text>

      <View style={styles.cta}>
        <Text style={styles.ctaText}>Commencer l’essai</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.primary,
    borderRadius: 28,
    padding: 22,
    marginBottom: 18,
    minHeight: 265,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.18,
    shadowRadius: 22,
    elevation: 8,
    overflow: 'hidden',
  },

  cardPressed: {
    transform: [{ scale: 0.985 }],
    opacity: 0.96,
  },

  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  brand: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 2,
  },

  network: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 1.5,
  },

  chipRow: {
    marginTop: 26,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  chip: {
    width: 54,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.88)',
    padding: 8,
    justifyContent: 'center',
  },

  chipLine: {
    height: 3,
    borderRadius: 99,
    backgroundColor: 'rgba(10,31,31,0.25)',
    marginBottom: 7,
  },

  chipLineSmall: {
    width: '62%',
    height: 3,
    borderRadius: 99,
    backgroundColor: 'rgba(10,31,31,0.25)',
  },

  badge: {
    overflow: 'hidden',
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.18)',
    color: '#ffffff',
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 12,
    fontWeight: '900',
  },

  cardNumber: {
    marginTop: 26,
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 2,
  },

  bottomRow: {
    marginTop: 26,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 18,
  },

  label: {
    color: 'rgba(255,255,255,0.72)',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.6,
    marginBottom: 6,
  },

  value: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '900',
  },

  rightBlock: {
    alignItems: 'flex-end',
  },

  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.18)',
    marginVertical: 18,
  },

  description: {
    color: 'rgba(255,255,255,0.86)',
    fontSize: 13,
    lineHeight: 20,
    fontWeight: '700',
  },

  cta: {
    marginTop: 18,
    height: 54,
    borderRadius: 18,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  ctaText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '900',
  },
});