import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors } from '@/shared/theme/colors';

type PasswordFieldProps = {
  password: string;
  onChangePassword: (text: string) => void;
};

export function AuthPasswordField({ password, onChangePassword }: PasswordFieldProps) {
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.inputBox}>
        <TextInput
          style={styles.input}
          placeholder="Mot de passe"
          placeholderTextColor={colors.textMuted}
          value={password}
          onChangeText={onChangePassword}
          secureTextEntry={!passwordVisible}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="done"
          textContentType="newPassword"
        />

        <Pressable
          style={styles.eyeButton}
          onPress={() => setPasswordVisible((currentValue) => !currentValue)}
        >
          <Text style={styles.eyeIcon}>{passwordVisible ? '🙈' : '👁️'}</Text>
        </Pressable>
      </View>

      <Text style={styles.helperText}>
        Utilisez au moins 6 caractères pour sécuriser votre compte.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 6,
  },
  inputBox: {
    minHeight: 64,
    borderWidth: 1.4,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.surface,
    paddingLeft: 18,
    paddingRight: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    minHeight: 64,
    color: colors.text,
    fontSize: 17,
    fontWeight: '600',
  },
  eyeButton: {
    width: 48,
    height: 48,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eyeIcon: {
    fontSize: 20,
  },
  helperText: {
    color: colors.textMuted,
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});