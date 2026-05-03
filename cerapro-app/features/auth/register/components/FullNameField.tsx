import { StyleSheet, Text, TextInput, View } from 'react-native';
import { colors } from '@/shared/theme/colors';

type FullNameFieldProps = {
  value: string;
  onChangeText: (text: string) => void;
};

export function FullNameField({ value, onChangeText }: FullNameFieldProps) {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Namo Eric Armand"
        placeholderTextColor={colors.textMuted}
        value={value}
        onChangeText={onChangeText}
        autoCapitalize="words"
        autoCorrect={false}
        returnKeyType="next"
        textContentType="name"
      />

      <Text style={styles.helperText}>
        Entrez le nom comme sur votre CNI ou votre Passport.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  input: {
    minHeight: 64,
    borderWidth: 1.4,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.surface,
    paddingHorizontal: 18,
    color: colors.text,
    fontSize: 17,
    fontWeight: '600',
  },
  helperText: {
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
});