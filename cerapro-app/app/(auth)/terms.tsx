import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/shared/theme/colors';

export default function TermsScreen() {
  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.brand}>CERAPRO</Text>
          <Text style={styles.kicker}>Conditions d’utilisation</Text>

          <Text style={styles.title}>Conditions Générales d’Utilisation</Text>

          <Text style={styles.intro}>
            CERAPRO est une plateforme professionnelle destinée aux distributeurs Longrich
            (“Longricheurs”) afin de structurer, sécuriser et développer leur activité à travers
            des outils digitaux avancés (CRM, ventes, mini-site, wallet, IA).
          </Text>

          {/* ENTREPRISE */}
          <View style={styles.companyCard}>
            <Text style={styles.companyTitle}>Éditeur du service</Text>
            <Text style={styles.companyText}>
              CERAPRO est un produit conçu et exploité par ACERA COOPERATION SARL
              (African Customer Experience Rating Agency), société régulièrement constituée
              au Cameroun.
            </Text>

            <Text style={styles.companyMeta}>RCCM : CM-NSI-01-2025-B12-01491</Text>
            <Text style={styles.companyMeta}>NIU : M102518122409U</Text>
            <Text style={styles.companyMeta}>
              Contacts : (+237) 6 78 48 47 95 / 6 90 79 69 83
            </Text>
          </View>

          {/* SECTION */}
          <Section title="1. Acceptation des conditions"
            text="L’utilisation de CERAPRO implique l’acceptation pleine et entière des présentes conditions. Tout utilisateur refusant ces conditions doit cesser immédiatement l’utilisation de la plateforme." />

          <Section title="2. Accès à la plateforme"
            text="L’accès à CERAPRO est conditionné par la création d’un compte sécurisé via un numéro de téléphone et un mot de passe. L’utilisateur est responsable de la confidentialité de ses identifiants." />

          <Section title="3. Abonnement"
            text="L’accès aux fonctionnalités de CERAPRO est soumis à un abonnement mensuel de 1000 FCFA. En cas d’expiration de l’abonnement, l’accès à l’ensemble des fonctionnalités est automatiquement suspendu jusqu’au renouvellement." />

          <Section title="4. Blocage en cas d’abonnement expiré"
            text="Lorsque l’abonnement arrive à échéance, l’utilisateur ne peut plus accéder aux modules de gestion, au wallet, ni au mini-site. Les données restent conservées mais l’accès est temporairement restreint." />

          <Section title="5. KYC (Know Your Customer)"
            text="L’accès aux fonctionnalités financières (wallet, retraits, paiements, mini-site e-commerce) est strictement conditionné par la validation complète du KYC. Les informations demandées incluent notamment : identité complète, date et lieu de naissance, adresse, photo selfie et documents officiels (CNI recto/verso)." />

          <Section title="6. Responsabilité des informations KYC"
            text="L’utilisateur s’engage à fournir des informations exactes, complètes et vérifiables. Toute fausse déclaration peut entraîner la suspension ou la suppression du compte sans préavis." />

          <Section title="7. Wallet et transactions"
            text="Chaque utilisateur dispose d’un wallet personnel permettant de recevoir les paiements issus de son activité. Toutes les opérations (commandes, crédits, retraits) sont strictement traçables et associées à un utilisateur unique." />

          <Section title="8. Mini-site personnel"
            text="Chaque Longricheur peut disposer d’un mini-site e-commerce personnel. Les commandes passées via ce site sont liées exclusivement à son compte. Aucun utilisateur ne peut accéder aux transactions d’un autre utilisateur." />

          <Section title="9. Isolation des données"
            text="CERAPRO garantit une isolation stricte des données. Aucun utilisateur ne peut consulter ou modifier les données d’un autre utilisateur (contacts, ventes, wallet, historique, actions, etc.)." />

          <Section title="10. Utilisation autorisée"
            text="L’utilisateur s’engage à utiliser CERAPRO de manière légale, éthique et conforme à son activité. Toute utilisation frauduleuse, abusive ou contraire aux lois peut entraîner la suspension du compte." />

          <Section title="11. Sécurité"
            text="CERAPRO met en œuvre des mesures de sécurité avancées (isolation des données, traçabilité, contrôle d’accès). Toutefois, l’utilisateur est responsable de la sécurité de son appareil et de ses accès." />

          <Section title="12. Limitation de responsabilité"
            text="CERAPRO est un outil de gestion et d’accompagnement. La plateforme ne garantit aucun revenu, performance commerciale ou résultat financier. L’utilisateur reste entièrement responsable de son activité." />

          <Section title="13. Suspension et résiliation"
            text="CERAPRO peut suspendre ou supprimer un compte en cas de non-respect des présentes conditions, fraude, utilisation abusive ou risque pour la sécurité de la plateforme." />

          <Section title="14. Services tiers"
            text="Certaines fonctionnalités peuvent dépendre de services externes (paiements, hébergement, messagerie). CERAPRO ne peut être tenu responsable des défaillances de ces services tiers." />

          <Section title="15. Évolution des conditions"
            text="Les présentes conditions peuvent être modifiées à tout moment afin de s’adapter aux évolutions de CERAPRO et aux exigences légales en vigueur. L’utilisateur est invité à les consulter régulièrement." />

          <Section title="16. Droit applicable"
            text="Les présentes conditions sont régies par le droit camerounais. En cas de litige, les juridictions compétentes du Cameroun seront seules habilitées." />

          <Section title="17. Contact"
            text="Pour toute question relative à ces conditions, vous pouvez contacter CERAPRO via les coordonnées officielles mentionnées ci-dessus." />

          <Pressable style={styles.button} onPress={() => router.back()}>
            <Text style={styles.buttonText}>Retour</Text>
          </Pressable>

          <Text style={styles.footer}>
            © 2026 CERAPRO — Produit officiel ACERA COOPERATION SARL
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

function Section({ title, text }: { title: string; text: string }) {
  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  content: {
    maxWidth: 720,
    alignSelf: 'center',
  },
  brand: {
    color: colors.primary,
    fontSize: 34,
    fontWeight: '900',
    textAlign: 'center',
  },
  kicker: {
    color: colors.textMuted,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '900',
    textAlign: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  intro: {
    color: colors.textMuted,
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 20,
  },
  companyCard: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },
  companyTitle: {
    color: '#fff',
    fontWeight: '900',
    marginBottom: 6,
  },
  companyText: {
    color: '#fff',
    fontSize: 14,
  },
  companyMeta: {
    color: '#fff',
    fontSize: 13,
    marginTop: 4,
    fontWeight: '700',
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontWeight: '900',
    marginBottom: 6,
  },
  text: {
    color: colors.textMuted,
    fontSize: 14,
  },
  button: {
    marginTop: 20,
    backgroundColor: colors.primary,
    height: 56,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '900',
  },
  footer: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 12,
    color: colors.textMuted,
  },
});