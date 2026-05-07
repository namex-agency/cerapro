import { useEffect, useState } from 'react';
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
import * as ImagePicker from 'expo-image-picker';

import { AccountKycBadge } from '@/features/account/components/AccountKycBadge';
import { AccountPreferenceRow } from '@/features/account/components/AccountPreferenceRow';
import { AccountProfileCard } from '@/features/account/components/AccountProfileCard';
import { AccountSecurityRow } from '@/features/account/components/AccountSecurityRow';
import { AccountSubscriptionCard } from '@/features/account/components/AccountSubscriptionCard';
import { getMe } from '@/shared/api/client';
import { colors } from '@/shared/theme/colors';

type SubscriptionCardStatus = 'TRIAL' | 'ACTIVE' | 'EXPIRED';

type AccountUser = {
  fullName?: string;
  phone?: string;
  country?: string;
  isKycVerified?: boolean;
  subscription?: {
    status?: string;
    startsAt?: string;
    endsAt?: string;
    trialEndsAt?: string;
  } | null;
};

function formatDate(value?: string | null) {
  if (!value) return '—';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return '—';

  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function calculateSubscriptionProgress(start?: string, end?: string | null) {
  if (!start || !end) return 0;

  const startDate = new Date(start).getTime();
  const endDate = new Date(end).getTime();
  const now = Date.now();

  if (
    Number.isNaN(startDate) ||
    Number.isNaN(endDate) ||
    endDate <= startDate
  ) {
    return 0;
  }

  const progress = ((now - startDate) / (endDate - startDate)) * 100;

  return Math.min(100, Math.max(0, Math.round(progress)));
}

export default function AccountScreen() {
  const router = useRouter();
  const [user, setUser] = useState<AccountUser | null>(null);

  useEffect(() => {
    async function loadUser() {
      try {
        const data = await getMe();
        setUser(data);
      } catch (error) {
        console.log('Erreur getMe account:', error);
      }
    }

    loadUser();
  }, []);

  const subscriptionEndDate =
    user?.subscription?.endsAt ?? user?.subscription?.trialEndsAt ?? null;

  const subscriptionStatus: SubscriptionCardStatus =
    user?.subscription?.status === 'TRIALING'
      ? 'TRIAL'
      : user?.subscription?.status === 'ACTIVE'
        ? 'ACTIVE'
        : 'EXPIRED';

  const subscriptionProgress = calculateSubscriptionProgress(
    user?.subscription?.startsAt,
    subscriptionEndDate,
  );

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
    }
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
  fullName={user?.fullName || 'Longricheur'}
  phone={user?.phone || '—'}
  country={user?.country || 'Cameroun'}
  isKycComplete={user?.isKycVerified ?? false}
  onPressChangePhoto={handleChangePhoto}
/>

        <AccountKycBadge
          isKycComplete={user?.isKycVerified ?? false}
          onPress={() => router.push('/account-kyc')}
        />

        <AccountSubscriptionCard
          status={subscriptionStatus}
          startDate={formatDate(user?.subscription?.startsAt)}
          endDate={formatDate(subscriptionEndDate)}
          progress={subscriptionProgress}
          onPress={() => router.push('/account-subscription')}
        />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Préférences</Text>

          <AccountPreferenceRow
            icon={<Globe2 size={22} color={colors.primaryDark} />}
            title="Langue"
            value="Français"
            onPress={() => router.push('/account-language')}
          />

          <AccountPreferenceRow
            icon={<Moon size={22} color={colors.primaryDark} />}
            title="Thème"
            value="Clair"
            onPress={() => router.push('/account-theme')}
          />

          <AccountPreferenceRow
            icon={<Bell size={22} color={colors.primaryDark} />}
            title="Notifications"
            value="Activées"
            onPress={() => router.push('/account-notifications')}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sécurité</Text>

          <AccountSecurityRow
            icon={<LockKeyhole size={22} color={colors.primaryDark} />}
            title="Mot de passe"
            value="Modifier"
            onPress={() => router.push('/account-password')}
          />

          <AccountSecurityRow
            icon={<Smartphone size={22} color={colors.primaryDark} />}
            title="Téléphone"
            value={user?.phone || '—'}
            onPress={() => router.push('/account-phone')}
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