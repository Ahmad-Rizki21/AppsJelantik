import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// --- Types ---
interface Paket {
  nama: string;
  kecepatan: string;
  harga: string;
  isPromo: boolean;
}

// --- Data ---
const internetPaket: Paket[] = [
  {
    nama: 'Basic Light',
    kecepatan: '10 Mbps',
    harga: 'Rp 166,500* / Bulan',
    isPromo: true,
  },
  {
    nama: 'Family Speed',
    kecepatan: '20 Mbps',
    harga: 'Rp 231,990* / Bulan',
    isPromo: true,
  },
  {
    nama: 'Pro Boost',
    kecepatan: '30 Mbps',
    harga: 'Rp 276,390* / Bulan',
    isPromo: false,
  },
  {
    nama: 'Ultra Fast',
    kecepatan: '50 Mbps',
    harga: 'Rp 321,789* / Bulan',
    isPromo: false,
  },
];

export default function PromoScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar style="dark" />
      
      {/* Custom Header */}
      <View style={styles.appBar}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.appBarTitle}>Pilih Paket Internet</Text>
          <View style={{ width: 40 }} /> 
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Banner Section */}
        <LinearGradient
            colors={['#3B82F6', '#2563EB']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.banner}
        >
            <Text style={{ fontSize: 32, marginBottom: 12 }}>⚡</Text>
            <Text style={styles.bannerTitle}>Paket Internet Rumah</Text>
            <Text style={styles.bannerSubtitle}>Internet stabil dan cepat untuk kebutuhan rumah tangga</Text>
        </LinearGradient>

        <View style={{ height: 16 }} />

        {/* List Packages */}
        {internetPaket.map((paket, index) => (
            <PaketCard key={index} paket={paket} index={index} />
        ))}

      </ScrollView>
    </SafeAreaView>
  );
}

function PaketCard({ paket, index }: { paket: Paket, index: number }) {
    const getSpeedColor = (speedStr: string) => {
        const speed = parseInt(speedStr.replace(/[^0-9]/g, ''));
        if (speed >= 50) return '#3B82F6';
        if (speed >= 30) return '#10B981';
        if (speed >= 20) return '#F59E0B';
        return '#6366F1';
    };

    const getSpeedIcon = (speedStr: string) => {
        const speed = parseInt(speedStr.replace(/[^0-9]/g, ''));
        if (speed >= 50) return '🚀';
        if (speed >= 30) return '🔥';
        if (speed >= 20) return '👨‍👩‍👧‍👦';
        return '💡';
    }

    const color = getSpeedColor(paket.kecepatan);
    const icon = getSpeedIcon(paket.kecepatan);

    const handlePress = () => {
        router.push({
            pathname: '/promo/detail',
            params: { ...paket }
        } as any);
    }

    return (
        <TouchableOpacity 
            style={[styles.card, paket.isPromo && styles.promoCard]} 
            onPress={handlePress}
            activeOpacity={0.9}
        >
            <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                    <View style={[styles.speedBadge, { borderColor: color, backgroundColor: color + '15' }]}>
                        <Text style={{ marginRight: 6 }}>{icon}</Text>
                        <Text style={[styles.speedText, { color }]}>{paket.kecepatan}</Text>
                    </View>
                    <View style={{ flex: 1 }} />
                    <View style={[styles.cartIcon, { borderColor: color }]}>
                        <Text style={{ color }}>+</Text>
                    </View>
                </View>

                <Text style={styles.cardTitle}>{paket.nama}</Text>
                <Text style={styles.cardDesc}>
                    Broadband UpTo | {paket.kecepatan}
                </Text>

                <View style={styles.divider} />

                <Text style={styles.priceLabel}>Harga Mulai</Text>
                <Text style={styles.price}>{paket.harga.split('*')[0]}</Text>
                
                <View style={{ height: 12 }} />
                
                 <View style={{flexDirection: 'row', gap: 8}}>
                    <View style={styles.featureChip}>
                        <Text style={{ fontSize: 10, color: '#3B82F6' }}>⚡ Setup Gratis</Text>
                    </View>
                     <View style={styles.featureChip}>
                        <Text style={{ fontSize: 10, color: '#3B82F6' }}>🎧 24/7 Support</Text>
                    </View>
                 </View>
            </View>

            {paket.isPromo && (
                <LinearGradient
                    colors={['#3B82F6', '#2563EB']}
                    style={styles.promoTag}
                    start={{ x:0, y:0 }}
                    end={{ x:1, y:1 }}
                >
                    <Text style={styles.promoText}>🔥 PROMO</Text>
                </LinearGradient>
            )}
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F3FF',
  },
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F0F3FF',
  },
  backButton: {
      padding: 8,
  },
  appBarTitle: {
      fontSize: 20,
      fontFamily: 'Poppins-Bold',
      color: '#1F2937',
  },
  content: {
      padding: 16,
      paddingBottom: 40,
  },
  banner: {
      padding: 20,
      borderRadius: 16,
      shadowColor: '#3B82F6',
      shadowOpacity: 0.3,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 4 },
      elevation: 5,
  },
  bannerTitle: {
      fontSize: 20,
      fontFamily: 'Poppins-Bold',
      color: 'white',
      marginBottom: 4,
  },
  bannerSubtitle: {
      fontSize: 14,
      fontFamily: 'Poppins-Regular',
      color: 'rgba(255,255,255,0.9)',
  },
  card: {
      backgroundColor: 'white',
      borderRadius: 20,
      marginBottom: 16,
      shadowColor: 'black',
      shadowOpacity: 0.05,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 4 },
      elevation: 2,
      borderWidth: 1,
      borderColor: 'transparent',
      overflow: 'visible', 
  },
  promoCard: {
      borderColor: 'rgba(59, 130, 246, 0.3)',
      borderWidth: 2,
  },
  cardContent: {
      padding: 20,
  },
  cardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
  },
  speedBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
      borderWidth: 1,
  },
  speedText: {
      fontWeight: 'bold',
      fontSize: 14,
      fontFamily: 'Poppins-Bold',
  },
  cartIcon: {
      width: 40, 
      height: 40,
      borderRadius: 20,
      borderWidth: 2,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(255,255,255,0.5)',
  },
  cardTitle: {
      fontSize: 20,
      fontFamily: 'Poppins-Bold',
      color: '#1F2937',
      marginBottom: 6,
  },
  cardDesc: {
      fontSize: 13,
      color: '#6B7280',
      fontFamily: 'Poppins-Regular',
  },
  divider: {
      height: 1,
      backgroundColor: '#E5E7EB',
      marginVertical: 16,
  },
  priceLabel: {
      fontSize: 12,
      color: '#6B7280',
      fontFamily: 'Poppins-Regular',
  },
  price: {
      fontSize: 22,
      fontFamily: 'Poppins-Bold',
      color: '#1F2937',
  },
  featureChip: {
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
  },
  promoTag: {
      position: 'absolute',
      top: -10,
      right: 20,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
      borderBottomLeftRadius: 4,
  },
  promoText: {
      color: 'white',
      fontSize: 10,
      fontFamily: 'Poppins-Bold',
      letterSpacing: 1,
  },
});
