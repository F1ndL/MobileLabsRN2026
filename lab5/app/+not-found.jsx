import { Link, Stack } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Помилка' }} />
      <View style={styles.container}>
        <Text style={styles.title}>Екран не знайдено</Text>
        <Text style={styles.text}>Маршрут, який ви відкрили, не існує.</Text>

        <Link href="/" asChild>
          <Pressable style={styles.button}>
            <Text style={styles.buttonText}>На головну</Text>
          </Pressable>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#f6f7fb',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#182033',
  },
  text: {
    marginTop: 8,
    textAlign: 'center',
    fontSize: 16,
    color: '#5e687d',
  },
  button: {
    minHeight: 48,
    justifyContent: 'center',
    marginTop: 24,
    borderRadius: 8,
    paddingHorizontal: 18,
    backgroundColor: '#1677ff',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
});
