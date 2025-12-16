import { Ionicons } from '@expo/vector-icons';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TermsScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar style="dark" />

            <View style={styles.appBar}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#1E1E1E" />
                </TouchableOpacity>
                <Text style={styles.appBarTitle}>Syarat & Ketentuan</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {/* Header */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>📋 Syarat & Ketentuan Layanan</Text>
                    <Text style={styles.cardText}>
                        Terakhir diperbarui: 11 Desember 2025{'\n\n'}
                        Selamat datang di layanan internet PT Artacomindo Jejaring Nusa. Dengan menggunakan layanan kami, Anda menyetujui syarat dan ketentuan berikut:
                    </Text>
                </View>

                {/* General Terms */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>1. Ketentuan Umum</Text>
                    <Text style={styles.cardText}>
                        1.1. Layanan internet Jelantik tersedia untuk individu yang berdomisili di wilayah layanan kami.{'\n\n'}
                        1.2. Pelanggan harus berusia minimal 18 tahun atau memiliki persetujuan dari orang tua/wali.{'\n\n'}
                        1.3. Setiap pendaftaran harus menggunakan data yang valid dan dapat diverifikasi.{'\n\n'}
                        1.4. Pelanggan bertanggung jawab penuh atas keamanan akun dan penggunaan layanan.
                    </Text>
                </View>

                {/* Service Description */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>2. Deskripsi Layanan</Text>
                    <Text style={styles.cardText}>
                        2.1. Kami menyediakan layanan internet broadband dengan kecepatan sesuai paket yang dipilih.{'\n\n'}
                        2.2. Kecepatan internet adalah up to (maksimal) dan dapat dipengaruhi oleh faktor eksternal.{'\n\n'}
                        2.3. Layanan tersedia 24/7 kecuali ada maintenance yang telah diinformasikan sebelumnya.{'\n\n'}
                        2.4. Kami berhak melakukan perbaikan dan upgrade sistem untuk meningkatkan kualitas layanan.
                    </Text>
                </View>

                {/* Registration */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>3. Pendaftaran & Aktivasi</Text>
                    <Text style={styles.cardText}>
                        3.1. Pelanggan baru harus melengkapi formulir pendaftaran dengan data yang benar.{'\n\n'}
                        3.2. Proses verifikasi data dapat memakan waktu 1 hari kerja.{'\n\n'}
                        3.3. Biaya pemasangan dan deposit (jika ada) harus dibayar sebelum aktivasi.{'\n\n'}
                        3.4. Pelanggan akan menerima nomor pelanggan dan informasi akun setelah pendaftaran disetujui.
                    </Text>
                </View>

                {/* Billing */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>4. Pembayaran & Tagihan</Text>
                    <Text style={styles.cardText}>
                        4.1. Tagihan diterbitkan setiap bulan pada tanggal yang telah ditentukan.{'\n\n'}
                        4.2. Pembayaran harus dilakukan sebelum tanggal jatuh tempo.{'\n\n'}
                        4.3. Metode pembayaran tersedia: transfer bank, e-wallet, minimarket, dan auto-debit.{'\n\n'}
                        4.4. Invoice akan dikirim via email dan tersedia di aplikasi.
                    </Text>
                </View>

                {/* Service Termination */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>5. Berhenti Berlangganan</Text>
                    <Text style={styles.cardText}>
                        5.1. Pelanggan dapat berhenti berlangganan dengan memberikan pemberitahuan 30 hari sebelumnya.{'\n\n'}
                    </Text>
                </View>

                {/* Responsibility */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>6. Tanggung Jawab Pelanggan</Text>
                    <Text style={styles.cardText}>
                        6.1. Menggunakan layanan secara bertanggung jawab dan sesuai hukum yang berlaku.{'\n\n'}
                        6.2. Tidak menggunakan layanan untuk aktivitas ilegal (piracy, fraud, dll).{'\n\n'}
                        6.3. Menjaga kerahasiaan password dan tidak membagikan akses ke pihak ketiga.{'\n\n'}
                        6.4. Memastikan perangkat aman dari virus dan malware.{'\n\n'}
                        6.5. Tidak melakukan activities yang mengganggu jaringan.
                    </Text>
                </View>

                {/* Limitation */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>7. Pembatasan & Pengecualian</Text>
                    <Text style={styles.cardText}>
                        7.1. Kami tidak bertanggung jawab atas kerugian akibat force majeure (bencana alam, dll).{'\n\n'}
                        7.2. Layanan dapat ditangguhkan sementara untuk maintenance.{'\n\n'}
                    </Text>
                </View>

                {/* Privacy */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>8. Privasi & Data Pribadi</Text>
                    <Text style={styles.cardText}>
                        8.1. Data pribadi pelanggan akan dilindungi sesuai Kebijakan Privasi kami.{'\n\n'}
                        8.2. Kami tidak akan menjual atau membagikan data ke pihak ketiga tanpa izin.{'\n\n'}
                        8.3. Data digunakan untuk meningkatkan kualitas layanan.{'\n\n'}
                        8.4. Pelanggan dapat mengakses dan memperbarui data pribadi kapan saja.
                    </Text>
                </View>

                {/* Dispute */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>9. Penyelesaian Sengketa</Text>
                    <Text style={styles.cardText}>
                        9.1. Setiap sengketa akan diselesaikan secara musyawarah terlebih dahulu.{'\n\n'}
                        9.2. Jika tidak mencapai kesepakatan, sengketa dapat dibawa ke pengadilan.{'\n\n'}
                        9.3. Hukum yang berlaku adalah hukum Republik Indonesia.{'\n\n'}
                        9.4. Lokasi penyelesaian sengketa adalah di kantor pusat Jelantik Internet.
                    </Text>
                </View>

                {/* Changes */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>10. Perubahan Ketentuan</Text>
                    <Text style={styles.cardText}>
                        10.1. Kami berhak mengubah syarat dan ketentuan sewaktu-waktu.{'\n\n'}
                        10.2. Perubahan signifikan akan diinformasikan 30 hari sebelum berlaku.{'\n\n'}
                        10.3. Pelanggan dapat menolak perubahan dan berhenti berlangganan.{'\n\n'}
                        10.4. Penggunaan layanan setelah perubahan berarti setuju dengan ketentuan baru.
                    </Text>
                </View>

                {/* Contact */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>📞 Informasi & Kontak</Text>
                    <Text style={styles.cardText}>
                        Untuk pertanyaan atau klarifikasi tentang syarat dan ketentuan:
                    </Text>
                    <View style={styles.contactInfo}>
                        <Text style={styles.contactItem}>• Email: legal@ajnusa.com</Text>
                        <Text style={styles.contactItem}>• WhatsApp: 6282223616884</Text>
                    </View>
                    <View style={styles.noteContainer}>
                        <Text style={styles.noteTitle}>PENTING:</Text>
                        <Text style={styles.noteText}>
                            Dengan menggunakan layanan Jelantik Internet, Anda menyatakan telah membaca, memahami, dan menyetujui semua syarat dan ketentuan yang berlaku.
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
        lineHeight: 22,
    },
    sectionTitle: {
        fontSize: 16,
        fontFamily: 'Poppins-SemiBold',
        color: '#1F2937',
        marginBottom: 12,
    },
    contactInfo: {
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        padding: 16,
        marginTop: 16,
    },
    contactItem: {
        fontSize: 14,
        color: '#1F2937',
        fontFamily: 'Poppins-Regular',
        marginBottom: 6,
    },
    noteContainer: {
        backgroundColor: '#FEE2E2',
        borderRadius: 12,
        padding: 16,
        marginTop: 16,
        borderLeftWidth: 4,
        borderLeftColor: '#EF4444',
    },
    noteTitle: {
        fontSize: 14,
        fontFamily: 'Poppins-Bold',
        color: '#991B1B',
        marginBottom: 8,
    },
    noteText: {
        fontSize: 14,
        color: '#7F1D1D',
        fontFamily: 'Poppins-Regular',
        lineHeight: 20,
    },
});