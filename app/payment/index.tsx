import { Ionicons } from '@expo/vector-icons';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PaymentScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar style="dark" />

            <View style={styles.appBar}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#1E1E1E" />
                </TouchableOpacity>
                <Text style={styles.appBarTitle}>Pembayaran</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {/* Quick Actions */}
                <View style={styles.sectionCard}>
                    <Text style={styles.sectionTitle}>Aksi Cepat</Text>
                    <View style={styles.quickActionRow}>
                        <TouchableOpacity style={[styles.quickActionButton, { backgroundColor: 'rgba(59, 130, 246, 0.1)', borderColor: 'rgba(59, 130, 246, 0.3)' }]} onPress={() => {}}>
                            <View style={[styles.quickActionIcon, { backgroundColor: '#3B82F6' }]}>
                                <Ionicons name="receipt" size={24} color="white" />
                            </View>
                            <Text style={[styles.quickActionText, { color: '#3B82F6' }]}>Bayar Tagihan</Text>
                        </TouchableOpacity>

                        <View style={{ width: 12 }} />

                        <TouchableOpacity style={[styles.quickActionButton, { backgroundColor: 'rgba(16, 185, 129, 0.1)', borderColor: 'rgba(16, 185, 129, 0.3)' }]} onPress={() => router.push('/promo')}>
                            <View style={[styles.quickActionIcon, { backgroundColor: '#10B981' }]}>
                                <Ionicons name="cart" size={24} color="white" />
                            </View>
                            <Text style={[styles.quickActionText, { color: '#10B981' }]}>Langganan Paket</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{ height: 24 }} />

                {/* Payment History */}
                <View style={styles.sectionCard}>
                    <View style={styles.rowBetween}>
                        <Text style={styles.sectionTitle}>Riwayat Pembayaran</Text>
                        <TouchableOpacity>
                            <Text style={styles.linkText}>Lihat Semua</Text>
                        </TouchableOpacity>
                    </View>
                    
                    <View style={{ height: 16 }} />

                    <PaymentHistoryItem 
                        period="November 2024" 
                        amount="Rp 166.500" 
                        date="20 Nov 2024" 
                        status="Sukses" 
                        color="#10B981" 
                    />
                    <View style={{ height: 12 }} />
                    <PaymentHistoryItem 
                        period="Oktober 2024" 
                        amount="Rp 166.500" 
                        date="25 Okt 2024" 
                        status="Sukses" 
                        color="#10B981" 
                    />
                    <View style={{ height: 12 }} />
                    <PaymentHistoryItem 
                        period="September 2024" 
                        amount="Rp 166.500" 
                        date="22 Sep 2024" 
                        status="Sukses" 
                        color="#10B981" 
                    />
                </View>

                <View style={{ height: 24 }} />

                {/* Payment Methods */}
                <View style={styles.sectionCard}>
                    <Text style={styles.sectionTitle}>Metode Pembayaran Tersedia</Text>
                    <View style={{ height: 16 }} />
                    <View style={styles.methodGrid}>
                        {['BCA', 'BNI', 'BRI', 'Mandiri', 'DANA', 'OVO', 'GoPay', 'Alfamart', 'QRIS'].map((method, index) => (
                            <View key={index} style={styles.methodItem}>
                                <Text style={{ fontSize: 20, marginBottom: 4 }}>
                                    {['DANA', 'OVO', 'GoPay'].includes(method) ? '💰' : 
                                     ['Alfamart'].includes(method) ? '🏪' : 
                                     ['QRIS'].includes(method) ? '📱' : '💳'}
                                </Text>
                                <Text style={styles.methodName}>{method}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                <View style={{ height: 40 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

function PaymentHistoryItem({ period, amount, date, status, color }: any) {
    return (
        <View style={styles.historyItem}>
            <View style={{ flex: 3 }}>
                <Text style={styles.historyPeriod}>{period}</Text>
                <Text style={styles.historyDate}>{date}</Text>
            </View>
            <View style={{ flex: 2, alignItems: 'flex-end' }}>
                <Text style={styles.historyAmount}>{amount}</Text>
                <View style={[styles.statusBadge, { backgroundColor: `${color}1A` }]}>
                    <Text style={[styles.statusText, { color: color }]}>{status}</Text>
                </View>
            </View>
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
    sectionCard: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 20,
        shadowColor: 'black',
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 18,
        fontFamily: 'Poppins-Bold',
        color: '#1F2937',
    },
    quickActionRow: {
        flexDirection: 'row',
        marginTop: 16,
    },
    quickActionButton: {
        flex: 1,
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        borderWidth: 1,
    },
    quickActionIcon: {
        width: 48,
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    quickActionText: {
        fontSize: 14,
        fontFamily: 'Poppins-SemiBold',
    },
    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    linkText: {
        color: '#3B82F6',
        fontFamily: 'Poppins-Medium',
        fontSize: 14,
    },
    historyItem: {
        flexDirection: 'row',
        padding: 16,
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    historyPeriod: {
        fontSize: 14,
        fontFamily: 'Poppins-SemiBold',
        color: '#1F2937',
        marginBottom: 4,
    },
    historyDate: {
        fontSize: 12,
        fontFamily: 'Poppins-Regular',
        color: '#6B7280',
    },
    historyAmount: {
        fontSize: 14,
        fontFamily: 'Poppins-Bold',
        color: '#1F2937',
        marginBottom: 4,
    },
    statusBadge: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    statusText: {
        fontSize: 10,
        fontFamily: 'Poppins-Medium',
    },
    methodGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    methodItem: {
        width: '31%',
        aspectRatio: 1.5,
        backgroundColor: '#F9FAFB',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        justifyContent: 'center',
        alignItems: 'center',
    },
    methodName: {
        fontSize: 10,
        fontFamily: 'Poppins-Medium',
        color: '#6B7280',
    },
});
