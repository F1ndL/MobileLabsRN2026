import { memo } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors, spacing } from '../theme';

function NewsCard({ item, onPress }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.content}>
        <View style={styles.metaRow}>
          <Text style={styles.author} numberOfLines={1}>
            {item.author}
          </Text>
          <View style={styles.badge}>
            <Ionicons name="flash-outline" size={12} color={colors.accent} />
            <Text style={styles.badgeText}>News</Text>
          </View>
        </View>
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.description} numberOfLines={2}>
          {item.description}
        </Text>
        <Text style={styles.date}>{item.publishedAt}</Text>
      </View>
    </Pressable>
  );
}

export default memo(NewsCard);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    minHeight: 144,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardPressed: {
    opacity: 0.7,
  },
  image: {
    width: 108,
    height: 108,
    borderRadius: 8,
    backgroundColor: colors.primarySoft,
  },
  content: {
    flex: 1,
    marginLeft: spacing.md,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  author: {
    flex: 1,
    color: colors.muted,
    fontSize: 12,
    fontWeight: '600',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    backgroundColor: '#CCFBF1',
  },
  badgeText: {
    color: colors.accent,
    fontSize: 11,
    fontWeight: '700',
  },
  title: {
    marginTop: spacing.xs,
    color: colors.text,
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '700',
  },
  description: {
    marginTop: spacing.xs,
    color: colors.muted,
    fontSize: 13,
    lineHeight: 18,
  },
  date: {
    marginTop: 'auto',
    color: colors.primary,
    fontSize: 12,
    fontWeight: '700',
  },
});
