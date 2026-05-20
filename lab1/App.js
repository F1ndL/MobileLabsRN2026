import React from 'react';
import {
  Alert,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const Tab = createMaterialTopTabNavigator();
const studentInfo = "Сокирко Владислав Володимирович, ІПЗ-23-4";

const news = [
  {
    id: 'news-1',
    title: 'Старт мобільної лабораторної',
    date: '20 травня 2026',
    summary: 'Створено перший Expo-застосунок з навігацією та базовими компонентами.',
    accent: '#087bff',
  },
  {
    id: 'news-2',
    title: 'Тестування на Android',
    date: 'Емулятор або Expo Go',
    summary: 'Проєкт можна запускати на віртуальному пристрої або реальному смартфоні.',
    accent: '#1c9f6e',
  },
  {
    id: 'news-3',
    title: 'React Native компоненти',
    date: 'View, Text, Image, TextInput',
    summary: 'Інтерфейс побудовано з базових компонентів та StyleSheet.',
    accent: '#f08a24',
  },
  {
    id: 'news-4',
    title: 'Навігація між екранами',
    date: '@react-navigation',
    summary: 'Вкладки перемикають новини, галерею та профіль користувача.',
    accent: '#7357d6',
  },
];

const galleryItems = Array.from({ length: 8 }, (_, index) => ({
  id: `gallery-${index + 1}`,
  color: ['#eaf3ff', '#e9f8f1', '#fff3e6', '#f1edff'][index % 4],
}));

function Header() {
  return (
    <View style={styles.header}>
      <View style={styles.logoPanel}>
        <Image source={require('./assets/logo.png')} style={styles.logo} resizeMode="contain" />
      </View>
      <View style={styles.headerTextBlock}>
        <Text style={styles.kicker}>Mobile Labs RN 2026</Text>
        <Text style={styles.appTitle}>FirstMobileApp</Text>
      </View>
    </View>
  );
}

function Footer() {
  return (
    <View style={styles.footer}>
      <Text style={styles.footerText}>{studentInfo}</Text>
    </View>
  );
}

function ScreenFrame({ children }) {
  return (
    <View style={styles.screen}>
      <View style={styles.screenContent}>{children}</View>
      <Footer />
    </View>
  );
}

function HomeScreen() {
  return (
    <ScreenFrame>
      <FlatList
        data={news}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View style={styles.sectionHeader}>
            <Text style={styles.screenTitle}>Новини</Text>
            <Text style={styles.screenSubtitle}>Короткий дайджест лабораторного застосунку</Text>
          </View>
        }
        contentContainerStyle={styles.newsList}
        renderItem={({ item }) => (
          <View style={[styles.newsItem, { borderLeftColor: item.accent }]}>
            <View style={[styles.newsImageWrap, { backgroundColor: `${item.accent}18` }]}>
              <Image source={require('./assets/news-placeholder.png')} style={styles.newsImage} />
            </View>
            <View style={styles.newsTextBlock}>
              <Text style={[styles.newsDate, { color: item.accent }]}>{item.date}</Text>
              <Text style={styles.newsTitle}>{item.title}</Text>
              <Text style={styles.newsSummary}>{item.summary}</Text>
            </View>
          </View>
        )}
      />
    </ScreenFrame>
  );
}

function GalleryScreen() {
  return (
    <ScreenFrame>
      <FlatList
        data={galleryItems}
        keyExtractor={(item) => item.id}
        numColumns={2}
        ListHeaderComponent={
          <View style={styles.sectionHeader}>
            <Text style={styles.screenTitle}>Фотогалерея</Text>
            <Text style={styles.screenSubtitle}>Місце для зображень проєкту</Text>
          </View>
        }
        contentContainerStyle={styles.galleryList}
        columnWrapperStyle={styles.galleryRow}
        renderItem={({ item, index }) => (
          <View style={[styles.galleryCard, { backgroundColor: item.color }]}>
            <Image source={require('./assets/gallery-placeholder.png')} style={styles.galleryImage} />
            <Text style={styles.galleryCaption}>Фото {index + 1}</Text>
          </View>
        )}
      />
    </ScreenFrame>
  );
}

function ProfileScreen() {
  const fields = [
    { id: 'email', label: 'Електронна пошта', placeholder: 'student@example.com', keyboardType: 'email-address' },
    { id: 'password', label: 'Пароль', placeholder: 'Введіть пароль', secureTextEntry: true },
    { id: 'passwordRepeat', label: 'Пароль (ще раз)', placeholder: 'Повторіть пароль', secureTextEntry: true },
    { id: 'surname', label: 'Прізвище', placeholder: 'Ваше прізвище' },
    { id: 'name', label: "Ім'я", placeholder: "Ваше ім'я" },
  ];

  const onSubmit = () => {
    Alert.alert('Реєстрація', 'Форма готова до перевірки введених даних.');
  };

  return (
    <ScreenFrame>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.formKeyboardArea}
      >
        <ScrollView contentContainerStyle={styles.formContent} keyboardShouldPersistTaps="handled">
          <View style={styles.sectionHeader}>
            <Text style={styles.screenTitle}>Профіль</Text>
            <Text style={styles.screenSubtitle}>Заповніть дані для реєстрації</Text>
          </View>

          {fields.map((field) => (
            <View key={field.id} style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{field.label}</Text>
              <TextInput
                autoCapitalize={field.keyboardType === 'email-address' ? 'none' : 'sentences'}
                keyboardType={field.keyboardType}
                placeholder={field.placeholder}
                placeholderTextColor="#9aa4b2"
                secureTextEntry={field.secureTextEntry}
                style={styles.input}
              />
            </View>
          ))}

          <Pressable style={({ pressed }) => [styles.submitButton, pressed && styles.buttonPressed]} onPress={onSubmit}>
            <Text style={styles.submitText}>Зареєструватися</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenFrame>
  );
}

