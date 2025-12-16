import { Ionicons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SupportScreen() {
    const openWhatsApp = () => {
        Linking.openURL('https://wa.me/6282223616884?text=Halo,+saya+butuh+bantuan+support+dari+Jelantik+Internet');
    };

    const openPhone = () => {
        Linking.openURL('tel:6282223616884');
    };

    const openEmail = () => {
        Linking.openURL('mailto:support@ajnusa.com?subject=Bantuan%20Support%20-%20Jelantik%20Internet');
    };

    const openLiveChat = () => {
        Alert.alert(
            "Live Chat",
            "Fitur live chat akan segera tersedia. Untuk sementara, silakan hubungi kami via WhatsApp.",
            [{ text: "OK", onPress: openWhatsApp }]
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar style="dark" />

            <View style={styles.appBar}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#1E1E1E" />
                </TouchableOpacity>
                <Text style={styles.appBarTitle}>Hubungi Support</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {/* Header */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>🎧 Pusat Bantuan</Text>
                    <Text style={styles.cardText}>
                        Tim support kami siap membantu Anda 24/7. Pilih metode kontak yang paling nyaman untuk Anda:
                    </Text>
                </View>

                {/* Quick Contact */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>📞 Kontak Langsung</Text>

                    <TouchableOpacity style={styles.contactButton} onPress={openWhatsApp}>
                        <View style={[styles.iconContainer, { backgroundColor: '#25D366' }]}>
                            <Ionicons name="logo-whatsapp" size={28} color="white" />
                        </View>
                        <View style={styles.contactInfo}>
                            <Text style={styles.contactTitle}>WhatsApp Support</Text>
                            <Text style={styles.contactDesc}>Respon cepat, tersedia 24/7</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.contactButton} onPress={openLiveChat}>
                        <View style={[styles.iconContainer, { backgroundColor: '#3B82F6' }]}>
                            <Ionicons name="chatbubble-ellipses" size={28} color="white" />
                        </View>
                        <View style={styles.contactInfo}>
                            <Text style={styles.contactTitle}>Live Chat</Text>
                            <Text style={styles.contactDesc}>Chat langsung dengan support</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                    </TouchableOpacity>

                    {/* <TouchableOpacity style={styles.contactButton} onPress={openPhone}>
                        <View style={[styles.iconContainer, { backgroundColor: '#10B981' }]}>
                            <Ionicons name="call" size={28} color="white" />
                        </View>
                        <View style={styles.contactInfo}>
                            <Text style={styles.contactTitle}>Telepon</Text>
                            <Text style={styles.contactDesc}>6282223616884</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                    </TouchableOpacity> */}

                    <TouchableOpacity style={styles.contactButton} onPress={openEmail}>
                        <View style={[styles.iconContainer, { backgroundColor: '#8B5CF6' }]}>
                            <Ionicons name="mail" size={28} color="white" />
                        </View>
                        <View style={styles.contactInfo}>
                            <Text style={styles.contactTitle}>Email</Text>
                            <Text style={styles.contactDesc}>support@ajnusa.com</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                    </TouchableOpacity>
                </View>

                {/* Office Hours */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>🕐 Jam Operasional</Text>
                    <View style={styles.scheduleContainer}>
                        <View style={styles.scheduleRow}>
                            <Text style={styles.scheduleDay}>Senin - Jumat</Text>
                            <Text style={styles.scheduleTime}>08:00 - 22:00 WIB</Text>
                        </View>
                        <View style={styles.scheduleRow}>
                            <Text style={styles.scheduleDay}>Sabtu</Text>
                            <Text style={styles.scheduleTime}>09:00 - 18:00 WIB</Text>
                        </View>
                        <View style={styles.scheduleRow}>
                            <Text style={styles.scheduleDay}>Minggu</Text>
                            <Text style={styles.scheduleTime}>09:00 - 17:00 WIB</Text>
                        </View>
                        <View style={styles.emergencyContainer}>
                            <Text style={styles.emergencyLabel}>🚨 Emergency Support</Text>
                            <Text style={styles.emergencyText}>
                                WhatsApp tersedia 24/7 untuk masalah urgent
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Response Time */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>⏱️ Estimasi Waktu Respon</Text>
                    <View style={styles.responseItem}>
                        <Text style={styles.responseChannel}>WhatsApp/Live Chat</Text>
                        <Text style={styles.responseTimeFast}>&lt; 5 menit</Text>
                    </View>
                    <View style={styles.responseItem}>
                        <Text style={styles.responseChannel}>Telepon</Text>
                        <Text style={styles.responseTimeFast}>Langsung</Text>
                    </View>
                    <View style={styles.responseItem}>
                        <Text style={styles.responseChannel}>Email</Text>
                        <Text style={styles.responseTimeNormal}>2-4 jam</Text>
                    </View>
                    <View style={styles.responseItem}>
                        <Text style={styles.responseChannel}>Media Sosial</Text>
                        <Text style={styles.responseTimeNormal}>4-8 jam</Text>
                    </View>
                </View>

                {/* Before Contacting */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>💡 Sebelum Menghubungi Kami</Text>
                    <Text style={styles.cardText}>
                        Untuk mempercepat proses bantuan, siapkan informasi berikut:
                    </Text>
                    <View style={styles.checklistContainer}>
                        <View style={styles.checklistItem}>
                            <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                            <Text style={styles.checklistText}>Nomor pelanggan/ID Internet</Text>
                        </View>
                        <View style={styles.checklistItem}>
                            <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                            <Text style={styles.checklistText}>Deskripsi masalah yang jelas</Text>
                        </View>
                        <View style={styles.checklistItem}>
                            <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                            <Text style={styles.checklistText}>Screenshoot error (jika ada)</Text>
                        </View>
                        <View style={styles.checklistItem}>
                            <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                            <Text style={styles.checklistText}>Langkah yang sudah dilakukan</Text>
                        </View>
                        <View style={styles.checklistItem}>
                            <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                            <Text style={styles.checklistText}>Lokasi dan waktu terjadi masalah</Text>
                        </View>
                    </View>
                </View>

                {/* Social Media */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>📱 Media Sosial</Text>
                    <View style={styles.socialContainer}>
                        <TouchableOpacity style={styles.socialButton}>
                            <View style={[styles.socialIcon, { backgroundColor: '#1877F2' }]}>
                                <Ionicons name="logo-facebook" size={24} color="white" />
                            </View>
                            <Text style={styles.socialText}>@JelantikInternet</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.socialButton}>
                            <View style={[styles.socialIcon, { backgroundColor: '#E4405F' }]}>
                                <Ionicons name="logo-instagram" size={24} color="white" />
                            </View>
                            <Text style={styles.socialText}>@jelantik.id</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.socialButton}>
                            <View style={[styles.socialIcon, { backgroundColor: '#1DA1F2' }]}>
                                <Ionicons name="logo-twitter" size={24} color="white" />
                            </View>
                            <Text style={styles.socialText}>@Jelantik_ID</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Tips */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>✨ Tips Dapat Bantuan Cepat</Text>
                    <Text style={styles.tipText}>
                        • Gunakan WhatsApp untuk respons tercepat{'\n'}
                        • Sertakan screenshot untuk masalah teknis{'\n'}
                        • Jelaskan masalah secara detail dan jelas{'\n'}
                        • Siapkan nomor pelanggan sebelum menghubungi{'\n'}
                        • Cek troubleshooting guide sebelum kontak support{'\n'}
                        • Follow up jika tidak ada respon dalam waktu yang ditentukan
                    </Text>
                </View>

                {/* Feedback */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>📝 Feedback Layanan</Text>
                    <Text style={styles.cardText}>
                        Kepuasan Anda adalah prioritas kami. Setelah selesai, kami akan mengirimkan survey kepuasan pelanggan. Feedback Anda membantu kami meningkatkan kualitas layanan.
                    </Text>
                    <TouchableOpacity
                        style={styles.feedbackButton}
                        onPress={() => router.push('/settings/feedback')}
                    >
                        <Text style={styles.feedbackButtonText}>Beri Feedback Sekarang</Text>
                    </TouchableOpacity>
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
        marginBottom: 16,
    },
    contactButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
    },
    iconContainer: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    contactInfo: {
        flex: 1,
    },
    contactTitle: {
        fontSize: 16,
        fontFamily: 'Poppins-SemiBold',
        color: '#1F2937',
        marginBottom: 4,
    },
    contactDesc: {
        fontSize: 13,
        color: '#6B7280',
        fontFamily: 'Poppins-Regular',
    },
    scheduleContainer: {
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        padding: 16,
    },
    scheduleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    scheduleDay: {
        fontSize: 15,
        fontFamily: 'Poppins-Medium',
        color: '#1F2937',
    },
    scheduleTime: {
        fontSize: 15,
        fontFamily: 'Poppins-Medium',
        color: '#3B82F6',
    },
    emergencyContainer: {
        backgroundColor: '#FEF3C7',
        borderRadius: 8,
        padding: 12,
        marginTop: 8,
    },
    emergencyLabel: {
        fontSize: 14,
        fontFamily: 'Poppins-SemiBold',
        color: '#92400E',
        marginBottom: 4,
    },
    emergencyText: {
        fontSize: 13,
        color: '#78350F',
        fontFamily: 'Poppins-Regular',
    },
    responseItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
    },
    responseChannel: {
        fontSize: 14,
        fontFamily: 'Poppins-Medium',
        color: '#1F2937',
    },
    responseTimeFast: {
        fontSize: 14,
        fontFamily: 'Poppins-Bold',
        color: '#10B981',
    },
    responseTimeNormal: {
        fontSize: 14,
        fontFamily: 'Poppins-Bold',
        color: '#3B82F6',
    },
    checklistContainer: {
        marginTop: 12,
    },
    checklistItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    checklistText: {
        fontSize: 14,
        color: '#6B7280',
        fontFamily: 'Poppins-Regular',
        marginLeft: 12,
        flex: 1,
    },
    socialContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    socialButton: {
        alignItems: 'center',
    },
    socialIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    socialText: {
        fontSize: 13,
        color: '#6B7280',
        fontFamily: 'Poppins-Regular',
    },
    tipText: {
        fontSize: 14,
        color: '#6B7280',
        fontFamily: 'Poppins-Regular',
        lineHeight: 22,
    },
    feedbackButton: {
        backgroundColor: '#3B82F6',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        marginTop: 16,
    },
    feedbackButtonText: {
        fontSize: 16,
        fontFamily: 'Poppins-SemiBold',
        color: 'white',
    },
});