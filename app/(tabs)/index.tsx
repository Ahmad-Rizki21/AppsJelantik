import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Animated, Image, Linking, Platform, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CartService from '../services/cartService';

// --- Types ---
interface Pelanggan {
  idPelanggan: string;
  nama: string;
  nomorTelepon: string;
  email: string;
  aktifHingga: Date;
  tagihanSelanjutnya: string;
  statusTagihan: string;
}

// --- Dummy Data ---
const dummyPelanggan: Pelanggan = {
  idPelanggan: 'FTTH-1222502221027',
  nama: 'Ahmad-Rizki21',
  nomorTelepon: '0822-2361-6884',
  email: 'ahmad.rizki21@gmail.com',
  aktifHingga: new Date(2025, 11, 28), // Month is 0-indexed in JS
  tagihanSelanjutnya: '01-01-2025',
  statusTagihan: 'Lunas',
};

// --- Helper Functions ---
const months = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const getFormattedDate = (date: Date) => {
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
};

const getShortFormattedDate = (date: Date) => {
  const day = date.getDate().toString().padStart(2, '0');
  const month = months[date.getMonth()];
  return `${day} ${month}\n${date.getFullYear()}`;
};

export default function HomeScreen() {
  const [isAccountSwitcherOpen, setIsAccountSwitcherOpen] = useState(false);
  const [slideAnim] = useState(new Animated.Value(-350));
  const [opacityAnim] = useState(new Animated.Value(0));
  const [cartItemCount, setCartItemCount] = useState(0);

  useEffect(() => {
    const loadCartCount = async () => {
      await CartService.initialize();
      setCartItemCount(CartService.getItemCount());
    };
    loadCartCount();
  }, []);

  const toggleAccountSwitcher = () => {
    const opacityValue = isAccountSwitcherOpen ? 0 : 1;
    const translateYValue = isAccountSwitcherOpen ? -350 : (Platform.OS === 'ios' ? 120 : 100);

    Animated.parallel([
        Animated.timing(slideAnim, {
            toValue: translateYValue,
            duration: 300,
            useNativeDriver: true, // Transform can use native driver
        }),
        Animated.timing(opacityAnim, {
            toValue: opacityValue,
            duration: 300,
            useNativeDriver: true, // Opacity can use native driver
        })
    ]).start();

    setIsAccountSwitcherOpen(!isAccountSwitcherOpen);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <View style={{ flex: 1, position: 'relative' }}>
             <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={{ height: 68 }} /> 
                <View style={{ height: 24 }} />
                
                <CombinedSubscriptionSection pelanggan={dummyPelanggan} />
                <View style={{ height: 24 }} />
                
                <ActionMenuSection cartItemCount={cartItemCount} />
                <View style={{ height: 24 }} />
                
                <SpecialOfferSection />
                <View style={{ height: 40 }} />
             </ScrollView>

             {/* Profile Card Fixed at Top */}
             <View style={styles.profileCardContainer}>
                 <ProfileCard pelanggan={dummyPelanggan} onToggle={toggleAccountSwitcher} isOpen={isAccountSwitcherOpen} />
             </View>

             {/* Account Switcher Overlay */}
             {isAccountSwitcherOpen && (
                 <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={toggleAccountSwitcher}>
                     <View style={[styles.overlay, { backgroundColor: 'rgba(0,0,0,0.2)' }]} />
                 </TouchableOpacity>
             )}

             {/* Account Switcher Popup */}
             <Animated.View style={[
                 styles.accountSwitcher,
                 {
                     transform: [{ translateY: slideAnim }],
                     opacity: opacityAnim
                 }
             ]}>
                 <AccountSwitcherContent pelanggan={dummyPelanggan} />
             </Animated.View>
        </View>
      </SafeAreaView>
    </View>
  );
}

// --- Components ---

