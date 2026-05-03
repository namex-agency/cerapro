import { router } from 'expo-router';
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
import { requestPasswordReset } from '@/shared/api/client';
import { colors } from '@/shared/theme/colors';

export default function ForgotPasswordScreen() {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const cleanPhone = phone.replace(/\s+/g, '').trim();
  const canSubmit = cleanPhone.length >= 8;

  async function handleRequestReset() {
    if (!canSubmit || loading) {
      Alert.alert(
        'Numéro requis',
        'Merci de renseigner le numéro WhatsApp associé à votre compte CERAPRO.',
      );
      return;
    }

    setLoading(true);

    try {
      await requestPasswordReset({
        phone: cleanPhone,
      });

      router.push({
        pathname: './reset-password-otp',
        params: {
          phone: cleanPhone,
        },
      });
    } catch (error) {
      Alert.alert(
        'Envoi impossible',
        error instanceof Error
          ? getFriendlyApiMessage(
              error,
              'Impossible d’envoyer le code WhatsApp pour le moment. Veuillez réessayer.',
            )
          : 'Impossible d’envoyer le code WhatsApp pour le moment. Veuillez réessayer.',
      );
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

            <Text style={styles.title}>Mot de passe oublié</Text>

            <Text style={styles.subtitle}>
              Entrez votre numéro WhatsApp. Nous vous enverrons un code de
              vérification pour sécuriser la mise à jour de votre mot de passe.
            </Text>

            <View style={styles.form}>
              <TextInput
                style={styles.input}
                placeholder="Numéro WhatsApp"
                placeholderTextColor={colors.textMuted}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />

              <Pressable
                style={[
                  styles.button,
                  (!canSubmit || loading) && styles.buttonDisabled,
                ]}
                onPress={handleRequestReset}
                disabled={!canSubmit || loading}
              >
                {loading ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <Text style={styles.buttonText}>Envoyer le code WhatsApp</Text>
                )}
              </Pressable>

              <Pressable onPress={() => router.push('./login')}>
                <Text style={styles.secondaryLink}>Retour à la connexion</Text>
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

    if (apiError?.statusCode === 404) {
      return 'Aucun compte CERAPRO n’est associé à ce numéro WhatsApp.';
    }

    if (apiError?.statusCode === 400) {
      return 'Numéro invalide. Vérifiez le numéro WhatsApp saisi.';
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
    fontSize: 32,
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
    fontSize: 16,
    fontWeight: '700',
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