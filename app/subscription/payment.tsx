import { Ionicons } from '@expo/vector-icons';
import { Stack, router } from 'expo-router';
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

interface PaymentMethod {
  id: string;
  name: string;
  image?: any; // For require()
  iconName?: keyof typeof Ionicons.glyphMap;
}

interface PaymentCategory {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  methods: PaymentMethod[];
}

import { useLocalSearchParams } from 'expo-router';

export default function PaymentScreen() {
  const params = useLocalSearchParams();
  const isInvoiceMode = params.mode === 'invoice';
  const invoiceAmount = params.totalAmount ? parseInt(params.totalAmount.toString().replace(/[^0-9]/g, '')) : 0;

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [customerData, setCustomerData] = useState<CustomerData | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<string | null>('bank_transfer');
  const [isLoading, setIsLoading] = useState(false);

  // Data based on Xendit Screenshots
  const paymentCategories: PaymentCategory[] = [
    {
      id: 'bank_transfer',
      title: 'Bank Transfer',
      icon: 'business-outline',
      methods: [
        { id: 'bca', name: 'BCA', iconName: 'business' },
        { id: 'cimb', name: 'CIMB Niaga', iconName: 'business' },
        { id: 'bsi', name: 'BSI', iconName: 'business' },
        { id: 'bri', name: 'BRI', iconName: 'business' },
        { id: 'permata', name: 'Permata', iconName: 'business' },
        { id: 'bni', name: 'BNI', iconName: 'business' },
        { id: 'mandiri', name: 'Mandiri', iconName: 'business' },
        { id: 'bjb', name: 'Bank bjb', iconName: 'business' },
        { id: 'other_bank', name: 'Other Banks', iconName: 'business' },
      ]
    },
    {
      id: 'retail_outlet',
      title: 'Retail Outlet',
      icon: 'storefront-outline',
      methods: [
        { id: 'alfamart', name: 'Alfamart / Alfamidi', iconName: 'cart' },
      ]
    },
    {
      id: 'ewallet',
      title: 'E-Wallet',
      icon: 'wallet-outline',
      methods: [
        { id: 'astrapay', name: 'AstraPay', iconName: 'wallet' },
        { id: 'dana', name: 'DANA', iconName: 'wallet' },
        { id: 'ovo', name: 'OVO', iconName: 'wallet' },
      ]
    },
    {
      id: 'qr_code',
      title: 'QR Payments',
      icon: 'qr-code-outline',
      methods: [
        { id: 'qris', name: 'QRIS', iconName: 'qr-code' },
      ]
    }
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    if (isInvoiceMode) return;
    
    try {
      await CartService.initialize();
      const items = CartService.getCartItems();
      const customer = CartService.getCustomerData();

      setCartItems(items);
      setCustomerData(customer);

      if (items.length === 0 || !customer) {
        Alert.alert('Error', 'Data tidak lengkap. Silakan ulangi dari keranjang.');
        router.push('/cart');
      }
    } catch (error) {
      Alert.alert('Error', 'Gagal memuat data pembayaran');
      router.push('/cart');
    }
  };

  const getTotalPrice = () => {
    const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    const tax = Math.round(subtotal * 0.11);
    const admin = 4500; // Adjusted admin fee
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

  const handleProceed = () => {
    if (!selectedMethod) {
      Alert.alert('Error', 'Silakan pilih metode pembayaran');
      return;
    }

    router.push({
      pathname: '/subscription/order-summary',
      params: {
        paymentMethod: selectedMethod,
        mode: isInvoiceMode ? 'invoice' : 'subscription',
        totalAmount: prices.total
      }
    });
  };

  const prices = getTotalPrice();
  
  const toggleCategory = (id: string) => {
      // If clicking the already expanded category, collapse it (optional). 
      // Xendit usually keeps one open. Let's toggle.
      if (expandedCategory === id) {
          setExpandedCategory(null);
      } else {
          setExpandedCategory(id);
      }
  };

  if (!customerData && !isInvoiceMode) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <StatusBar style="dark" />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Memuat data...</Text>
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
        <Text style={styles.headerTitle}>Pilih Metode Pembayaran</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Total Amount Due Banner like Xendit */}
        <View style={styles.amountDueContainer}>
             <Text style={styles.amountDueLabel}>TOTAL AMOUNT DUE</Text>
             <Text style={styles.amountDueValue}>{formatPrice(prices.total)}</Text>
        </View>

        {/* Ringkasan Pesanan - Only show if NOT in invoice mode */ }
        {!isInvoiceMode && (
          <>
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Ringkasan Pesanan</Text>

              {cartItems.map((item, index) => (
                <View key={item.id} style={styles.orderItem}>
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemSpeed}>{item.speed}</Text>
                    <Text style={styles.itemPeriod}>/{item.activePeriod}</Text>
                  </View>
                  <Text style={styles.itemPrice}>{formatPrice(item.price * item.quantity)}</Text>
                </View>
              ))}

              <View style={styles.divider} />

              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Subtotal</Text>
                <Text style={styles.priceValue}>{formatPrice(prices.subtotal)}</Text>
              </View>
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>PPN (11%)</Text>
                <Text style={styles.priceValue}>{formatPrice(prices.tax)}</Text>
              </View>
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Biaya Admin</Text>
                <Text style={styles.priceValue}>{formatPrice(prices.admin)}</Text>
              </View>
              <View style={[styles.priceRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>Total Pembayaran</Text>
                <Text style={styles.totalValue}>{formatPrice(prices.total)}</Text>
              </View>
            </View>

            {/* Installation Schedule */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Jadwal Pemasangan</Text>
              <View style={styles.scheduleInfo}>
                <View style={styles.scheduleItem}>
                  <Ionicons name="calendar-outline" size={20} color="#6B7280" />
                  <Text style={styles.scheduleText}>
                    {customerData?.installationDate || 'Belum dipilih'}
                  </Text>
                </View>
                <View style={styles.scheduleItem}>
                  <Ionicons name="time-outline" size={20} color="#6B7280" />
                  <Text style={styles.scheduleText}>
                    {customerData?.installationTime || 'Belum dipilih'}
                  </Text>
                </View>
              </View>
            </View>

            {/* Customer Info */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Data Pelanggan</Text>
              <View style={styles.customerInfo}>
                <Text style={styles.customerName}>{customerData?.name}</Text>
                <Text style={styles.customerDetail}>NIK: {customerData?.nik}</Text>
                <Text style={styles.customerDetail}>Email: {customerData?.email}</Text>
                <Text style={styles.customerDetail}>Telepon: {customerData?.phone}</Text>
              </View>
            </View>
          </>
        )}

        {/* Payment Methods Accordion */}
        <Text style={styles.sectionHeading}>PAYMENT METHOD</Text>
        
        <View style={styles.accordionContainer}>
            {paymentCategories.map(category => {
                const isExpanded = expandedCategory === category.id;
                return (
                    <View key={category.id} style={styles.accordionItem}>
                        <TouchableOpacity 
                            style={[styles.accordionHeader, isExpanded && styles.accordionHeaderActive]}
                            onPress={() => toggleCategory(category.id)}
                        >
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Ionicons name={category.icon} size={20} color="#6B7280" />
                                <Text style={styles.accordionTitle}>{category.title}</Text>
                            </View>
                            
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                {/* Small logos could go here */}
                                <Ionicons name={isExpanded ? "chevron-up" : "chevron-down"} size={20} color="#6B7280" />
                            </View>
                        </TouchableOpacity>

                        {isExpanded && (
                            <View style={styles.accordionContent}>
                                <View style={styles.methodGrid}>
                                    {category.methods.map(method => (
                                        <TouchableOpacity 
                                            key={method.id}
                                            style={[
                                                styles.methodBox,
                                                selectedMethod === method.id && styles.methodBoxSelected
                                            ]}
                                            onPress={() => setSelectedMethod(method.id)}
                                        >
                                            <Ionicons name={method.iconName || 'card'} size={24} color={selectedMethod === method.id ? "#3B82F6" : "#1F2937"} />
                                            {method.name.includes(" / ") ? (
                                                <View style={{ marginTop: 8, alignItems: 'center' }}>
                                                     <Text style={styles.methodBoxTitle}>{method.name.split(" / ")[0]}</Text>
                                                     <Text style={[styles.methodBoxTitle, { color: '#E11D2B' }]}>{method.name.split(" / ")[1]}</Text> 
                                                </View>
                                            ) : (
                                                <Text style={[
                                                    styles.methodBoxTitle,
                                                    selectedMethod === method.id && styles.methodBoxTitleSelected
                                                ]}>
                                                    {method.name}
                                                </Text>
                                            )}
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        )}
                    </View>
                );
            })}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[
            styles.proceedButton,
            (!selectedMethod || isLoading) && styles.proceedButtonDisabled
          ]}
          onPress={handleProceed}
          disabled={!selectedMethod || isLoading}
        >
          <Text style={styles.proceedButtonText}>
            {isLoading ? 'Memproses...' : 'Lanjutkan'}
          </Text>
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
  sectionCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    // Removed shadows to fix "excessive corners" issue
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  itemSpeed: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#3B82F6',
  },
  itemPeriod: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#6B7280',
  },
  itemPrice: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: '#1F2937',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 16,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  priceLabel: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#6B7280',
  },
  priceValue: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#1F2937',
  },
  totalRow: {
    marginTop: 8,
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
  scheduleInfo: {
    gap: 8,
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  scheduleText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#1F2937',
  },
  customerInfo: {
    gap: 4,
  },
  customerName: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  customerDetail: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#6B7280',
  },
  amountDueContainer: {
     alignItems: 'center',
     paddingVertical: 32,
     backgroundColor: 'white',
     marginBottom: 8,
  },
  amountDueLabel: {
    fontSize: 12,
    color: '#6B7280',
    letterSpacing: 1.5,
    fontFamily: 'Poppins-Bold',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  amountDueValue: {
    fontSize: 36,
    color: '#3B82F6',
    fontFamily: 'Poppins-Light',
  },
  sectionHeading: {
      fontSize: 14,
      fontFamily: 'Poppins-Bold',
      color: '#4B5563',
      marginTop: 24,
      marginBottom: 16,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
  },
  accordionContainer: {
      borderWidth: 1,
      borderColor: '#E5E7EB',
      borderRadius: 12,
      backgroundColor: 'white',
      overflow: 'hidden',
  },
  accordionItem: {
      borderBottomWidth: 1,
      borderBottomColor: '#E5E7EB',
  },
  accordionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 20,
      backgroundColor: 'white',
  },
  accordionHeaderActive: {
      backgroundColor: '#F9FAFB',
  },
  accordionTitle: {
      fontSize: 16,
      fontFamily: 'Poppins-SemiBold',
      color: '#1F2937',
      marginLeft: 16,
  },
  accordionContent: {
      padding: 20,
      backgroundColor: '#F9FAFB',
      borderTopWidth: 1,
      borderTopColor: '#E5E7EB',
  },
  methodGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10,
      justifyContent: 'space-between', 
  },
  methodBox: {
      width: '30%', 
      aspectRatio: 1, // Square shape
      backgroundColor: 'white',
      borderRadius: 12,
      borderWidth: 1,
      borderColor: '#E5E7EB',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 8,
      shadowColor: '#000',
      shadowOpacity: 0.02,
      shadowRadius: 2,
      elevation: 1,
  },
  methodBoxSelected: {
      borderColor: '#3B82F6',
      backgroundColor: '#EFF6FF',
      borderWidth: 2,
      shadowColor: '#3B82F6',
      shadowOpacity: 0.1,
  },
  methodBoxTitle: {
      fontSize: 11, // Smaller font like screenshot
      textAlign: 'center',
      marginTop: 8,
      fontFamily: 'Poppins-Medium',
      color: '#4B5563',
      lineHeight: 14,
  },
  methodBoxTitleSelected: {
      color: '#3B82F6',
      fontFamily: 'Poppins-Bold',
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
  proceedButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#3B82F6',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  proceedButtonDisabled: {
    backgroundColor: '#D1D5DB',
    shadowOpacity: 0,
    elevation: 0,
  },
  proceedButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    letterSpacing: 0.5,
  },
});