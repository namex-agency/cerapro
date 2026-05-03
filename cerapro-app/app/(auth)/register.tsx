import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { AuthPasswordField } from '@/features/auth/register/components/AuthPasswordField';
import { FullNameField } from '@/features/auth/register/components/FullNameField';
import { LoginRedirectLink } from '@/features/auth/register/components/LoginRedirectLink';
import { PhoneCountryField } from '@/features/auth/register/components/PhoneCountryField';
import { RegisterFooter } from '@/features/auth/register/components/RegisterFooter';
import { RegisterHeader } from '@/features/auth/register/components/RegisterHeader';
import { RegisterSubmitButton } from '@/features/auth/register/components/RegisterSubmitButton';
import { RegisterSuccessModal } from '@/features/auth/register/components/RegisterSuccessModal';
import { TermsCheckbox } from '@/features/auth/register/components/TermsCheckbox';
import { registerLongricheur } from '@/shared/api/client';
import { colors } from '@/shared/theme/colors';

function getFriendlyApiMessage(error: unknown, fallbackMessage: string) {
  if (!(error instanceof Error)) return fallbackMessage;

  try {
    const apiError = JSON.parse(error.message.replace('Erreur API: ', ''));

    if (apiError?.statusCode === 409) {
      return 'Ce numéro est déjà utilisé.\nConnectez-vous ou utilisez un autre numéro.';
    }

    if (apiError?.statusCode === 400) {
      return 'Informations invalides.\nVérifiez les champs saisis.';
    }

    if (typeof apiError?.message === 'string') {
      return apiError.message;
    }
  } catch {
    return fallbackMessage;
  }

  return fallbackMessage;
}

export default function RegisterScreen() {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const cleanFullName = fullName.trim();
  const cleanPhone = phone.replace(/\s+/g, '').trim();

 const canSubmit =
  cleanFullName.length > 2 &&
  cleanPhone.length >= 8 &&
  password.length >= 6 &&
  acceptedTerms;

  async function handleRegister() {
if (!acceptedTerms) {
  Alert.alert(
    'Conditions requises',
    'Veuillez accepter les conditions et la politique de confidentialité pour continuer.',
  );
  return;
}

if (!canSubmit || loading) {
  Alert.alert(
    'Informations incomplètes',
    'Merci de renseigner votre nom complet, votre numéro WhatsApp et un mot de passe de 6 caractères minimum.',
  );
  return;
}

    setLoading(true);

    try {
      await registerLongricheur({
        fullName: cleanFullName,
        phone: cleanPhone,
        country: 'Cameroun',
        password,
      });

      setSuccessVisible(true);
    } catch (error) {
      Alert.alert(
        'Inscription impossible',
        getFriendlyApiMessage(
          error,
          'Nous n’avons pas pu créer votre compte pour le moment.\nVeuillez réessayer dans quelques instants.',
        ),
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
        alwaysBounceVertical={false}
      >
        <View style={styles.content}>
          <View style={styles.mainContent}>
            <RegisterHeader />

            <View style={styles.form}>
              <FullNameField value={fullName} onChangeText={setFullName} />

              <PhoneCountryField phone={phone} onChangePhone={setPhone} />

              <AuthPasswordField
                password={password}
                onChangePassword={setPassword}
              />

              <TermsCheckbox
  value={acceptedTerms}
  onChange={setAcceptedTerms}
/>

              <RegisterSubmitButton
                disabled={!canSubmit || loading}
                loading={loading}
                onPress={handleRegister}
              />

              <LoginRedirectLink />
            </View>
          </View>

          <RegisterFooter />
        </View>
      </ScrollView>

      <RegisterSuccessModal
        visible={successVisible}
        phone={cleanPhone}
        onClose={() => setSuccessVisible(false)}
      />
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
    flexShrink: 0,
    justifyContent: 'center',
  },
  form: {
    gap: 18,
    marginTop: 10,
  },
});