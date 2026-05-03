import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useState } from 'react';

import { colors } from '@/shared/theme/colors';

type Props = {
  value: boolean;
  onChange: (value: boolean) => void;
};

export function TermsCheckbox({ value, onChange }: Props) {
  return (
    <View style={styles.container}>
      {/* CHECKBOX */}
      <Pressable
        style={[styles.checkbox, value && styles.checkboxActive]}
        onPress={() => onChange(!value)}
      >
        {value && <View style={styles.inner} />}
      </Pressable>

      {/* TEXTE */}
      <Text style={styles.text}>
        Je certifie avoir lu et approuvé les{' '}
        <Text style={styles.link} onPress={() => router.push('/privacy')}>
          conditions de confidentialité
        </Text>{' '}
        et les{' '}
        <Text style={styles.link} onPress={() => router.push('/terms')}>
          conditions d’utilisation
        </Text>.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 6,
    gap: 10,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkboxActive: {
    backgroundColor: colors.primary,
  },
  inner: {
    width: 10,
    height: 10,
    borderRadius: 2,
    backgroundColor: '#fff',
  },
  text: {
    flex: 1,
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 18,
  },
  link: {
    color: colors.primary,
    textDecorationLine: 'underline',
    fontWeight: '700',
  },
});