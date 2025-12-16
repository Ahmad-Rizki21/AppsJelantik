import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { FlatList, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// --- Types ---
interface Message {
  id: string;
  title: string;
  content: string;
  time: string;
  date: string;
  type: 'promotion' | 'payment' | 'reminder' | 'welcome' | 'announcement';
  isUnread: boolean;
  details?: Record<string, string>;
}

// --- Dummy Data ---
const messages: Message[] = [
  {
    id: '1',
    title: '🎉 Promo Spesial Untuk Anda!',
    content: 'Hai, kita punya promo buat kamu sobat. Dapatkan kecepatan internet 2x lipat dengan harga yang sama!',
    time: '9:41',
    date: '20 November 2025',
    type: 'promotion',
    isUnread: true,
    details: {
      'promoCode': 'SPEEDUP2X',
      'discount': '50%',
      'validUntil': '30 November 2025',
      'description': 'Upgrade ke paket 20 Mbps dengan harga 10 Mbps selama 3 bulan pertama',
      'terms': 'Berlaku untuk pelanggan existing minimal 6 bulan',
    },
  },
  {
    id: '2',
    title: '⏰ Pengingat Pembayaran',
    content: 'Bulan ini kamu akan jatuh tempo. Segera lakukan pembayaran untuk menghindari pemutusan layanan.',
    time: '9:41',
    date: '20 November 2025',
    type: 'reminder',
    isUnread: true,
    details: {
      'amount': 'Rp 250.000',
      'dueDate': '25 November 2025',
      'invoiceNumber': 'INV-2025-11-046',
      'paymentMethods': 'Transfer Bank, E-Wallet, Minimarket',
    },
  },
  {
    id: '3',
    title: '✅ Pembayaran Berhasil',
    content: 'Pembayaran kamu berhasil terkonfirmasi. Terima kasih telah melakukan pembayaran tepat waktu.',
    time: 'Kemarin',
    date: '19 November 2025',
    type: 'payment',
    isUnread: false,
    details: {
      'amount': 'Rp 250.000',
      'paymentDate': '19 November 2025',
      'paymentMethod': 'Transfer Bank BCA',
      'transactionId': 'PAY-2025-045',
      'period': 'November 2025',
    },
  },
];

export default function PesanScreen() {
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  const getIcon = (type: string) => {
    switch (type) {
      case 'promotion': return '🏷️';
      case 'payment': return '💳';
      case 'reminder': return '🔔';
      case 'welcome': return '👋';
      case 'announcement': return '📢';
      default: return '✉️';
    }
  };

  const getColors = (type: string) => {
    switch (type) {
      case 'promotion': return { bg: '#FFF7ED', text: '#F59E0B' };
      case 'payment': return { bg: '#F0FDF4', text: '#10B981' };
      case 'reminder': return { bg: '#FFE6E6', text: '#EF4444' };
      case 'welcome': return { bg: '#EBF8FF', text: '#3B82F6' };
      case 'announcement': return { bg: '#F3E8FF', text: '#8B5CF6' };
      default: return { bg: '#F3F4F6', text: '#6B7280' };
    }
  };

  const renderItem = ({ item }: { item: Message }) => {
    const colors = getColors(item.type);
    return (
      <TouchableOpacity 
        style={[styles.card, item.isUnread && styles.unreadCard]} 
        onPress={() => setSelectedMessage(item)}
      >
        <View style={[styles.iconContainer, { backgroundColor: colors.bg }]}>
            <Text style={{ fontSize: 20 }}>{getIcon(item.type)}</Text>
        </View>
        
        <View style={styles.contentContainer}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text style={[styles.title, item.isUnread && styles.unreadTitle]}>{item.title}</Text>
                {item.isUnread && <View style={styles.unreadDot} />}
            </View>
            
            <Text style={styles.content} numberOfLines={2}>{item.content}</Text>
            
            <Text style={styles.metaText}>🕒 {item.date}, {item.time}</Text>
        </View>
        
         <Text style={{ color: '#9CA3AF', fontSize: 20, alignSelf:'flex-start' }}>›</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
          <Text style={styles.headerTitle}>Pesan</Text>
          {messages.some(m => m.isUnread) && (
              <View style={styles.headerBadge}>
                  <Text style={styles.headerBadgeText}>{messages.filter(m => m.isUnread).length}</Text>
              </View>
          )}
      </View>

      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={() => (
             <View style={styles.infoBox}>
                 <Text style={{ fontSize: 18, color: '#1D4ED8' }}>ℹ️</Text>
                 <Text style={styles.infoText}>Tap pada pesan untuk melihat detail</Text>
             </View>
        )}
      />

      <Modal
        visible={!!selectedMessage}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedMessage(null)}
      >
          <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                  {selectedMessage && (
                      <>
                        <View style={styles.modalHeader}>
                             <View style={[styles.iconContainer, { backgroundColor: getColors(selectedMessage.type).bg }]}>
                                <Text style={{ fontSize: 24 }}>{getIcon(selectedMessage.type)}</Text>
                            </View>
                             <TouchableOpacity onPress={() => setSelectedMessage(null)}>
                                 <Text style={{ fontSize: 24 }}>✕</Text>
                             </TouchableOpacity>
                        </View>
                        
                        <Text style={styles.modalTitle}>{selectedMessage.title}</Text>
                        <Text style={styles.modalDesc}>{selectedMessage.content}</Text>
                        
                        <View style={styles.modalDateBox}>
                             <Text style={styles.metaText}>🕒 {selectedMessage.date} • {selectedMessage.time}</Text>
                        </View>
                        
                        <ScrollView style={{ maxHeight: 200, marginVertical: 16 }}>
                            <DetailsSection item={selectedMessage} />
                        </ScrollView>
                        
                        <TouchableOpacity style={styles.closeButton} onPress={() => setSelectedMessage(null)}>
                            <Text style={styles.closeButtonText}>Tutup</Text>
                        </TouchableOpacity>
                      </>
                  )}
              </View>
          </View>
      </Modal>

    </SafeAreaView>
  );
}

function DetailsSection({ item }: { item: Message }) {
    const details = item.details || {};
    return (
        <View style={styles.detailsBox}>
             <Text style={styles.detailsHeader}>Detail Pesan</Text>
             {Object.entries(details).map(([key, value]) => (
                 <View key={key} style={styles.detailRow}>
                     <Text style={styles.detailLabel}>{formatLabel(key)}:</Text>
                     <Text style={styles.detailValue}>{value}</Text>
                 </View>
             ))}
        </View>
    )
}

function formatLabel(key: string) {
    return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F3FF',
  },
  header: {
    padding: 16,
    backgroundColor: '#F0F3FF',
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#1F2937',
  },
  headerBadge: {
      backgroundColor: 'red',
      borderRadius: 12,
      paddingHorizontal: 8,
      paddingVertical: 2,
      marginLeft: 8,
  },
  headerBadgeText: { color: 'white', fontWeight: 'bold', fontSize: 12 },
  listContent: {
    padding: 16,
  },
  infoBox: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'white',
      borderRadius: 12,
      padding: 12,
      marginBottom: 16,
      shadowColor: 'black',
      shadowOpacity: 0.05,
      shadowRadius: 10,
      elevation: 2,
  },
  infoText: {
      marginLeft: 12,
      color: '#1D4ED8',
      fontSize: 14,
      fontFamily: 'Poppins-Medium',
  },
  card: {
      backgroundColor: 'white',
      borderRadius: 14,
      padding: 16,
      marginBottom: 12,
      flexDirection: 'row',
      shadowColor: 'black',
      shadowOpacity: 0.05,
      shadowRadius: 10,
      elevation: 2,
  },
  unreadCard: {
      backgroundColor: '#EBF5FF',
      borderWidth: 1,
      borderColor: '#3B82F6',
  },
  iconContainer: {
      padding: 8,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
      width: 40,
      height: 40,
  },
  contentContainer: {
      flex: 1,
  },
  title: {
      fontSize: 15,
      fontFamily: 'Poppins-SemiBold',
      color: '#1F2937',
  },
  unreadTitle: {
      fontFamily: 'Poppins-Bold',
  },
  unreadDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: 'red',
  },
  content: {
      fontSize: 13,
      color: '#6B7280',
      fontFamily: 'Poppins-Regular',
      marginTop: 4,
      marginBottom: 8,
  },
  metaText: {
      fontSize: 12,
      color: '#6B7280',
      fontFamily: 'Poppins-Regular',
  },
  
  // Modal
  modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
  },
  modalContent: {
      backgroundColor: 'white',
      borderRadius: 16,
      padding: 20,
      width: '100%',
      maxWidth: 400,
      shadowColor: 'black',
      shadowOpacity: 0.2,
      shadowRadius: 20,
      elevation: 10,
  },
  modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
  },
  modalTitle: { fontSize: 18, fontFamily: 'Poppins-Bold', color: '#1F2937' },
  modalDesc: { fontSize: 14, color: '#6B7280', fontFamily: 'Poppins-Regular', marginTop: 8 },
  modalDateBox: {
      backgroundColor: '#F3F4F6',
      borderRadius: 8,
      padding: 12,
      marginTop: 16,
      flexDirection: 'row',
      alignItems: 'center',
  },
  closeButton: {
      backgroundColor: '#3B82F6',
      borderRadius: 8,
      padding: 12,
      alignItems: 'center',
      marginTop: 8,
  },
  closeButtonText: { color: 'white', fontSize: 16, fontFamily: 'Poppins-SemiBold' },
  
  detailsBox: {
      backgroundColor: '#FFF7ED', // Defaulting to something warm
      borderRadius: 8,
      padding: 12,
      borderWidth: 1,
      borderColor: '#F59E0B',
  },
  detailsHeader: { fontSize: 14, fontFamily: 'Poppins-Bold', color: '#1F2937', marginBottom: 8 },
  detailRow: { flexDirection: 'row', marginBottom: 4 },
  detailLabel: { width: 100, fontSize: 12, color: '#6B7280', fontFamily: 'Poppins-Medium' },
  detailValue: { flex: 1, fontSize: 12, color: '#1F2937', fontFamily: 'Poppins-Regular' },
});
