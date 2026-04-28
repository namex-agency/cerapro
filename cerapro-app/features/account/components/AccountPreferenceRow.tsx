import { ChevronRight } from 'lucide-react-native';
import { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/shared/theme/colors';

type Props = {
  icon: ReactNode;
  title: string;
  value: string;
  onPress?: () => void;
};

export function AccountPreferenceRow({ icon, title, value, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
      accessibilityRole="button"
    >
      <View style={styles.iconBox}>{icon}</View>

      <View style={styles.textBox}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.value}>{value}</Text>
      </View>

      <ChevronRight size={21} color={colors.textMuted} strokeWidth={2.4} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 16,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },

  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
  },

  textBox: {
    flex: 1,
  },

  title: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.text,
  },

  value: {
    marginTop: 3,
    fontSize: 13,
    fontWeight: '700',
    color: colors.textMuted,
  },

  pressed: {
    opacity: 0.72,
  },
});