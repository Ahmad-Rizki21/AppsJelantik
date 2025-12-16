import AsyncStorage from '@react-native-async-storage/async-storage';
import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';

export default function Index() {
  const [isReady, setIsReady] = useState(false);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Wait 3 seconds to match Flutter splash
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        const value = await AsyncStorage.getItem('hasSeenOnboarding');
        if (value === 'true') {
          setHasSeenOnboarding(true);
        }
      } catch (e) {
        console.warn(e);
      } finally {
        setIsReady(true);
      }
    }

    prepare();
  }, []);

  if (!isReady) {
     return (
        <View style={styles.container}>
             <Image 
                source={require('../assets/images/Jelantik_Logo.png')} 
                style={{ width: 150, height: 150 }}
                resizeMode="contain"
             />
        </View>
     )
  }

  if (hasSeenOnboarding) {
    return <Redirect href="/(auth)/login" />;
  } else {
    return <Redirect href="/(auth)/onboarding" />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
