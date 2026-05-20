import 'react-native-gesture-handler';

import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { Pressable } from 'react-native';

import CustomDrawerContent from './src/components/CustomDrawerContent';
import ContactsScreen from './src/screens/ContactsScreen';
import DetailsScreen from './src/screens/DetailsScreen';
import MainScreen from './src/screens/MainScreen';
import { colors } from './src/theme';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

function DrawerButton({ navigation }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Відкрити меню"
      onPress={() => navigation.getParent()?.openDrawer()}
      style={({ pressed }) => ({
        marginLeft: 16,
        opacity: pressed ? 0.55 : 1,
      })}
    >
      <Ionicons name="menu" size={26} color={colors.text} />
    </Pressable>
  );
}

function NewsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: '700' },
        headerStyle: { backgroundColor: colors.surface },
        cardStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen
        name="MainScreen"
        component={MainScreen}
        options={({ navigation }) => ({
          title: 'Новини',
          headerLeft: () => <DrawerButton navigation={navigation} />,
        })}
      />
      <Stack.Screen
        name="DetailsScreen"
        component={DetailsScreen}
        options={({ route }) => ({
          title: route.params?.title ?? 'Деталі новини',
        })}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Drawer.Navigator
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          headerShown: false,
          drawerActiveTintColor: colors.primary,
          drawerInactiveTintColor: colors.muted,
          drawerStyle: { backgroundColor: colors.surface },
          sceneContainerStyle: { backgroundColor: colors.background },
        }}
      >
        <Drawer.Screen
          name="News"
          component={NewsStack}
          options={{
            title: 'Новини',
            drawerIcon: ({ color, size }) => (
              <Ionicons name="newspaper-outline" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="Contacts"
          component={ContactsScreen}
          options={{
            title: 'Контакти',
            drawerIcon: ({ color, size }) => (
              <Ionicons name="people-outline" size={size} color={color} />
            ),
          }}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
