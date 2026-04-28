import { AlertCircle, CheckCircle2, ChevronRight } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/shared/theme/colors';

type Props = {
  isKycComplete: boolean;
  onPress?: () => void;
};

export function AccountKycBadge({ isKycComplete, onPress }: Props) {
  const label = isKycComplete ? 'KYC vérifié' : 'Mettre à jour le KYC';
  const description = isKycComplete
    ? 'Votre profil est vérifié'
    : 'Complétez vos informations de base';

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        isKycComplete ? styles.successContainer : styles.warningContainer,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.left}>
        {isKycComplete ? (
          <CheckCircle2 size={20} color={colors.success} strokeWidth={2.4} />
        ) : (
          <AlertCircle size={20} color={colors.danger} strokeWidth={2.4} />
        )}

        <View>
          <Text
            style={[
              styles.title,
              { color: isKycComplete ? colors.success : colors.danger },
            ]}
          >
            {label}
          </Text>
          <Text style={styles.description}>{description}</Text>
        </View>
      </View>

      <ChevronRight
        size={20}
        color={isKycComplete ? colors.success : colors.danger}
        strokeWidth={2.4}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 18,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  successContainer: {
    backgroundColor: colors.primaryLight,
  },

  warningContainer: {
    backgroundColor: '#FFF0F0',
  },

  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  title: {
    fontSize: 15,
    fontWeight: '900',
  },

  description: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: '700',
    color: colors.textMuted,
  },

  pressed: {
    opacity: 0.72,
  },
});