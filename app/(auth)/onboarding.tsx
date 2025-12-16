import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useRef, useState } from 'react';
import { Dimensions, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

const pageData = [
  {
    image: require('../../assets/images/Pebble.png'),
    title: "Hidupkan Setiap Detik",
    subtitle: "We are here ready serve you order 24 hour nonstop so you can enjoy your holidays.",
  },
  {
    image: require('../../assets/images/Wormies.png'),
    title: "Dengan Kecepatan Terbaik",
    subtitle: "Do whatever you like and we protect your data from various threats.",
  }
];

export default function OnboardingScreen() {
  const [currentPage, setCurrentPage] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const navigateToLogin = async () => {
    await AsyncStorage.setItem('hasSeenOnboarding', 'true');
    router.replace('/(auth)/login');
  };

  const onNext = () => {
    if (currentPage === pageData.length - 1) {
      navigateToLogin();
    } else {
        flatListRef.current?.scrollToIndex({ index: currentPage + 1 });
    }
  };

  const renderItem = ({ item }: { item: typeof pageData[0] }) => (
    <View style={styles.imageContainer}>
      <Image source={item.image} style={styles.image} />
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Top Section with Images */}
      <FlatList
        ref={flatListRef}
        data={pageData}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onMomentumScrollEnd={(e) => {
            const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
            setCurrentPage(newIndex);
        }}
        renderItem={renderItem}
        keyExtractor={(_, index) => index.toString()}
      />
      
      {/* Skip Button */}
      <TouchableOpacity style={styles.skipButton} onPress={navigateToLogin}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>
      
      {/* Bottom Card */}
      <View style={styles.bottomCard}>
         <View style={styles.textContainer}>
            <Text style={styles.title}>{pageData[currentPage].title}</Text>
            <Text style={styles.subtitle}>{pageData[currentPage].subtitle}</Text>
         </View>
         
         <View style={styles.controls}>
             {/* Indicators */}
             <View style={styles.indicators}>
                {pageData.map((_, index) => (
                    <View 
                        key={index} 
                        style={[
                            styles.dot, 
                            { 
                                backgroundColor: currentPage === index ? '#3B82F6' : 'rgba(0,0,0,0.12)',
                            } 
                        ]} 
                    />
                ))}
             </View>
             
             {/* Next Button */}
            <TouchableOpacity onPress={onNext}>
                <Image source={require('../../assets/images/Next.png')} style={{ width: 60, height: 60 }} />
            </TouchableOpacity>
         </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E0F2FE',
  },
  imageContainer: {
    width: width,
    paddingTop: 100,
    paddingBottom: 250, // Match Flutter padding
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  image: {
    height: 250,
    width: width * 0.8, // Adjust as needed
    resizeMode: 'contain',
  },
  skipButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    padding: 10,
    zIndex: 10,
  },
  skipText: {
    color: 'rgba(0,0,0,0.54)',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  bottomCard: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 320,
    backgroundColor: 'white',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingHorizontal: 40,
    paddingTop: 40, // Adjust mainly for text centering
    // shadow? Flutter didn't have explicit shadow in code shown but maybe default elevation
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  title: {
    fontSize: 26,
    fontFamily: 'Poppins-Bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: 'rgba(0,0,0,0.54)',
    textAlign: 'center',
    lineHeight: 24,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  indicators: {
    flexDirection: 'row',
    gap: 12,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  }
});