function ProfileCard({ pelanggan, onToggle, isOpen }: { pelanggan: Pelanggan, onToggle: () => void, isOpen: boolean }) {
    return (
        <TouchableOpacity style={styles.profileCard} onPress={onToggle} activeOpacity={0.9}>
            <Image source={require('../../assets/images/Ellipse 245.png')} style={styles.avatar} />
            <View style={styles.profileInfo}>
                <Text style={styles.greeting}>Hi, {pelanggan.nama}</Text>
                <View style={styles.idRow}>
                    <Ionicons 
                        name="chevron-down" 
                        size={16} 
                        color="#1F2937" 
                        style={{ marginRight: 4, transform: [{ rotate: isOpen ? '180deg' : '0deg' }] }}
                    />
                    <Text style={styles.idText}>{pelanggan.idPelanggan.replace('FTTH-', '')}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

function AccountSwitcherContent({ pelanggan }: { pelanggan: Pelanggan }) {
    return (
        <View style={styles.switcherContent}>
            <Text style={styles.switcherTitle}>Pilih akun</Text>
            <View style={styles.divider} />
            <Text style={styles.switcherName}>{pelanggan.nama}</Text>
            <Text style={styles.switcherId}>{pelanggan.idPelanggan}</Text>
            <Text style={styles.switcherId}>{pelanggan.email}</Text>
            <Text style={styles.switcherActive}>Aktif hingga {getFormattedDate(pelanggan.aktifHingga)}</Text>
        </View>
    );
}

function CombinedSubscriptionSection({ pelanggan }: { pelanggan: Pelanggan }) {
    return (
        <View style={styles.combinedCard}>
            <SubscriptionCard pelanggan={pelanggan} />
            <InternetDetailsCard />
        </View>
    );
}

function SubscriptionCard({ pelanggan }: { pelanggan: Pelanggan }) {
    return (
        <View style={styles.subscriptionCard}>
            <View style={styles.subscriptionRow}>
                <View style={[styles.subscriptionCol, { flex: 1, marginRight: 6 }]}>
                    <BillingInfoCard pelanggan={pelanggan} />
                </View>
                <View style={[styles.subscriptionCol, { flex: 1, marginLeft: 6 }]}>
                    <PackageInfoCard />
                </View>
            </View>
        </View>
    );
}

function BillingInfoCard({ pelanggan }: { pelanggan: Pelanggan }) {
    return (
        <View style={styles.infoCard}>
             <View style={styles.rowCenter}>
                 <Text style={styles.lunasText}>Tagihan Lunas</Text>
                 <Text style={{ color: '#3B82F6', marginLeft: 4 }}>✓</Text> 
                 {/* Or use Icon if available */}
             </View>
             
             <View style={{ height: 6 }} />
             
             <View style={styles.rowCenter}>
                 <Text style={styles.detailLabelIcon}>👤</Text>
                 <Text style={styles.detailLabel}>ID Pelanggan</Text>
             </View>
             <Text style={styles.detailValue}>{pelanggan.idPelanggan}</Text>
             
             <View style={{ height: 8 }} />
             
             <Text style={styles.detailLabel}>Aktif hingga</Text>
             <Text style={styles.dateLarge}>{getShortFormattedDate(pelanggan.aktifHingga)}</Text>
             
             <View style={{ flex: 1 }} />
             
             <Text style={styles.nextBillLabel}>Tagihan selanjutnya <Text style={styles.nextBillValue}>{pelanggan.tagihanSelanjutnya}</Text></Text>
        </View>
    );
}

function PackageInfoCard() {
    return (
        <View style={[styles.infoCard, { alignItems: 'center' }]}>
            <View style={{ flex: 1 }} />
            <Text style={styles.sparkText}>Spark</Text>
            <View style={styles.rowBaseline}>
                <Text style={styles.speedNumber}>50</Text>
                <Text style={styles.speedUnit}>Mbps</Text>
            </View>
            <View style={{ flex: 1 }} />
            <Text style={styles.ontText}>ONT : <Text style={{ fontWeight: 'bold' }}>ZTEGC6937B3</Text></Text>
        </View>
    );
}

function InternetDetailsCard() {
    return (
        <TouchableOpacity 
            style={styles.internetDetailsCard} 
            activeOpacity={0.9}
            onPress={() => router.push('/subscription/package-detail')}
        >
            <View style={styles.iconCircle}>
                <Image source={require('../../assets/images/Subtract.png')} style={{ width: 32, height: 32 }} />
                <Image source={require('../../assets/images/Subtract (1).png')} style={styles.iconOverlay} />
            </View>
            <View style={{ width: 12 }} />
            <View style={{ flex: 1 }}>
                <Text style={styles.internetLabel}>Internet</Text>
                <Text style={styles.internetValue}>Sampai dengan</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.broadbandLabel}>Broadband UpTo</Text>
                <Text style={styles.broadbandValue}>10 Mbps</Text>
            </View>
             <View style={{ width: 8 }} />
             <Text style={{ color: 'grey' }}>›</Text>
        </TouchableOpacity>
    );
}

function ActionMenuSection({ cartItemCount }: { cartItemCount: number }) {
    return (
        <View style={styles.actionMenuContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ padding: 16 }}>
                <TouchableOpacity style={styles.actionItem} onPress={() => router.push('/payment')}>
                    <View style={styles.actionIconContainer}>
                        <Ionicons name="card" size={24} color="#3B82F6"/>
                    </View>
                    <Text style={styles.actionLabel}>Pembayaran</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionItem} onPress={() => router.push('/cart')}>
                    <View style={styles.actionIconContainer}>
                        <Ionicons name="cart" size={24} color="#3B82F6"/>
                        {cartItemCount > 0 && (
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>{cartItemCount}</Text>
                            </View>
                        )}
                    </View>
                    <Text style={styles.actionLabel}>Cart</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionItem} onPress={() => router.push('/support')}>
                    <View style={styles.actionIconContainer}>
                        <Ionicons name="headset" size={24} color="#3B82F6"/>
                    </View>
                    <Text style={styles.actionLabel}>Layanan\Pelanggan</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionItem} onPress={() => router.push('/tools/router')}>
                    <View style={styles.actionIconContainer}>
                        <Ionicons name="wifi" size={24} color="#3B82F6"/>
                    </View>
                    <Text style={styles.actionLabel}>Ont / Router</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionItem} onPress={() => Linking.openURL('https://www.instagram.com/artacomindojejaring/')}>
                    <View style={styles.actionIconContainer}>
                        <Ionicons name="logo-instagram" size={24} color="#3B82F6"/>
                    </View>
                    <Text style={styles.actionLabel}>Instagram</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionItem} onPress={() => Linking.openURL('https://x.com/artacomindo')}>
                    <View style={styles.actionIconContainer}>
                        <Ionicons name="logo-twitter" size={24} color="#3B82F6"/>
                    </View>
                    <Text style={styles.actionLabel}>Twitter</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionItem} onPress={() => Linking.openURL('https://www.jelantik.com')}>
                    <View style={styles.actionIconContainer}>
                        <Ionicons name="globe" size={24} color="#3B82F6"/>
                    </View>
                    <Text style={styles.actionLabel}>Website</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

