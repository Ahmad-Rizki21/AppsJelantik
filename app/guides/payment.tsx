import { Ionicons } from '@expo/vector-icons';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PaymentHelpScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar style="dark" />

            <View style={styles.appBar}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#1E1E1E" />
                </TouchableOpacity>
                <Text style={styles.appBarTitle}>Cara Pembayaran</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {/* Overview */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Metode Pembayaran</Text>
                    <Text style={styles.cardText}>
                        Kami menyediakan berbagai metode pembayaran untuk memudahkan Anda dalam membayar tagihan internet rumah.
                    </Text>
                </View>

                {/* Payment Methods */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>💳 Transfer Bank</Text>
                    <Text style={styles.cardText}>
                        Anda dapat melakukan pembayaran melalui transfer ke rekening bank kami:
                    </Text>
                    <View style={styles.paymentMethod}>
                        <Text style={styles.methodTitle}>BCA</Text>
                        {/* <Text style={styles.methodDetail}>No. Rek: 123-456-7890</Text>
                        <Text style={styles.methodDetail}>a.n. PT Jelantik Internet</Text> */}
                    </View>
                    <View style={styles.paymentMethod}>
                        <Text style={styles.methodTitle}>Mandiri</Text>
                        {/* <Text style={styles.methodDetail}>No. Rek: 987-654-3210</Text>
                        <Text style={styles.methodDetail}>a.n. PT Jelantik Internet</Text> */}
                    </View>
                </View>

                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>📱 E-Wallet</Text>
                    <View style={styles.paymentMethod}>
                        <Text style={styles.methodTitle}>GoPay</Text>
                        <Text style={styles.methodDetail}>Scan QR Code di aplikasi GoJek</Text>
                    </View>
                    <View style={styles.paymentMethod}>
                        <Text style={styles.methodTitle}>OVO</Text>
                        <Text style={styles.methodDetail}>Scan QR Code di aplikasi OVO</Text>
                    </View>
                    <View style={styles.paymentMethod}>
                        <Text style={styles.methodTitle}>DANA</Text>
                        <Text style={styles.methodDetail}>Scan QR Code di aplikasi DANA</Text>
                    </View>
                </View>

                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>🏪 Minimarket</Text>
                    <View style={styles.paymentMethod}>
                        <Text style={styles.methodTitle}>Alfamart</Text>
                        <Text style={styles.methodDetail}>Sebutkan nomor pelanggan Anda ke kasir</Text>
                    </View>
                    {/* <View style={styles.paymentMethod}>
                        <Text style={styles.methodTitle}>Indomaret</Text>
                        <Text style={styles.methodDetail}>Sebutkan nomor pelanggan Anda ke kasir</Text>
                    </View> */}
                </View>

                {/* Steps */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>📋 Langkah Pembayaran</Text>
                    <View style={styles.stepContainer}>
                        <View style={styles.stepNumber}>
                            <Text style={styles.stepNumberText}>1</Text>
                        </View>
                        <View style={styles.stepContent}>
                            <Text style={styles.stepTitle}>Periksa Tagihan</Text>
                            <Text style={styles.stepText}>Cek jumlah tagihan melalui aplikasi atau WhatsApp/Email</Text>
                        </View>
                    </View>
                    <View style={styles.stepContainer}>
                        <View style={styles.stepNumber}>
                            <Text style={styles.stepNumberText}>2</Text>
                        </View>
                        <View style={styles.stepContent}>
                            <Text style={styles.stepTitle}>Pilih Metode</Text>
                            <Text style={styles.stepText}>Pilih metode pembayaran yang paling nyaman</Text>
                        </View>
                    </View>
                    <View style={styles.stepContainer}>
                        <View style={styles.stepNumber}>
                            <Text style={styles.stepNumberText}>3</Text>
                        </View>
                        <View style={styles.stepContent}>
                            <Text style={styles.stepTitle}>Lakukan Pembayaran</Text>
                            <Text style={styles.stepText}>Selesaikan pembayaran sesuai metode yang dipilih</Text>
                        </View>
                    </View>
                    <View style={styles.stepContainer}>
                        <View style={styles.stepNumber}>
                            <Text style={styles.stepNumberText}>4</Text>
                        </View>
                        <View style={styles.stepContent}>
                            <Text style={styles.stepTitle}>Simpan Bukti</Text>
                            <Text style={styles.stepText}>Simpan bukti pembayaran sebagai arsip</Text>
                        </View>
                    </View>
                </View>

                {/* Tips */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>💡 Tips Pembayaran</Text>
                    <Text style={styles.cardText}>
                        • Lakukan pembayaran sebelum tanggal jatuh tempo untuk menghindari denda{'\n'}
                        • Pembayaran akan diproses maksimal 1x24 jam{'\n'}
                        • Simpan selalu bukti pembayaran Anda{'\n'}
                        • Hubungi customer service jika ada kendala pembayaran
                    </Text>
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
    paymentMethod: {
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        padding: 12,
        marginBottom: 8,
    },
    methodTitle: {
        fontSize: 15,
        fontFamily: 'Poppins-SemiBold',
        color: '#3B82F6',
        marginBottom: 4,
    },
    methodDetail: {
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
});