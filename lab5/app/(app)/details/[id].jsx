import { useLocalSearchParams } from 'expo-router';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { products } from '../../../data/products';

function formatPrice(price) {
  return `${price.toLocaleString('uk-UA')} грн`;
}

export default function ProductDetailsScreen() {
  const { id } = useLocalSearchParams();
  const productId = Array.isArray(id) ? id[0] : id;
  const product = products.find((item) => item.id === productId);

  if (!product) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>Товар не знайдено</Text>
        <Text style={styles.emptyText}>Перевірте ідентифікатор товару.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: product.image }} style={styles.image} />

      <View style={styles.content}>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.price}>{formatPrice(product.price)}</Text>
        <Text style={styles.sectionTitle}>Опис</Text>
        <Text style={styles.description}>{product.description}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 32,
    backgroundColor: '#f6f7fb',
  },
  image: {
    width: '100%',
    aspectRatio: 1.15,
    backgroundColor: '#d8deea',
  },
  content: {
    gap: 14,
    padding: 20,
  },
  name: {
    fontSize: 28,
    fontWeight: '800',
    color: '#182033',
  },
  price: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1677ff',
  },
  sectionTitle: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: '800',
    color: '#182033',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#4f5b70',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#f6f7fb',
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#182033',
  },
  emptyText: {
    marginTop: 8,
    fontSize: 16,
    color: '#5e687d',
  },
});
