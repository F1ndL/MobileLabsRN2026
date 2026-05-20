import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors, spacing } from '../theme';

export default function DetailsScreen({ route }) {
  const { title, description, image, author, publishedAt, id } = route.params;

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Image source={{ uri: image }} style={styles.image} />

      <View style={styles.meta}>
        <View style={styles.metaItem}>
          <Ionicons name="person-circle-outline" size={18} color={colors.primary} />
          <Text style={styles.metaText}>{author}</Text>
        </View>
        <View style={styles.metaItem}>
          <Ionicons name="time-outline" size={18} color={colors.primary} />
          <Text style={styles.metaText}>{publishedAt}</Text>
        </View>
      </View>

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>

      <View style={styles.panel}>
        <Text style={styles.panelTitle}>Передані параметри</Text>
        <Text style={styles.param}>id: {id}</Text>
        <Text style={styles.param}>title: {title}</Text>
      </View>

      <Text style={styles.body}>
        Цей екран відкривається зі Stack Navigator. Дані новини передаються з
        головного екрана через navigation.navigate, а заголовок екрана
        встановлюється динамічно з route.params.title.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  image: {
    width: '100%',
    aspectRatio: 16 / 10,
    borderRadius: 8,
    backgroundColor: colors.primarySoft,
  },
  meta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 8,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  metaText: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '700',
  },
  title: {
    marginTop: spacing.lg,
    color: colors.text,
    fontSize: 26,
    lineHeight: 32,
    fontWeight: '800',
  },
  description: {
    marginTop: spacing.md,
    color: colors.muted,
    fontSize: 16,
    lineHeight: 23,
  },
  panel: {
    marginTop: spacing.lg,
    padding: spacing.md,
    borderRadius: 8,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  panelTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '800',
  },
  param: {
    marginTop: spacing.sm,
    color: colors.primary,
    fontSize: 14,
    fontWeight: '700',
  },
  body: {
    marginTop: spacing.lg,
    color: colors.text,
    fontSize: 15,
    lineHeight: 22,
  },
});
