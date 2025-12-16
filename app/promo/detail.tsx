import { Ionicons } from '@expo/vector-icons';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CartService, { Package } from '../services/cartService';

export default function PromoDetailScreen() {
    const params = useLocalSearchParams();
    const { nama, kecepatan, harga, isPromo } = params;

    // Fallback if data is missing (though typings should help)
    const title = nama as string || 'Paket';
    const speed = kecepatan as string || '0 Mbps';
    const priceText = harga as string || 'Rp 0';

    const [activeTab, setActiveTab] = useState('deskripsi');
    const [isInCart, setIsInCart] = useState(false);
    const [cartItemCount, setCartItemCount] = useState(0);

    useEffect(() => {
        const loadCartStatus = async () => {
            await CartService.initialize();
            setCartItemCount(CartService.getItemCount());

            // Check if current package is in cart
            const packageId = `${title.toLowerCase().replace(/\s+/g, '-')}`;
            setIsInCart(CartService.isItemInCart(packageId));
        };
        loadCartStatus();
    }, []);

    const handleAddToCart = async () => {
        const price = parseInt(priceText.replace(/[^\d]/g, '')) || 0;
        const packageId = `${title.toLowerCase().replace(/\s+/g, '-')}`;

        const packageItem: Package = {
            id: packageId,
            name: title,
            speed: speed,
            price: price,
            description: `Paket Internet ${title} dengan kecepatan ${speed}`,
            features: ['Unlimited Kuota', 'Gratis Modem ONT', 'Support 24/7'],
            activePeriod: 'bulan',
            isPromo: isPromo === 'true'
        };

        try {
            await CartService.addToCart(packageItem);
            setIsInCart(true);
            setCartItemCount(CartService.getItemCount());

            Alert.alert(
                "Berhasil Ditambahkan",
                "Paket berhasil ditambahkan ke keranjang. Apakah Anda ingin melanjutkan?",
                [
                    {
                        text: "Lihat Keranjang",
                        onPress: () => router.push('/cart')
                    },
                    {
                        text: "Nanti Saja",
                        style: "cancel"
                    }
                ]
            );
        } catch (error) {
            Alert.alert("Error", "Gagal menambahkan ke keranjang");
        }
    };

    const handleSubscribe = async () => {
        const price = parseInt(priceText.replace(/[^\d]/g, '')) || 0;
        const packageId = `${title.toLowerCase().replace(/\s+/g, '-')}`;

        const packageItem: Package = {
            id: packageId,
            name: title,
            speed: speed,
            price: price,
            description: `Paket Internet ${title} dengan kecepatan ${speed}`,
            features: ['Unlimited Kuota', 'Gratis Modem ONT', 'Support 24/7'],
            activePeriod: 'bulan',
            isPromo: isPromo === 'true'
        };

        try {
            await CartService.addToCart(packageItem);
            setCartItemCount(CartService.getItemCount());

            // Navigate to cart
            router.push('/cart');
        } catch (error) {
            Alert.alert("Error", "Gagal menambahkan ke keranjang");
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <Stack.Screen options={{ headerShown: false }} />
            
            {/* Header Background */}
            <View style={styles.headerBg}>
                 <Image 
                    source={require('../../assets/images/Rectangle 2800.png')} 
                    style={styles.headerImage}
                    resizeMode="cover"
                 />
                 <SafeAreaView>
                     <View style={styles.appBar}>
                        <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
                            <Ionicons name="arrow-back" size={24} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/cart')}>
                            <View style={styles.cartContainer}>
                                <Ionicons name="cart" size={24} color="white" />
                                {cartItemCount > 0 && (
                                    <View style={styles.cartBadge}>
                                        <Text style={styles.cartBadgeText}>{cartItemCount}</Text>
                                    </View>
                                )}
                            </View>
                        </TouchableOpacity>
                     </View>

                     <View style={styles.headerContent}>
                         <Text style={styles.headerTitle}>{title}</Text>
                         <Text style={styles.headerSpeed}>Up To {speed}</Text>
                         <View style={styles.headerChip}>
                             <Text style={styles.headerChipText}>Berlangganan</Text>
                         </View>
                     </View>
                 </SafeAreaView>
            </View>

            {/* White Content Card */}
            <View style={styles.contentCard}>
                <ScrollView contentContainerStyle={{ padding: 24 }}>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Masa Aktif</Text>
                        <Text style={styles.infoValue}>1 Bulan</Text>
                    </View>
                    <View style={{ height: 16 }} />
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Internet</Text>
                        <Text style={styles.infoValue}>{speed.replace(/\D/g,'')} Mbps</Text>
                    </View>

                    <View style={{ height: 32 }} />
                    
                    <Text style={styles.sectionTitle}>Informasi Tambahan:</Text>
                    <View style={{ height: 16 }} />

                    {/* Tabs */}
                    <View style={styles.tabBar}>
                        <TouchableOpacity 
                            style={[styles.tab, activeTab === 'deskripsi' && styles.activeTab]}
                            onPress={() => setActiveTab('deskripsi')}
                        >
                            <Text style={[styles.tabText, activeTab === 'deskripsi' && styles.activeTabText]}>Deskripsi</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={[styles.tab, activeTab === 'syarat' && styles.activeTab]}
                            onPress={() => setActiveTab('syarat')}
                        >
                            <Text style={[styles.tabText, activeTab === 'syarat' && styles.activeTabText]}>Syarat & Ketentuan</Text>
                        </TouchableOpacity>
                    </View>
                    
                    <View style={{ height: 16 }} />
                    
                    {activeTab === 'deskripsi' ? (
                        <Text style={styles.descText}>
                            Paket Internet {title} dengan kecepatan {speed} berlangganan selama 1 Bulan. 
                            Cocok untuk kebutuhan rumah tangga dengan penggunaan wajar.
                            {"\n\n"}
                            • Unlimited Kuota {"\n"}
                            • Gratis Modem ONT{"\n"}
                            • Support 24/7
                        </Text>
                    ) : (
                        <Text style={styles.descText}>
                            1. Harga belum termasuk PPN 11%{"\n"}
                            2. Kontrak berlangganan minimal 12 bulan{"\n"}
                            3. Biaya instalasi gratis untuk area tertentu
                        </Text>
                    )}

                    <View style={{ height: 100 }} />
                </ScrollView>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
                <View style={styles.footerRow}>
                    <Text style={styles.footerLabel}>Total Harga</Text>
                    <Text style={styles.footerPrice}>{priceText}</Text>
                </View>

                <View style={{ height: 16 }} />

                <View style={styles.buttonRow}>
                    <TouchableOpacity 
                        style={[styles.outlineButton, isInCart && styles.outlineButtonActive]}
                        onPress={handleAddToCart}
                    >
                        <Text style={[styles.outlineButtonText, isInCart && styles.outlineButtonTextActive]}>
                            {isInCart ? 'In Cart' : 'Add to Cart'}
                        </Text>
                    </TouchableOpacity>

                    <View style={{ width: 12 }} />

                    <TouchableOpacity style={styles.primaryButton} onPress={handleSubscribe}>
                        <Text style={styles.primaryButtonText}>Langganan</Text>
                    </TouchableOpacity>
                </View>
                <SafeAreaView edges={['bottom']} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  headerBg: {
      height: 300,
      backgroundColor: '#3B82F6', 
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
  },
  headerImage: {
      ...StyleSheet.absoluteFillObject,
      opacity: 0.5,
  },
  appBar: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingTop: 10,
  },
  iconButton: {
      padding: 8,
  },
  headerContent: {
      alignItems: 'center',
      marginTop: 20,
  },
  headerTitle: {
      color: 'white',
      fontSize: 22,
      fontFamily: 'Poppins-SemiBold',
      marginBottom: 4,
  },
  headerSpeed: {
      color: 'white',
      fontSize: 32,
      fontFamily: 'Poppins-Bold',
      marginBottom: 12,
  },
  headerChip: {
      backgroundColor: 'rgba(255,255,255,0.2)',
      paddingHorizontal: 16,
      paddingVertical: 6,
      borderRadius: 100,
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.3)',
  },
  headerChipText: {
      color: 'white',
      fontFamily: 'Poppins-Medium',
  },
  contentCard: {
      marginTop: 280, // Overlap header
      backgroundColor: '#F9FAFB',
      flex: 1,
      // No rounded corners at top as per design or maybe simple straight cut
  },
  infoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
  },
  infoLabel: {
      color: '#666666',
      fontSize: 16,
      fontFamily: 'Poppins-Medium',
  },
  infoValue: {
      color: '#1F2937',
      fontSize: 16,
      fontFamily: 'Poppins-SemiBold',
  },
  sectionTitle: {
      color: '#666666',
      fontSize: 16,
      fontFamily: 'Poppins-Medium',
  },
  tabBar: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderBottomColor: '#E5E7EB',
  },
  tab: {
      marginRight: 24,
      paddingBottom: 10,
      borderBottomWidth: 2,
      borderBottomColor: 'transparent',
  },
  activeTab: {
      borderBottomColor: '#3B82F6',
  },
  tabText: {
      color: '#9CA3AF',
      fontFamily: 'Poppins-Medium',
      fontSize: 14,
  },
  activeTabText: {
      color: '#3B82F6',
      fontFamily: 'Poppins-SemiBold',
  },
  descText: {
      color: '#666666',
      fontSize: 14,
      fontFamily: 'Poppins-Regular',
      lineHeight: 22,
  },
  footer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'white',
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      padding: 24,
      shadowColor: 'black',
      shadowOpacity: 0.1,
      shadowRadius: 10,
      elevation: 10,
  },
  footerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
  },
  footerLabel: {
      color: '#4B5563',
      fontSize: 16,
      fontFamily: 'Poppins-Medium',
  },
  footerPrice: {
      color: '#3B82F6',
      fontSize: 22,
      fontFamily: 'Poppins-Bold',
  },
  buttonRow: {
      flexDirection: 'row',
  },
  outlineButton: {
      flex: 1,
      borderWidth: 1,
      borderColor: '#3B82F6',
      borderRadius: 16,
      paddingVertical: 14,
      alignItems: 'center',
  },
  outlineButtonActive: {
      backgroundColor: '#EFF6FF',
      borderColor: '#3B82F6',
  },
  outlineButtonText: {
      color: '#3B82F6',
      fontFamily: 'Poppins-SemiBold',
      fontSize: 16,
  },
  outlineButtonTextActive: {
      color: 'green',
  },
  primaryButton: {
      flex: 1,
      backgroundColor: '#3B82F6',
      borderRadius: 16,
      paddingVertical: 14,
      alignItems: 'center',
  },
  primaryButtonText: {
      color: 'white',
      fontFamily: 'Poppins-Bold',
      fontSize: 16,
  },
  cartContainer: {
      position: 'relative',
  },
  cartBadge: {
      position: 'absolute',
      right: -8,
      top: -4,
      backgroundColor: '#EF4444',
      borderRadius: 10,
      width: 20,
      height: 20,
      justifyContent: 'center',
      alignItems: 'center',
  },
  cartBadgeText: {
      color: 'white',
      fontSize: 12,
      fontFamily: 'Poppins-Bold',
  },
});
