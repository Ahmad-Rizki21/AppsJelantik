import { Ionicons } from '@expo/vector-icons';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TroubleshootingHelpScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar style="dark" />

            <View style={styles.appBar}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#1E1E1E" />
                </TouchableOpacity>
                <Text style={styles.appBarTitle}>Troubleshooting Koneksi</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {/* Common Issues */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Masalah Umum Koneksi</Text>
                    <Text style={styles.cardText}>
                        Berikut adalah solusi untuk masalah koneksi internet yang sering terjadi:
                    </Text>
                </View>

                {/* No Internet */}
                <View style={styles.card}>
                    <View style={styles.problemHeader}>
                        <Text style={styles.problemIcon}>❌</Text>
                        <Text style={styles.problemTitle}>Tidak Ada Koneksi Internet</Text>
                    </View>
                    <Text style={styles.sectionTitle}>Solusi:</Text>
                    <View style={styles.solutionList}>
                        <Text style={styles.solutionItem}>• Periksa kabel Ethernet/UTP terhubung dengan baik</Text>
                        <Text style={styles.solutionItem}>• Restart modem/router (matikan 30 detik, nyalakan kembali)</Text>
                        <Text style={styles.solutionItem}>• Periksa lampu indikator pada modem (Power, Internet, WLAN)</Text>
                        <Text style={styles.solutionItem}>• Coba koneksikan ke perangkat lain</Text>
                        <Text style={styles.solutionItem}>• Reset network settings di perangkat</Text>
                    </View>
                </View>

                {/* Slow Connection */}
                <View style={styles.card}>
                    <View style={styles.problemHeader}>
                        <Text style={styles.problemIcon}>🐌</Text>
                        <Text style={styles.problemTitle}>Koneksi Lambat</Text>
                    </View>
                    <Text style={styles.sectionTitle}>Solusi:</Text>
                    <View style={styles.solutionList}>
                        <Text style={styles.solutionItem}>• Restart modem/router</Text>
                        <Text style={styles.solutionItem}>• Kurangi jumlah perangkat yang terhubung</Text>
                        <Text style={styles.solutionItem}>• Pindah lebih dekat ke router</Text>
                        <Text style={styles.solutionItem}>• Tutup aplikasi yang memakan bandwidth</Text>
                        <Text style={styles.solutionItem}>• Cek apakah ada update otomatis berjalan</Text>
                        <Text style={styles.solutionItem}>• Clear cache browser</Text>
                    </View>
                </View>

                {/* WiFi Issues */}
                <View style={styles.card}>
                    <View style={styles.problemHeader}>
                        <Text style={styles.problemIcon}>📶</Text>
                        <Text style={styles.problemTitle}>WiFi Tidak Bisa Terhubung</Text>
                    </View>
                    <Text style={styles.sectionTitle}>Solusi:</Text>
                    <View style={styles.solutionList}>
                        <Text style={styles.solutionItem}>• Pastikan password WiFi benar</Text>
                        <Text style={styles.solutionItem}>• Forget network dan reconnect kembali</Text>
                        <Text style={styles.solutionItem}>• Restart perangkat yang ingin konek</Text>
                        <Text style={styles.solutionItem}>• Reset router ke settingan factory (jika perlu)</Text>
                        <Text style={styles.solutionItem}>• Cek apakah MAC filter aktif</Text>
                    </View>
                </View>

                {/* Intermittent Connection */}
                <View style={styles.card}>
                    <View style={styles.problemHeader}>
                        <Text style={styles.problemIcon}>🔄</Text>
                        <Text style={styles.problemTitle}>Koneksi Putus-Nyambung</Text>
                    </View>
                    <Text style={styles.sectionTitle}>Solusi:</Text>
                    <View style={styles.solutionList}>
                        <Text style={styles.solutionItem}>• Periksa kabel yang mungkin longgar</Text>
                        <Text style={styles.solutionItem}>• Cek overheating pada modem/router</Text>
                        <Text style={styles.solutionItem}>• Update firmware router</Text>
                        <Text style={styles.solutionItem}>• Hindari interference (microwave, cordless phone)</Text>
                        <Text style={styles.solutionItem}>• Ganti channel WiFi (2.4GHz: 1, 6, atau 11)</Text>
                    </View>
                </View>

                {/* Speed Test Guide */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>📊 Cara Test Kecepatan</Text>
                    <Text style={styles.cardText}>Langkah-langkah melakukan speed test:</Text>
                    <View style={styles.stepContainer}>
                        <View style={styles.stepNumber}>
                            <Text style={styles.stepNumberText}>1</Text>
                        </View>
                        <View style={styles.stepContent}>
                            <Text style={styles.stepTitle}>Koneksi WiFi</Text>
                            <Text style={styles.stepText}>Pastikan terhubung langsung ke router</Text>
                        </View>
                    </View>
                    <View style={styles.stepContainer}>
                        <View style={styles.stepNumber}>
                            <Text style={styles.stepNumberText}>2</Text>
                        </View>
                        <View style={styles.stepContent}>
                            <Text style={styles.stepTitle}>Tutup Aplikasi</Text>
                            <Text style={styles.stepText}>Tutup semua aplikasi yang memakan bandwidth</Text>
                        </View>
                    </View>
                    <View style={styles.stepContainer}>
                        <View style={styles.stepNumber}>
                            <Text style={styles.stepNumberText}>3</Text>
                        </View>
                        <View style={styles.stepContent}>
                            <Text style={styles.stepTitle}>Buka Speed Test</Text>
                            <Text style={styles.stepText}>Gunakan speedtest.net atau fast.com</Text>
                        </View>
                    </View>
                    <View style={styles.stepContainer}>
                        <View style={styles.stepNumber}>
                            <Text style={styles.stepNumberText}>4</Text>
                        </View>
                        <View style={styles.stepContent}>
                            <Text style={styles.stepTitle}>Lakukan Test</Text>
                            <Text style={styles.stepText}>Klik start dan tunggu hasilnya</Text>
                        </View>
                    </View>
                </View>

                {/* Contact Support */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>🆘 Butuh Bantuan?</Text>
                    <Text style={styles.cardText}>
                        Jika masalah masih belum teratasi setelah mencoba solusi di atas, jangan ragu untuk menghubungi tim support kami:
                    </Text>
                    <View style={styles.contactInfo}>
                        <Text style={styles.contactItem}>📞 WhatsApp: 6282223616884</Text>
                        <Text style={styles.contactItem}>✉️ Email: support@ajnusa.com</Text>
                        <Text style={styles.contactItem}>💬 Live Chat: 24/7 di aplikasi</Text>
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
        marginTop: 16,
        marginBottom: 8,
    },
    problemHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    problemIcon: {
        fontSize: 24,
        marginRight: 12,
    },
    problemTitle: {
        fontSize: 16,
        fontFamily: 'Poppins-SemiBold',
        color: '#1F2937',
        flex: 1,
    },
    solutionList: {
        marginLeft: 8,
    },
    solutionItem: {
        fontSize: 14,
        color: '#6B7280',
        fontFamily: 'Poppins-Regular',
        marginBottom: 6,
        lineHeight: 20,
    },
    stepContainer: {
        flexDirection: 'row',
        marginBottom: 12,
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
    contactInfo: {
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        padding: 16,
        marginTop: 12,
    },
    contactItem: {
        fontSize: 14,
        color: '#1F2937',
        fontFamily: 'Poppins-Medium',
        marginBottom: 8,
    },
});