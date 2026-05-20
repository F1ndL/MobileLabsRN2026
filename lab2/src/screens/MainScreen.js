import { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import NewsCard from '../components/NewsCard';
import { generateNewsPage } from '../data/news';
import { colors, spacing } from '../theme';

const PAGE_SIZE = 12;

export default function MainScreen({ navigation }) {
  const [page, setPage] = useState(1);
  const [news, setNews] = useState(() => generateNewsPage(1, PAGE_SIZE));
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const listStats = useMemo(
    () => `${news.length} матеріалів завантажено`,
    [news.length],
  );

  const handleRefresh = useCallback(() => {
    setRefreshing(true);

    setTimeout(() => {
      setPage(1);
      setNews(generateNewsPage(1, PAGE_SIZE));
      setRefreshing(false);
    }, 900);
  }, []);

  const handleLoadMore = useCallback(() => {
    if (loadingMore || refreshing) {
      return;
    }

    setLoadingMore(true);

    setTimeout(() => {
      setNews((currentNews) => [
        ...currentNews,
        ...generateNewsPage(page + 1, PAGE_SIZE),
      ]);
      setPage((currentPage) => currentPage + 1);
      setLoadingMore(false);
    }, 900);
  }, [loadingMore, page, refreshing]);

  const renderItem = useCallback(
    ({ item }) => (
      <NewsCard
        item={item}
        onPress={() =>
          navigation.navigate('DetailsScreen', {
            id: item.id,
            title: item.title,
            description: item.description,
            image: item.image,
            author: item.author,
            publishedAt: item.publishedAt,
          })
        }
      />
    ),
    [navigation],
  );

  return (
    <FlatList
      data={news}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      contentContainerStyle={styles.content}
      refreshing={refreshing}
      onRefresh={handleRefresh}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.45}
      initialNumToRender={8}
      maxToRenderPerBatch={6}
      windowSize={7}
      removeClippedSubviews
      ListHeaderComponent={
        <View style={styles.header}>
          <Text style={styles.eyebrow}>Лабораторна робота N 2</Text>
          <Text style={styles.heading}>Список новин</Text>
          <Text style={styles.subtitle}>
            FlatList із pull-to-refresh, нескінченним прокручуванням та
            параметрами оптимізації рендерингу.
          </Text>
          <View style={styles.counter}>
            <Text style={styles.counterText}>{listStats}</Text>
          </View>
        </View>
      }
      ListFooterComponent={
        <View style={styles.footer}>
          {loadingMore ? (
            <>
              <ActivityIndicator color={colors.primary} />
              <Text style={styles.footerText}>Завантаження новин...</Text>
            </>
          ) : (
            <Text style={styles.footerText}>Прокрутіть нижче для підвантаження</Text>
          )}
        </View>
      }
      ItemSeparatorComponent={() => <View style={styles.separator} />}
    />
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  header: {
    marginBottom: spacing.md,
  },
  eyebrow: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  heading: {
    marginTop: spacing.xs,
    color: colors.text,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '800',
  },
  subtitle: {
    marginTop: spacing.sm,
    color: colors.muted,
    fontSize: 15,
    lineHeight: 21,
  },
  counter: {
    alignSelf: 'flex-start',
    marginTop: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 8,
    backgroundColor: colors.primarySoft,
  },
  counterText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '800',
  },
  separator: {
    height: spacing.md,
  },
  footer: {
    minHeight: 72,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  footerText: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '600',
  },
});
