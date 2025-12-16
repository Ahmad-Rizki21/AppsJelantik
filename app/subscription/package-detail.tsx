import { Ionicons } from '@expo/vector-icons';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SceneMap, TabBar, TabView } from 'react-native-tab-view';
import CartService, { Package } from '../services/cartService';

// Initialize CartService
const cartService = CartService;

// Mock data untuk paket yang tersedia
const AVAILABLE_PACKAGES: Package[] = [
    {
        id: 'basic',
        name: 'Basic Light',
        speed: '10 Mbps',
        price: 166500,
        description: 'Cocok untuk browsing dan sosial media',
        features: ['Unlimited Quota', 'Modem Gratis', 'Support 24/7'],
        activePeriod: 'bulan',
        isPromo: true
    },
    {
        id: 'family',
        name: 'Family Speed',
        speed: '20 Mbps',
        price: 231990,
        description: 'Ideal untuk streaming dan video conference',
        features: ['Unlimited Quota', 'Modem Gratis', 'Support 24/7', 'Bonus Streaming'],
        activePeriod: 'bulan',
        isPromo: true
    },
    {
        id: 'pro',
        name: 'Pro Boost',
        speed: '30 Mbps',
        price: 276390,
        description: 'Perfect untuk gaming dan multiple devices',
        features: ['Unlimited Quota', 'Modem Gratis', 'Support 24/7', 'Prioritas Gaming'],
        activePeriod: 'bulan',
        isPromo: false
    },
    {
        id: 'ultra',
        name: 'Ultra Fast',
        speed: '50 Mbps',
        price: 321789,
        description: 'Ultimate speed untuk heavy users',
        features: ['Unlimited Quota', 'Modem Gratis', 'Support 24/7', 'Static IP Available'],
        activePeriod: 'bulan',
        isPromo: false
    }
];

// Add color property to packages
AVAILABLE_PACKAGES.forEach(pkg => {
    (pkg as any).color = CartService.getSpeedColor(pkg.speed);
});

// Mock data untuk paket saat ini
const DEFAULT_PACKAGE = {
    title: 'Broadband UpTo',
    speed: '10 Mbps',
    packageId: 'basic',
    activePeriod: '1 Bulan',
    price: 166500,
    description: 'Nikmati internet cepat dan stabil dengan paket Broadband UpTo 10 Mbps. Cocok untuk penggunaan rumahan, streaming, dan browsing sehari-hari.\n\nKeunggulan:\n- Koneksi Fiber Optic\n- Unlimited Quota\n- Support 24/7\n- Modem WiFi dipinjamkan\n- Gratis biaya pasang baru*',
    terms: '1. Harga belum termasuk PPN 11%.\n2. Kecepatan up to 10 Mbps (Best Effort).\n3. Biaya instalasi gratis dengan syarat berlangganan minimal 12 bulan.\n4. Perangkat modem pinjaman, wajib dikembalikan saat berhenti berlangganan.'
};

