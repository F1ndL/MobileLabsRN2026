import { Ionicons } from '@expo/vector-icons';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { GameProvider, useGame } from './src/state/GameContext';
import GameScreen from './src/screens/GameScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import TasksScreen from './src/screens/TasksScreen';
import { palettes } from './src/theme';

const Drawer = createDrawerNavigator();

function DrawerButton({ navigation, color }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Відкрити меню"
      onPress={() => navigation.openDrawer()}
      style={({ pressed }) => [styles.drawerButton, pressed && styles.pressed]}
    >
      <Ionicons name="menu" size={26} color={color} />
    </Pressable>
  );
}

function Navigator() {
  const { settings } = useGame();
  const colors = palettes[settings.theme];

  return (
    <NavigationContainer>
      <StatusBar style={settings.theme === 'dark' ? 'light' : 'dark'} />
      <Drawer.Navigator
        initialRouteName="Game"
        screenOptions={({ navigation }) => ({
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.text,
          headerTitleStyle: { fontWeight: '800' },
          drawerActiveTintColor: colors.primary,
          drawerInactiveTintColor: colors.muted,
          drawerStyle: { backgroundColor: colors.surface },
          sceneContainerStyle: { backgroundColor: colors.background },
          headerLeft: () => <DrawerButton navigation={navigation} color={colors.text} />,
        })}
      >
        <Drawer.Screen
          name="Game"
          component={GameScreen}
          options={{
            title: 'Клікер',
            drawerIcon: ({ color, size }) => <Ionicons name="sparkles-outline" size={size} color={color} />,
          }}
        />
        <Drawer.Screen
          name="Tasks"
          component={TasksScreen}
          options={{
            title: 'Завдання',
            drawerIcon: ({ color, size }) => <Ionicons name="checkmark-done-outline" size={size} color={color} />,
          }}
        />
        <Drawer.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            title: 'Налаштування',
            drawerIcon: ({ color, size }) => <Ionicons name="options-outline" size={size} color={color} />,
          }}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <GameProvider>
          <Navigator />
        </GameProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  drawerButton: {
    marginLeft: 16,
    padding: 6,
  },
  pressed: {
    opacity: 0.55,
  },
});
