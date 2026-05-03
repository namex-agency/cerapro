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
import { resetPassword } from '@/shared/api/client';
import { colors } from '@/shared/theme/colors';

export default function ResetPasswordNewScreen() {
  const { phone, code } = useLocalSearchParams<{
    phone: string;
    code?: string;
  }>();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const cleanPhone = String(phone || '').trim();
  const cleanCode = String(code || '').trim();

  const canSubmit =
    newPassword.length >= 6 &&
    confirmPassword.length >= 6 &&
    newPassword === confirmPassword &&
    cleanPhone.length >= 8 &&
    cleanCode.length >= 4;

  async function handleUpdatePassword() {
    if (loading) return;

    if (!newPassword || !confirmPassword) {
      Alert.alert(
        'Champs obligatoires',
        'Merci de renseigner et confirmer votre nouveau mot de passe.',
      );
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert(
        'Mot de passe trop court',
        'Votre nouveau mot de passe doit contenir au moins 6 caractères.',
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert(
        'Mots de passe différents',
        'Les deux mots de passe ne correspondent pas.',
      );
      return;
    }

    if (!cleanPhone || !cleanCode) {
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

    setLoading(true);

    try {
      await resetPassword({
        phone: cleanPhone,
        code: cleanCode,
        newPassword,
      });

      Alert.alert(
        'Mot de passe mis à jour',
        'Votre mot de passe CERAPRO a été mis à jour avec succès. Vous pouvez maintenant vous connecter.',
        [
          {
            text: 'Se connecter',
            onPress: () => {
              router.replace({
                pathname: './login',
                params: {
                  phone: cleanPhone,
                },
              });
            },
          },
        ],
      );
    } catch (error) {
      Alert.alert(
        'Mise à jour impossible',
        error instanceof Error
          ? getFriendlyApiMessage(
              error,
              'Nous n’avons pas pu mettre à jour votre mot de passe pour le moment.',
            )
          : 'Nous n’avons pas pu mettre à jour votre mot de passe pour le moment.',
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

            <Text style={styles.title}>Nouveau mot de passe</Text>

            <Text style={styles.subtitle}>
              Créez un nouveau mot de passe sécurisé pour récupérer l’accès à
              votre espace Longricheur.
            </Text>

            <View style={styles.form}>
              <TextInput
                style={styles.input}
                placeholder="Nouveau mot de passe"
                placeholderTextColor={colors.textMuted}
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
              />

              <TextInput
                style={styles.input}
                placeholder="Confirmer mon mot de passe"
                placeholderTextColor={colors.textMuted}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />

              <Text style={styles.helperText}>
                Utilisez au moins 6 caractères pour sécuriser votre compte.
              </Text>

              <Pressable
                style={[
                  styles.button,
                  (!canSubmit || loading) && styles.buttonDisabled,
                ]}
                onPress={handleUpdatePassword}
                disabled={!canSubmit || loading}
              >
                {loading ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <Text style={styles.buttonText}>Mise à jour</Text>
                )}
              </Pressable>

              <Pressable onPress={() => router.replace('./login')}>
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

    if (apiError?.statusCode === 400) {
      return 'Les informations envoyées sont invalides. Veuillez recommencer.';
    }

    if (apiError?.statusCode === 401) {
      return 'Le code est incorrect ou expiré. Veuillez demander un nouveau code.';
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
    fontSize: 16,
    fontWeight: '700',
  },
  helperText: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: -4,
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