export default function PackageDetailScreen() {
    const params = useLocalSearchParams();
    const packet = { ...DEFAULT_PACKAGE, ...params };
    const layout = useWindowDimensions();

    const [mainIndex, setMainIndex] = useState(0);
    const [mainRoutes] = useState([
        { key: 'detail', title: 'Detail' },
        { key: 'change', title: 'Ganti Paket' },
    ]);

    const [innerIndex, setInnerIndex] = useState(0);
    const [innerRoutes] = useState([
        { key: 'description', title: 'Deskripsi' },
        { key: 'terms', title: 'Syarat & Ketentuan' },
    ]);

    // States untuk package change flow
    const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [changeStep, setChangeStep] = useState('select'); // select, confirm, success

    // States for cart functionality
    const [cartItemCount, setCartItemCount] = useState(0);
    const [isAddingToCart, setIsAddingToCart] = useState(false);

    // Initialize cart service
    useEffect(() => {
        const initializeCart = async () => {
            await cartService.initialize();
            setCartItemCount(cartService.getItemCount());
        };
        initializeCart();
    }, []);

    // Add to cart function
    const handleAddToCart = async (pkg: Package) => {
        setIsAddingToCart(true);
        try {
            await cartService.addToCart(pkg);
            setCartItemCount(cartService.getItemCount());

            // Ask if user wants to proceed to registration
            Alert.alert(
                'Berhasil Ditambahkan',
                'Paket berhasil ditambahkan ke keranjang. Apakah Anda ingin melanjutkan pendaftaran?',
                [
                    {
                        text: 'Lihat Keranjang',
                        onPress: () => router.push('/cart')
                    },
                    {
                        text: 'Daftar Sekarang',
                        onPress: () => router.push('/subscription/customer-type')
                    },
                    {
                        text: 'Nanti Saja',
                        style: 'cancel'
                    }
                ]
            );
        } catch (error) {
            Alert.alert('Error', 'Gagal menambahkan ke keranjang. Silakan coba lagi.');
        } finally {
            setIsAddingToCart(false);
        }
    };

    const renderInnerScene = SceneMap({
        description: () => (
            <ScrollView style={styles.tabContent} nestedScrollEnabled>
                <Text style={styles.tabText}>{packet.description}</Text>
            </ScrollView>
        ),
        terms: () => (
            <ScrollView style={styles.tabContent} nestedScrollEnabled>
                <Text style={styles.tabText}>{packet.terms}</Text>
            </ScrollView>
        ),
    });

    const DetailTab = () => (
        <View style={{ flex: 1, padding: 24 }}>
            {/* Info Rows */}
            <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Masa Aktif</Text>
                <Text style={styles.infoValue}>{packet.activePeriod}</Text>
            </View>
            <View style={styles.separator} />
            <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Internet</Text>
                <Text style={styles.infoValue}>{packet.speed}</Text>
            </View>

            <View style={{ height: 24 }} />

            <Text style={styles.additionalInfoTitle}>Informasi tambahan:</Text>

            <View style={{ flex: 1, marginTop: 16 }}>
                <TabView
                    navigationState={{ index: innerIndex, routes: innerRoutes }}
                    renderScene={renderInnerScene}
                    onIndexChange={setInnerIndex}
                    initialLayout={{ width: layout.width }}
                    renderTabBar={(props: any) => (
                        <TabBar
                            {...props}
                            indicatorStyle={{ backgroundColor: '#3B82F6', height: 2 }}
                            style={{ backgroundColor: 'white', elevation: 0, shadowOpacity: 0, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' }}
                            labelStyle={{ color: '#3B82F6', fontFamily: 'Poppins-SemiBold', fontSize: 14, textTransform: 'none' }}
                            activeColor="#3B82F6"
                            inactiveColor="#9CA3AF"
                        />
                    )}
                />
            </View>
        </View>
    );

    // Fungsi untuk memproses perubahan paket
    const processPackageChange = async () => {
        if (!selectedPackage) return;

        setIsProcessing(true);

        // Simulasi API call
        setTimeout(() => {
            setIsProcessing(false);
            setChangeStep('success');

            // Tampilkan sukses notifikasi
            Alert.alert(
                'Perubahan Paket Berhasil!',
                `Paket Anda akan berubah ke ${selectedPackage.name} (${selectedPackage.speed}) mulai periode tagihan berikutnya. \n\nBiaya tambahan: Rp ${selectedPackage.price - packet.price}/bulan`,
                [
                    {
                        text: 'OK',
                        onPress: () => {
                            // Kembali ke halaman utama
                            router.back();
                        }
                    }
                ]
            );
        }, 2000);
    };

    // Render step pemilihan paket
    const renderSelectStep = () => (
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 24 }}>
            <Text style={styles.sectionTitle}>Pilih Paket Baru</Text>
            <Text style={styles.sectionSubtitle}>
                Paket saat ini: {packet.title} ({packet.speed})
            </Text>

            <View style={{ height: 20 }} />

            {AVAILABLE_PACKAGES
                .filter((pkg: Package) => pkg.id !== packet.packageId) // Filter out current package
                .map((pkg) => (
                    <TouchableOpacity
                        key={pkg.id}
                        style={[
                            styles.packageCard,
                            selectedPackage?.id === pkg.id && styles.selectedPackageCard
                        ]}
                        onPress={() => setSelectedPackage(pkg)}
                    >
                        <View style={styles.packageHeader}>
                            <View style={styles.packageInfo}>
                                <Text style={styles.packageName}>{pkg.name}</Text>
                                <Text style={styles.packageSpeed}>{pkg.speed}</Text>
                            </View>
                            <View style={styles.packagePriceContainer}>
                                <Text style={styles.packagePrice}>
                                    Rp {pkg.price.toLocaleString('id-ID')}
                                </Text>
                                <Text style={styles.packagePriceLabel}>/bulan</Text>
                            </View>
                        </View>
                        <Text style={styles.packageDescription}>{pkg.description}</Text>

                        <View style={styles.featuresContainer}>
                            {pkg.features.map((feature, index) => (
                                <View key={index} style={styles.featureItem}>
                                    <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                                    <Text style={styles.featureText}>{feature}</Text>
                                </View>
                            ))}
                        </View>

                        <View style={styles.packageActions}>
                            <TouchableOpacity
                                style={styles.addToCartButton}
                                onPress={() => handleAddToCart(pkg)}
                                disabled={isAddingToCart}
                            >
                                {isAddingToCart && selectedPackage?.id === pkg.id ? (
                                    <ActivityIndicator size="small" color="white" />
                                ) : (
                                    <Ionicons name="cart" size={16} color="white" />
                                )}
                                <Text style={styles.addToCartText}>
                                    {isAddingToCart && selectedPackage?.id === pkg.id ? 'Menambahkan...' : 'Tambah ke Keranjang'}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.selectButton,
                                    selectedPackage?.id === pkg.id && styles.selectButtonSelected
                                ]}
                                onPress={() => setSelectedPackage(pkg)}
                            >
                                <Ionicons
                                    name={selectedPackage?.id === pkg.id ? "checkmark" : "radio-button-off"}
                                    size={16}
                                    color={selectedPackage?.id === pkg.id ? "white" : "#3B82F6"}
                                />
                                <Text style={[
                                    styles.selectButtonText,
                                    selectedPackage?.id === pkg.id && styles.selectButtonTextSelected
                                ]}>
                                    {selectedPackage?.id === pkg.id ? 'Dipilih' : 'Pilih'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                ))}

            <View style={{ height: 24 }} />

            <TouchableOpacity
                style={[
                    styles.continueButton,
                    !selectedPackage && styles.continueButtonDisabled
                ]}
                onPress={() => setChangeStep('confirm')}
                disabled={!selectedPackage}
            >
                <Text style={styles.continueButtonText}>Lanjutkan</Text>
            </TouchableOpacity>

            <View style={{ height: 40 }} />
        </ScrollView>
    );

    // Render step konfirmasi
    const renderConfirmStep = () => {
        if (!selectedPackage) return null;

        return (
            <ScrollView style={{ flex: 1, padding: 24 }}>
                <View style={styles.confirmCard}>
                    <View style={styles.confirmIcon}>
                        <Ionicons name="swap-horizontal" size={32} color="#3B82F6" />
                    </View>
                    <Text style={styles.confirmTitle}>Konfirmasi Perubahan Paket</Text>

                    <View style={{ height: 24 }} />

                    <View style={styles.currentPackageContainer}>
                        <Text style={styles.packageChangeLabel}>Paket Saat Ini</Text>
                        <View style={styles.currentPackageInfo}>
                            <Text style={styles.currentPackageName}>{packet.title}</Text>
                            <Text style={styles.currentPackageSpeed}>{packet.speed}</Text>
                            <Text style={styles.currentPackagePrice}>
                                Rp {packet.price.toLocaleString('id-ID')}/bulan
                            </Text>
                        </View>
                    </View>

                    <View style={styles.arrowContainer}>
                        <Ionicons name="arrow-down" size={24} color="#9CA3AF" />
                    </View>

                    <View style={styles.newPackageContainer}>
                        <Text style={styles.packageChangeLabel}>Paket Baru</Text>
                        <View style={styles.newPackageInfo}>
                            <Text style={styles.newPackageName}>{selectedPackage.name}</Text>
                            <Text style={styles.newPackageSpeed}>{selectedPackage.speed}</Text>
                            <Text style={styles.newPackagePrice}>
                                Rp {selectedPackage.price.toLocaleString('id-ID')}/bulan
                            </Text>
                        </View>
                    </View>

                    <View style={{ height: 24 }} />

                    <View style={styles.priceDifferenceContainer}>
                        <Text style={styles.priceDifferenceLabel}>Selisih Harga</Text>
                        <Text style={[
                            styles.priceDifference,
                            selectedPackage.price > packet.price ? styles.priceIncrease : styles.priceDecrease
                        ]}>
                            {selectedPackage.price > packet.price ? '+' : ''}
                            Rp {(selectedPackage.price - packet.price).toLocaleString('id-ID')}/bulan
                        </Text>
                    </View>

                <View style={{ height: 32 }} />

                <View style={styles.noteContainer}>
                    <Ionicons name="information-circle" size={20} color="#F59E0B" />
                    <Text style={styles.noteText}>
                        Perubahan paket akan berlaku mulai periode tagihan berikutnya.
                        Biaya selisih akan ditambahkan ke tagihan bulan depan.
                    </Text>
                </View>

                <View style={{ height: 32 }} />

                <View style={styles.buttonRow}>
                    <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={() => {
                            setChangeStep('select');
                            setSelectedPackage(null);
                        }}
                    >
                        <Text style={styles.cancelButtonText}>Batal</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.confirmButton}
                        onPress={processPackageChange}
                        disabled={isProcessing}
                    >
                        {isProcessing ? (
                            <Text style={styles.confirmButtonText}>Memproses...</Text>
                        ) : (
                            <Text style={styles.confirmButtonText}>Konfirmasi Perubahan</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
        );
    };

    const ChangeTab = () => {
        if (changeStep === 'select') {
            return renderSelectStep();
        } else if (changeStep === 'confirm') {
            return renderConfirmStep();
        }

        // Default view for any other case
        return (
            <ScrollView style={{ flex: 1, padding: 24 }}>
                <View style={styles.changeCard}>
                    <View style={[styles.iconCircle, { alignSelf: 'center', marginBottom: 24 }]}>
                        <Ionicons name="information" size={32} color="#3B82F6" />
                    </View>
                    <Text style={styles.warningText}>
                        Memproses perubahan paket...
                    </Text>
                </View>
            </ScrollView>
        );
    };

    const renderMainScene = SceneMap({
        detail: DetailTab,
        change: ChangeTab,
    });

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar style="light" />

            {/* Background Image Header */}
            <View style={styles.headerImageContainer}>
                {/* Placeholder for 'assets/images/Rectangle 2800.png' - using a gradient or color if image missing */}
                <View style={styles.headerBackground} />

                {/* Back Button & Cart */}
                <SafeAreaView style={styles.headerSafeArea} edges={['top']}>
                    <View style={styles.navBar}>
                        <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
                            <Ionicons name="arrow-back" size={24} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => router.push('/cart')} style={styles.iconButton}>
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

                    {/* Header Content */}
                    <View style={styles.headerContent}>
                        <Text style={styles.headerTitle}>{packet.title}</Text>
                        <Text style={styles.headerSpeed}>{packet.speed}</Text>
                        <TouchableOpacity
                            style={styles.subscribeButton}
                            onPress={async () => {
                                const currentPackage: Package = {
                                    id: packet.packageId || 'current',
                                    name: packet.title,
                                    speed: packet.speed,
                                    price: packet.price,
                                    description: packet.description.split('\n')[0],
                                    features: ['Koneksi Fiber Optic', 'Unlimited Quota', 'Support 24/7'],
                                    activePeriod: packet.activePeriod || 'bulan',
                                    isPromo: false,
                                    color: CartService.getSpeedColor(packet.speed)
                                };

                                // Add to cart first
                                await cartService.addToCart(currentPackage);
                                setCartItemCount(cartService.getItemCount());

                                // Navigate to cart
                                router.push('/cart');
                            }}
                        >
                            <Ionicons name="cart" size={16} color="white" />
                            {/* <Text style={styles.subscribeButtonText}>Berlangganan Sekarang</Text> */}
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </View>

            {/* Content Body */}
            <View style={styles.bodyContainer}>
                <TabView
                    navigationState={{ index: mainIndex, routes: mainRoutes }}
                    renderScene={renderMainScene}
                    onIndexChange={setMainIndex}
                    initialLayout={{ width: layout.width }}
                    renderTabBar={(props: any) => (
                        <TabBar
                            {...props}
                            indicatorStyle={{ backgroundColor: '#1F2937', height: 3, borderRadius: 1.5 }}
                            style={{ backgroundColor: 'transparent', elevation: 0, shadowOpacity: 0, marginTop: 12 }}
                            labelStyle={{ fontFamily: 'Poppins-SemiBold', fontSize: 16, textTransform: 'none' }}
                            activeColor="#1F2937"
                            inactiveColor="#9CA3AF"
                            tabStyle={{ flex: 1 }}
                        />
                    )}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0F3FF',
    },
    headerImageContainer: {
        height: 280,
        width: '100%',
        backgroundColor: '#3B82F6', // Fallback color
    },
    headerBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#2563EB', // A slightly darker blue for gradient effect simulation
    },
    headerSafeArea: {
        flex: 1,
    },
    navBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    iconButton: {
        padding: 8,
    },
    headerContent: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },
    headerTitle: {
        fontSize: 22,
        fontFamily: 'Poppins-SemiBold',
        color: 'white',
        marginBottom: 4,
    },
    headerSpeed: {
        fontSize: 32,
        fontFamily: 'Poppins-Bold',
        color: 'white',
        marginBottom: 12,
    },
    subscribeButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 12,
    },
    subscribeButtonText: {
        color: 'white',
        fontFamily: 'Poppins-Medium',
        fontSize: 14,
    },
    bodyContainer: {
        flex: 1,
        backgroundColor: '#F9FAFB',
        marginTop: -30, // Overlap effect
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        overflow: 'hidden',
    },
    bodyContent: {
        padding: 24,
        flex: 1,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
    },
    infoLabel: {
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
        color: '#6B7280',
    },
    infoValue: {
        fontSize: 16,
        fontFamily: 'Poppins-SemiBold',
        color: '#1F2937',
    },
    separator: {
        height: 1,
        backgroundColor: '#E5E7EB',
        marginVertical: 8,
    },
    additionalInfoTitle: {
        fontSize: 16,
        fontFamily: 'Poppins-SemiBold',
        color: '#4B5563',
    },
    tabContent: {
        padding: 16,
        backgroundColor: 'white',
    },
    tabText: {
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
        color: '#4B5563',
        lineHeight: 22,
    },

    // Package change styles
    sectionTitle: {
        fontSize: 20,
        fontFamily: 'Poppins-Bold',
        color: '#1F2937',
        marginBottom: 8,
    },
    sectionSubtitle: {
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
        color: '#6B7280',
        marginBottom: 16,
    },
    packageCard: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        shadowColor: 'black',
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
        borderWidth: 2,
        borderColor: 'transparent',
        position: 'relative',
    },
    selectedPackageCard: {
        borderColor: '#3B82F6',
        backgroundColor: '#EBF4FF',
    },
    packageHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    packageInfo: {
        flex: 1,
    },
    packageName: {
        fontSize: 16,
        fontFamily: 'Poppins-Bold',
        color: '#1F2937',
        marginBottom: 4,
    },
    packageSpeed: {
        fontSize: 14,
        fontFamily: 'Poppins-SemiBold',
        color: '#3B82F6',
    },
    packagePriceContainer: {
        alignItems: 'flex-end',
    },
    packagePrice: {
        fontSize: 16,
        fontFamily: 'Poppins-Bold',
        color: '#1F2937',
    },
    packagePriceLabel: {
        fontSize: 12,
        color: '#6B7280',
    },
    packageDescription: {
        fontSize: 13,
        color: '#6B7280',
        marginBottom: 12,
        lineHeight: 18,
    },
    featuresContainer: {
        gap: 6,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    featureText: {
        fontSize: 13,
        color: '#6B7280',
        marginLeft: 8,
    },
    selectedBadge: {
        position: 'absolute',
        top: -15,
        alignSelf: 'center',
        backgroundColor: '#3B82F6',
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 6,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        shadowColor: 'black',
        shadowOpacity: 0.2,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 4,
    },
    selectedText: {
        color: 'white',
        fontSize: 12,
        fontFamily: 'Poppins-SemiBold',
    },
    continueButton: {
        backgroundColor: '#3B82F6',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    continueButtonDisabled: {
        backgroundColor: '#9CA3AF',
    },
    continueButtonText: {
        color: 'white',
        fontSize: 16,
        fontFamily: 'Poppins-Bold',
    },

    // Confirmation styles
    confirmCard: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 24,
        shadowColor: 'black',
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    confirmIcon: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#EBF4FF',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginBottom: 24,
    },
    confirmTitle: {
        fontSize: 20,
        fontFamily: 'Poppins-Bold',
        color: '#1F2937',
        textAlign: 'center',
        marginBottom: 24,
    },
    currentPackageContainer: {
        marginBottom: 16,
    },
    newPackageContainer: {
        marginBottom: 16,
    },
    packageChangeLabel: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 8,
        fontFamily: 'Poppins-Medium',
    },
    currentPackageInfo: {
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        padding: 16,
    },
    currentPackageName: {
        fontSize: 16,
        fontFamily: 'Poppins-SemiBold',
        color: '#1F2937',
        marginBottom: 4,
    },
    currentPackageSpeed: {
        fontSize: 14,
        color: '#3B82F6',
        fontFamily: 'Poppins-Medium',
        marginBottom: 4,
    },
    currentPackagePrice: {
        fontSize: 14,
        color: '#6B7280',
    },
    arrowContainer: {
        alignItems: 'center',
        marginVertical: 8,
    },
    newPackageInfo: {
        backgroundColor: '#EBF4FF',
        borderRadius: 12,
        padding: 16,
        borderLeftWidth: 4,
        borderLeftColor: '#3B82F6',
    },
    newPackageName: {
        fontSize: 16,
        fontFamily: 'Poppins-Bold',
        color: '#1F2937',
        marginBottom: 4,
    },
    newPackageSpeed: {
        fontSize: 14,
        color: '#3B82F6',
        fontFamily: 'Poppins-Medium',
        marginBottom: 4,
    },
    newPackagePrice: {
        fontSize: 14,
        color: '#6B7280',
    },
    priceDifferenceContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        padding: 16,
    },
    priceDifferenceLabel: {
        fontSize: 16,
        fontFamily: 'Poppins-Medium',
        color: '#6B7280',
    },
    priceDifference: {
        fontSize: 16,
        fontFamily: 'Poppins-Bold',
    },
    priceIncrease: {
        color: '#EF4444',
    },
    priceDecrease: {
        color: '#10B981',
    },
    noteContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FEF3C7',
        borderRadius: 12,
        padding: 16,
    },
    noteText: {
        fontSize: 13,
        color: '#92400E',
        marginLeft: 12,
        flex: 1,
        lineHeight: 18,
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 12,
    },
    cancelButton: {
        flex: 1,
        backgroundColor: 'white',
        borderWidth: 2,
        borderColor: '#E5E7EB',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    cancelButtonText: {
        fontSize: 16,
        fontFamily: 'Poppins-Bold',
        color: '#6B7280',
    },
    confirmButton: {
        flex: 2,
        backgroundColor: '#3B82F6',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    confirmButtonText: {
        fontSize: 16,
        fontFamily: 'Poppins-Bold',
        color: 'white',
    },

    // Legacy styles
    changeCard: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 32,
    },
    warningText: {
        textAlign: 'center',
        fontSize: 16,
        fontFamily: 'Poppins-Medium',
        color: '#374151',
        lineHeight: 24,
    },
    iconCircle: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#EBF4FF',
        justifyContent: 'center',
        alignItems: 'center',
    },

    // Cart styles
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
    packageActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 16,
        gap: 8,
    },
    addToCartButton: {
        flex: 1,
        backgroundColor: '#10B981',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 8,
        gap: 8,
    },
    addToCartText: {
        color: 'white',
        fontSize: 14,
        fontFamily: 'Poppins-SemiBold',
    },
    selectButton: {
        flex: 1,
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#3B82F6',
        gap: 8,
    },
    selectButtonSelected: {
        backgroundColor: '#3B82F6',
        borderColor: '#3B82F6',
    },
    selectButtonText: {
        color: '#3B82F6',
        fontSize: 14,
        fontFamily: 'Poppins-SemiBold',
    },
    selectButtonTextSelected: {
        color: 'white',
    },
});