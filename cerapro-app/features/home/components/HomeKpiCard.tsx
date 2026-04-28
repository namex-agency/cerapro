import { Eye, EyeOff, ShoppingBag } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/shared/theme/colors';
import { HomeKpiData } from '@/shared/types/home.types';

type HomeKpiRoute =
  | 'orders'
  | 'margin'
  | 'pv'
  | 'commissions'
  | 'debts'
  | 'contacts'
  | 'actions';

interface Props {
  data: HomeKpiData;
  onNavigate?: (route: HomeKpiRoute) => void;
}

export function HomeKpiCard({ data, onNavigate }: Props) {
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);

  const balanceText = isBalanceVisible
    ? formatCurrency(data.balance)
    : maskValue();

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View>
          <Text style={styles.label}>Solde</Text>
          <Text style={styles.balance}>{balanceText}</Text>
        </View>

        <Pressable
          onPress={() => setIsBalanceVisible((current) => !current)}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel={
            isBalanceVisible ? 'Masquer le solde' : 'Afficher le solde'
          }
        >
          {isBalanceVisible ? (
            <Eye size={23} color="#DDFBFA" strokeWidth={2.2} />
          ) : (
            <EyeOff size={23} color="#DDFBFA" strokeWidth={2.2} />
          )}
        </Pressable>
      </View>

      <Pressable
        onPress={() => onNavigate?.('orders')}
        style={styles.actionButton}
        accessibilityRole="button"
      >
        <ShoppingBag size={16} color={colors.primaryDark} strokeWidth={2.4} />
        <Text style={styles.actionText}>Voir mes commandes</Text>
      </Pressable>

      <View style={styles.grid}>
        <KpiItem
          label="Marge"
          value={isBalanceVisible ? formatCurrency(data.margin) : maskValue()}
          onPress={() => onNavigate?.('margin')}
        />

        <KpiItem
          label="PV"
          value={data.pv.toString()}
          onPress={() => onNavigate?.('pv')}
        />

        <KpiItem
          label="Commissions"
          value={
            isBalanceVisible ? formatCurrency(data.commissions) : maskValue()
          }
          onPress={() => onNavigate?.('commissions')}
        />

        <KpiItem
          label="Dettes"
          value={isBalanceVisible ? formatCurrency(data.debts) : maskValue()}
          onPress={() => onNavigate?.('debts')}
        />

        <KpiItem
          label="Contacts"
          value={data.contacts.toString()}
          onPress={() => onNavigate?.('contacts')}
        />

        <KpiItem
          label="Actions à faire"
          value={data.actionsToDo.toString()}
          onPress={() => onNavigate?.('actions')}
        />
      </View>
    </View>
  );
}

function KpiItem({
  label,
  value,
  onPress,
}: {
  label: string;
  value: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.kpiItem,
        pressed && styles.kpiItemPressed,
      ]}
      accessibilityRole="button"
    >
      <Text style={styles.kpiLabel}>{label}</Text>
      <Text style={styles.kpiValue}>{value}</Text>
    </Pressable>
  );
}

function formatCurrency(value: number) {
  return `${value.toLocaleString('fr-FR')} FCFA`;
}

function maskValue() {
  return '••••••';
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 20,
    marginTop: 4,
    borderRadius: 26,
    backgroundColor: colors.primary,
    padding: 20,
  },

  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  label: {
    color: '#DDFBFA',
    fontSize: 15,
    fontWeight: '700',
  },

  balance: {
    marginTop: 8,
    color: '#FFFFFF',
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: -0.8,
  },

  actionButton: {
    marginTop: 18,
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  actionText: {
    color: colors.primaryDark,
    fontSize: 14,
    fontWeight: '800',
  },

  grid: {
    marginTop: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },

  kpiItem: {
    width: '47%',
    minHeight: 82,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.18)',
    padding: 14,
    justifyContent: 'space-between',
  },

  kpiItemPressed: {
    opacity: 0.82,
  },

  kpiLabel: {
    color: '#E7FFFF',
    fontSize: 14,
    fontWeight: '700',
  },

  kpiValue: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: -0.4,
  },
});