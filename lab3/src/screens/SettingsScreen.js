import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useGame } from '../state/GameContext';
import { palettes, spacing } from '../theme';

function SettingRow({ icon, title, description, children, theme }) {
  const colors = palettes[theme];

  return (
    <View style={[styles.row, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={[styles.iconBox, { backgroundColor: colors.primarySoft }]}>
        <Ionicons name={icon} size={22} color={colors.primary} />
      </View>
      <View style={styles.rowText}>
        <Text style={[styles.rowTitle, { color: colors.text }]}>{title}</Text>
        <Text style={[styles.rowDescription, { color: colors.muted }]}>{description}</Text>
      </View>
      {children}
    </View>
  );
}

export default function SettingsScreen() {
  const { settings, updateSetting, toggleTheme, resetGame, completedTasks, tasks } = useGame();
  const colors = palettes[settings.theme];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['left', 'right', 'bottom']}>
      <View style={styles.content}>
        <View style={[styles.header, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.kicker, { color: colors.secondary }]}>Налаштування</Text>
          <Text style={[styles.title, { color: colors.text }]}>Жести, тема і прогрес</Text>
          <Text style={[styles.subtitle, { color: colors.muted }]}>
            Виконано {completedTasks} з {tasks.length} завдань
          </Text>
        </View>

        <SettingRow
          icon={settings.theme === 'dark' ? 'moon-outline' : 'sunny-outline'}
          title="Темна тема"
          description="Перемикає палітру всього застосунку."
          theme={settings.theme}
        >
          <Switch
            value={settings.theme === 'dark'}
            onValueChange={toggleTheme}
            trackColor={{ false: colors.border, true: colors.primarySoft }}
            thumbColor={settings.theme === 'dark' ? colors.primary : colors.surface}
          />
        </SettingRow>

        <SettingRow
          icon="volume-medium-outline"
          title="Звук"
          description="Імітація налаштування реакції на бонуси."
          theme={settings.theme}
        >
          <Switch
            value={settings.sound}
            onValueChange={(value) => updateSetting('sound', value)}
            trackColor={{ false: colors.border, true: colors.primarySoft }}
            thumbColor={settings.sound ? colors.primary : colors.surface}
          />
        </SettingRow>

        <SettingRow
          icon="phone-portrait-outline"
          title="Вібрація"
          description="Прапорець для тактильного відгуку."
          theme={settings.theme}
        >
          <Switch
            value={settings.vibration}
            onValueChange={(value) => updateSetting('vibration', value)}
            trackColor={{ false: colors.border, true: colors.primarySoft }}
            thumbColor={settings.vibration ? colors.primary : colors.surface}
          />
        </SettingRow>

        <View style={[styles.multiplier, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.rowTitle, { color: colors.text }]}>Множник очок</Text>
          <View style={styles.segmented}>
            {[1, 2, 3].map((value) => {
              const active = settings.multiplier === value;

              return (
                <Pressable
                  key={value}
                  accessibilityRole="button"
                  accessibilityLabel={`Множник ${value}`}
                  onPress={() => updateSetting('multiplier', value)}
                  style={[
                    styles.segment,
                    {
                      backgroundColor: active ? colors.primary : colors.surfaceAlt,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <Text style={[styles.segmentText, { color: active ? colors.surface : colors.text }]}>x{value}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Скинути прогрес гри"
          onPress={resetGame}
          style={({ pressed }) => [
            styles.resetButton,
            { backgroundColor: colors.secondary },
            pressed && styles.pressed,
          ]}
        >
          <Ionicons name="refresh-outline" size={20} color={colors.surface} />
          <Text style={[styles.resetText, { color: colors.surface }]}>Скинути прогрес</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: spacing.md,
    gap: spacing.md,
  },
  header: {
    borderWidth: 1,
    borderRadius: 8,
    padding: spacing.lg,
    gap: 6,
  },
  kicker: {
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  row: {
    borderWidth: 1,
    borderRadius: 8,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowText: {
    flex: 1,
    gap: 3,
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: '900',
  },
  rowDescription: {
    fontSize: 12,
    lineHeight: 17,
  },
  multiplier: {
    borderWidth: 1,
    borderRadius: 8,
    padding: spacing.md,
    gap: spacing.md,
  },
  segmented: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  segment: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  segmentText: {
    fontWeight: '900',
  },
  resetButton: {
    minHeight: 50,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  resetText: {
    fontSize: 15,
    fontWeight: '900',
  },
  pressed: {
    opacity: 0.75,
  },
});
