import { ChevronLeft, Eye, EyeOff, LockKeyhole } from 'lucide-react-native';
import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { colors } from '@/shared/theme/colors';

export default function AccountPasswordScreen() {
  const router = useRouter();

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

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
            <LockKeyhole size={28} color={colors.primaryDark} strokeWidth={2.4} />
          </View>

          <Text style={styles.title}>Mot de passe</Text>
          <Text style={styles.subtitle}>
            Modifiez votre mot de passe pour sécuriser votre compte CERAPRO.
          </Text>
        </View>

        <PasswordInput
          label="Mot de passe actuel"
          visible={showCurrentPassword}
          onToggle={() => setShowCurrentPassword((value) => !value)}
        />

        <PasswordInput
          label="Nouveau mot de passe"
          visible={showNewPassword}
          onToggle={() => setShowNewPassword((value) => !value)}
        />

        <Pressable style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
          <Text style={styles.buttonText}>Enregistrer</Text>
        </Pressable>
      </View>
    </>
  );
}

function PasswordInput({
  label,
  visible,
  onToggle,
}: {
  label: string;
  visible: boolean;
  onToggle: () => void;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>

      <View style={styles.inputWrap}>
        <TextInput
          secureTextEntry={!visible}
          placeholder="••••••••"
          placeholderTextColor={colors.textMuted}
          style={styles.input}
        />

        <Pressable onPress={onToggle} hitSlop={10}>
          {visible ? (
            <EyeOff size={22} color={colors.primaryDark} strokeWidth={2.4} />
          ) : (
            <Eye size={22} color={colors.primaryDark} strokeWidth={2.4} />
          )}
        </Pressable>
      </View>
    </View>
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
    marginBottom: 16,
  },

  label: {
    fontSize: 14,
    fontWeight: '900',
    color: colors.text,
    marginBottom: 8,
  },

  inputWrap: {
    height: 58,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },

  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
  },

  button: {
    marginTop: 10,
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