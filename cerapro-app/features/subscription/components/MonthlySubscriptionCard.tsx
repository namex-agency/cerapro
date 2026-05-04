import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/shared/theme/colors';

type MonthlySubscriptionCardProps = {
  onPress: () => void;
};

export function MonthlySubscriptionCard({ onPress }: MonthlySubscriptionCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      <View style={styles.glowOne} />
      <View style={styles.glowTwo} />

      <View style={styles.topRow}>
        <Text style={styles.brand}>CERAPRO PRO</Text>

        <View style={styles.mastercard}>
          <View style={styles.circleOne} />
          <View style={styles.circleTwo} />
        </View>
      </View>

      <View style={styles.chipRow}>
        <View style={styles.chip}>
          <View style={styles.chipLine} />
          <View style={styles.chipLineSmall} />
        </View>

        <Text style={styles.badge}>Accès complet</Text>
      </View>

      <Text style={styles.cardNumber}>1000 • FCFA • MONTH</Text>

      <View style={styles.bottomRow}>
        <View>
          <Text style={styles.label}>FORMULE</Text>
          <Text style={styles.value}>Mensuel</Text>
        </View>

        <View style={styles.rightBlock}>
          <Text style={styles.label}>PAIEMENT</Text>
          <Text style={styles.value}>Mobile Money</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <Text style={styles.description}>
        Accédez à CERAPRO chaque mois avec paiement sécurisé via Maviance /
        Smobilpay.
      </Text>

      <View style={styles.cta}>
        <Text style={styles.ctaText}>Payer maintenant</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    position: 'relative',
    backgroundColor: '#0A1F1F',
    borderRadius: 28,
    padding: 22,
    marginBottom: 18,
    minHeight: 265,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.22,
    shadowRadius: 24,
    elevation: 9,
    overflow: 'hidden',
  },

  cardPressed: {
    transform: [{ scale: 0.985 }],
    opacity: 0.96,
  },

  glowOne: {
    position: 'absolute',
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: 'rgba(37,166,170,0.28)',
    top: -72,
    right: -64,
  },

  glowTwo: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.08)',
    bottom: -70,
    left: -55,
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

  mastercard: {
    width: 56,
    height: 34,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  circleOne: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.72)',
    marginRight: -9,
  },

  circleTwo: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(37,166,170,0.9)',
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
    backgroundColor: 'rgba(255,255,255,0.12)',
    color: '#ffffff',
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 12,
    fontWeight: '900',
  },

  cardNumber: {
    marginTop: 26,
    color: '#ffffff',
    fontSize: 23,
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
    color: 'rgba(255,255,255,0.65)',
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
    backgroundColor: 'rgba(255,255,255,0.15)',
    marginVertical: 18,
  },

  description: {
    color: 'rgba(255,255,255,0.82)',
    fontSize: 13,
    lineHeight: 20,
    fontWeight: '700',
  },

  cta: {
    marginTop: 18,
    height: 54,
    borderRadius: 18,
    borderWidth: 1.4,
    borderColor: 'rgba(255,255,255,0.35)',
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  ctaText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '900',
  },
});