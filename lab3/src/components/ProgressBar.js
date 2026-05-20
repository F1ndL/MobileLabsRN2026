import { StyleSheet, View } from 'react-native';

import { palettes } from '../theme';

export default function ProgressBar({ value, theme }) {
  const colors = palettes[theme];
  const width = `${Math.max(0, Math.min(value, 1)) * 100}%`;

  return (
    <View style={[styles.track, { backgroundColor: colors.border }]}>
      <View style={[styles.fill, { width, backgroundColor: colors.primary }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 8,
    borderRadius: 8,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 8,
  },
});
