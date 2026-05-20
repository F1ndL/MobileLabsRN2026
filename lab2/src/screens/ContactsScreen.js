import { Ionicons } from '@expo/vector-icons';
import {
  Pressable,
  SectionList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { contactSections } from '../data/contacts';
import { colors, spacing } from '../theme';

export default function ContactsScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.topBar}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Відкрити меню"
          onPress={() => navigation.openDrawer()}
          style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
        >
          <Ionicons name="menu" size={26} color={colors.text} />
        </Pressable>
        <Text style={styles.screenTitle}>Контакти</Text>
      </View>

      <SectionList
        sections={contactSections}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.contactCard}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {item.name
                  .split(' ')
                  .slice(0, 2)
                  .map((word) => word[0])
                  .join('')}
              </Text>
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.role}>{item.role}</Text>
              <Text style={styles.phone}>{item.phone}</Text>
            </View>
          </View>
        )}
        renderSectionHeader={({ section }) => (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={styles.content}
        stickySectionHeadersEnabled
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topBar: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  iconButton: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  pressed: {
    opacity: 0.55,
  },
  screenTitle: {
    marginLeft: spacing.sm,
    color: colors.text,
    fontSize: 20,
    fontWeight: '800',
  },
  content: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  sectionHeader: {
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    backgroundColor: colors.background,
  },
  sectionTitle: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  avatar: {
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 26,
    backgroundColor: colors.primarySoft,
  },
  avatarText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '900',
  },
  contactInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  name: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '800',
  },
  role: {
    marginTop: 3,
    color: colors.muted,
    fontSize: 13,
    fontWeight: '600',
  },
  phone: {
    marginTop: spacing.xs,
    color: colors.primary,
    fontSize: 14,
    fontWeight: '800',
  },
  separator: {
    height: spacing.sm,
  },
});
