import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
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
import { colors } from '@/shared/theme/colors';

const API_URL = 'https://cerapro-production.up.railway.app';

export default function LoginScreen() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadPrefilledPhone() {
      const savedPhone = await AsyncStorage.getItem('cerapro_phone_prefill');

      if (savedPhone) {
        setPhone(savedPhone);
      }
    }

    loadPrefilledPhone();
  }, []);

  async function handleLogin() {
    const cleanPhone = phone.replace(/\s+/g, '').trim();
    const cleanPassword = password.trim();

    if (!cleanPhone || !cleanPassword) {
      Alert.alert(
        'Champs obligatoires',
        'Merci de remplir le numéro WhatsApp et le mot de passe.',
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: cleanPhone,
          password: cleanPassword,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.message || 'Connexion impossible.');
      }

      const accessToken = result?.data?.accessToken;
      const user = result?.data?.user;
      const access = result?.data?.access;

      if (!accessToken || !user?.id) {
        throw new Error('Session invalide. Merci de vous reconnecter.');
      }

      await AsyncStorage.multiSet([
        ['cerapro_access_token', accessToken],
        ['cerapro_user', JSON.stringify(user)],
        ['cerapro_user_id', user.id],
        ['cerapro_phone', cleanPhone],
      ]);

      await AsyncStorage.removeItem('cerapro_phone_prefill');

      if (access?.mustChooseSubscription) {
        router.replace('/(auth)/subscription-choice');
        return;
      }

      router.replace('/(tabs)');
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
            <Text style={styles.logo}>CERAPRO</Text>

            <Text style={styles.title}>Connexion</Text>

            <Text style={styles.subtitle}>
              Connecte-toi avec ton numéro WhatsApp et ton mot de passe.
            </Text>

            <View style={styles.form}>
              <TextInput
                style={styles.input}
                placeholder="Numéro WhatsApp"
                placeholderTextColor={colors.textMuted}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                autoCapitalize="none"
                autoCorrect={false}
              />

              <TextInput
                style={styles.input}
                placeholder="Mot de passe"
                placeholderTextColor={colors.textMuted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
              />

              <Pressable onPress={() => router.push('./forgot-password')}>
                <Text style={styles.forgotPassword}>
                  Mot de passe oublié ?
                </Text>
              </Pressable>

              <Pressable
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleLogin}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <Text style={styles.buttonText}>Connexion</Text>
                )}
              </Pressable>

              <Pressable onPress={() => router.push('./register')}>
                <Text style={styles.secondaryLink}>
                  Créer un compte Longricheur
                </Text>
              </Pressable>
            </View>
          </View>

          <RegisterFooter />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
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
    paddingTop: 70,
    paddingBottom: 18,
  },

  content: {
    flex: 1,
    maxWidth: 520,
    alignSelf: 'center',
    justifyContent: 'space-between',
  },

  mainContent: {
    justifyContent: 'center',
  },

  logo: {
    color: colors.primary,
    fontSize: 36,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 32,
  },

  title: {
    color: colors.text,
    fontSize: 34,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 14,
  },

  subtitle: {
    color: colors.text,
    fontSize: 17,
    lineHeight: 25,
    textAlign: 'center',
    marginBottom: 34,
  },

  form: {
    gap: 16,
    marginTop: 10,
    marginBottom: 20,
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
  },

  forgotPassword: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '700',
    textDecorationLine: 'underline',
    textAlign: 'right',
    marginTop: -6,
    marginBottom: 6,
  },

  button: {
    height: 62,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  buttonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: 0.5,
  },

  secondaryLink: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: '900',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 10,
    textDecorationLine: 'underline',
  },
});