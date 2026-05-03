import { router } from 'expo-router';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { RegisterFooter } from '@/features/auth/register/components/RegisterFooter';
import { colors } from '@/shared/theme/colors';

export default function SubscriptionChoiceScreen() {
  function handleStartTrial() {
    Alert.alert(
      'Essai activé',
      'Votre période d’essai CERAPRO de 7 jours est activée.',
      [
        {
          text: 'Continuer',
          onPress: () => router.replace('/(tabs)'),
        },
      ],
    );
  }

  function handleMonthlyPayment() {
    Alert.alert(
      'Paiement bientôt disponible',
      'Le paiement mensuel de 1000 FCFA sera connecté à Maviance / Smobilpay dans la prochaine étape.',
    );
  }

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View>
            <Text style={styles.logo}>CERAPRO</Text>

            <Text style={styles.title}>Choisissez votre accès</Text>

            <Text style={styles.subtitle}>
              Activez votre espace Longricheur pour gérer vos produits, contacts,
              ventes, dettes, mini-site et wallet CERAPRO.
            </Text>

            <View style={styles.card}>
              <Text style={styles.badge}>Recommandé pour commencer</Text>
              <Text style={styles.cardTitle}>Essai gratuit</Text>
              <Text style={styles.price}>7 jours</Text>
              <Text style={styles.description}>
                Testez CERAPRO gratuitement avant de passer à l’abonnement mensuel.
              </Text>

              <Pressable style={styles.primaryButton} onPress={handleStartTrial}>
                <Text style={styles.primaryButtonText}>Commencer l’essai</Text>
              </Pressable>
            </View>

            <View style={styles.card}>
              <Text style={styles.badgeAlt}>Accès complet</Text>
              <Text style={styles.cardTitle}>Abonnement mensuel</Text>
              <Text style={styles.price}>1000 FCFA</Text>
              <Text style={styles.description}>
                Accédez à CERAPRO chaque mois avec paiement Mobile Money sécurisé.
              </Text>

              <Pressable style={styles.secondaryButton} onPress={handleMonthlyPayment}>
                <Text style={styles.secondaryButtonText}>Payer maintenant</Text>
              </Pressable>
            </View>
          </View>

          <RegisterFooter />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingTop: 58,
    paddingBottom: 18,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    color: colors.primary,
    fontSize: 38,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 34,
  },
  title: {
    color: colors.text,
    fontSize: 34,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 14,
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 28,
  },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1.3,
    borderColor: colors.border,
    borderRadius: 24,
    padding: 22,
    marginBottom: 18,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(37, 166, 170, 0.12)',
    color: colors.primary,
    fontSize: 12,
    fontWeight: '900',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    marginBottom: 14,
  },
  badgeAlt: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(10, 31, 31, 0.08)',
    color: colors.text,
    fontSize: 12,
    fontWeight: '900',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    marginBottom: 14,
  },
  cardTitle: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 6,
  },
  price: {
    color: colors.primary,
    fontSize: 34,
    fontWeight: '900',
    marginBottom: 12,
  },
  description: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 22,
    fontWeight: '700',
    marginBottom: 18,
  },
  primaryButton: {
    height: 58,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '900',
  },
  secondaryButton: {
    height: 58,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: colors.primary,
    backgroundColor: 'rgba(37, 166, 170, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '900',
  },
});