function SpecialOfferSection() {
    return (
        <View style={styles.specialOfferContainer}>
             <View style={styles.specialOfferHeader}>
                 <View style={{ flex: 1 }}>
                     <Text style={styles.soTitle}>Special Offers</Text>
                     <Text style={styles.soSubtitle}>Pilihan paket terbaik dengan harga spesial</Text>
                 </View>
                 <View style={styles.limitedBadge}>
                     <Text style={styles.limitedText}>LIMITED</Text>
                 </View>
             </View>
             
             <View style={{ height: 16 }} />
             
             <OfferCard 
                title="Lighting" 
                speed="10 Mbps" 
                price="Rp 166,500* / Bulan"
                originalPrice="Rp 200,000 / Bulan"
                discount="17%"
                features={['Basic Internet', 'Email Support']}
                color="#6366F1"
                icon="💡"
                isPopular
                onPress={() => router.push({
                    pathname: '/promo/detail',
                    params: {
                        nama: 'Lighting',
                        kecepatan: '10 Mbps',
                        harga: 'Rp 166,500* / Bulan',
                        isPromo: 'true'
                    }
                } as any)}
             />
             <View style={{ height: 12 }} />
             <OfferCard 
                title="Family Speed" 
                speed="20 Mbps" 
                price="Rp 231,990* / Bulan"
                originalPrice="Rp 389,000 / Bulan"
                discount="40%"
                features={['Streaming HD', 'Multiuser Support', 'Online Gaming']}
                color="#3B82F6"
                icon="🚀"
                onPress={() => router.push({
                    pathname: '/promo/detail',
                    params: {
                        nama: 'Family Speed',
                        kecepatan: '20 Mbps',
                        harga: 'Rp 231,990* / Bulan',
                        isPromo: 'true'
                    }
                } as any)}
             />
             
             <View style={{ height: 16 }} />
             
             <TouchableOpacity style={styles.viewAllButton} onPress={() => router.push('/promo' as any)}>
                 <Text style={styles.viewAllText}>Lihat Semua Promo</Text>
             </TouchableOpacity>
        </View>
    );
}

