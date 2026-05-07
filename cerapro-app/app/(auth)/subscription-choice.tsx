import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';

import { RegisterFooter } from '@/features/auth/register/components/RegisterFooter';
import { FreeTrialAccessCard } from '@/features/subscription/components/FreeTrialAccessCard';
import { MonthlySubscriptionCard } from '@/features/subscription/components/MonthlySubscriptionCard';
import { SubscriptionChoiceHeader } from '@/features/subscription/components/SubscriptionChoiceHeader';
import { colors } from '@/shared/theme/colors';

const API_URL = 'https://cerapro-production.up.railway.app';

export default function SubscriptionChoiceScreen() {
  const [loadingTrial, setLoadingTrial] = useState(false);

  async function handleStartTrial() {
    if (loadingTrial) return;

    setLoadingTrial(true);

    try {
      const accessToken = await AsyncStorage.getItem('cerapro_access_token');

      if (!accessToken) {
        throw new Error('Session expirée. Merci de vous reconnecter.');
      }

      const response = await fetch(`${API_URL}/subscription/start-free-trial`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.message || 'Impossible d’activer l’essai gratuit.',
        );
      }

      await AsyncStorage.setItem(
        'cerapro_access',
        JSON.stringify(result?.data ?? result),
      );

      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert(
        'Essai gratuit',
        error instanceof Error
          ? error.message
          : 'Une erreur est survenue pendant l’activation.',
      );
    } finally {
      setLoadingTrial(false);
    }
  }

  function handleMonthlyPayment() {
    Alert.alert(
      'Paiement bientôt connecté',
      'L’abonnement mensuel de 1000 FCFA sera connecté via Maviance / Smobilpay.',
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
            <SubscriptionChoiceHeader />

            <FreeTrialAccessCard onPress={handleStartTrial} />

            <MonthlySubscriptionCard onPress={handleMonthlyPayment} />
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
});