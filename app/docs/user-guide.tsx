import { Ionicons } from '@expo/vector-icons';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function UserGuideScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar style="dark" />

            <View style={styles.appBar}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#1E1E1E" />
                </TouchableOpacity>
                <Text style={styles.appBarTitle}>Panduan Pengguna</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {/* Getting Started */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>🚀 Memulai Penggunaan</Text>
                    <Text style={styles.cardText}>
                        Selamat datang di aplikasi Jelantik Internet! Panduan ini akan membantu Anda menggunakan semua fitur aplikasi dengan mudah.
                    </Text>
                </View>

                {/* Installation */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>📱 Instalasi Aplikasi</Text>
                    <View style={styles.stepContainer}>
                        <View style={styles.stepNumber}>
                            <Text style={styles.stepNumberText}>1</Text>
                        </View>
                        <View style={styles.stepContent}>
                            <Text style={styles.stepTitle}>Download Aplikasi</Text>
                            <Text style={styles.stepText}>
                                Download aplikasi Jelantik Internet dari Google Play Store (Android) atau App Store (iOS)
                            </Text>
                        </View>
                    </View>
                    <View style={styles.stepContainer}>
                        <View style={styles.stepNumber}>
                            <Text style={styles.stepNumberText}>2</Text>
                        </View>
                        <View style={styles.stepContent}>
                            <Text style={styles.stepTitle}>Install & Buka</Text>
                            <Text style={styles.stepText}>
                                Install aplikasi dan buka untuk memulai registrasi atau login
                            </Text>
                        </View>
                    </View>
                    <View style={styles.stepContainer}>
                        <View style={styles.stepNumber}>
                            <Text style={styles.stepNumberText}>3</Text>
                        </View>
                        <View style={styles.stepContent}>
                            <Text style={styles.stepTitle}>Izinkan Akses</Text>
                            <Text style={styles.stepText}>
                                Berikan izin yang diperlukan untuk fitur aplikasi
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Registration */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>📝 Pendaftaran Akun</Text>
                    <Text style={styles.cardText}>
                        Untuk pelanggan baru, ikuti langkah berikut:
                    </Text>
                    <View style={styles.stepContainer}>
                        <View style={styles.stepNumber}>
                            <Text style={styles.stepNumberText}>1</Text>
                        </View>
                        <View style={styles.stepContent}>
                            <Text style={styles.stepTitle}>Tap "Daftar"</Text>
                            <Text style={styles.stepText}>
                                Pilih menu "Daftar" di halaman awal
                            </Text>
                        </View>
                    </View>
                    <View style={styles.stepContainer}>
                        <View style={styles.stepNumber}>
                            <Text style={styles.stepNumberText}>2</Text>
                        </View>
                        <View style={styles.stepContent}>
                            <Text style={styles.stepTitle}>Isi Data Diri</Text>
                            <Text style={styles.stepText}>
                                Lengkapi form dengan data pribadi yang valid
                            </Text>
                        </View>
                    </View>
                    <View style={styles.stepContainer}>
                        <View style={styles.stepNumber}>
                            <Text style={styles.stepNumberText}>3</Text>
                        </View>
                        <View style={styles.stepContent}>
                            <Text style={styles.stepTitle}>Verifikasi Email</Text>
                            <Text style={styles.stepText}>
                                Cek email dan klik link verifikasi
                            </Text>
                        </View>
                    </View>
                    <View style={styles.stepContainer}>
                        <View style={styles.stepNumber}>
                            <Text style={styles.stepNumberText}>4</Text>
                        </View>
                        <View style={styles.stepContent}>
                            <Text style={styles.stepTitle}>Aktivasi Akun</Text>
                            <Text style={styles.stepText}>
                                Akun Anda siap digunakan!
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Main Features */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>⭐ Fitur Utama</Text>

                    <View style={styles.featureCard}>
                        <Text style={styles.featureTitle}>🏠 Dashboard</Text>
                        <Text style={styles.featureDesc}>
                            • Melihat status koneksi internet{'\n'}
                            • Cek kuota dan kecepatan{'\n'}
                            • Informasi tagihan{'\n'}
                            • Quick access menu
                        </Text>
                    </View>

                    <View style={styles.featureCard}>
                        <Text style={styles.featureTitle}>💳 Pembayaran</Text>
                        <Text style={styles.featureDesc}>
                            • Bayar tagihan online{'\n'}
                            • Riwayat pembayaran{'\n'}
                            • Download invoice{'\n'}
                            • Reminder pembayaran
                        </Text>
                    </View>

                    <View style={styles.featureCard}>
                        <Text style={styles.featureTitle}>📊 Usage Monitor</Text>
                        <Text style={styles.featureDesc}>
                            • Monitor pemakaian harian{'\n'}
                            • Grafik pemakaian{'\n'}
                            • Analisis konsumsi{'\n'}
                            • Alert kuota hampir habis
                        </Text>
                    </View>

                    <View style={styles.featureCard}>
                        <Text style={styles.featureTitle}>⚙️ Pengaturan</Text>
                        <Text style={styles.featureDesc}>
                            • Ubah profil{'\n'}
                            • Ganti password{'\n'}
                            • Notifikasi setting{'\n'}
                            • Preference lainnya
                        </Text>
                    </View>
                </View>

                {/* Troubleshooting */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>🔧 Tips & Troubleshooting</Text>

                    <View style={styles.tipContainer}>
                        <Text style={styles.tipTitle}>Lupa Password?</Text>
                        <Text style={styles.tipText}>
                            Gunakan fitur "Lupa Password" di halaman login. Ikuti instruksi untuk reset password via email.
                        </Text>
                    </View>

                    <View style={styles.tipContainer}>
                        <Text style={styles.tipTitle}>Aplikasi Error?</Text>
                        <Text style={styles.tipText}>
                            • Clear cache aplikasi{'\n'}
                            • Update ke versi terbaru{'\n'}
                            • Restart aplikasi{'\n'}
                            • Cek koneksi internet
                        </Text>
                    </View>

                    <View style={styles.tipContainer}>
                        <Text style={styles.tipTitle}>Data Tidak Muncul?</Text>
                        <Text style={styles.tipText}>
                            Pull to refresh untuk reload data. Pastikan koneksi internet stabil dan login dengan akun yang benar.
                        </Text>
                    </View>
                </View>

                {/* Support */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>🆘 Butuh Bantuan?</Text>
                    <Text style={styles.cardText}>
                        Jika mengalami kesulitan, jangan ragu untuk menghubungi kami:
                    </Text>
                    <View style={styles.contactInfo}>
                        <TouchableOpacity
                            style={styles.contactButton}
                            onPress={() => router.push('/support')}
                        >
                            <Ionicons name="chatbubble" size={20} color="#3B82F6" />
                            <Text style={styles.contactButtonText}>Live Chat Support</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.contactButton}
                            onPress={() => router.push('/support/report')}
                        >
                            <Ionicons name="alert-circle" size={20} color="#EF4444" />
                            <Text style={styles.contactButtonText}>Laporkan Masalah</Text>
                        </TouchableOpacity>
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
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 16,
        fontFamily: 'Poppins-SemiBold',
        color: '#1F2937',
        marginBottom: 16,
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
        fontSize: 14,
        color: '#6B7280',
        fontFamily: 'Poppins-Regular',
        lineHeight: 20,
    },
    featureCard: {
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
    },
    featureTitle: {
        fontSize: 16,
        fontFamily: 'Poppins-SemiBold',
        color: '#1F2937',
        marginBottom: 8,
    },
    featureDesc: {
        fontSize: 14,
        color: '#6B7280',
        fontFamily: 'Poppins-Regular',
        lineHeight: 20,
    },
    tipContainer: {
        backgroundColor: '#FEF3C7',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderLeftWidth: 4,
        borderLeftColor: '#F59E0B',
    },
    tipTitle: {
        fontSize: 15,
        fontFamily: 'Poppins-SemiBold',
        color: '#92400E',
        marginBottom: 8,
    },
    tipText: {
        fontSize: 14,
        color: '#78350F',
        fontFamily: 'Poppins-Regular',
        lineHeight: 20,
    },
    contactInfo: {
        marginTop: 16,
    },
    contactButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        padding: 16,
        marginBottom: 8,
    },
    contactButtonText: {
        fontSize: 15,
        fontFamily: 'Poppins-Medium',
        color: '#1F2937',
        marginLeft: 12,
    },
});