import { Ionicons } from '@expo/vector-icons';
import {
  DrawerContentScrollView,
  DrawerItem,
} from '@react-navigation/drawer';
import { Image, StyleSheet, Text, View } from 'react-native';

import { colors, spacing } from '../theme';

export default function CustomDrawerContent(props) {
  const activeRoute = props.state.routeNames[props.state.index];

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.container}>
      <View style={styles.profile}>
        <Image
          source={{ uri: 'https://i.pravatar.cc/160?img=12' }}
          style={styles.avatar}
        />
        <Text style={styles.name}>Сокирко Владислав Володимирович</Text>
        <Text style={styles.group}>Група ІПЗ-23-4</Text>
      </View>

      <View style={styles.menu}>
        <DrawerItem
          label="Новини"
          focused={activeRoute === 'News'}
          activeTintColor={colors.primary}
          inactiveTintColor={colors.muted}
          icon={({ color, size }) => (
            <Ionicons name="newspaper-outline" size={size} color={color} />
          )}
          onPress={() => props.navigation.navigate('News')}
        />
        <DrawerItem
          label="Контакти"
          focused={activeRoute === 'Contacts'}
          activeTintColor={colors.primary}
          inactiveTintColor={colors.muted}
          icon={({ color, size }) => (
            <Ionicons name="people-outline" size={size} color={color} />
          )}
          onPress={() => props.navigation.navigate('Contacts')}
        />
      </View>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: colors.surface,
  },
  profile: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  avatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: colors.primarySoft,
  },
  name: {
    marginTop: spacing.md,
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
  },
  group: {
    marginTop: spacing.xs,
    color: colors.muted,
    fontSize: 14,
    fontWeight: '600',
  },
  menu: {
    paddingTop: spacing.md,
  },
});
