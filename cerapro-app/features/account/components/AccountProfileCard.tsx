import { Camera, User } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/shared/theme/colors';

type Props = {
  fullName: string;
  phone: string;
  isKycComplete: boolean;
  onPressChangePhoto?: () => void;
};

export function AccountProfileCard({
  fullName,
  phone,
  isKycComplete,
  onPressChangePhoto,
}: Props) {
  return (
    <View style={styles.container}>
      <Pressable
        style={({ pressed }) => [
          styles.avatarWrapper,
          pressed && styles.pressed,
        ]}
        onPress={onPressChangePhoto}
        hitSlop={10}
        accessibilityRole="button"
        accessibilityLabel="Modifier la photo de profil"
      >
        <View style={styles.avatar}>
          <User size={42} color="#FFFFFF" strokeWidth={2.2} />
        </View>

        <View style={styles.cameraBadge}>
          <Camera size={14} color="#FFFFFF" strokeWidth={2.4} />
        </View>
      </Pressable>

      <Text style={styles.name}>{fullName}</Text>
      <Text style={styles.phone}>{phone}</Text>

      <View
        style={[
          styles.statusBadge,
          {
            backgroundColor: isKycComplete
              ? colors.primaryLight
              : colors.primaryLight,
          },
        ]}
      >
        <Text
          style={[
            styles.statusText,
            {
              color: isKycComplete ? colors.success : colors.primaryDark,
            },
          ]}
        >
          {isKycComplete ? 'Compte vérifié' : 'KYC à compléter'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 10,
  },

  avatarWrapper: {
    marginBottom: 16,
  },

  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  cameraBadge: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.background,
  },

  pressed: {
    opacity: 0.78,
    transform: [{ scale: 0.97 }],
  },

  name: {
    fontSize: 26,
    fontWeight: '900',
    color: colors.text,
    letterSpacing: -0.5,
  },

  phone: {
    marginTop: 4,
    fontSize: 14,
    color: colors.textMuted,
    fontWeight: '600',
  },

  statusBadge: {
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 999,
  },

  statusText: {
    fontSize: 13,
    fontWeight: '800',
  },
});