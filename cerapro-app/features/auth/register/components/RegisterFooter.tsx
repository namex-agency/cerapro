import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/shared/theme/colors';

export function RegisterFooter() {
  return (
    <View style={styles.container}>
      <Text style={styles.copyright}>© 2026 CERAPRO</Text>

      <View style={styles.linksRow}>
        <Pressable onPress={() => router.push('./privacy')}>
          <Text style={styles.link}>Confidentialité</Text>
        </Pressable>

        <Pressable onPress={() => router.push('./terms')}>
          <Text style={styles.link}>Conditions</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingTop: 22,
    paddingBottom: 12,
  },
  copyright: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
  linksRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 18,
    marginTop: 8,
  },
  link: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '800',
    textDecorationLine: 'underline',
  },
});