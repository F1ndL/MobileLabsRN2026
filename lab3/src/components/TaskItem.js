import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import ProgressBar from './ProgressBar';
import { palettes } from '../theme';

export default function TaskItem({ task, theme }) {
  const colors = palettes[theme];
  const progress = task.goal === 0 ? 1 : task.progress / task.goal;

  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.header}>
        <View style={[styles.icon, { backgroundColor: task.done ? colors.primarySoft : colors.surfaceAlt }]}>
          <Ionicons
            name={task.done ? 'checkmark-circle' : 'radio-button-off'}
            size={22}
            color={task.done ? colors.success : colors.muted}
          />
        </View>
        <View style={styles.textBlock}>
          <Text style={[styles.title, { color: colors.text }]}>{task.title}</Text>
          <Text style={[styles.description, { color: colors.muted }]}>{task.description}</Text>
        </View>
        <Text style={[styles.counter, { color: colors.primary }]}>
          {task.progress}/{task.goal}
        </Text>
      </View>
      <ProgressBar value={progress} theme={theme} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 14,
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  icon: {
    width: 38,
    height: 38,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBlock: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 15,
    fontWeight: '800',
  },
  description: {
    fontSize: 12,
    lineHeight: 17,
  },
  counter: {
    minWidth: 42,
    textAlign: 'right',
    fontSize: 13,
    fontWeight: '900',
  },
});
