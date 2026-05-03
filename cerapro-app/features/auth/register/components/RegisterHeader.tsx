import { StyleSheet, Text, View } from 'react-native';
import { colors } from '@/shared/theme/colors';

export function RegisterHeader() {
  return (
    <View style={styles.container}>
      <View style={styles.logoBox}>
        <Text style={styles.logoText}>CERAPRO</Text>
        <Text style={styles.logoSubText}>Longrich Business System</Text>
      </View>

      <Text style={styles.title}>Inscription</Text>

      <Text style={styles.subtitle}>
        Digitaliser et sécuriser votre croissance Longrich
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 38,
  },
  logoBox: {
    alignItems: 'center',
    marginBottom: 34,
  },
  logoText: {
    color: colors.primary,
    fontSize: 38,
    fontWeight: '900',
    letterSpacing: 1,
  },
  logoSubText: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 4,
  },
  title: {
    color: colors.text,
    fontSize: 36,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 18,
  },
  subtitle: {
    color: colors.text,
    fontSize: 18,
    lineHeight: 27,
    textAlign: 'center',
  },
});