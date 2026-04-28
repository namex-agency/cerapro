import {
  CalendarDays,
  Camera,
  ChevronLeft,
  Flag,
  Home,
  IdCard,
  Landmark,
  MapPin,
  Phone,
  User,
} from 'lucide-react-native';
import { Stack, useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { colors } from '@/shared/theme/colors';

export default function AccountKycScreen() {
  const router = useRouter();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
        >
          <ChevronLeft size={30} color={colors.primaryDark} strokeWidth={2.6} />
        </Pressable>

        <View style={styles.header}>
          <View style={styles.iconBox}>
            <IdCard size={28} color={colors.primaryDark} strokeWidth={2.4} />
          </View>

          <Text style={styles.title}>Mise à jour KYC</Text>
          <Text style={styles.subtitle}>
            Renseignez vos informations exactes pour sécuriser votre compte CERAPRO.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Identité</Text>

        <KycInput
          icon={<User size={20} color={colors.primaryDark} />}
          label="Nom complet"
          placeholder="Eric Namo"
        />

        <KycInput
          icon={<Phone size={20} color={colors.primaryDark} />}
          label="Numéro de téléphone"
          placeholder="+237 6XX XXX XXX"
          keyboardType="phone-pad"
        />

        <KycInput
          icon={<CalendarDays size={20} color={colors.primaryDark} />}
          label="Date de naissance"
          placeholder="JJ/MM/AAAA"
        />

        <KycInput
          icon={<MapPin size={20} color={colors.primaryDark} />}
          label="Lieu de naissance"
          placeholder="Ex : Bafoussam"
        />

        <Text style={styles.sectionTitle}>Adresse actuelle</Text>

        <KycInput
          icon={<Home size={20} color={colors.primaryDark} />}
          label="Lieu dit"
          placeholder="Ex : Carrefour Mvog-Mbi"
        />

        <KycInput
          icon={<Landmark size={20} color={colors.primaryDark} />}
          label="Quartier"
          placeholder="Ex : Mvan"
        />

        <KycInput
          icon={<MapPin size={20} color={colors.primaryDark} />}
          label="Ville"
          placeholder="Ex : Yaoundé"
        />

        <KycInput
          icon={<Flag size={20} color={colors.primaryDark} />}
          label="Pays"
          placeholder="Ex : Cameroun"
        />

        <Text style={styles.sectionTitle}>Documents</Text>

        <KycUpload title="Photo selfie" />
        <KycUpload title="CNI recto" />
        <KycUpload title="CNI verso" />

        <Pressable style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
          <Text style={styles.buttonText}>Soumettre le KYC</Text>
        </Pressable>
      </ScrollView>
    </>
  );
}

function KycInput({
  icon,
  label,
  placeholder,
  keyboardType = 'default',
}: {
  icon: React.ReactNode;
  label: string;
  placeholder: string;
  keyboardType?: 'default' | 'phone-pad';
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>

      <View style={styles.inputWrap}>
        {icon}
        <TextInput
          keyboardType={keyboardType}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          style={styles.input}
        />
      </View>
    </View>
  );
}

function KycUpload({ title }: { title: string }) {
  return (
    <Pressable style={({ pressed }) => [styles.uploadBox, pressed && styles.pressed]}>
      <Camera size={23} color={colors.primaryDark} strokeWidth={2.4} />
      <View>
        <Text style={styles.uploadTitle}>{title}</Text>
        <Text style={styles.uploadText}>Ajouter une image</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 54,
    paddingBottom: 38,
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

  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.text,
    marginBottom: 12,
    marginTop: 10,
  },

  field: {
    marginBottom: 16,
  },

  label: {
    fontSize: 14,
    fontWeight: '900',
    color: colors.text,
    marginBottom: 8,
  },

  inputWrap: {
    height: 58,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
  },

  uploadBox: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
  },

  uploadTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.text,
  },

  uploadText: {
    marginTop: 3,
    fontSize: 13,
    fontWeight: '700',
    color: colors.textMuted,
  },

  button: {
    marginTop: 10,
    height: 58,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },

  pressed: {
    opacity: 0.72,
  },
});