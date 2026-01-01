import { Ionicons } from '@expo/vector-icons';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CartService, { CartItem, CustomerData } from '../services/cartService';

export default function OrderSummaryScreen() {
  const params = useLocalSearchParams();
  const paymentMethod = params.paymentMethod as string;
  const isInvoiceMode = params.mode === 'invoice';
  const invoiceAmount = params.totalAmount ? parseInt(params.totalAmount.toString().replace(/[^0-9]/g, '')) : 0;

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [customerData, setCustomerData] = useState<CustomerData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!isInvoiceMode) {
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInvoiceMode]);

  const loadData = async () => {
    if (isInvoiceMode) return;
    
    try {
      await CartService.initialize();
      const items = CartService.getCartItems();
      const customer = CartService.getCustomerData();

      setCartItems(items);
      setCustomerData(customer);
    } catch {
      Alert.alert('Error', 'Gagal memuat data');
    }
  };

  const getTotalPrice = () => {
    if (isInvoiceMode) {
        return {
            subtotal: invoiceAmount,
            tax: 0, 
            admin: 0,
            total: invoiceAmount
        };
    }

    const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    const tax = Math.round(subtotal * 0.11);
    const admin = 5000;
    return {
      subtotal,
      tax,
      admin,
      total: subtotal + tax + admin
    };
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const generatePaymentDetails = () => {
    const orderId = `JLT-${Date.now()}`;
    // const timestamp = new Date().toLocaleString('id-ID'); // Unused

    switch (paymentMethod) {
      // Retail
      case 'alfamart':
        return {
          title: 'Pembayaran di Alfamart',
          code: `${orderId.substring(4)}${Math.floor(Math.random() * 10000)}`,
          instructions: [
            '1. Tunjukkan kode pembayaran ini ke kasir Alfamart',
            '2. Sebutkan "Pembayaran Jelantik Internet"',
            '3. Lakukan pembayaran sebelum waktu habis',
            '4. Simpan struk pembayaran sebagai bukti'
          ],
          expiresIn: '24 jam'
        };

      // Banks (Virtual Accounts)
      case 'bca':
        return {
          title: 'Virtual Account BCA',
          account: '3901' + orderId.substring(4),
          instructions: [
            '1. Buka m-BCA atau ATM BCA',
            '2. Pilih menu "m-Transfer" > "BCA Virtual Account"',
            '3. Masukkan nomor VA di atas',
            '4. Masukkan jumlah pembayaran',
            '5. Masukkan PIN dan selesaikan transaksi'
          ],
          expiresIn: '24 jam'
        };
      case 'mandiri':
        return {
          title: 'Virtual Account Mandiri',
          account: '88012' + orderId.substring(4),
          instructions: [
            '1. Buka Livin by Mandiri atau ATM Mandiri',
            '2. Pilih menu "Bayar" > "Buat Pembayaran Baru"',
            '3. Pilih "Multipayment" > "Jelantik Internet"',
            '4. Masukkan nomor VA di atas',
            '5. Konfirmasi dan bayar'
          ],
          expiresIn: '24 jam'
        };
      case 'bni':
        return {
          title: 'Virtual Account BNI',
          account: '8808' + orderId.substring(4),
          instructions: [
            '1. Buka BNI Mobile Banking atau ATM BNI',
            '2. Pilih menu "Transfer" > "Virtual Account Billing"',
            '3. Masukkan nomor VA di atas',
            '4. Konfirmasi tagihan dan bayar'
          ],
          expiresIn: '24 jam'
        };
      case 'bri':
        return {
          title: 'Virtual Account BRI',
          account: '8881' + orderId.substring(4),
          instructions: [
            '1. Buka BRImo atau ATM BRI',
            '2. Pilih menu "Pembayaran" > "BRIVA"',
            '3. Masukkan nomor BRIVA di atas',
            '4. Masukkan PIN dan selesaikan transaksi'
          ],
          expiresIn: '24 jam'
        };
      case 'cimb':
        return {
          title: 'Virtual Account CIMB Niaga',
          account: '4551' + orderId.substring(4),
          instructions: [
            '1. Buka OCTO Mobile atau ATM CIMB Niaga',
            '2. Pilih menu "Pembayaran" > "Virtual Account"',
            '3. Masukkan nomor VA di atas',
            '4. Konfirmasi dan bayar'
          ],
          expiresIn: '24 jam'
        };
      case 'bsi':
        return {
          title: 'Virtual Account BSI',
          account: '9001' + orderId.substring(4),
          instructions: [
            '1. Buka BSI Mobile atau ATM BSI',
            '2. Pilih menu "Bayar" > "Institusi"',
            '3. Masukkan kode institusi dan nomor VA',
            '4. Konfirmasi dan selesaikan pembayaran'
          ],
          expiresIn: '24 jam'
        };
      case 'permata':
        return {
          title: 'Virtual Account Permata',
          account: '7821' + orderId.substring(4),
          instructions: [
            '1. Buka PermataMobile X atau ATM Permata',
            '2. Pilih menu "Pembayaran Tagihan" > "Virtual Account"',
            '3. Masukkan nomor VA di atas',
            '4. Konfirmasi dan bayar'
          ],
          expiresIn: '24 jam'
        };
      case 'bjb':
        return {
          title: 'Virtual Account bank bjb',
          account: '2211' + orderId.substring(4),
          instructions: [
            '1. Buka bjb DIGI atau ATM bjb',
            '2. Pilih menu "Bayar" > "Virtual Account"',
            '3. Masukkan nomor VA di atas',
            '4. Selesaikan transaksi'
          ],
          expiresIn: '24 jam'
        };
      case 'other_bank':
        return {
          title: 'Transfer Bank Lain',
          account: '9999' + orderId.substring(4),
          instructions: [
            '1. Gunakan menu Transfer Antar Bank',
            '2. Pilih bank tujuan (Misal: Permata/BNI)',
            '3. Masukkan kode bank + nomor VA',
            '4. Selesaikan transfer'
          ],
          expiresIn: '24 jam'
        };

      // E-Wallet
      case 'dana':
        return {
          title: 'Pembayaran DANA',
          link: `https://link.dana.id/payment/${orderId}`,
          instructions: [
            '1. Klik tombol "Bayar Sekarang" untuk membuka DANA',
            '2. Atau salin link dan buka di aplikasi DANA',
            '3. Konfirmasi pembayaran',
            '4. Selesaikan pembayaran dengan PIN DANA'
          ],
          expiresIn: '24 jam'
        };
      case 'ovo':
        return {
          title: 'Pembayaran OVO',
          link: `https://ovo.id/payment/${orderId}`,
          instructions: [
            '1. Pastikan nomor HP Anda terdaftar di OVO',
            '2. Buka notifikasi pembayaran di aplikasi OVO',
            '3. Konfirmasi dan bayar',
            '4. Selesaikan dengan Security Code'
          ],
          expiresIn: '24 jam'
        };
      case 'astrapay':
        return {
          title: 'Pembayaran AstraPay',
          link: `https://astrapay.com/pay/${orderId}`,
          instructions: [
            '1. Buka aplikasi AstraPay',
            '2. Scan QR atau cek tagihan pending',
            '3. Konfirmasi dan bayar'
          ],
          expiresIn: '24 jam'
        };

      // QRIS
      case 'qris':
        return {
          title: 'Pembayaran QRIS',
          qrData: orderId,
          instructions: [
            '1. Buka aplikasi e-wallet (GoPay, OVO, DANA, dll) atau Mobile Banking',
            '2. Pindai/Scan QR code di atas',
            '3. Cek nominal dan nama merchant',
            '4. Masukkan PIN untuk membayar'
          ],
          expiresIn: '24 jam'
        };

      default:
        return {
          title: 'Detail Pembayaran',
          link: `https://checkout.xendit.co/payment/${orderId}`,
          instructions: [
            '1. Klik tombol "Bayar Sekarang"',
            '2. Ikuti instruksi pada halaman pembayaran',
            '3. Selesaikan transaksi sebelum waktu habis'
          ],
          expiresIn: '24 jam'
        };
    }
  };

  const handlePayment = async () => {
    setIsProcessing(true);

    try {
      // Simulate API call to create payment
      await new Promise(resolve => setTimeout(resolve, 2000));

      const paymentDetails = generatePaymentDetails();

      // Clear cart after successful payment creation
      await CartService.clearCart();
      await CartService.clearCustomerData();

      // Navigate to payment success screen
      router.push({
        pathname: '/subscription/payment-success',
        params: {
          paymentMethod,
          ...paymentDetails
        }
      });
    } catch {
      Alert.alert('Error', 'Gagal membuat pembayaran. Silakan coba lagi.');
    } finally {
      setIsProcessing(false);
    }
  };

  const paymentDetails = generatePaymentDetails();
  const prices = getTotalPrice();

  if (!customerData && !isInvoiceMode) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <StatusBar style="dark" />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Memuat...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1E1E1E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Konfirmasi Pembayaran</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Order Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <Ionicons name="receipt-outline" size={24} color="#3B82F6" />
            <Text style={styles.summaryTitle}>Ringkasan Pesanan</Text>
          </View>

          {/* Package Details */}
          {!isInvoiceMode && (
            <>
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Detail Paket</Text>
                {cartItems.map((item) => (
                  <View key={item.id} style={styles.packageRow}>
                    <View style={styles.packageInfo}>
                      <Text style={styles.packageName}>{item.name}</Text>
                      <Text style={styles.packageSpeed}>{item.speed}</Text>
                    </View>
                    <Text style={styles.packagePrice}>{formatPrice(item.price)}</Text>
                  </View>
                ))}
              </View>

              {/* Installation Details */}
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Jadwal Pemasangan</Text>
                <View style={styles.scheduleInfo}>
                  <Text style={styles.scheduleText}>
                    📅 {customerData?.installationDate || 'Menunggu jadwal'}
                  </Text>
                  <Text style={styles.scheduleText}>
                    ⏰ {customerData?.installationTime || 'Menunggu waktu'}
                  </Text>
                </View>
              </View>
            </>
          )}

          {/* Payment Breakdown */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Rincian Pembayaran</Text>
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>Subtotal</Text>
              <Text style={styles.breakdownValue}>{formatPrice(prices.subtotal)}</Text>
            </View>
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>PPN (11%)</Text>
              <Text style={styles.breakdownValue}>{formatPrice(prices.tax)}</Text>
            </View>
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>Biaya Admin</Text>
              <Text style={styles.breakdownValue}>{formatPrice(prices.admin)}</Text>
            </View>
            <View style={styles.totalBreakdown}>
              <Text style={styles.totalLabel}>Total Pembayaran</Text>
              <Text style={styles.totalValue}>{formatPrice(prices.total)}</Text>
            </View>
          </View>
        </View>

        {/* Payment Method Card */}
        <View style={styles.paymentCard}>
          <View style={styles.paymentHeader}>
            <Ionicons name="card-outline" size={24} color="#3B82F6" />
            <Text style={styles.paymentTitle}>Metode Pembayaran</Text>
          </View>

          <View style={styles.selectedMethod}>
            <Text style={styles.methodTitle}>{paymentDetails.title}</Text>
            {paymentDetails.code && (
              <View style={styles.codeContainer}>
                <Text style={styles.codeLabel}>Kode Pembayaran:</Text>
                <Text style={styles.code}>{paymentDetails.code}</Text>
                <TouchableOpacity style={styles.copyButton}>
                  <Text style={styles.copyText}>Salin</Text>
                </TouchableOpacity>
              </View>
            )}
            {paymentDetails.account && (
              <View style={styles.accountContainer}>
                <Text style={styles.accountLabel}>Nomor Virtual Account:</Text>
                <Text style={styles.account}>{paymentDetails.account}</Text>
              </View>
            )}
          </View>

          <View style={styles.instructions}>
            <Text style={styles.instructionsTitle}>Cara Pembayaran:</Text>
            {paymentDetails.instructions.map((instruction, index) => (
              <Text key={index} style={styles.instructionText}>{instruction}</Text>
            ))}
            <Text style={styles.expiryText}>⏰ Berlaku hingga: {paymentDetails.expiresIn}</Text>
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.payButton, isProcessing && styles.payButtonDisabled]}
          onPress={handlePayment}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <Text style={styles.payButtonText}>Memproses...</Text>
          ) : (
            <>
              <Text style={styles.payButtonText}>Bayar Sekarang</Text>
              <Text style={styles.payTotal}>{formatPrice(prices.total)}</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: '#1E1E1E',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#6B7280',
  },
  summaryCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  summaryTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#1F2937',
  },
  section: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  packageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  packageInfo: {
    flex: 1,
  },
  packageName: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#1F2937',
  },
  packageSpeed: {
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    color: '#6B7280',
  },
  packagePrice: {
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
    color: '#1F2937',
  },
  scheduleInfo: {
    gap: 4,
  },
  scheduleText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#374151',
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  breakdownLabel: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#6B7280',
  },
  breakdownValue: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#1F2937',
  },
  totalBreakdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  totalLabel: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: '#1F2937',
  },
  totalValue: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#3B82F6',
  },
  paymentCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  paymentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  paymentTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#1F2937',
  },
  selectedMethod: {
    backgroundColor: '#F0F3FF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  methodTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: '#3B82F6',
    marginBottom: 12,
  },
  codeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  codeLabel: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#6B7280',
  },
  code: {
    flex: 1,
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#1F2937',
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 8,
    textAlign: 'center',
  },
  copyButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  copyText: {
    color: 'white',
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
  },
  accountContainer: {
    marginTop: 12,
  },
  accountLabel: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#6B7280',
    marginBottom: 4,
  },
  account: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#1F2937',
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    textAlign: 'center',
  },
  instructions: {
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 16,
  },
  instructionsTitle: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#92400E',
    marginBottom: 8,
  },
  instructionText: {
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    color: '#92400E',
    lineHeight: 20,
    marginBottom: 4,
  },
  expiryText: {
    fontSize: 13,
    fontFamily: 'Poppins-Medium',
    color: '#DC2626',
    marginTop: 8,
  },
  helpCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    alignItems: 'center',
  },
  helpTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  whatsappButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#25D366',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
    width: '100%',
  },
  whatsappText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 8,
  },
  payButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  payButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },
  payButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
  },
  payTotal: {
    color: 'white',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    marginTop: 4,
  },
});