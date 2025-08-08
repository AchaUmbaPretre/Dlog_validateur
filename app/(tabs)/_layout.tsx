import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Platform, TouchableOpacity, View, useColorScheme } from 'react-native';

export default function HomeTabsLayout() {
  const theme = useColorScheme();
  const isDark = theme === 'dark';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: isDark ? '#999' : '#999',
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: '600',
          letterSpacing: 0.3,
          marginBottom: Platform.OS === 'android' ? 6 : 0,
        },
        tabBarStyle: {
          height: 80,
          paddingBottom: Platform.OS === 'android' ? 10 : 20,
          paddingTop: 10,
          backgroundColor: isDark ? '#121212' : '#fdfdfd',
          borderTopWidth: 0.4,
          borderTopColor: isDark ? '#333' : '#ccc',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 6,
          elevation: 8,
          position: 'absolute',
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Accueil',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'home' : 'home-outline'}
              size={26}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="plus"
        options={{
          tabBarLabel: () => null,
          tabBarIcon: () => null,
          tabBarButton: (props) => (
            <View style={{ position: 'absolute', top: -28, alignSelf: 'center' }}>
              <TouchableOpacity
                onPress={props.onPress}
                activeOpacity={0.85}
                style={{
                  width: 66,
                  height: 66,
                  borderRadius: 33,
                  backgroundColor: '#007AFF',
                  justifyContent: 'center',
                  alignItems: 'center',
                  shadowColor: '#007AFF',
                  shadowOffset: { width: 0, height: 6 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 8,
                }}
              >
                <Ionicons name="add" size={34} color="#fff" />
              </TouchableOpacity>
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="profil"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'person' : 'person-outline'}
              size={26}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}