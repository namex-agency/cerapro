import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/shared/theme/colors';

export function SubscriptionChoiceHeader() {
  return (
    <View style={styles.header}>
      <Text style={styles.logo}>CERAPRO</Text>

      <Text style={styles.title}>Choisissez votre accès</Text>

      <Text style={styles.subtitle}>
        Activez votre espace Longricheur pour gérer vos produits, contacts,
        ventes, dettes, mini-site et wallet CERAPRO.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 28,
  },

  logo: {
    color: colors.primary,
    fontSize: 38,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 34,
  },

  title: {
    color: colors.text,
    fontSize: 34,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 14,
  },

  subtitle: {
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 24,
    fontWeight: '700',
    textAlign: 'center',
  },
});