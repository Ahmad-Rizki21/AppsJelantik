import { Ionicons } from '@expo/vector-icons';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import CartService, { CartItem, CustomerData } from '../services/cartService';

export default function CartScreen() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isTimeModalVisible, setTimeModalVisible] = useState(false);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [tempDate, setTempDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);

  const timeSlots = [
    '09:00 - 12:00',
    '12:00 - 15:00',
    '15:00 - 18:00',
    '18:00 - 21:00'
  ];

  useEffect(() => {
    loadCartItems();
  }, []);

  const loadCartItems = async () => {
    setIsLoading(true);
    try {
      const items = CartService.getCartItems();
      setCartItems(items);

      // Load customer data to restore date/time selection
      const customerData = CartService.getCustomerData();
      if (customerData) {
        setSelectedDate(customerData.installationDate || null);
        setSelectedTime(customerData.installationTime || null);
      }
    } catch {
      console.error('Error loading cart');
      Alert.alert('Error', 'Gagal memuat keranjang');
    } finally {
      setIsLoading(false);
    }
  };

  const pickDate = () => {
    // Set minimum date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setTempDate(tomorrow);
    setDatePickerVisible(true);
  };

  const handleDateChange = (event: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS === 'android') {
      setDatePickerVisible(false);
    }

    if (event.type === 'set' && selected) {
      // Format date as DD-MM-YYYY
      const dateStr = `${selected.getDate()}-${selected.getMonth() + 1}-${selected.getFullYear()}`;
      setSelectedDate(dateStr);
      saveCustomerData({ installationDate: dateStr });
      // Close picker on iOS after selection
      if (Platform.OS === 'ios') {
        setDatePickerVisible(false);
      }
    } else if (event.type === 'dismissed') {
      setDatePickerVisible(false);
    }
  };

  const saveCustomerData = async (data: Partial<CustomerData>) => {
    try {
      const existingData = CartService.getCustomerData();
      const mergedData: CustomerData = {
        nik: existingData?.nik || '',
        name: existingData?.name || '',
        email: existingData?.email || '',
        phone: existingData?.phone || '',
        address: existingData?.address || '',
        installationDate: existingData?.installationDate || '',
        installationTime: existingData?.installationTime || '',
        ...data
      };
      await CartService.saveCustomerData(mergedData);
    } catch {
      console.error('Error saving customer data');
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    Alert.alert(
      "Hapus Item",
      "Apakah Anda yakin ingin menghapus item ini?",
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus",
          style: "destructive",
          onPress: async () => {
            try {
              await CartService.removeFromCart(itemId);
              loadCartItems();
            } catch {
              Alert.alert('Error', 'Gagal menghapus item');
            }
          }
        }
      ]
    );
  };

  const handleClearCart = () => {
    Alert.alert(
      "Hapus Keranjang",
      "Apakah Anda yakin ingin menghapus semua item?",
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus",
          style: "destructive",
          onPress: async () => {
            try {
              await CartService.clearCart();
              loadCartItems();
              setSelectedDate(null);
              setSelectedTime(null);
              CartService.clearCustomerData();
            } catch {
              Alert.alert('Error', 'Gagal mengosongkan keranjang');
            }
          }
        }
      ]
    );
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleCheckout = () => {
    if (!selectedDate || !selectedTime) {
      Alert.alert('Error', 'Silakan pilih tanggal dan waktu pemasangan');
      return;
    }
    router.push('/subscription/customer-type');
  };

  if (isLoading) {
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

  if (cartItems.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <StatusBar style="dark" />
        <View style={styles.appBar}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#1E1E1E" />
          </TouchableOpacity>
          <Text style={styles.appBarTitle}>Keranjang</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconContainer}>
            <Ionicons name="cart-outline" size={80} color="#D1D5DB" />
          </View>
          <Text style={styles.emptyTitle}>Keranjang Kosong</Text>
          <Text style={styles.emptyText}>Pilih paket untuk dimasukkan ke keranjang</Text>
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
        <Text style={styles.appBarTitle}>Keranjang</Text>
        <TouchableOpacity onPress={handleClearCart}>
          <Ionicons name="trash-outline" size={24} color="#EF4444" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Installation Schedule */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="calendar" size={24} color="#3B82F6" />
            <Text style={styles.cardHeaderText}>Jadwal Pemasangan</Text>
          </View>
          <Text style={styles.helperText}>
            Pilih tanggal dan waktu pemasangan:
          </Text>

          <TouchableOpacity style={styles.pickerButton} onPress={pickDate}>
            <Ionicons name="calendar-outline" size={20} color="#6B7280" />
            <Text style={[styles.pickerText, !selectedDate && { color: '#9CA3AF' }]}>
              {selectedDate || 'Pilih Tanggal Pemasangan'}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#6B7280" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.pickerButton}
            onPress={() => setTimeModalVisible(true)}
          >
            <Ionicons name="time-outline" size={20} color="#6B7280" />
            <Text style={[styles.pickerText, !selectedTime && { color: '#9CA3AF' }]}>
              {selectedTime || 'Pilih Waktu Pemasangan'}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* Cart Items */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="cube-outline" size={24} color="#3B82F6" />
            <Text style={styles.cardHeaderText}>Paket Dipilih</Text>
          </View>

          {cartItems.map((item) => (
            <View key={item.id} style={styles.cartItem}>
              <View style={styles.itemHeader}>
                <View style={styles.itemInfo}>
                  <View style={[styles.speedBadge, { backgroundColor: item.color || CartService.getSpeedColor(item.speed) }]}>
                    <Text style={styles.speedText}>{item.speed}</Text>
                  </View>
                  <View style={styles.itemDetails}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemPrice}>{formatPrice(item.price)}</Text>
                    <Text style={styles.itemPeriod}>/{item.activePeriod}</Text>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => handleRemoveItem(item.id)}
                  style={styles.removeButton}
                >
                  <Ionicons name="trash-outline" size={20} color="#EF4444" />
                </TouchableOpacity>
              </View>

              <View style={styles.featuresContainer}>
                {item.features.slice(0, 3).map((feature, index) => (
                  <View key={index} style={styles.featureChip}>
                    <Ionicons name="checkmark-circle" size={14} color="#10B981" />
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>

        <View style={styles.spacer} />
      </ScrollView>

      <View style={styles.bottomBar}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total Pembayaran</Text>
          <Text style={styles.totalValue}>{formatPrice(getTotalPrice())}</Text>
        </View>
        <TouchableOpacity
          style={[
            styles.checkoutButton,
            (!selectedDate || !selectedTime) && styles.checkoutButtonDisabled
          ]}
          onPress={handleCheckout}
          disabled={!selectedDate || !selectedTime}
        >
          <Text style={styles.checkoutText}>Lanjutkan ke Data Pelanggan</Text>
          <Ionicons name="arrow-forward" size={20} color="white" />
        </TouchableOpacity>
      </View>

      <Modal
        transparent={true}
        visible={isTimeModalVisible}
        onRequestClose={() => setTimeModalVisible(false)}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Pilih Waktu Pemasangan</Text>
            {timeSlots.map((slot, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.timeSlot,
                  selectedTime === slot && styles.timeSlotSelected
                ]}
                onPress={() => {
                  setSelectedTime(slot);
                  setTimeModalVisible(false);
                  saveCustomerData({ installationTime: slot });
                }}
              >
                <Text style={[
                  styles.timeSlotText,
                  selectedTime === slot && styles.timeSlotTextSelected
                ]}>
                  {slot}
                </Text>
                {selectedTime === slot && (
                  <Ionicons name="checkmark-circle" size={20} color="#3B82F6" />
                )}
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setTimeModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Batal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {isDatePickerVisible && (
        <DateTimePicker
          value={tempDate}
          mode="date"
          display="default"
          minimumDate={new Date(Date.now() + 24 * 60 * 60 * 1000)} // Minimum tomorrow
          onChange={handleDateChange}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
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
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 8,
  },
  appBarTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#1F2937',
  },
  content: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyIconContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#1F2937',
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
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardHeaderText: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#1F2937',
    marginLeft: 12,
  },
  helperText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#6B7280',
    marginBottom: 16,
  },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#FAFAFA',
  },
  pickerText: {
    flex: 1,
    marginLeft: 12,
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#1F2937',
  },
  cartItem: {
    padding: 16,
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    marginBottom: 12,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  speedBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 12,
  },
  speedText: {
    fontSize: 12,
    fontFamily: 'Poppins-Bold',
    color: 'white',
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#3B82F6',
  },
  itemPeriod: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#6B7280',
  },
  removeButton: {
    padding: 8,
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  featureChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  featureText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#059669',
    marginLeft: 4,
  },
  spacer: {
    height: 100,
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
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#6B7280',
  },
  totalValue: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#3B82F6',
  },
  checkoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  checkoutButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },
  checkoutText: {
    color: 'white',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#1F2937',
  },
  timeSlot: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  timeSlotSelected: {
    backgroundColor: '#EFF6FF',
  },
  timeSlotText: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#1F2937',
  },
  timeSlotTextSelected: {
    color: '#3B82F6',
    fontFamily: 'Poppins-SemiBold',
  },
  closeButton: {
    marginTop: 16,
    padding: 16,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#EF4444',
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
  },
});