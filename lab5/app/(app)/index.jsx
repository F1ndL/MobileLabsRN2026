import { Link } from 'expo-router';
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { products } from '../../data/products';

function formatPrice(price) {
  return `${price.toLocaleString('uk-UA')} грн`;
}

export default function CatalogScreen() {
  const { logout, user } = useAuth();

  const renderItem = ({ item }) => (
    <Link href={`/details/${item.id}`} asChild>
      <Pressable style={styles.card}>
        <Image source={{ uri: item.image }} style={styles.image} />
        <View style={styles.cardContent}>
          <Text numberOfLines={2} style={styles.productName}>
            {item.name}
          </Text>
          <Text style={styles.price}>{formatPrice(item.price)}</Text>
        </View>
      </Pressable>
    </Link>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.eyebrow}>Вітаємо, {user?.name ?? 'користувачу'}</Text>
          <Text style={styles.title}>Каталог товарів</Text>
        </View>
        <Pressable onPress={logout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Вийти</Text>
        </Pressable>
      </View>

      <FlatList
        contentContainerStyle={styles.list}
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f7fb',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 10,
  },
  headerText: {
    flex: 1,
  },
  eyebrow: {
    fontSize: 14,
    color: '#657086',
  },
  title: {
    marginTop: 4,
    fontSize: 28,
    fontWeight: '800',
    color: '#182033',
  },
  logoutButton: {
    minHeight: 40,
    justifyContent: 'center',
    borderRadius: 8,
    paddingHorizontal: 14,
    backgroundColor: '#eaf1ff',
  },
  logoutText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1677ff',
  },
  list: {
    gap: 14,
    padding: 18,
    paddingBottom: 28,
  },
  card: {
    flexDirection: 'row',
    minHeight: 118,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e1e6f0',
    borderRadius: 8,
    backgroundColor: '#ffffff',
  },
  image: {
    width: 118,
    height: 118,
    backgroundColor: '#d8deea',
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
    gap: 10,
    padding: 14,
  },
  productName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#182033',
  },
  price: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1677ff',
  },
});