function tabIcon(name) {
  return ({ color }) => <MaterialCommunityIcons name={name} size={26} color={color} />;
}

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea} edges={['top', 'right', 'bottom', 'left']}>
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        <Header />
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={{
              tabBarActiveTintColor: '#087bff',
              tabBarInactiveTintColor: '#8a8a8a',
              tabBarIndicatorStyle: styles.tabIndicator,
              tabBarItemStyle: styles.tabItem,
              tabBarLabelStyle: styles.tabLabel,
              tabBarShowIcon: true,
              tabBarStyle: styles.tabBar,
            }}
          >
            <Tab.Screen name="Головна" component={HomeScreen} options={{ tabBarIcon: tabIcon('home') }} />
            <Tab.Screen
              name="Фотогалерея"
              component={GalleryScreen}
              options={{ tabBarIcon: tabIcon('image-multiple') }}
            />
            <Tab.Screen name="Профіль" component={ProfileScreen} options={{ tabBarIcon: tabIcon('account') }} />
          </Tab.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    minHeight: 82,
    paddingHorizontal: 18,
    paddingVertical: 12,
    backgroundColor: '#f8fbff',
    alignItems: 'center',
    flexDirection: 'row',
    borderBottomColor: '#e6edf5',
    borderBottomWidth: 1,
    gap: 14,
  },
  logoPanel: {
    width: 102,
    height: 50,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    justifyContent: 'center',
  },
  logo: {
    width: 90,
    height: 34,
  },
  headerTextBlock: {
    flex: 1,
  },
  kicker: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: '600',
  },
  appTitle: {
    color: '#1e1e1e',
    fontSize: 22,
    fontWeight: '700',
    marginTop: 2,
  },
  tabBar: {
    backgroundColor: '#ffffff',
    elevation: 0,
    shadowOpacity: 0,
  },
  tabItem: {
    minHeight: 46,
    paddingVertical: 2,
  },
  tabLabel: {
    fontSize: 11,
    marginTop: 0,
    textTransform: 'none',
  },
  tabIndicator: {
    backgroundColor: '#087bff',
    borderRadius: 2,
    height: 3,
  },
  screen: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  screenContent: {
    flex: 1,
  },
  screenTitle: {
    color: '#1e1e1e',
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'left',
  },
  screenSubtitle: {
    color: '#64748b',
    fontSize: 14,
    marginTop: 4,
  },
  sectionHeader: {
    paddingBottom: 18,
    paddingTop: 20,
  },
  footer: {
    minHeight: 28,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  footerText: {
    color: '#1e1e1e',
    fontSize: 12,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  newsList: {
    paddingBottom: 18,
    paddingHorizontal: 18,
  },
  newsItem: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#e5ebf3',
    borderLeftWidth: 4,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    marginBottom: 12,
    padding: 12,
  },
  newsImageWrap: {
    alignItems: 'center',
    borderRadius: 8,
    height: 62,
    justifyContent: 'center',
    width: 62,
  },
  newsImage: {
    height: 40,
    opacity: 0.68,
    width: 40,
  },
  newsTextBlock: {
    flex: 1,
    marginLeft: 12,
  },
  newsTitle: {
    color: '#1c1c1c',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 3,
  },
  newsDate: {
    fontSize: 12,
    fontWeight: '700',
  },
  newsSummary: {
    color: '#4b5563',
    fontSize: 13,
    lineHeight: 18,
    marginTop: 4,
  },
  galleryList: {
    paddingBottom: 18,
    paddingHorizontal: 18,
  },
  galleryRow: {
    gap: 12,
    marginBottom: 12,
  },
  galleryCard: {
    flex: 1,
    aspectRatio: 0.92,
    borderColor: '#e5ebf3',
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
    padding: 12,
  },
  galleryImage: {
    width: '100%',
    height: '72%',
  },
  galleryCaption: {
    color: '#1f2937',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 8,
    textAlign: 'center',
  },
  formKeyboardArea: {
    flex: 1,
  },
  formContent: {
    paddingBottom: 26,
    paddingHorizontal: 22,
  },
  inputGroup: {
    marginBottom: 18,
  },
  inputLabel: {
    color: '#334155',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 7,
  },
  input: {
    height: 46,
    backgroundColor: '#f8fafc',
    borderColor: '#d7dee8',
    borderRadius: 8,
    borderWidth: 1,
    color: '#1e1e1e',
    fontSize: 15,
    paddingHorizontal: 12,
  },
  submitButton: {
    height: 48,
    alignItems: 'center',
    backgroundColor: '#0f766e',
    borderRadius: 8,
    justifyContent: 'center',
    marginTop: 6,
  },
  buttonPressed: {
    opacity: 0.82,
  },
  submitText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
});
