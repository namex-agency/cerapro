import { useEffect, useMemo, useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
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
import * as ImagePicker from 'expo-image-picker';
import { Stack, useRouter } from 'expo-router';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { getMyKyc, updateMyKyc } from '@/shared/api/client';
import { CAMEROON_CITIES } from '@/shared/data/cameroon-cities';
import { colors } from '@/shared/theme/colors';

const CLOUDINARY_KYC_UPLOAD_URL =
  'https://cerapro-production.up.railway.app/cloudinary/upload?type=kyc';

type CityField = 'birthPlace' | 'city';
type KycImageField = 'selfieUrl' | 'cniFrontUrl' | 'cniBackUrl';

function normalizeSearchText(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export default function AccountKycScreen() {
  const router = useRouter();
  const [form, setForm] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingField, setUploadingField] = useState<KycImageField | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [activeCityField, setActiveCityField] = useState<CityField | null>(null);

  useEffect(() => {
    async function loadKyc() {
      setLoading(true);

      try {
        const data = await getMyKyc();
        setForm(data);
      } catch (error) {
        Alert.alert(
          'KYC',
          'Impossible de charger vos informations KYC pour le moment.',
        );
      } finally {
        setLoading(false);
      }
    }

    loadKyc();
  }, []);

  const citySuggestions = useMemo(() => {
    if (!activeCityField) return [];

    const currentValue = String(form?.[activeCityField] || '').trim();

    if (!currentValue) return [];

    const query = normalizeSearchText(currentValue);

    return CAMEROON_CITIES.filter((city) =>
      normalizeSearchText(city).includes(query),
    ).slice(0, 6);
  }, [activeCityField, form]);

  function handleCityChange(field: CityField, value: string) {
    setActiveCityField(field);
    setForm({ ...form, [field]: value });
  }

  function handleSelectCity(field: CityField, city: string) {
    setForm({ ...form, [field]: city });
    setActiveCityField(null);
  }

  function handleDateChange(event: any, selectedDate?: Date) {
    setShowDatePicker(false);

    if (selectedDate) {
      const isoDate = selectedDate.toISOString().slice(0, 10);
      setForm({ ...form, birthDate: isoDate });
    }
  }

  async function pickImage(source: 'camera' | 'library') {
    try {
      const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
      const galleryPermission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!cameraPermission.granted || !galleryPermission.granted) {
        Alert.alert(
          'Permissions requises',
          "Autorisez l'accès à la caméra et à la galerie pour ajouter vos documents KYC.",
        );
        return null;
      }

      const result =
        source === 'camera'
          ? await ImagePicker.launchCameraAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              quality: 0.7,
            })
          : await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              quality: 0.7,
            });

      if (result.canceled) return null;

      return result.assets[0];
    } catch (error) {
      Alert.alert('Erreur', "Impossible d'ouvrir la caméra ou la galerie.");
      return null;
    }
  }

  async function uploadImageToCloudinary(image: ImagePicker.ImagePickerAsset) {
    const formData = new FormData();

    formData.append('file', {
      uri: image.uri,
      name: 'kyc-document.jpg',
      type: 'image/jpeg',
    } as any);

    const response = await fetch(CLOUDINARY_KYC_UPLOAD_URL, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (!response.ok || !data?.success || !data?.data?.url) {
      throw new Error(data?.message || 'Upload Cloudinary impossible.');
    }

    return data.data.url;
  }

  function openImagePicker(field: KycImageField) {
    Alert.alert('Ajouter une image', 'Choisissez une source', [
      {
        text: 'Caméra',
        onPress: async () => {
          await handleImageFlow(field, 'camera');
        },
      },
      {
        text: 'Galerie',
        onPress: async () => {
          await handleImageFlow(field, 'library');
        },
      },
      {
        text: 'Annuler',
        style: 'cancel',
      },
    ]);
  }

  async function handleImageFlow(field: KycImageField, source: 'camera' | 'library') {
    if (uploadingField) return;

    const image = await pickImage(source);

    if (!image) return;

    setUploadingField(field);

    try {
      const uploadedUrl = await uploadImageToCloudinary(image);

      setForm((current: any) => ({
        ...current,
        [field]: uploadedUrl,
      }));

      Alert.alert('Image ajoutée', 'Votre image a été envoyée avec succès.');
    } catch (error) {
      Alert.alert(
        'Erreur upload',
        error instanceof Error
          ? error.message
          : "Impossible d'envoyer l'image pour le moment.",
      );
    } finally {
      setUploadingField(null);
    }
  }

  async function handleSubmitKyc() {
    if (submitting) return;

    if (!form?.fullName?.trim()) {
      Alert.alert('Champ obligatoire', 'Le nom complet est obligatoire.');
      return;
    }

    if (!form?.phone?.trim()) {
      Alert.alert('Champ obligatoire', 'Le numéro WhatsApp est obligatoire.');
      return;
    }

    if (!form?.country?.trim()) {
      Alert.alert('Champ obligatoire', 'Le pays est obligatoire.');
      return;
    }

    setSubmitting(true);

    try {
      await updateMyKyc({
        fullName: form.fullName?.trim(),
        phone: form.phone?.trim(),
        birthDate: form.birthDate?.trim(),
        birthPlace: form.birthPlace?.trim(),
        placeName: form.placeName?.trim(),
        district: form.district?.trim(),
        city: form.city?.trim(),
        country: form.country?.trim(),
        selfieUrl: form.selfieUrl,
        cniFrontUrl: form.cniFrontUrl,
        cniBackUrl: form.cniBackUrl,
      });

      Alert.alert(
        'KYC soumis',
        'Vos informations ont été envoyées pour vérification.',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ],
      );
    } catch (error) {
      Alert.alert(
        'Erreur KYC',
        error instanceof Error
          ? error.message
          : 'Impossible de soumettre le KYC pour le moment.',
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
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
          placeholder="Nom complet"
          value={form?.fullName || ''}
          onChangeText={(text) => setForm({ ...form, fullName: text })}
        />

        <KycInput
          icon={<Phone size={20} color={colors.primaryDark} />}
          label="Numéro de téléphone"
          placeholder="Numéro WhatsApp"
          keyboardType="phone-pad"
          value={form?.phone || ''}
          onChangeText={(text) => setForm({ ...form, phone: text })}
        />

        <Pressable onPress={() => setShowDatePicker(true)}>
          <KycInput
            icon={<CalendarDays size={20} color={colors.primaryDark} />}
            label="Date de naissance"
            placeholder="AAAA-MM-JJ"
            value={form?.birthDate ? String(form.birthDate).slice(0, 10) : ''}
            editable={false}
          />
        </Pressable>

        <CityAutocompleteInput
          icon={<MapPin size={20} color={colors.primaryDark} />}
          label="Lieu de naissance"
          placeholder="Ex : Bafoussam"
          value={form?.birthPlace || ''}
          isActive={activeCityField === 'birthPlace'}
          suggestions={citySuggestions}
          onFocus={() => setActiveCityField('birthPlace')}
          onChangeText={(text) => handleCityChange('birthPlace', text)}
          onSelect={(city) => handleSelectCity('birthPlace', city)}
        />

        <Text style={styles.sectionTitle}>Adresse actuelle</Text>

        <KycInput
          icon={<Home size={20} color={colors.primaryDark} />}
          label="Lieu dit"
          placeholder="Ex : Carrefour Mvog-Mbi"
          value={form?.placeName || ''}
          onChangeText={(text) => setForm({ ...form, placeName: text })}
        />

        <KycInput
          icon={<Landmark size={20} color={colors.primaryDark} />}
          label="Quartier"
          placeholder="Ex : Mvan"
          value={form?.district || ''}
          onChangeText={(text) => setForm({ ...form, district: text })}
        />

        <CityAutocompleteInput
          icon={<MapPin size={20} color={colors.primaryDark} />}
          label="Ville"
          placeholder="Ex : Yaoundé"
          value={form?.city || ''}
          isActive={activeCityField === 'city'}
          suggestions={citySuggestions}
          onFocus={() => setActiveCityField('city')}
          onChangeText={(text) => handleCityChange('city', text)}
          onSelect={(city) => handleSelectCity('city', city)}
        />

        <KycInput
          icon={<Flag size={20} color={colors.primaryDark} />}
          label="Pays"
          placeholder="Ex : Cameroun"
          value={form?.country || 'Cameroun'}
          onChangeText={(text) => setForm({ ...form, country: text })}
        />

        <Text style={styles.sectionTitle}>Documents</Text>

        <KycUpload
          title="Photo selfie"
          imageUrl={form?.selfieUrl}
          uploading={uploadingField === 'selfieUrl'}
          onPress={() => openImagePicker('selfieUrl')}
        />

        <KycUpload
          title="CNI recto"
          imageUrl={form?.cniFrontUrl}
          uploading={uploadingField === 'cniFrontUrl'}
          onPress={() => openImagePicker('cniFrontUrl')}
        />

        <KycUpload
          title="CNI verso"
          imageUrl={form?.cniBackUrl}
          uploading={uploadingField === 'cniBackUrl'}
          onPress={() => openImagePicker('cniBackUrl')}
        />

        <Pressable
          onPress={handleSubmitKyc}
          disabled={loading || submitting || !!uploadingField}
          style={({ pressed }) => [
            styles.button,
            (loading || submitting || !!uploadingField) && styles.buttonDisabled,
            pressed && styles.pressed,
          ]}
        >
          {submitting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Soumettre le KYC</Text>
          )}
        </Pressable>

        {showDatePicker && (
          <DateTimePicker
            value={form?.birthDate ? new Date(form.birthDate) : new Date()}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}
      </ScrollView>
    </>
  );
}

function KycInput({
  icon,
  label,
  placeholder,
  value,
  onChangeText,
  onFocus,
  keyboardType = 'default',
  editable = true,
}: {
  icon: React.ReactNode;
  label: string;
  placeholder: string;
  value?: string;
  onChangeText?: (text: string) => void;
  onFocus?: () => void;
  keyboardType?: 'default' | 'phone-pad';
  editable?: boolean;
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
          value={value}
          onChangeText={onChangeText}
          onFocus={onFocus}
          editable={editable}
          autoCapitalize="words"
          autoCorrect={false}
        />
      </View>
    </View>
  );
}

function CityAutocompleteInput({
  icon,
  label,
  placeholder,
  value,
  isActive,
  suggestions,
  onFocus,
  onChangeText,
  onSelect,
}: {
  icon: React.ReactNode;
  label: string;
  placeholder: string;
  value: string;
  isActive: boolean;
  suggestions: string[];
  onFocus: () => void;
  onChangeText: (text: string) => void;
  onSelect: (city: string) => void;
}) {
  return (
    <View style={styles.autocompleteWrapper}>
      <KycInput
        icon={icon}
        label={label}
        placeholder={placeholder}
        value={value}
        onFocus={onFocus}
        onChangeText={onChangeText}
      />

      {isActive && suggestions.length > 0 ? (
        <View style={styles.suggestionsBox}>
          {suggestions.map((city) => (
            <Pressable
              key={city}
              onPress={() => onSelect(city)}
              style={({ pressed }) => [
                styles.suggestionItem,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.suggestionText}>{city}</Text>
            </Pressable>
          ))}
        </View>
      ) : null}
    </View>
  );
}

function KycUpload({
  title,
  imageUrl,
  uploading,
  onPress,
}: {
  title: string;
  imageUrl?: string;
  uploading?: boolean;
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={uploading}
      style={({ pressed }) => [
        styles.uploadBox,
        imageUrl && styles.uploadBoxWithImage,
        pressed && styles.pressed,
      ]}
    >
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={styles.uploadPreview} />
      ) : (
        <View style={styles.uploadIconBox}>
          {uploading ? (
            <ActivityIndicator color={colors.primaryDark} />
          ) : (
            <Camera size={23} color={colors.primaryDark} strokeWidth={2.4} />
          )}
        </View>
      )}

      <View style={styles.uploadContent}>
        <Text style={styles.uploadTitle}>{title}</Text>
        <Text style={styles.uploadText}>
          {uploading
            ? 'Envoi en cours...'
            : imageUrl
              ? 'Image ajoutée — toucher pour remplacer'
              : 'Ajouter une image'}
        </Text>
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

  autocompleteWrapper: {
    marginBottom: 2,
  },

  label: {
    fontSize: 14,
    fontWeight: '900',
    color: colors.text,
    marginBottom: 8,
  },

  inputWrap: {
    minHeight: 58,
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
    minHeight: 58,
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
  },

  suggestionsBox: {
    marginTop: -8,
    marginBottom: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },

  suggestionItem: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  suggestionText: {
    fontSize: 15,
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

  uploadBoxWithImage: {
    minHeight: 88,
  },

  uploadIconBox: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },

  uploadPreview: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: colors.primaryLight,
  },

  uploadContent: {
    flex: 1,
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

  buttonDisabled: {
    opacity: 0.62,
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