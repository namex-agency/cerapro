import { StyleSheet, Text, TextInput, View } from 'react-native';
import { colors } from '@/shared/theme/colors';

type PhoneCountryFieldProps = {
  phone: string;
  onChangePhone: (text: string) => void;
};

export function PhoneCountryField({ phone, onChangePhone }: PhoneCountryFieldProps) {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.countryBox}>
          <Text style={styles.flag}>🇨🇲</Text>
          <Text style={styles.dialCode}>+237</Text>
        </View>

        <TextInput
          style={styles.input}
          placeholder="6 78 48 47 95"
          placeholderTextColor={colors.textMuted}
          value={phone}
          onChangeText={onChangePhone}
          keyboardType="phone-pad"
          autoCorrect={false}
          returnKeyType="next"
          textContentType="telephoneNumber"
        />
      </View>

      <Text style={styles.helperText}>
        CERAPRO sera bientôt disponible dans tous les pays du monde.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  countryBox: {
    minHeight: 64,
    minWidth: 118,
    borderWidth: 1.4,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
  },
  flag: {
    fontSize: 22,
  },
  dialCode: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '900',
  },
  input: {
    flex: 1,
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
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});