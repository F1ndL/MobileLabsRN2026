import { Ionicons } from '@expo/vector-icons';
import { useRef, useState } from 'react';
import { Animated, Dimensions, StyleSheet, Text, View } from 'react-native';
import {
  Directions,
  FlingGestureHandler,
  LongPressGestureHandler,
  PanGestureHandler,
  PinchGestureHandler,
  State,
  TapGestureHandler,
} from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

import StatPill from '../components/StatPill';
import { useGame } from '../state/GameContext';
import { palettes, spacing } from '../theme';

const { width } = Dimensions.get('window');

export default function GameScreen() {
  const {
    stats,
    settings,
    completedTasks,
    tasks,
    lastAction,
    registerTap,
    registerDoubleTap,
    registerLongPress,
    registerDrag,
    registerFling,
    registerResize,
  } = useGame();
  const colors = palettes[settings.theme];
  const doubleTapRef = useRef(null);
  const pan = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const baseScale = useRef(new Animated.Value(1)).current;
  const pinchScale = useRef(new Animated.Value(1)).current;
  const [savedScale, setSavedScale] = useState(1);

  const scale = Animated.multiply(baseScale, pinchScale).interpolate({
    inputRange: [0.5, 2.2],
    outputRange: [0.5, 2.2],
    extrapolate: 'clamp',
  });

  const onPanGestureEvent = Animated.event([{ nativeEvent: { translationX: pan.x, translationY: pan.y } }], {
    useNativeDriver: false,
  });

  const onPanStateChange = ({ nativeEvent }) => {
    if (nativeEvent.oldState === State.ACTIVE) {
      pan.extractOffset();
      registerDrag();
    }
  };

  const onPinchGestureEvent = Animated.event([{ nativeEvent: { scale: pinchScale } }], {
    useNativeDriver: false,
  });

  const onPinchStateChange = ({ nativeEvent }) => {
    if (nativeEvent.oldState === State.ACTIVE) {
      const nextScale = Math.max(0.65, Math.min(savedScale * nativeEvent.scale, 1.7));
      baseScale.setValue(nextScale);
      pinchScale.setValue(1);
      setSavedScale(nextScale);
      registerResize();
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['left', 'right', 'bottom']}>
      <View style={styles.container}>
        <View style={[styles.hero, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View>
            <Text style={[styles.kicker, { color: colors.secondary }]}>Gesture Clicker</Text>
            <Text style={[styles.score, { color: colors.text }]}>{stats.score}</Text>
            <Text style={[styles.scoreLabel, { color: colors.muted }]}>очок зібрано</Text>
          </View>
          <View style={[styles.badge, { backgroundColor: colors.primarySoft }]}>
            <Text style={[styles.badgeNumber, { color: colors.primary }]}>{completedTasks}/{tasks.length}</Text>
            <Text style={[styles.badgeText, { color: colors.muted }]}>завдань</Text>
          </View>
        </View>

        <View style={styles.statsGrid}>
          <StatPill icon="hand-left-outline" label="Кліки" value={stats.taps} theme={settings.theme} />
          <StatPill icon="flash-outline" label="Дабли" value={stats.doubleTaps} theme={settings.theme} />
          <StatPill icon="timer-outline" label="Hold" value={stats.longPresses} theme={settings.theme} />
        </View>

        <View style={[styles.arena, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}>
          <FlingGestureHandler direction={Directions.RIGHT} onActivated={() => registerFling('right')}>
            <FlingGestureHandler direction={Directions.LEFT} onActivated={() => registerFling('left')}>
              <TapGestureHandler ref={doubleTapRef} numberOfTaps={2} maxDelayMs={260} onActivated={registerDoubleTap}>
                <TapGestureHandler waitFor={doubleTapRef} numberOfTaps={1} onActivated={registerTap}>
                  <LongPressGestureHandler minDurationMs={3000} onActivated={registerLongPress}>
                    <PanGestureHandler onGestureEvent={onPanGestureEvent} onHandlerStateChange={onPanStateChange}>
                      <PinchGestureHandler
                        onGestureEvent={onPinchGestureEvent}
                        onHandlerStateChange={onPinchStateChange}
                      >
                        <Animated.View
                          style={[
                            styles.clickObject,
                            {
                              backgroundColor: colors.primary,
                              shadowColor: colors.shadow,
                              transform: [{ translateX: pan.x }, { translateY: pan.y }, { scale }],
                            },
                          ]}
                        >
                          <Ionicons name="planet-outline" size={52} color={colors.surface} />
                          <Text style={[styles.objectText, { color: colors.surface }]}>TAP</Text>
                        </Animated.View>
                      </PinchGestureHandler>
                    </PanGestureHandler>
                  </LongPressGestureHandler>
                </TapGestureHandler>
              </TapGestureHandler>
            </FlingGestureHandler>
          </FlingGestureHandler>
        </View>

        <View style={[styles.actionPanel, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Ionicons name="radio-outline" size={20} color={colors.secondary} />
          <Text style={[styles.actionText, { color: colors.text }]}>{lastAction}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: spacing.md,
    gap: spacing.md,
  },
  hero: {
    borderWidth: 1,
    borderRadius: 8,
    padding: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  kicker: {
    fontSize: 13,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  score: {
    marginTop: 4,
    fontSize: 54,
    fontWeight: '900',
  },
  scoreLabel: {
    fontSize: 15,
    fontWeight: '700',
  },
  badge: {
    width: 88,
    height: 88,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeNumber: {
    fontSize: 22,
    fontWeight: '900',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '800',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  arena: {
    flex: 1,
    minHeight: 290,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  clickObject: {
    width: Math.min(150, width * 0.38),
    height: Math.min(150, width * 0.38),
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowOpacity: 0.22,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  objectText: {
    fontSize: 18,
    fontWeight: '900',
  },
  actionPanel: {
    borderWidth: 1,
    borderRadius: 8,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  actionText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '800',
  },
});
