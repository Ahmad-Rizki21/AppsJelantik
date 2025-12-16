import { Ionicons } from '@expo/vector-icons';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PrivacyScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar style="dark" />

            <View style={styles.appBar}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#1E1E1E" />
                </TouchableOpacity>
                <Text style={styles.appBarTitle}>Kebijakan Privasi</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {/* Header */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>🔒 Kebijakan Privasi</Text>
                    <Text style={styles.cardText}>
                        Terakhir diperbarui: 11 Desember 2025{'\n\n'}
                        PT Artacomindo Jejaring Nusa ("Kami") berkomitmen untuk melindungi privasi dan data pribadi pelanggan. Kebijakan ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi Anda.
                    </Text>
                </View>

                {/* Data Collection */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>1. Data yang Kami Kumpulkan</Text>
                    <Text style={styles.subsectionTitle}>📝 Informasi Pribadi</Text>
                    <Text style={styles.cardText}>
                        • Nama lengkap dan identitas resmi{'\n'}
                        • Alamat email dan nomor telepon{'\n'}
                        • Alamat tempat tinggal{'\n'}
                        • Nomor KTP/Identitas{'\n'}
                        • Informasi pembayaran
                    </Text>

                    <Text style={styles.subsectionTitle}>📊 Data Penggunaan Layanan</Text>
                    <Text style={styles.cardText}>
                        • IP address dan device ID{'\n'}
                        • Riwayat browsing (jika applicable){'\n'}
                        • Pemakaian bandwidth{'\n'}
                        • Log koneksi dan aktivitas{'\n'}
                        • Lokasi geografis (umum)
                    </Text>

                    <Text style={styles.subsectionTitle}>📱 Data Teknis</Text>
                    <Text style={styles.cardText}>
                        • Tipe perangkat dan OS{'\n'}
                        • Browser version{'\n'}
                        • Informasi jaringan{'\n'}
                        • Crash logs{'\n'}
                        • Performance data
                    </Text>
                </View>

                {/* Data Usage */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>2. Penggunaan Data</Text>
                    <View style={styles.usageItem}>
                        <Text style={styles.usageTitle}>✅ Tujuan yang Diperbolehkan:</Text>
                        <Text style={styles.usageText}>
                            • Menyediakan dan mengelola layanan internet{'\n'}
                            • Memproses pembayaran dan penagihan{'\n'}
                            • Verifikasi identitas dan keamanan{'\n'}
                            • Memberikan support teknis{'\n'}
                            • Mengirim informasi penting tentang layanan{'\n'}
                            • Meningkatkan kualitas layanan{'\n'}
                            • Menganalisis trend dan preferensi pengguna{'\n'}
                            • Melindungi dari aktivitas fraud
                        </Text>
                    </View>

                    <View style={styles.usageItem}>
                        <Text style={styles.usageTitle}>❌ Yang TAK Kami Lakukan:</Text>
                        <Text style={styles.usageText}>
                            • Menjual data ke pihak ketiga{'\n'}
                            • Mengirim spam tanpa persetujuan{'\n'}
                            • Melacak aktivitas pribadi yang sensitif{'\n'}
                            • Menggunakan data untuk kepentingan politik{'\n'}
                            • Berbagi data dengan agency iklan
                        </Text>
                    </View>
                </View>

                {/* Data Sharing */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>3. Berbagi Data</Text>
                    <Text style={styles.cardText}>
                        Kami hanya akan berbagi data dalam kondisi berikut:
                    </Text>
                    <View style={styles.shareItem}>
                        <Text style={styles.shareTitle}>🤝 Pihak Ketiga Tepercaya:</Text>
                        <Text style={styles.shareText}>
                            • Payment processors untuk transaksi{'\n'}
                            • Credit bureaus untuk verifikasi{'\n'}
                            • Tech vendors untuk infrastructure{'\n'}
                            • Government agencies sesuai hukum
                        </Text>
                    </View>
                    <Text style={styles.noteText}>
                        Semua pihak ketiga telah ditandatangani perjanjian kerahasiaan.
                    </Text>
                </View>

                {/* Data Storage */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>4. Penyimpanan & Keamanan Data</Text>
                    <Text style={styles.cardText}>
                        4.1. Data disimpan dalam server terenkripsi dengan keamanan tingkat enterprise.{'\n\n'}
                        4.2. Akses data dibatasi untuk staff yang berwenang saja.{'\n\n'}
                        4.3. Backup data rutin dilakukan untuk mencegah kehilangan data.{'\n\n'}
                        4.4. Monitoring security 24/7 untuk deteksi ancaman.{'\n\n'}
                        4.5. Data pelanggan akan dihapus setelah 5 tahun setelah berhenti berlangganan.
                    </Text>
                </View>

                {/* Cookies */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>5. Cookies & Tracking</Text>
                    <Text style={styles.cardText}>
                        Website dan aplikasi kami menggunakan cookies untuk:{'\n\n'}
                        • Mengingat preferensi login{'\n'}
                        • Menganalisis penggunaan layanan{'\n'}
                        • Personalisasi konten{'\n'}
                        • Keperluan keamanan{'\n\n'}
                        Anda dapat menonaktifkan cookies melalui browser settings.
                    </Text>
                </View>

                {/* User Rights */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>6. Hak Anda Sebagai Pengguna</Text>
                    <View style={styles.rightsItem}>
                        <Text style={styles.rightsIcon}>👁️</Text>
                        <View style={styles.rightsContent}>
                            <Text style={styles.rightsTitle}>Akses Data</Text>
                            <Text style={styles.rightsText}>
                                Anda dapat meminta copy data pribadi yang kami simpan
                            </Text>
                        </View>
                    </View>
                    <View style={styles.rightsItem}>
                        <Text style={styles.rightsIcon}>✏️</Text>
                        <View style={styles.rightsContent}>
                            <Text style={styles.rightsTitle}>Koreksi Data</Text>
                            <Text style={styles.rightsText}>
                                Anda dapat memperbarui data yang tidak akurat
                            </Text>
                        </View>
                    </View>
                    <View style={styles.rightsItem}>
                        <Text style={styles.rightsIcon}>🗑️</Text>
                        <View style={styles.rightsContent}>
                            <Text style={styles.rightsTitle}>Hapus Data</Text>
                            <Text style={styles.rightsText}>
                                Anda dapat meminta penghapusan data (dengan syarat)
                            </Text>
                        </View>
                    </View>
                    <View style={styles.rightsItem}>
                        <Text style={styles.rightsIcon}>⚙️</Text>
                        <View style={styles.rightsContent}>
                            <Text style={styles.rightsTitle}>Pengaturan Privasi</Text>
                            <Text style={styles.rightsText}>
                                Kontrol bagaimana data Anda digunakan
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Data Breach */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>7. Kebocoran Data</Text>
                    <Text style={styles.cardText}>
                        7.1. Kami akan memberitahu Anda dalam 72 jam jika terjadi kebocoran data.{'\n\n'}
                        7.2. Notifikasi akan dikirim via email dan WhatsApp.{'\n\n'}
                        7.3. Kami akan mengambil langkah-langkah untuk meminimalkan dampak.{'\n\n'}
                        7.4. Bantuan perlindungan identitas akan disediakan jika diperlukan.
                    </Text>
                </View>

                {/* Children Privacy */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>8. Privasi Anak-Anak</Text>
                    <Text style={styles.cardText}>
                        8.1. Layanan kami tidak ditujukan untuk anak di bawah 13 tahun.{'\n\n'}
                        8.2. Kami tidak sengaja mengumpulkan data pribadi anak-anak.{'\n\n'}
                        8.3. Jika mengetahui kami mengumpulkan data anak, akan segera dihapus.{'\n\n'}
                        8.4. Orang tua dapat menghubungi kami untuk verifikasi atau penghapusan data anak.
                    </Text>
                </View>

                {/* Contact */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>📞 Kontak Privasi</Text>
                    <Text style={styles.cardText}>
                        Untuk pertanyaan atau permintaan terkait privasi data:
                    </Text>
                    <View style={styles.contactInfo}>
                        <Text style={styles.contactItem}>📧 Email Privacy: support@ajnusa.com</Text>
                        <Text style={styles.contactItem}>📱 WhatsApp: 6282223616884</Text>
                        <Text style={styles.contactItem}>🏢 Alamat: Privacy Team, PT Artacommindo Jejaring Nusa</Text>
                    </View>
                </View>

                {/* Last Updated */}
                <View style={styles.card}>
                    <View style={styles.updateContainer}>
                        <Text style={styles.updateText}>
                            Kebijakan Privasi ini terakhir diperbarui pada 11 Desember 2025.{'\n\n'}
                            Kami dapat memperbarui kebijakan ini sewaktu-waktu. Perubahan akan diinformasikan melalui email atau notifikasi aplikasi.
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
        marginBottom: 12,
    },
    subsectionTitle: {
        fontSize: 15,
        fontFamily: 'Poppins-Medium',
        color: '#3B82F6',
        marginTop: 16,
        marginBottom: 8,
    },
    usageItem: {
        marginBottom: 16,
    },
    usageTitle: {
        fontSize: 15,
        fontFamily: 'Poppins-SemiBold',
        color: '#1F2937',
        marginBottom: 8,
    },
    usageText: {
        fontSize: 14,
        color: '#6B7280',
        fontFamily: 'Poppins-Regular',
        lineHeight: 20,
        marginLeft: 8,
    },
    shareItem: {
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
    },
    shareTitle: {
        fontSize: 15,
        fontFamily: 'Poppins-SemiBold',
        color: '#1F2937',
        marginBottom: 8,
    },
    shareText: {
        fontSize: 14,
        color: '#6B7280',
        fontFamily: 'Poppins-Regular',
        lineHeight: 20,
    },
    noteText: {
        fontSize: 13,
        color: '#6B7280',
        fontFamily: 'Poppins-Italic',
        marginTop: 8,
        fontStyle: 'italic',
    },
    rightsItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        padding: 16,
    },
    rightsIcon: {
        fontSize: 24,
        marginRight: 16,
    },
    rightsContent: {
        flex: 1,
    },
    rightsTitle: {
        fontSize: 15,
        fontFamily: 'Poppins-SemiBold',
        color: '#1F2937',
        marginBottom: 4,
    },
    rightsText: {
        fontSize: 14,
        color: '#6B7280',
        fontFamily: 'Poppins-Regular',
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
        marginBottom: 8,
    },
    updateContainer: {
        backgroundColor: '#EBF5FF',
        borderRadius: 12,
        padding: 16,
        borderLeftWidth: 4,
        borderLeftColor: '#3B82F6',
    },
    updateText: {
        fontSize: 14,
        color: '#1E3A8A',
        fontFamily: 'Poppins-Regular',
        lineHeight: 20,
    },
});