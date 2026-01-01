import { Ionicons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import * as Sharing from 'expo-sharing';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PaymentSuccessScreen() {
  const params = useLocalSearchParams();
  const {
    paymentMethod,
    title,
    code,
    account,
    link,
    total
  } = params as any;

  useEffect(() => {
    // Animation for success icon
    const animation = Animated.sequence([
      Animated.timing(new Animated.Value(0), {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    ]);
    animation.start();
  }, []);

  const sharePaymentDetails = async () => {
    try {
      const message = `📋 Detail Pembayaran Jelantik\n━━━━━━━━━━━━━━━━━━━━\nMetode: ${title}\n${code ? `Kode: ${code}\n` : ''}${account ? `VA: ${account}\n` : ''}Total: ${total}\n━━━━━━━━━━━━━━━━━━━━\nSilakan lakukan pembayaran untuk mengaktifkan layanan internet Anda.`;

      await Sharing.shareAsync(message, {
        dialogTitle: 'Detail Pembayaran Jelantik',
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleWhatsAppHelp = () => {
    const message = encodeURIComponent(
      `Halo Jelantik, saya baru saja membuat pesanan dengan detail:\n` +
      `Metode: ${title}\n` +
      `${code ? `Kode: ${code}\n` : ''}` +
      `${account ? `VA: ${account}\n` : ''}` +
      `Total: ${total}\n` +
      `Mohon bantu saya untuk proses selanjutnya.`
    );
    Linking.openURL(`https://wa.me/6281234567890?text=${message}`);
  };

  const getPaymentIcon = () => {
    switch (paymentMethod) {
      case 'alfamart':
        return <Ionicons name="business-outline" size={60} color="#ED1C24" />;
      case 'bni_va':
      case 'bri_va':
      case 'bca_va':
      case 'mandiri_va':
        return <Ionicons name="card" size={60} color="#3B82F6" />;
      case 'dana':
        return <Ionicons name="card" size={60} color="#118EEA" />;
      case 'ovo':
        return <Ionicons name="card" size={60} color="#6A1B9A" />;
      case 'gopay':
        return <Ionicons name="card" size={60} color="#00A651" />;
      case 'qris':
        return <Ionicons name="grid" size={60} color="#2E3192" />;
      default:
        return <Ionicons name="checkmark-circle-outline" size={60} color="#10B981" />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar style="dark" />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Success Animation */}
        <View style={styles.successContainer}>
          <View style={styles.successCircle}>
            <Animated.View style={styles.checkmarkContainer}>
              {getPaymentIcon()}
            </Animated.View>
          </View>
          <Text style={styles.successTitle}>Pembayaran Berhasil Dibuat!</Text>
          <Text style={styles.successSubtitle}>
            Pesanan Anda telah dibuat. Silakan lakukan pembayaran untuk mengaktifkan layanan.
          </Text>
        </View>

        {/* Payment Details Card */}
        <View style={styles.detailsCard}>
          <Text style={styles.detailsTitle}>Detail Pembayaran</Text>

          <View style={styles.detailsRow}>
            <Text style={styles.detailsLabel}>Metode Pembayaran</Text>
            <Text style={styles.detailsValue}>{title}</Text>
          </View>

          {code && (
            <View style={styles.codeContainer}>
              <Text style={styles.codeLabel}>Kode Pembayaran</Text>
              <View style={styles.codeBox}>
                <Text style={styles.codeText}>{code}</Text>
                <TouchableOpacity
                  style={styles.copyButton}
                  onPress={() => {
                    // Copy to clipboard logic would go here
                  }}
                >
                  <Ionicons name="copy-outline" size={20} color="#3B82F6" />
                </TouchableOpacity>
              </View>
            </View>
          )}

          {account && (
            <View style={styles.codeContainer}>
              <Text style={styles.codeLabel}>Nomor Virtual Account</Text>
              <View style={styles.codeBox}>
                <Text style={styles.codeText}>{account}</Text>
                <TouchableOpacity
                  style={styles.copyButton}
                  onPress={() => {
                    // Copy to clipboard logic would go here
                  }}
                >
                  <Ionicons name="copy-outline" size={20} color="#3B82F6" />
                </TouchableOpacity>
              </View>
            </View>
          )}

          <View style={styles.detailsRow}>
            <Text style={styles.detailsLabel}>Total Pembayaran</Text>
            <Text style={styles.detailsValueTotal}>{total}</Text>
          </View>
        </View>

        {/* Instructions */}
        <View style={styles.instructionsCard}>
          <Text style={styles.instructionsTitle}>Instruksi Pembayaran</Text>

          {paymentMethod === 'alfamart' && (
            <>
              <Text style={styles.instructionText}>
                1. Tunjukkan kode pembayaran ini ke kasir Alfamart
              </Text>
              <Text style={styles.instructionText}>
                2. Sebutkan &quot;Pembayaran Jelantik Internet&quot;
              </Text>
              <Text style={styles.instructionText}>
                3. Lakukan pembayaran sebelum waktu habis (24 jam)
              </Text>
              <Text style={styles.instructionText}>
                4. Simpan struk pembayaran sebagai bukti
              </Text>
            </>
          )}

          {(paymentMethod?.includes('_va')) && (
            <>
              <Text style={styles.instructionText}>
                1. Buka aplikasi mobile banking atau ATM
              </Text>
              <Text style={styles.instructionText}>
                2. Pilih menu Transfer → Virtual Account
              </Text>
              <Text style={styles.instructionText}>
                3. Masukkan nomor VA di atas
              </Text>
              <Text style={styles.instructionText}>
                4. Masukkan jumlah pembayaran: {total}
              </Text>
              <Text style={styles.instructionText}>
                5. Konfirmasi dan selesaikan pembayaran
              </Text>
            </>
          )}

          {(paymentMethod === 'dana' || paymentMethod === 'ovo' || paymentMethod === 'gopay') && (
            <>
              <Text style={styles.instructionText}>
                1. Buka aplikasi e-wallet Anda
              </Text>
              <Text style={styles.instructionText}>
                2. Pilih menu &quot;Bayar&quot; atau &quot;Transfer&quot;
              </Text>
              <Text style={styles.instructionText}>
                3. Masukkan jumlah: {total}
              </Text>
              <Text style={styles.instructionText}>
                4. Selesaikan pembayaran dengan PIN/OTP
              </Text>
            </>
          )}

          {paymentMethod === 'qris' && (
            <>
              <Text style={styles.instructionText}>
                1. Buka aplikasi e-wallet atau mobile banking
              </Text>
              <Text style={styles.instructionText}>
                2. Pilih menu &quot;QRIS Payment&quot;
              </Text>
              <Text style={styles.instructionText}>
                3. Scan QR code yang tersedia
              </Text>
              <Text style={styles.instructionText}>
                4. Konfirmasi dan selesaikan pembayaran
              </Text>
            </>
          )}

          <View style={styles.warningBox}>
            <Ionicons name="information-circle" size={20} color="#F59E0B" />
            <Text style={styles.warningText}>
              Pembayaran harus dilakukan dalam 24 jam. Pesanan akan dibatalkan otomatis jika pembayaran terlambat.
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.shareButton]}
            onPress={sharePaymentDetails}
          >
            <Ionicons name="share-social-outline" size={20} color="#6B7280" />
            <Text style={styles.shareButtonText}>Bagikan</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.whatsappButton]}
            onPress={handleWhatsAppHelp}
          >
            <Ionicons name="logo-whatsapp" size={20} color="#25D366" />
            <Text style={styles.whatsappButtonText}>Hubungi Support</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Navigation */}
        <View style={styles.bottomNavigation}>
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => router.push('/')}
          >
            <Ionicons name="home-outline" size={24} color="#6B7280" />
            <Text style={styles.navButtonText}>Beranda</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navButton}
            onPress={() => router.push('/(tabs)/history')}
          >
            <Ionicons name="receipt-outline" size={24} color="#6B7280" />
            <Text style={styles.navButtonText}>Riwayat</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navButton}
            onPress={() => router.push('/support')}
          >
            <Ionicons name="headset-outline" size={24} color="#6B7280" />
            <Text style={styles.navButtonText}>Bantuan</Text>
          </TouchableOpacity>
        </View>

        {/* Add extra padding at the bottom */}
        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  successContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  successCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkmarkContainer: {
    transform: [{ scale: 1 }],
  },
  successTitle: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  successSubtitle: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#6B7280',
    textAlign: 'center',
    paddingHorizontal: 32,
    lineHeight: 20,
  },
  detailsCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  detailsTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailsLabel: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#6B7280',
  },
  detailsValue: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#1F2937',
  },
  detailsValueTotal: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: '#3B82F6',
  },
  codeContainer: {
    marginBottom: 16,
  },
  codeLabel: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#6B7280',
    marginBottom: 8,
  },
  codeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 12,
  },
  codeText: {
    flex: 1,
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#1F2937',
    textAlign: 'center',
  },
  copyButton: {
    padding: 8,
  },
  instructionsCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  instructionsTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  instructionText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#374151',
    lineHeight: 24,
    marginBottom: 8,
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
  },
  warningText: {
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    color: '#92400E',
    marginLeft: 8,
    flex: 1,
    lineHeight: 18,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  shareButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  shareButtonText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#6B7280',
  },
  whatsappButton: {
    backgroundColor: '#25D366',
  },
  whatsappButtonText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: 'white',
  },
  bottomNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  navButton: {
    alignItems: 'center',
  },
  navButtonText: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    color: '#6B7280',
    marginTop: 4,
  },
});