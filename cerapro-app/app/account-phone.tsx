import { ChevronLeft, Smartphone } from 'lucide-react-native';
import { Stack, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { colors } from '@/shared/theme/colors';

export default function AccountPhoneScreen() {
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
            <Smartphone size={28} color={colors.primaryDark} strokeWidth={2.4} />
          </View>

          <Text style={styles.title}>Téléphone</Text>
          <Text style={styles.subtitle}>
            Modifiez votre numéro principal et sécurisez l’accès à votre compte.
          </Text>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Numéro de téléphone</Text>

          <TextInput
            keyboardType="phone-pad"
            placeholder="+237 6XX XXX XXX"
            placeholderTextColor={colors.textMuted}
            style={styles.input}
          />
        </View>

        <Pressable style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
          <Text style={styles.buttonText}>Enregistrer</Text>
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

  field: {
    marginBottom: 18,
  },

  label: {
    fontSize: 14,
    fontWeight: '900',
    color: colors.text,
    marginBottom: 8,
  },

  input: {
    height: 58,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
  },

  button: {
    height: 58,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
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