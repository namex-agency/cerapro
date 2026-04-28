import { CalendarDays, ChevronLeft, CreditCard, WalletCards } from 'lucide-react-native';
import { Stack, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/shared/theme/colors';

export default function AccountSubscriptionScreen() {
  const router = useRouter();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.screen}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
        >
          <ChevronLeft size={30} color={colors.primaryDark} strokeWidth={2.6} />
        </Pressable>

        <View style={styles.header}>
          <View style={styles.iconBox}>
            <WalletCards size={28} color={colors.primaryDark} strokeWidth={2.4} />
          </View>

          <Text style={styles.title}>Abonnement</Text>
          <Text style={styles.subtitle}>
            Gérez votre accès CERAPRO et votre réabonnement mensuel.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Statut actuel</Text>
          <Text style={styles.cardTitle}>Actif</Text>

          <View style={styles.infoRow}>
            <CalendarDays size={18} color="#E7FFFF" strokeWidth={2.4} />
            <Text style={styles.infoText}>01 Avr 2026 → 30 Avr 2026</Text>
          </View>

          <View style={styles.progressTrack}>
            <View style={styles.progressFill} />
          </View>

          <Text style={styles.progressText}>80% de période utilisée</Text>
        </View>

        <View style={styles.priceBox}>
          <Text style={styles.priceLabel}>Prix mensuel</Text>
          <Text style={styles.price}>1 000 FCFA</Text>
          <Text style={styles.priceHint}>Paiement via Maviance / Smobilpay</Text>
        </View>

        <Pressable style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
          <CreditCard size={20} color="#FFFFFF" strokeWidth={2.4} />
          <Text style={styles.buttonText}>Renouveler maintenant</Text>
        </Pressable>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 20,
    paddingTop: 54,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 22,
  },

  header: {
    marginBottom: 24,
  },

  iconBox: {
    width: 58,
    height: 58,
    borderRadius: 20,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },

  title: {
    fontSize: 32,
    fontWeight: '900',
    color: colors.text,
    letterSpacing: -0.8,
  },

  subtitle: {
    marginTop: 8,
    fontSize: 15,
    fontWeight: '700',
    color: colors.textMuted,
    lineHeight: 21,
  },

  card: {
    backgroundColor: colors.primary,
    borderRadius: 28,
    padding: 22,
    marginBottom: 16,
  },

  cardLabel: {
    color: '#DDFBFA',
    fontSize: 14,
    fontWeight: '800',
  },

  cardTitle: {
    marginTop: 8,
    color: '#FFFFFF',
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: -0.8,
  },

  infoRow: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  infoText: {
    color: '#E7FFFF',
    fontSize: 14,
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
    width: '80%',
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

  priceBox: {
    backgroundColor: colors.surface,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 18,
    marginBottom: 16,
  },

  priceLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textMuted,
  },

  price: {
    marginTop: 6,
    fontSize: 30,
    fontWeight: '900',
    color: colors.text,
    letterSpacing: -0.7,
  },

  priceHint: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: '700',
    color: colors.textMuted,
  },

  button: {
    height: 58,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 9,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },

  pressed: {
    opacity: 0.72,
  },
});