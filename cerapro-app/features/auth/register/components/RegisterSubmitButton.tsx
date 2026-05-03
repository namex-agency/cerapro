import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { colors } from '@/shared/theme/colors';

type RegisterSubmitButtonProps = {
  disabled: boolean;
  loading: boolean;
  onPress: () => void;
};

export function RegisterSubmitButton({
  disabled,
  loading,
  onPress,
}: RegisterSubmitButtonProps) {
  return (
    <Pressable
      style={[styles.button, disabled && styles.buttonDisabled]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color="#ffffff" />
      ) : (
        <Text style={styles.buttonText}>Créer mon compte</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 64,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.55,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
});