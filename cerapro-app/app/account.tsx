import {
  Bell,
  ChevronLeft,
  Globe2,
  LockKeyhole,
  Moon,
  Smartphone,
} from 'lucide-react-native';
import { Stack, useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AccountKycBadge } from '@/features/account/components/AccountKycBadge';
import { AccountPreferenceRow } from '@/features/account/components/AccountPreferenceRow';
import { AccountProfileCard } from '@/features/account/components/AccountProfileCard';
import { AccountSecurityRow } from '@/features/account/components/AccountSecurityRow';
import { AccountSubscriptionCard } from '@/features/account/components/AccountSubscriptionCard';
import * as ImagePicker from 'expo-image-picker';
import { colors } from '@/shared/theme/colors';

export default function AccountScreen() {
  const router = useRouter();

 const handleChangePhoto = async () => {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (!permission.granted) {
    alert('Permission refusée pour accéder à la galerie');
    return;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.7,
  });

  if (!result.canceled) {
    const image = result.assets[0].uri;

    console.log('Image sélectionnée :', image);

    // Étape suivante (plus tard) :
    // → upload backend
    // → mise à jour avatar global
  }
};

const handleKycPress = () => {
  router.push('/account-kyc');
};

const handleSubscriptionPress = () => {
  router.push('/account-subscription');
};

 const handleLanguagePress = () => {
  router.push('/account-language');
};
 const handleThemePress = () => {
  router.push('/account-theme');
};

  const handleNotificationPress = () => {
  router.push('/account-notifications');
};

 const handlePasswordPress = () => {
  router.push('/account-password');
};

 const handlePhoneSecurityPress = () => {
  router.push('/account-phone');
};

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

        <AccountProfileCard
          fullName="Eric Namo"
          phone="+237 6XX XXX XXX"
          isKycComplete={false}
          onPressChangePhoto={handleChangePhoto}
        />

        <AccountKycBadge
          isKycComplete={false}
          onPress={handleKycPress}
        />

        <AccountSubscriptionCard
          status="ACTIVE"
          startDate="01 Avr 2026"
          endDate="30 Avr 2026"
          progress={80}
          onPress={handleSubscriptionPress}
        />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Préférences</Text>

          <AccountPreferenceRow
            icon={<Globe2 size={22} color={colors.primaryDark} />}
            title="Langue"
            value="Français"
            onPress={handleLanguagePress}
          />

          <AccountPreferenceRow
            icon={<Moon size={22} color={colors.primaryDark} />}
            title="Thème"
            value="Clair"
            onPress={handleThemePress}
          />

          <AccountPreferenceRow
            icon={<Bell size={22} color={colors.primaryDark} />}
            title="Notifications"
            value="Activées"
            onPress={handleNotificationPress}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sécurité</Text>

          <AccountSecurityRow
            icon={<LockKeyhole size={22} color={colors.primaryDark} />}
            title="Mot de passe"
            value="Modifier"
            onPress={handlePasswordPress}
          />

          <AccountSecurityRow
            icon={<Smartphone size={22} color={colors.primaryDark} />}
            title="Téléphone"
            value="+237 6XX XXX XXX"
            onPress={handlePhoneSecurityPress}
          />
        </View>
      </ScrollView>
    </>
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
    marginBottom: 10,
  },

  section: {
    marginTop: 24,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.text,
    marginBottom: 10,
  },

  pressed: {
    opacity: 0.68,
  },
});