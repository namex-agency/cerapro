import { router } from 'expo-router';
import { Pressable, StyleSheet, Text } from 'react-native';

import { colors } from '@/shared/theme/colors';

export function LoginRedirectLink() {
  return (
    <Pressable
      style={styles.container}
      onPress={() => router.push('./login')}
    >
      <Text style={styles.text}>J’ai déjà un compte</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    marginTop: 6,
  },
  text: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: '800',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});