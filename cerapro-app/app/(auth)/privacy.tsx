import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/shared/theme/colors';

export default function PrivacyScreen() {
  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <Text style={styles.brand}>CERAPRO</Text>
          <Text style={styles.kicker}>Protection des données & sécurité</Text>

          <Text style={styles.title}>Politique de confidentialité</Text>

          <Text style={styles.intro}>
            CERAPRO est une plateforme professionnelle conçue pour permettre aux
            Longricheurs de gérer leur activité comme une véritable entreprise,
            dans un environnement sécurisé, structuré et strictement personnel.
          </Text>

          {/* SECTION 1 */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>1. Données collectées</Text>
            <Text style={styles.text}>
              Nous collectons uniquement les données nécessaires au bon
              fonctionnement de la plateforme CERAPRO, notamment :
            </Text>

            <Text style={styles.list}>
              • Informations d’identification (nom, numéro de téléphone){'\n'}
              • Données de compte et de sécurité{'\n'}
              • Données d’activité (contacts, actions, ventes, dettes,
              historique){'\n'}
              • Données financières liées au wallet (transactions, retraits,
              commandes){'\n'}
              • Données liées au mini-site personnel et aux commandes clients
            </Text>
          </View>

          {/* SECTION 2 */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>2. Finalité des données</Text>
            <Text style={styles.text}>
              Vos données sont utilisées exclusivement pour :
            </Text>

            <Text style={styles.list}>
              • Fournir un espace personnel sécurisé{'\n'}
              • Gérer votre activité Longrich (CRM, ventes, comptabilité){'\n'}
              • Assurer le suivi des transactions et du wallet{'\n'}
              • Garantir la traçabilité des opérations{'\n'}
              • Améliorer l’expérience utilisateur CERAPRO
            </Text>
          </View>

          {/* SECTION 3 */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>
              3. Isolation stricte des données
            </Text>
            <Text style={styles.text}>
              CERAPRO repose sur une règle fondamentale :
            </Text>

            <Text style={styles.highlight}>
              Chaque Longricheur possède un espace totalement privé et isolé.
            </Text>

            <Text style={styles.text}>
              Cela signifie que :
            </Text>

            <Text style={styles.list}>
              • Vos contacts ne sont visibles que par vous{'\n'}
              • Vos ventes et dettes sont strictement personnelles{'\n'}
              • Votre wallet est totalement isolé{'\n'}
              • Votre mini-site n’impacte aucun autre utilisateur{'\n'}
              • Aucune donnée d’un utilisateur n’est accessible à un autre
            </Text>
          </View>

          {/* SECTION 4 */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>4. Sécurité</Text>
            <Text style={styles.text}>
              CERAPRO met en œuvre des mécanismes de sécurité avancés afin de
              protéger vos données contre tout accès non autorisé :
            </Text>

            <Text style={styles.list}>
              • Isolation logique par utilisateur{'\n'}
              • Sécurisation des accès et des sessions{'\n'}
              • Journalisation des actions sensibles{'\n'}
              • Protection des données financières{'\n'}
              • Infrastructure backend sécurisée
            </Text>
          </View>

          {/* SECTION 5 */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>5. Données financières</Text>
            <Text style={styles.text}>
              Les données liées à votre wallet (solde, transactions, retraits,
              commandes) sont utilisées uniquement pour garantir :
            </Text>

            <Text style={styles.list}>
              • La traçabilité complète des opérations{'\n'}
              • La transparence financière{'\n'}
              • La gestion sécurisée de votre activité
            </Text>
          </View>

          {/* SECTION 6 */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>
              6. Confidentialité & non-partage
            </Text>
            <Text style={styles.text}>
              CERAPRO ne vend ni ne partage vos données personnelles à des tiers.
            </Text>

            <Text style={styles.text}>
              Vos informations peuvent uniquement être utilisées dans les cas
              suivants :
            </Text>

            <Text style={styles.list}>
              • Fonctionnement normal de la plateforme{'\n'}
              • Sécurité et prévention des abus{'\n'}
              • Obligations légales si applicable
            </Text>
          </View>

          {/* SECTION 7 */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>7. Responsabilité utilisateur</Text>
            <Text style={styles.text}>
              Chaque utilisateur est responsable de la confidentialité de ses
              accès (mot de passe, appareil, session).
            </Text>
          </View>

          {/* SECTION 8 */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>8. Évolution</Text>
            <Text style={styles.text}>
              Cette politique peut évoluer afin de s’adapter aux améliorations de
              CERAPRO et aux exigences réglementaires.
            </Text>
          </View>

          {/* SECTION 9 */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>9. Contact</Text>
            <Text style={styles.text}>
              Pour toute question liée à vos données ou à la sécurité de votre
              compte, vous pouvez contacter le support CERAPRO depuis votre app.
            </Text>
          </View>

          <Pressable style={styles.button} onPress={() => router.back()}>
            <Text style={styles.buttonText}>Retour</Text>
          </Pressable>

          <Text style={styles.footer}>
            © 2026 CERAPRO — Tous droits réservés.
          </Text>
        </View>
      </ScrollView>
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
    width: '100%',
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
    letterSpacing: 1.2,
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
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 24,
    fontWeight: '600',
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '900',
    marginBottom: 8,
  },
  text: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 22,
    fontWeight: '600',
  },
  list: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 22,
    marginTop: 6,
    fontWeight: '600',
  },
  highlight: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '900',
    marginVertical: 8,
  },
  button: {
    marginTop: 20,
    height: 56,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '900',
  },
  footer: {
    color: colors.textMuted,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 20,
  },
});