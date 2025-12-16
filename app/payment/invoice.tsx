import { Ionicons } from '@expo/vector-icons';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function InvoiceScreen() {
    // Mock Data (matches Flutter template)
    const invoiceData = {
        status: 'Belum Bayar',
        invoiceNumber: 'INV/2024/11/001',
        period: 'November 2024',
        dueDate: '30 Nov 2024',
        packageName: 'Broadband UpTo',
        speed: '10 Mbps',
        amount: 'Rp 166.500',
        ppn: 'Rp 18.315',
        admin: 'Rp 5.000',
        total: 'Rp 189.815',
        isPaid: false
    };

    const isPaid = invoiceData.status === 'Sudah Bayar';
    const statusColor = isPaid ? '#10B981' : '#EF4444';

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar style="dark" />

            {/* Header */}
            <View style={styles.appBar}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#1E1E1E" />
                </TouchableOpacity>
                <Text style={styles.appBarTitle}>Detail Tagihan</Text>
                <TouchableOpacity style={styles.downloadButton} onPress={() => {}}>
                    <Ionicons name="download-outline" size={24} color="#1E1E1E" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {/* Invoice Status Card */}
                <View style={[styles.statusCard, { backgroundColor: statusColor }]}>
                    <Ionicons 
                        name={isPaid ? "checkmark-circle" : "time"} 
                        size={48} 
                        color="white" 
                        style={{ marginBottom: 12 }}
                    />
                    <Text style={styles.statusTitle}>{invoiceData.status}</Text>
                    
                    {!isPaid && (
                        <Text style={styles.statusSubtitle}>
                            Segera lakukan pembayaran sebelum jatuh tempo
                        </Text>
                    )}
                </View>

                <View style={{ height: 24 }} />

                {/* Invoice Info */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Informasi Tagihan</Text>
                    <View style={{ height: 16 }} />
                    <DetailRow label="No. Invoice" value={invoiceData.invoiceNumber} />
                    <DetailRow label="Periode" value={invoiceData.period} />
                    <DetailRow label="Jatuh Tempo" value={invoiceData.dueDate} />
                    <DetailRow label="Status Pembayaran" value={invoiceData.status} />
                </View>

                <View style={{ height: 24 }} />

                {/* Package Info */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Detail Paket</Text>
                    <View style={{ height: 16 }} />
                    <DetailRow label="Nama Paket" value={invoiceData.packageName} />
                    <DetailRow label="Kecepatan" value={invoiceData.speed} />
                    <DetailRow label="Harga" value={invoiceData.amount} />
                </View>

                <View style={{ height: 24 }} />

                {/* Payment Breakdown */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Rincian Pembayaran</Text>
                    <View style={{ height: 16 }} />
                    <DetailRow label="Harga Paket" value={invoiceData.amount} />
                    <DetailRow label="PPN (11%)" value={invoiceData.ppn} />
                    <DetailRow label="Administrasi" value={invoiceData.admin} />
                    <View style={styles.divider} />
                    <DetailRow 
                        label="Total Pembayaran" 
                        value={invoiceData.total} 
                        isBold 
                        valueColor="#3B82F6" 
                    />
                </View>

                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Pay Button Footer */}
            {!isPaid && (
                <View style={styles.footer}>
                    <TouchableOpacity 
                        style={styles.payButton}
                        onPress={() => router.push({
                            pathname: '/subscription/payment',
                            params: {
                                mode: 'invoice',
                                totalAmount: invoiceData.total
                            }
                        })}
                    >
                        <Ionicons name="card-outline" size={20} color="white" style={{ marginRight: 8 }} />
                        <Text style={styles.payButtonText}>Bayar Sekarang</Text>
                    </TouchableOpacity>
                </View>
            )}
        </SafeAreaView>
    );
}

function DetailRow({ label, value, isBold = false, valueColor = '#1F2937' }: any) {
    return (
        <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, isBold && styles.boldText]}>{label}</Text>
            <Text style={[
                styles.detailValue, 
                { color: valueColor },
                isBold && styles.boldText
            ]}>{value}</Text>
        </View>
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
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    backButton: {
        padding: 8,
    },
    downloadButton: {
        padding: 8,
    },
    appBarTitle: {
        fontSize: 20,
        fontFamily: 'Poppins-Bold',
        color: '#1F2937',
    },
    content: {
        padding: 16,
    },
    statusCard: {
        width: '100%',
        padding: 24,
        borderRadius: 16,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 6,
    },
    statusTitle: {
        fontSize: 20,
        fontFamily: 'Poppins-Bold',
        color: 'white',
        marginBottom: 8,
    },
    statusSubtitle: {
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
        color: 'white',
        textAlign: 'center',
        opacity: 0.9,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 20,
        shadowColor: 'black',
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    cardTitle: {
        fontSize: 18,
        fontFamily: 'Poppins-Bold',
        color: '#1F2937',
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    detailLabel: {
        fontSize: 14,
        color: '#6B7280',
        fontFamily: 'Poppins-Regular',
    },
    detailValue: {
        fontSize: 14,
        fontFamily: 'Poppins-SemiBold',
        color: '#1F2937',
    },
    boldText: {
        fontFamily: 'Poppins-Bold',
    },
    divider: {
        height: 1,
        backgroundColor: '#E5E7EB',
        marginVertical: 12,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        paddingBottom: 32, // for safe area
    },
    payButton: {
        backgroundColor: '#3B82F6',
        borderRadius: 16,
        paddingVertical: 16,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    payButtonText: {
        color: 'white',
        fontSize: 16,
        fontFamily: 'Poppins-Bold',
    },
});
