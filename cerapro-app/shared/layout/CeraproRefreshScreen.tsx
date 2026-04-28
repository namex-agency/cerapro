import { ReactNode, useCallback, useState } from 'react';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  ViewStyle,
} from 'react-native';

import { colors } from '@/shared/theme/colors';

type CeraproRefreshScreenProps = {
  children: ReactNode;
  onRefresh?: () => Promise<void> | void;
  contentContainerStyle?: ViewStyle;
};

export function CeraproRefreshScreen({
  children,
  onRefresh,
  contentContainerStyle,
}: CeraproRefreshScreenProps) {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    if (!onRefresh) return;

    try {
      setRefreshing(true);
      await onRefresh();
    } finally {
      setRefreshing(false);
    }
  }, [onRefresh]);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[styles.content, contentContainerStyle]}
      showsVerticalScrollIndicator={false}
      alwaysBounceVertical
      bounces
      overScrollMode="always"
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          tintColor={colors.primary}
          colors={[colors.primary]}
          progressViewOffset={20}
        />
      }
    >
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flexGrow: 1,
    paddingBottom: 40,
  },
});