import { router } from 'expo-router';
import { useEffect, useRef } from 'react';
import {
  Animated,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  Vibration,
  View,
} from 'react-native';

import { colors } from '@/shared/theme/colors';

type RegisterSuccessModalProps = {
  visible: boolean;
  phone: string;
  onClose: () => void;
};

export function RegisterSuccessModal({
  visible,
  phone,
  onClose,
}: RegisterSuccessModalProps) {
  const scaleAnim = useRef(new Animated.Value(0.86)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!visible) return;

    Vibration.vibrate(80);

    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 90,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 260,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.08,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [visible, opacityAnim, pulseAnim, scaleAnim]);

  function goToLogin() {
    onClose();

    router.replace({
      pathname: './login',
      params: {
        phone,
      },
    });
  }

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.card,
            {
              opacity: opacityAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Animated.View
            style={[
              styles.iconCircle,
              {
                transform: [{ scale: pulseAnim }],
              },
            ]}
          >
            <Text style={styles.checkIcon}>✓</Text>
          </Animated.View>

          <Text style={styles.title}>Compte créé avec succès</Text>

          <Text style={styles.description}>
            Bienvenue sur CERAPRO. Votre espace Longricheur est maintenant prêt.
          </Text>

          <View style={styles.phoneBadge}>
            <Text style={styles.phoneLabel}>Numéro de connexion</Text>
            <Text style={styles.phoneValue}>+237 {phone}</Text>
          </View>

          <Pressable style={styles.button} onPress={goToLogin}>
            <Text style={styles.buttonText}>Se connecter</Text>
          </Pressable>

          <Text style={styles.footerText}>
            Sécurisez votre croissance Longrich avec CERAPRO.
          </Text>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(4, 24, 25, 0.62)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  card: {
    width: '100%',
    borderRadius: 30,
    backgroundColor: colors.surface,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 26,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 24,
    shadowOffset: {
      width: 0,
      height: 14,
    },
    elevation: 12,
  },
  iconCircle: {
    width: 86,
    height: 86,
    borderRadius: 999,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 22,
  },
  checkIcon: {
    color: '#ffffff',
    fontSize: 44,
    fontWeight: '900',
  },
  title: {
    color: colors.text,
    fontSize: 26,
    fontWeight: '900',
    textAlign: 'center',
  },
  description: {
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 23,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 12,
  },
  phoneBadge: {
    width: '100%',
    borderRadius: 18,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 16,
    paddingHorizontal: 18,
    marginTop: 24,
    alignItems: 'center',
  },
  phoneLabel: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  phoneValue: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '900',
    marginTop: 6,
  },
  button: {
    width: '100%',
    height: 58,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '900',
  },
  footerText: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 16,
  },
});