import { Link, router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    const result = login(email, password);

    if (!result.success) {
      Alert.alert('Помилка входу', result.message);
      return;
    }

    router.replace('/');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <View style={styles.form}>
        <Text style={styles.title}>Вхід</Text>
        <Text style={styles.subtitle}>Увійдіть, щоб відкрити каталог товарів</Text>

        <TextInput
          autoCapitalize="none"
          keyboardType="email-address"
          onChangeText={setEmail}
          placeholder="Email"
          placeholderTextColor="#7a8397"
          style={styles.input}
          value={email}
        />
        <TextInput
          onChangeText={setPassword}
          placeholder="Пароль"
          placeholderTextColor="#7a8397"
          secureTextEntry
          style={styles.input}
          value={password}
        />

        <Pressable onPress={handleLogin} style={styles.button}>
          <Text style={styles.buttonText}>Увійти</Text>
        </Pressable>

        <Link href="/register" style={styles.link}>
          Немає акаунту? Зареєструватися
        </Link>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#f6f7fb',
  },
  form: {
    gap: 14,
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    color: '#182033',
  },
  subtitle: {
    marginBottom: 12,
    fontSize: 16,
    color: '#5e687d',
  },
  input: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: '#d8deea',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#182033',
    backgroundColor: '#ffffff',
  },
  button: {
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: '#1677ff',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  link: {
    marginTop: 6,
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '600',
    color: '#1677ff',
  },
});
