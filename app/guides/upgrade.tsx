import { Ionicons } from '@expo/vector-icons';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function UpgradeHelpScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar style="dark" />

            <View style={styles.appBar}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#1E1E1E" />
                </TouchableOpacity>
                <Text style={styles.appBarTitle}>Upgrade Paket</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {/* Overview */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Upgrade Paket Internet</Text>
                    <Text style={styles.cardText}>
                        Ingin internet lebih cepat? Kami menyediakan opsi upgrade paket yang mudah dan cepat. Berikut panduan lengkapnya:
                    </Text>
                </View>

                {/* Available Packages */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>📦 Paket Tersedia</Text>

                    <View style={styles.packageCard}>
                        <View style={styles.packageHeader}>
                            <Text style={styles.packageName}>Basic Light</Text>
                            <Text style={styles.packageSpeed}>10 Mbps</Text>
                        </View>
                        <Text style={styles.packagePrice}>Rp 166.500/bulan</Text>
                        <Text style={styles.packageDesc}>Cocok untuk browsing dan sosial media</Text>
                    </View>

                    <View style={styles.packageCard}>
                        <View style={styles.packageHeader}>
                            <Text style={styles.packageName}>Family Speed</Text>
                            <Text style={styles.packageSpeed}>20 Mbps</Text>
                        </View>
                        <Text style={styles.packagePrice}>Rp 231.990/bulan</Text>
                        <Text style={styles.packageDesc}>Ideal untuk streaming dan video conference</Text>
                    </View>

                    <View style={styles.packageCard}>
                        <View style={styles.packageHeader}>
                            <Text style={styles.packageName}>Pro Boost</Text>
                            <Text style={styles.packageSpeed}>30 Mbps</Text>
                        </View>
                        <Text style={styles.packagePrice}>Rp 276.390/bulan</Text>
                        <Text style={styles.packageDesc}>Perfect untuk gaming dan multiple devices</Text>
                    </View>

                    <View style={styles.packageCard}>
                        <View style={styles.packageHeader}>
                            <Text style={styles.packageName}>Ultra Fast</Text>
                            <Text style={styles.packageSpeed}>50 Mbps</Text>
                        </View>
                        <Text style={styles.packagePrice}>Rp 321.789/bulan</Text>
                        <Text style={styles.packageDesc}>Ultimate speed untuk heavy users</Text>
                    </View>
                </View>

                {/* Upgrade Steps */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>📋 Cara Upgrade Paket</Text>
                    <View style={styles.stepContainer}>
                        <View style={styles.stepNumber}>
                            <Text style={styles.stepNumberText}>1</Text>
                        </View>
                        <View style={styles.stepContent}>
                            <Text style={styles.stepTitle}>Login ke Akun</Text>
                            <Text style={styles.stepText}>Buka aplikasi dan login dengan akun Anda</Text>
                        </View>
                    </View>
                    <View style={styles.stepContainer}>
                        <View style={styles.stepNumber}>
                            <Text style={styles.stepNumberText}>2</Text>
                        </View>
                        <View style={styles.stepContent}>
                            <Text style={styles.stepTitle}>Menu Paket</Text>
                            <Text style={styles.stepText}>Pilih menu &quot;Paket Internet&quot; di dashboard</Text>
                        </View>
                    </View>
                    <View style={styles.stepContainer}>
                        <View style={styles.stepNumber}>
                            <Text style={styles.stepNumberText}>3</Text>
                        </View>
                        <View style={styles.stepContent}>
                            <Text style={styles.stepTitle}>Pilih Paket</Text>
                            <Text style={styles.stepText}>Pilih paket yang diinginkan</Text>
                        </View>
                    </View>
                    <View style={styles.stepContainer}>
                        <View style={styles.stepNumber}>
                            <Text style={styles.stepNumberText}>4</Text>
                        </View>
                        <View style={styles.stepContent}>
                            <Text style={styles.stepTitle}>Konfirmasi</Text>
                            <Text style={styles.stepText}>Review detail dan konfirmasi upgrade</Text>
                        </View>
                    </View>
                    <View style={styles.stepContainer}>
                        <View style={styles.stepNumber}>
                            <Text style={styles.stepNumberText}>5</Text>
                        </View>
                        <View style={styles.stepContent}>
                            <Text style={styles.stepTitle}>Selesai</Text>
                            <Text style={styles.stepText}>Paket akan aktif dalam 1x24 jam</Text>
                        </View>
                    </View>
                </View>

                {/* Alternative Methods */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>📞 Cara Lain Upgrade</Text>
                    <View style={styles.methodContainer}>
                        <Text style={styles.methodTitle}>Via WhatsApp</Text>
                        <Text style={styles.methodDesc}>
                            Kirim pesan ke 6282223616884 dengan format:{'\n'}
                            &quot;UPGRADE#[Nomor Pelanggan]#[Paket Yang Diinginkan]&quot;
                        </Text>
                    </View>
                    {/* <View style={styles.methodContainer}>
                        <Text style={styles.methodTitle}>Via Telepon</Text>
                        <Text style={styles.methodDesc}>
                            Hubungi call center di 1500-123 dan ikuti instruksi
                        </Text>
                    </View> */}
                    <View style={styles.methodContainer}>
                        <Text style={styles.methodTitle}>Via Kantor Cabang</Text>
                        <Text style={styles.methodDesc}>
                            Datang langsung ke kantor cabang terdekat
                        </Text>
                    </View>
                </View>

                {/* Important Info */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>ℹ️ Informasi Penting</Text>
                    <Text style={styles.cardText}>
                        • Upgrade berlaku mulai periode tagihan berikutnya{'\n'}
                        • Biaya upgrade akan ditambahkan ke tagihan bulanan{'\n'}
                        • Tidak ada biaya pemasangan tambahan{'\n'}
                        • Bisa downgrade kapan saja{'\n'}
                        • Kecepatan tergantung lokasi dan kondisi jaringan
                    </Text>
                </View>

                {/* FAQ */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>❓ FAQ</Text>

                    <View style={styles.faqItem}>
                        <Text style={styles.faqQuestion}>Berapa lama proses upgrade?</Text>
                        <Text style={styles.faqAnswer}>
                            Proses upgrade memakan waktu maksimal 1x24 jam
                        </Text>
                    </View>

                    <View style={styles.faqItem}>
                        <Text style={styles.faqQuestion}>Apakah perlu ganti perangkat?</Text>
                        <Text style={styles.faqAnswer}>
                            Tidak, perangkat modem tetap sama
                        </Text>
                    </View>

                    <View style={styles.faqItem}>
                        <Text style={styles.faqQuestion}>Bisa downgrade lagi?</Text>
                        <Text style={styles.faqAnswer}>
                            Ya, bisa downgrade kapan saja tanpa penalty
                        </Text>
                    </View>

                    <View style={styles.faqItem}>
                        <Text style={styles.faqQuestion}>Apakah ada biaya tambahan?</Text>
                        <Text style={styles.faqAnswer}>
                            Tidak ada biaya tambahan, hanya selisih harga paket
                        </Text>
                    </View>
                </View>

                <View style={{ height: 40 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0F3FF',
    },
    appBar: {
        flexDirection: 'row',
        alignItems: 'center',
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
        marginLeft: 16,
    },
    content: {
        padding: 16,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        shadowColor: 'black',
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    cardTitle: {
        fontSize: 18,
        fontFamily: 'Poppins-Bold',
        color: '#1F2937',
        marginBottom: 12,
    },
    cardText: {
        fontSize: 14,
        color: '#6B7280',
        fontFamily: 'Poppins-Regular',
        lineHeight: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontFamily: 'Poppins-SemiBold',
        color: '#1F2937',
        marginTop: 16,
        marginBottom: 12,
    },
    packageCard: {
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
    },
    packageHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    packageName: {
        fontSize: 16,
        fontFamily: 'Poppins-SemiBold',
        color: '#1F2937',
    },
    packageSpeed: {
        fontSize: 16,
        fontFamily: 'Poppins-Bold',
        color: '#3B82F6',
    },
    packagePrice: {
        fontSize: 14,
        color: '#10B981',
        fontFamily: 'Poppins-Medium',
        marginBottom: 4,
    },
    packageDesc: {
        fontSize: 13,
        color: '#6B7280',
        fontFamily: 'Poppins-Regular',
    },
    stepContainer: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    stepNumber: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#3B82F6',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    stepNumberText: {
        color: 'white',
        fontSize: 14,
        fontFamily: 'Poppins-Bold',
    },
    stepContent: {
        flex: 1,
    },
    stepTitle: {
        fontSize: 15,
        fontFamily: 'Poppins-SemiBold',
        color: '#1F2937',
        marginBottom: 4,
    },
    stepText: {
        fontSize: 13,
        color: '#6B7280',
        fontFamily: 'Poppins-Regular',
    },
    methodContainer: {
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
    },
    methodTitle: {
        fontSize: 15,
        fontFamily: 'Poppins-SemiBold',
        color: '#1F2937',
        marginBottom: 8,
    },
    methodDesc: {
        fontSize: 14,
        color: '#6B7280',
        fontFamily: 'Poppins-Regular',
        lineHeight: 20,
    },
    faqItem: {
        marginBottom: 16,
    },
    faqQuestion: {
        fontSize: 15,
        fontFamily: 'Poppins-SemiBold',
        color: '#1F2937',
        marginBottom: 4,
    },
    faqAnswer: {
        fontSize: 14,
        color: '#6B7280',
        fontFamily: 'Poppins-Regular',
    },
});