function OfferCard({ title, speed, price, originalPrice, discount, features, color, icon, isPopular, onPress }: any) {
    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.9} style={[styles.offerCard, isPopular && styles.offerCardPopular, { shadowColor: color }]}>
            <View style={{ flexDirection: 'row' }}>
                <View style={[styles.offerIconContainer, { backgroundColor: color + '20' }]}>
                    <Text style={{ fontSize: 20 }}>{icon}</Text>
                </View>
                <View style={{ width: 12 }} />
                <View style={{ flex: 1 }}>
                    <Text style={styles.offerTitle}>{title}</Text>
                    <Text style={[styles.offerSpeed, { color }]}>{speed}</Text>
                </View>
                {isPopular && (
                    <View style={styles.popularBadge}>
                        <Ionicons name="star" size={10} color="white" style={{ marginRight: 4 }} />
                        <Text style={styles.popularText}>POPULER</Text>
                    </View>
                )}
            </View>
            
            <View style={{ height: 12 }} />
            
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                {features.map((f: string, i: number) => (
                    <View key={i} style={styles.featureChip}>
                        <Text style={styles.featureText}>{f}</Text>
                    </View>
                ))}
            </View>
            
            <View style={{ height: 12 }} />
            <View style={{ height: 1, backgroundColor: '#E5E7EB' }} />
            <View style={{ height: 12 }} />
            
            <View style={{ flexDirection: 'row' }}>
                <View style={{ flex: 1 }}>
                     {originalPrice && <Text style={styles.originalPrice}>{originalPrice}</Text>}
                     <Text style={styles.price}>{price}</Text>
                </View>
                {discount && (
                    <View style={styles.discountBadge}>
                        <Text style={styles.discountText}>HEMAT {discount}</Text>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F3FF',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  profileCardContainer: {
    position: 'absolute',
    top: 8,
    left: 16,
    right: 16,
    zIndex: 10,
  },
  profileCard: {
    height: 68,
    backgroundColor: 'white',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    shadowColor: 'grey',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  profileInfo: {
    marginLeft: 12,
  },
  greeting: {
    fontSize: 15,
    fontFamily: 'Poppins-SemiBold',
    color: '#1F2937',
  },
  idRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lineIcon: {
    width: 25,
    height: 10,
    marginLeft: -4,
  },
  idText: {
    fontSize: 13,
    fontFamily: 'Poppins-Medium',
    color: '#1F2937',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9,
  },
  accountSwitcher: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 20,
  },
  switcherContent: {
      padding: 24,
      backgroundColor: 'white',
      borderRadius: 16,
      shadowColor: 'black',
      shadowOpacity: 0.1,
      shadowRadius: 24,
      elevation: 10,
  },
  switcherTitle: {
      fontSize: 20,
      fontFamily: 'Poppins-Bold',
      color: '#111827',
  },
  divider: {
      height: 1.5,
      backgroundColor: '#D1D5DB',
      marginVertical: 16,
  },
  switcherName: { fontSize: 16, fontFamily: 'Poppins-SemiBold', color: '#2563EB' },
  switcherId: { fontSize: 16, fontFamily: 'Poppins-SemiBold', color: '#111827' },
  switcherActive: { fontSize: 14, fontFamily: 'Poppins-Medium', color: '#181818', marginTop: 4 },

  // Subscription Section
  combinedCard: {
      borderRadius: 20,
      shadowColor: '#3B82F6',
      shadowOpacity: 0.3,
      shadowRadius: 15,
      shadowOffset: { width: 0, height: 8 },
      elevation: 5,
      backgroundColor: 'transparent',
  },
  subscriptionCard: {
      backgroundColor: '#3B82F6',
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: 12,
  },
  subscriptionRow: {
      flexDirection: 'row',
  },
  subscriptionCol: {
      // flex: 1 handled inline
  },
  infoCard: {
      backgroundColor: 'white',
      borderRadius: 12,
      padding: 12,
      minHeight: 140, // Ensure nice height alignment
      flex: 1, // Ensure it fills the parent height for equal sizing
  },
  lunasText: { color: '#3B82F6', fontWeight: 'bold', fontSize: 11, fontFamily: 'Poppins-Bold' },
  rowCenter: { flexDirection: 'row', alignItems: 'center' },
  detailLabelIcon: { fontSize: 12, color: '#6B7280', marginRight: 4 },
  detailLabel: { fontSize: 10, color: '#6B7280', fontFamily: 'Poppins-Regular' },
  detailValue: { fontSize: 12, fontWeight: '600', color: '#1F2937', fontFamily: 'Poppins-SemiBold' },
  dateLarge: { fontSize: 16, fontWeight: 'bold', color: '#1E40AF', lineHeight: 20, fontFamily: 'Poppins-Bold' },
  nextBillLabel: { fontSize: 10, color: '#6B7280', fontFamily: 'Poppins-Regular' },
  nextBillValue: { color: '#1E40AF' },
  
  sparkText: { fontSize: 20, color: '#3B82F6', fontFamily: 'Poppins-SemiBold' },
  rowBaseline: { flexDirection: 'row', alignItems: 'baseline' },
  speedNumber: { fontSize: 36, fontWeight: '800', color: '#1E40AF', fontFamily: 'Poppins-Bold' },
  speedUnit: { fontSize: 18, fontWeight: '600', color: '#1E40AF', marginLeft: 4, fontFamily: 'Poppins-SemiBold' },
  ontText: { fontSize: 10, color: '#131313', fontFamily: 'Poppins-Regular' },

  internetDetailsCard: {
      backgroundColor: 'white',
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
      paddingHorizontal: 16,
      paddingVertical: 12,
      flexDirection: 'row',
      alignItems: 'center',
  },
  iconCircle: { width: 32, height: 32, position: 'relative' },
  iconOverlay: { position: 'absolute', bottom: 0, width: 32, height: 18, resizeMode: 'contain' },
  internetLabel: { color: '#11317D', fontSize: 14, fontFamily: 'Poppins-Regular' },
  internetValue: { color: '#11317D', fontSize: 16, fontWeight: 'bold', fontFamily: 'Poppins-SemiBold' },
  broadbandLabel: { color: '#11317D', fontSize: 14, fontFamily: 'Poppins-Bold', textAlign: 'right' },
  broadbandValue: { color: '#11317D', fontSize: 16, fontWeight: 'bold', fontFamily: 'Poppins-Bold', textAlign: 'right' },

  // Action Menu
  actionMenuContainer: {
      backgroundColor: 'white',
      borderRadius: 20,
      shadowColor: 'black',
      shadowOpacity: 0.05,
      shadowRadius: 10,
      elevation: 2,
  },
  actionItem: {
      alignItems: 'center',
      marginHorizontal: 8,
      minWidth: 80,
  },
  actionIconContainer: {
      position: 'relative',
      marginBottom: 8,
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: '#F0F3FF',
      justifyContent: 'center',
      alignItems: 'center',
  },
  badge: {
      position: 'absolute',
      right: -4,
      top: -4,
      backgroundColor: '#EF4444',
      borderRadius: 10,
      width: 20,
      height: 20,
      justifyContent: 'center',
      alignItems: 'center',
  },
  badgeText: {
      color: 'white',
      fontSize: 12,
      fontFamily: 'Poppins-Bold',
  },
  actionLabel: {
      fontSize: 12,
      fontFamily: 'Poppins-Regular',
      color: '#1F2937',
      textAlign: 'center',
  },

  // Special Offers
  specialOfferContainer: {
      backgroundColor: 'white',
      borderRadius: 20,
      borderWidth: 1,
      borderColor: '#E5E7EB',
      padding: 16,
  },
  specialOfferHeader: { flexDirection: 'row' },
  soTitle: { fontSize: 20, fontFamily: 'Poppins-Bold', color: '#1F2937' },
  soSubtitle: { fontSize: 12, color: '#6B7280', fontFamily: 'Poppins-Regular' },
  limitedBadge: { backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6, justifyContent: 'center' },
  limitedText: { fontSize: 10, color: '#3B82F6', fontWeight: 'bold', letterSpacing: 1 },
  
  viewAllButton: { backgroundColor: '#3B82F6', borderRadius: 12, padding: 14, alignItems: 'center' },
  viewAllText: { color: 'white', fontSize: 16, fontFamily: 'Poppins-SemiBold' },

  offerCard: {
      backgroundColor: 'white',
      borderRadius: 16,
      padding: 16,
      borderWidth: 1,
      borderColor: 'rgba(0,0,0,0.1)',
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 2,
  },
  offerCardPopular: {
      borderWidth: 2,
      borderColor: '#3B82F6',
  },
  offerIconContainer: { padding: 8, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  offerTitle: { fontSize: 18, fontFamily: 'Poppins-Bold', color: '#1F2937' },
  offerSpeed: { fontSize: 14, fontFamily: 'Poppins-SemiBold' },
  popularBadge: { 
      backgroundColor: '#3B82F6', 
      borderRadius: 12, 
      paddingHorizontal: 8, 
      paddingVertical: 4, 
      alignSelf: 'flex-start',
      flexDirection: 'row',
      alignItems: 'center' 
  },
  popularText: { color: 'white', fontSize: 10, fontWeight: 'bold' },
  featureChip: { backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  featureText: { fontSize: 11, color: '#6B7280', fontFamily: 'Poppins-Regular' },
  originalPrice: { fontSize: 12, color: 'grey', textDecorationLine: 'line-through', fontFamily: 'Poppins-Regular' },
  price: { fontSize: 20, fontFamily: 'Poppins-Bold', color: '#1F2937' },
  discountBadge: { 
      backgroundColor: 'red', 
      borderRadius: 8, 
      paddingHorizontal: 8, 
      paddingVertical: 4, 
      justifyContent: 'center', 
      alignSelf: 'flex-start' 
  },
  discountText: { color: 'white', fontSize: 10, fontWeight: 'bold' },
},);
