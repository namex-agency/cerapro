import { Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors } from '@/shared/theme/colors';

type RegisterOtpModalProps = {
  visible: boolean;
  otpCode: string;
  phone: string;
  onChangeOtpCode: (text: string) => void;
  onClose: () => void;
};

export function RegisterOtpModal({
  visible,
  otpCode,
  phone,
  onChangeOtpCode,
  onClose,
}: RegisterOtpModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>Code de vérification</Text>

          <Text style={styles.description}>
            Nous avons envoyé un code WhatsApp au numéro +237 {phone}.
          </Text>

          <TextInput
            style={styles.input}
            value={otpCode}
            onChangeText={onChangeOtpCode}
            placeholder="000000"
            placeholderTextColor={colors.textMuted}
            keyboardType="number-pad"
            maxLength={6}
            textAlign="center"
          />

          <Text style={styles.helperText}>
            Entrez le code reçu pour finaliser votre inscription.
          </Text>

          <Pressable style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Fermer</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  card: {
    width: '100%',
    borderRadius: 24,
    backgroundColor: colors.surface,
    padding: 24,
  },
  title: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '900',
    textAlign: 'center',
  },
  description: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 12,
  },
  input: {
    height: 64,
    borderWidth: 1.4,
    borderColor: colors.border,
    borderRadius: 14,
    backgroundColor: colors.background,
    color: colors.text,
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 8,
    marginTop: 22,
  },
  helperText: {
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 10,
  },
  closeButton: {
    height: 54,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 22,
  },
  closeButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '900',
  },
});