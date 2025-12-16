import { Ionicons } from '@expo/vector-icons';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CartService, { CustomerData } from '../services/cartService';

export default function CustomerRegistrationScreen() {
  const [formData, setFormData] = useState<CustomerData>({
    nik: '',
    name: '',
    email: '',
    phone: '',
    address: '',
    installationDate: '',
    installationTime: ''
  });
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<CustomerData>>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Initialize CartService
      await CartService.initialize();

      // Load cart items
      const items = CartService.getCartItems();
      setCartItems(items);

      // Load saved customer data
      const savedData = CartService.getCustomerData();
      if (savedData) {
        setFormData(savedData);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<CustomerData> = {};

    // NIK validation
    if (!formData.nik) {
      newErrors.nik = 'NIK wajib diisi';
    } else if (formData.nik.length !== 16) {
      newErrors.nik = 'NIK harus 16 digit';
    } else if (!/^[0-9]+$/.test(formData.nik)) {
      newErrors.nik = 'NIK hanya boleh mengandung angka';
    }

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Nama lengkap wajib diisi';
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email wajib diisi';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }

    // Phone validation
    if (!formData.phone) {
      newErrors.phone = 'Nomor telepon wajib diisi';
    } else if (formData.phone.length < 10) {
      newErrors.phone = 'Nomor telepon minimal 10 digit';
    }

    // Address validation
    if (!formData.address.trim()) {
      newErrors.address = 'Alamat lengkap wajib diisi';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Save customer data to CartService
      await CartService.saveCustomerData(formData);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      Alert.alert(
        'Data Tersimpan',
        'Data pelanggan berhasil disimpan. Silakan lanjut ke pembayaran.',
        [
          {
            text: 'OK',
            onPress: () => {
              router.push('/subscription/payment');
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Terjadi kesalahan. Silakan coba lagi.');
      console.error('Submit error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const showEncryptionInfo = () => {
    Alert.alert(
      'Keamanan Data',
      'NIK yang Anda daftarkan dilindungi dengan:\n\n' +
      '• Enkripsi AES-256 (standar industri)\n' +
      '• Penyimpanan terenkripsi di database\n' +
      '• Tidak dapat diakses pihak tidak bertanggung jawab\n' +
      '• Kepatuhan standar keamanan data\n\n' +
      'Data sensitif Anda aman bersama kami.',
      [{ text: 'Mengerti' }]
    );
  };

  const updateFormData = (field: keyof CustomerData, value: string) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);

    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  if (cartItems.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <StatusBar style="dark" />

        <View style={styles.appBar}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#1E1E1E" />
          </TouchableOpacity>
          <Text style={styles.appBarTitle}>Data Pelanggan Baru</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.emptyContainer}>
          <Ionicons name="cart-outline" size={80} color="#D1D5DB" />
          <Text style={styles.emptyTitle}>Keranjang Kosong</Text>
          <Text style={styles.emptyText}>
            Silakan pilih paket terlebih dahulu sebelum mengisi data pelanggan
          </Text>
          <TouchableOpacity
            style={styles.emptyButton}
            onPress={() => router.push('/promo')}
          >
            <Text style={styles.emptyButtonText}>Pilih Paket</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar style="dark" />

      <View style={styles.appBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1E1E1E" />
        </TouchableOpacity>
        <Text style={styles.appBarTitle}>Data Pelanggan Baru</Text>
        <TouchableOpacity onPress={() => Alert.alert('Info', 'Pastikan semua data yang Anda masukkan sudah benar dan sesuai dengan dokumen identitas resmi.')}>
          <Ionicons name="information-circle-outline" size={24} color="#1E1E1E" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Cart Items Summary */}
        <View style={styles.selectedPackageCard}>
          <View style={styles.selectedPackageHeader}>
            <Ionicons name="checkmark-circle" size={20} color="#10B981" />
            <Text style={styles.selectedPackageText}>Paket Dipilih ({cartItems.length})</Text>
          </View>

          {cartItems.map((item, index) => (
            <View key={item.id} style={index > 0 ? { marginTop: 12 } : {}}>
              <View style={styles.packageItem}>
                <View style={styles.packageInfo}>
                  <View style={[styles.speedBadge, { backgroundColor: item.color || CartService.getSpeedColor(item.speed) }]}>
                    <Text style={styles.speedText}>{item.speed}</Text>
                  </View>
                  <View style={styles.packageDetails}>
                    <Text style={styles.packageName}>{item.name}</Text>
                    <Text style={styles.packageDescription}>{item.description}</Text>
                  </View>
                </View>
                <Text style={styles.packagePrice}>{formatPrice(item.price)}</Text>
              </View>
            </View>
          ))}

          <View style={styles.divider} />
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total Pembayaran</Text>
            <Text style={styles.totalValue}>{formatPrice(getTotalPrice())}</Text>
          </View>
        </View>

        {/* Installation Schedule Summary */}
        <View style={styles.scheduleCard}>
          <View style={styles.scheduleHeader}>
            <Ionicons name="calendar" size={20} color="#3B82F6" />
            <Text style={styles.scheduleTitle}>Jadwal Pemasangan</Text>
          </View>
          <View style={styles.scheduleInfo}>
            <View style={styles.scheduleItem}>
              <Ionicons name="calendar-outline" size={16} color="#6B7280" />
              <Text style={styles.scheduleText}>
                Tanggal: {formData.installationDate || 'Belum dipilih'}
              </Text>
            </View>
            <View style={styles.scheduleItem}>
              <Ionicons name="time-outline" size={16} color="#6B7280" />
              <Text style={styles.scheduleText}>
                Waktu: {formData.installationTime || 'Belum dipilih'}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.changeScheduleButton}
            onPress={() => router.back()}
          >
            <Text style={styles.changeScheduleText}>Ubah Jadwal</Text>
          </TouchableOpacity>
        </View>

        {/* Form Title */}
        <Text style={styles.formTitle}>Lengkapi Data Diri</Text>
        <Text style={styles.formSubtitle}>Pastikan data yang Anda masukkan sudah benar</Text>

        {/* Form Fields */}
        <View style={styles.formContainer}>
          <InputField
            label="NIK"
            placeholder="Masukkan 16 digit Nomor Induk Kependudukan"
            value={formData.nik}
            onChangeText={(value) => updateFormData('nik', value.replace(/[^0-9]/g, ''))}
            keyboardType="numeric"
            maxLength={16}
            error={errors.nik}
            rightIcon={
              <TouchableOpacity onPress={showEncryptionInfo}>
                <Ionicons name="shield-checkmark" size={20} color="#10B981" />
              </TouchableOpacity>
            }
          />

          <InputField
            label="Nama Lengkap"
            placeholder="Masukkan nama lengkap sesuai KTP"
            value={formData.name}
            onChangeText={(value) => updateFormData('name', value)}
            error={errors.name}
          />

          <InputField
            label="Email"
            placeholder="Masukkan alamat email aktif"
            value={formData.email}
            onChangeText={(value) => updateFormData('email', value)}
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.email}
          />

          <InputField
            label="Nomor Telepon"
            placeholder="Masukkan nomor WhatsApp aktif"
            value={formData.phone}
            onChangeText={(value) => updateFormData('phone', value.replace(/[^0-9]/g, ''))}
            keyboardType="phone-pad"
            error={errors.phone}
          />

          <InputField
            label="Alamat Lengkap"
            placeholder="Masukkan alamat lengkap sesuai KTP"
            value={formData.address}
            onChangeText={(value) => updateFormData('address', value)}
            multiline
            numberOfLines={3}
            error={errors.address}
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, isLoading && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.submitButtonText}>Lanjutkan ke Pembayaran</Text>
          )}
        </TouchableOpacity>

        {/* Terms and Conditions */}
        <Text style={styles.termsText}>
          Dengan melanjutkan, Anda menyetujui{' '}
          <Text
            style={styles.linkText}
            onPress={() => Alert.alert('Syarat & Ketentuan', 'Halaman syarat dan ketentuan akan segera tersedia.')}
          >
            Syarat & Ketentuan
          </Text>{' '}
          dan{' '}
          <Text
            style={styles.linkText}
            onPress={() => Alert.alert('Kebijakan Privasi', 'Halaman kebijakan privasi akan segera tersedia.')}
          >
            Kebijakan Privasi
          </Text>{' '}
          kami.
        </Text>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

interface InputFieldProps {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  maxLength?: number;
  error?: string;
  rightIcon?: React.ReactNode;
  multiline?: boolean;
  numberOfLines?: number;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
}

function InputField({
  label,
  placeholder,
  value,
  onChangeText,
  keyboardType = 'default',
  maxLength,
  error,
  rightIcon,
  multiline = false,
  numberOfLines = 1,
  autoCapitalize = 'sentences'
}: InputFieldProps) {
  return (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={[styles.inputWrapper, multiline && styles.inputWrapperMultiline]}>
        <TextInput
          style={[styles.textInput, multiline && styles.textInputMultiline]}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          maxLength={maxLength}
          multiline={multiline}
          numberOfLines={numberOfLines}
          autoCapitalize={autoCapitalize}
        />
        {rightIcon}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  appBar: {
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
  appBarTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: '#1E1E1E',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 32,
  },
  emptyButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderRadius: 12,
  },
  emptyButtonText: {
    color: 'white',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
  },
  selectedPackageCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  selectedPackageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  selectedPackageText: {
    fontSize: 14,
    color: '#10B981',
    fontFamily: 'Poppins-SemiBold',
    marginLeft: 8,
  },
  packageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  packageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  speedBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    marginRight: 12,
  },
  speedText: {
    fontSize: 10,
    fontFamily: 'Poppins-Bold',
    color: 'white',
  },
  packageDetails: {
    flex: 1,
  },
  packageName: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#1F2937',
    marginBottom: 2,
  },
  packageDescription: {
    fontSize: 13,
    color: '#6B7280',
    fontFamily: 'Poppins-Regular',
  },
  packagePrice: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: '#3B82F6',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 16,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#1F2937',
  },
  totalValue: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: '#3B82F6',
  },
  scheduleCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  scheduleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  scheduleTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: '#1F2937',
    marginLeft: 8,
  },
  scheduleInfo: {
    marginBottom: 16,
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  scheduleText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#1F2937',
    marginLeft: 8,
  },
  changeScheduleButton: {
    alignSelf: 'flex-start',
  },
  changeScheduleText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#3B82F6',
  },
  formTitle: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  formSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'Poppins-Regular',
    marginBottom: 24,
  },
  formContainer: {
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#1F2937',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 50,
  },
  inputWrapperMultiline: {
    alignItems: 'flex-start',
    height: 'auto',
    paddingTop: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: '#1F2937',
    fontFamily: 'Poppins-Regular',
  },
  textInputMultiline: {
    height: 80,
    textAlignVertical: 'top',
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    fontFamily: 'Poppins-Regular',
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  disabledButton: {
    backgroundColor: '#9CA3AF',
  },
  submitButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: 'white',
  },
  termsText: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    lineHeight: 18,
  },
  linkText: {
    color: '#3B82F6',
    textDecorationLine: 'underline',
  },
});