import { Check, ChevronLeft, Moon, Sun } from 'lucide-react-native';
import { Stack, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/shared/theme/colors';

export default function AccountThemeScreen() {
  const router = useRouter();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.screen}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
        >
          <ChevronLeft size={30} color={colors.primaryDark} strokeWidth={2.6} />
        </Pressable>

        <View style={styles.header}>
          <View style={styles.iconBox}>
            <Moon size={28} color={colors.primaryDark} strokeWidth={2.4} />
          </View>

          <Text style={styles.title}>Thème</Text>
          <Text style={styles.subtitle}>
            Personnalisez l’apparence de CERAPRO.
          </Text>
        </View>

        <ThemeOption
          label="Clair"
          description="Interface lumineuse"
          icon={<Sun size={22} color={colors.primaryDark} />}
          selected
        />

        <ThemeOption
          label="Sombre"
          description="Interface sombre pour les yeux"
          icon={<Moon size={22} color={colors.primaryDark} />}
        />
      </View>
    </>
  );
}

function ThemeOption({
  label,
  description,
  icon,
  selected,
}: {
  label: string;
  description: string;
  icon: React.ReactNode;
  selected?: boolean;
}) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.option,
        selected && styles.optionSelected,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.left}>
        <View style={styles.iconWrap}>{icon}</View>

        <View>
          <Text style={styles.optionLabel}>{label}</Text>
          <Text style={styles.optionDesc}>{description}</Text>
        </View>
      </View>

      {selected ? (
        <Check size={22} color={colors.primaryDark} strokeWidth={2.6} />
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 20,
    paddingTop: 54,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 22,
  },

  header: {
    marginBottom: 24,
  },

  iconBox: {
    width: 58,
    height: 58,
    borderRadius: 20,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },

  title: {
    fontSize: 32,
    fontWeight: '900',
    color: colors.text,
    letterSpacing: -0.8,
  },

  subtitle: {
    marginTop: 8,
    fontSize: 15,
    fontWeight: '700',
    color: colors.textMuted,
    lineHeight: 21,
  },

  option: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 22,
    padding: 18,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  optionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },

  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },

  optionLabel: {
    fontSize: 17,
    fontWeight: '900',
    color: colors.text,
  },

  optionDesc: {
    marginTop: 3,
    fontSize: 13,
    fontWeight: '700',
    color: colors.textMuted,
  },

  pressed: {
    opacity: 0.72,
  },
});