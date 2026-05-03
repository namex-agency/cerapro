import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
} from 'react-native';
import { colors } from '@/shared/theme/colors';

const API_URL = 'https://cerapro-production.up.railway.app';

export default function VerifyOtpScreen() {
  const params = useLocalSearchParams<{
    phone?: string;
    purpose?: string;
  }>();

  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const phone = params.phone ?? '';
  const purpose = params.purpose ?? 'REGISTER';

  async function handleVerifyOtp() {
    if (!phone.trim()) {
      Alert.alert('Numéro manquant', 'Le numéro WhatsApp est introuvable.');
      return;
    }

    if (!code.trim()) {
      Alert.alert('Code obligatoire', 'Merci de saisir le code OTP reçu.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: phone.trim(),
          code: code.trim(),
          purpose,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.message || 'Code invalide ou expiré.');
      }

      Alert.alert('Vérification réussie', result?.message || 'Compte vérifié.');

      router.replace('./login');
    } catch (error) {
      Alert.alert(
        'Erreur',
        error instanceof Error ? error.message : 'Une erreur est survenue.',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.logo}>CERAPRO</Text>

        <Text style={styles.title}>Vérification</Text>

        <Text style={styles.subtitle}>
          Entre le code reçu sur WhatsApp pour activer ton compte Longricheur.
        </Text>

        <Text style={styles.phone}>{phone}</Text>

        <TextInput
          style={styles.input}
          placeholder="Code OTP"
          placeholderTextColor={colors.textMuted}
          value={code}
          onChangeText={setCode}
          keyboardType="number-pad"
          maxLength={6}
        />

        <Pressable
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleVerifyOtp}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.buttonText}>Vérifier mon compte</Text>
          )}
        </Pressable>

        <Pressable onPress={() => router.replace('./register')}>
          <Text style={styles.secondaryLink}>Revenir à l’inscription</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
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
    paddingTop: 80,
    paddingBottom: 28,
  },
  logo: {
    color: colors.primary,
    fontSize: 36,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 40,
  },
  title: {
    color: colors.text,
    fontSize: 34,
    fontWeight: '900',
    textAlign: 'center',
  },
  subtitle: {
    color: colors.text,
    fontSize: 17,
    lineHeight: 26,
    textAlign: 'center',
    marginTop: 18,
    marginBottom: 24,
  },
  phone: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 28,
  },
  input: {
    minHeight: 64,
    borderWidth: 1.4,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.surface,
    paddingHorizontal: 18,
    color: colors.text,
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: 4,
  },
  button: {
    height: 64,
    borderRadius: 8,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 28,
  },
  buttonDisabled: {
    opacity: 0.55,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '900',
  },
  secondaryLink: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '900',
    textAlign: 'center',
    marginTop: 24,
  },
});