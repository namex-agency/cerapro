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
  View,
} from 'react-native';

import { RegisterFooter } from '@/features/auth/register/components/RegisterFooter';
import { verifyAuthOtp } from '@/shared/api/client';
import { colors } from '@/shared/theme/colors';

export default function ResetPasswordOtpScreen() {
  const { phone } = useLocalSearchParams<{ phone: string }>();

  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const cleanPhone = String(phone || '').trim();
  const cleanCode = code.replace(/\D/g, '').trim();
  const canSubmit = cleanPhone.length >= 8 && cleanCode.length === 6;

  async function handleVerifyOtp() {
    if (!cleanPhone) {
      Alert.alert(
        'Session expirée',
        'Veuillez recommencer la procédure de mot de passe oublié.',
        [
          {
            text: 'Recommencer',
            onPress: () => router.replace('./forgot-password'),
          },
        ],
      );
      return;
    }

    if (!canSubmit || loading) {
      Alert.alert(
        'Code requis',
        'Veuillez entrer le code WhatsApp à 6 chiffres.',
      );
      return;
    }

    setLoading(true);

    try {
      await verifyAuthOtp({
        phone: cleanPhone,
        code: cleanCode,
        purpose: 'PASSWORD_RESET',
      });

      router.push({
        pathname: './reset-password-new',
        params: {
          phone: cleanPhone,
          code: cleanCode,
        },
      });
    } catch (error) {
      Alert.alert(
        'Code invalide',
        error instanceof Error
          ? getFriendlyApiMessage(
              error,
              'Le code est incorrect ou expiré. Veuillez vérifier le code reçu sur WhatsApp.',
            )
          : 'Le code est incorrect ou expiré. Veuillez vérifier le code reçu sur WhatsApp.',
      );

      setCode('');
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={styles.content}>
          <View style={styles.mainContent}>
            <Pressable style={styles.backButton} onPress={() => router.back()}>
              <Text style={styles.backText}>‹</Text>
            </Pressable>

            <Text style={styles.logo}>CERAPRO</Text>

            <Text style={styles.title}>Code de vérification</Text>

            <Text style={styles.subtitle}>
              Entrez le code à 6 chiffres reçu sur WhatsApp pour sécuriser la
              mise à jour de votre mot de passe.
            </Text>

            <View style={styles.form}>
              <TextInput
                style={styles.input}
                placeholder="Code OTP"
                placeholderTextColor={colors.textMuted}
                value={code}
                onChangeText={(value) => setCode(value.replace(/\D/g, '').slice(0, 6))}
                keyboardType="number-pad"
                maxLength={6}
              />

              <Pressable
                style={[
                  styles.button,
                  (!canSubmit || loading) && styles.buttonDisabled,
                ]}
                onPress={handleVerifyOtp}
                disabled={!canSubmit || loading}
              >
                {loading ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <Text style={styles.buttonText}>Vérifier le code</Text>
                )}
              </Pressable>

              <Pressable onPress={() => router.replace('./forgot-password')}>
                <Text style={styles.secondaryLink}>Demander un nouveau code</Text>
              </Pressable>
            </View>
          </View>

          <RegisterFooter />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function getFriendlyApiMessage(error: Error, fallbackMessage: string) {
  try {
    const apiError = JSON.parse(error.message.replace('Erreur API: ', ''));

    if (apiError?.statusCode === 401) {
      return 'Le code est incorrect ou expiré. Demandez un nouveau code si nécessaire.';
    }

    if (apiError?.statusCode === 400) {
      return 'Code invalide. Veuillez entrer le code WhatsApp à 6 chiffres.';
    }

    if (typeof apiError?.message === 'string') {
      return apiError.message;
    }
  } catch {
    return fallbackMessage;
  }

  return fallbackMessage;
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    minHeight: '100%',
    paddingHorizontal: 28,
    paddingTop: 48,
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
  mainContent: {
    justifyContent: 'center',
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    marginBottom: 18,
  },
  backText: {
    color: colors.primary,
    fontSize: 44,
    fontWeight: '800',
    lineHeight: 44,
  },
  logo: {
    color: colors.primary,
    fontSize: 36,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 30,
  },
  title: {
    color: colors.text,
    fontSize: 31,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 14,
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 34,
  },
  form: {
    gap: 16,
  },
  input: {
    minHeight: 62,
    borderWidth: 1.3,
    borderColor: colors.border,
    borderRadius: 10,
    backgroundColor: colors.surface,
    paddingHorizontal: 18,
    color: colors.text,
    fontSize: 22,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: 6,
  },
  button: {
    height: 62,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  buttonDisabled: {
    opacity: 0.55,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '900',
  },
  secondaryLink: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '800',
    textAlign: 'center',
    textDecorationLine: 'underline',
    marginTop: 8,
  },
});