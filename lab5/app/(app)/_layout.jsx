import { Redirect, Stack } from 'expo-router';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedLayout() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#ffffff' },
        headerTitleStyle: { color: '#182033' },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: '#f6f7fb' },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Каталог товарів' }} />
      <Stack.Screen name="details/[id]" options={{ title: 'Деталі товару' }} />
    </Stack>
  );
}
