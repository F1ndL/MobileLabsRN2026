import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ProgressBar from '../components/ProgressBar';
import TaskItem from '../components/TaskItem';
import { useGame } from '../state/GameContext';
import { palettes, spacing } from '../theme';

export default function TasksScreen() {
  const { tasks, completedTasks, settings } = useGame();
  const colors = palettes[settings.theme];
  const progress = completedTasks / tasks.length;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['left', 'right', 'bottom']}>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <View style={[styles.summary, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.kicker, { color: colors.secondary }]}>Прогрес лабораторної</Text>
            <Text style={[styles.title, { color: colors.text }]}>
              Виконано {completedTasks} з {tasks.length}
            </Text>
            <ProgressBar value={progress} theme={settings.theme} />
          </View>
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item }) => <TaskItem task={item} theme={settings.theme} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  summary: {
    borderWidth: 1,
    borderRadius: 8,
    padding: spacing.lg,
    marginBottom: spacing.md,
    gap: 12,
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
  separator: {
    height: spacing.sm,
  },
});
