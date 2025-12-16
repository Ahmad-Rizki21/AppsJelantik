import { Tabs } from 'expo-router';
import { Image, Platform, Text, View } from 'react-native';

export default function TabLayout() {
  const getIcon = (name: string, focused: boolean) => {
    let source;
    switch (name) {
      case 'index':
        source = require('../../assets/images/Home.png');
        break;
      case 'history':
        source = require('../../assets/images/History.png');
        break;
      case 'pesan':
        source = require('../../assets/images/Pesan.png');
        break;
      case 'settings':
        source = require('../../assets/images/Settings.png');
        break;
    }
    return (
      <View style={{ paddingTop: 10, paddingBottom: 2, alignItems: 'center', justifyContent: 'center' }}>
        <Image
          source={source}
          style={{ width: focused ? 28 : 26, height: focused ? 28 : 26, tintColor: focused ? '#3B82F6' : '#757575' }}
          resizeMode="contain"
        />
      </View>
    );
  };

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 0,
          height: Platform.OS === 'ios' ? 90 : 70,
          paddingBottom: Platform.OS === 'ios' ? 30 : 10,
          ...Platform.select({
            ios: {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -2 },
              shadowOpacity: 0.2,
              shadowRadius: 10,
            },
            android: {
              elevation: 10,
              shadowColor: '#000',
            },
          }),
        },
        tabBarActiveTintColor: '#3B82F6',
        tabBarInactiveTintColor: '#757575',
        tabBarLabelStyle: {
            fontFamily: 'Poppins-Regular',
            fontSize: 12,
        },
        tabBarLabel: ({ focused, color }) => {
            let label;
             switch (route.name) {
                case 'index': label = 'Home'; break;
                case 'history': label = 'History'; break;
                case 'pesan': label = 'Pesan'; break;
                case 'settings': label = 'Settings'; break;
             }
             return <Text style={{ color, fontFamily: focused ? 'Poppins-Bold' : 'Poppins-Regular', fontSize: 12 }}>{label}</Text>
        }
      })}
      >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => getIcon('index', focused),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ focused }) => getIcon('history', focused),
        }}
      />
      <Tabs.Screen
        name="pesan"
        options={{
          title: 'Pesan',
          tabBarIcon: ({ focused }) => getIcon('pesan', focused),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ focused }) => getIcon('settings', focused),
        }}
      />
    </Tabs>
  );
}
