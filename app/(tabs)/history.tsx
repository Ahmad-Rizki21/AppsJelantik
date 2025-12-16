import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { FlatList, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// --- Types ---
interface HistoryItem {
  id: string;
  title: string;
  description: string;
  time: string;
  date: string;
  type: 'package_change' | 'payment' | 'installation';
  isNew: boolean;
  details?: Record<string, string>;
}

// --- Dummy Data ---
const historyItems: HistoryItem[] = [
  {
    id: '1',
    title: 'Penggantian Paket Berhasil',
    description: 'Paket berhasil diubah dari 10 Mbps ke 20 Mbps',
    time: '9:41',
    date: '20 November 2025',
    type: 'package_change',
    isNew: true,
    details: {
      'oldPackage': 'Speed 10 Mbps',
      'newPackage': 'Speed 20 Mbps',
      'oldPrice': 'Rp 150.000/bulan',
      'newPrice': 'Rp 250.000/bulan',
      'effectiveDate': '20 November 2025',
      'transactionId': 'PKG-2025-001',
    },
  },
  {
    id: '2',
    title: 'Pembayaran Berhasil',
    description: 'Pembayaran bulan November telah terkonfirmasi',
    time: '9:40',
    date: '19 November 2025',
    type: 'payment',
    isNew: false,
    details: {
      'amount': 'Rp 250.000',
      'paymentMethod': 'Transfer Bank',
      'paymentDate': '19 November 2025',
      'transactionId': 'PAY-2025-045',
      'invoiceNumber': 'INV-2025-11-045',
    },
  },
  {
    id: '3',
    title: 'Instalasi Berhasil',
    description: 'Instalasi layanan internet FTTH telah selesai',
    time: '14:30',
    date: '15 November 2025',
    type: 'installation',
    isNew: false,
    details: {
      'technician': 'Budi Santoso',
      'installationTime': '15 November 2025, 13:00 - 14:30',
      'location': 'Jl. Merdeka No. 123',
      'ontSerial': 'ONT-2025-1123',
      'status': 'Completed',
    },
  },
];

export default function HistoryScreen() {
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);

  const getIcon = (type: string) => {
    switch (type) {
      case 'package_change': return '↔️'; // swap_horiz
      case 'payment': return '💳'; // payment
      case 'installation': return '🛠️'; // engineering
      default: return 'ℹ️';
    }
  };

  const getColors = (type: string) => {
    switch (type) {
      case 'package_change': return { bg: '#EBF8FF', text: '#3B82F6' };
      case 'payment': return { bg: '#F0FDF4', text: '#10B981' };
      case 'installation': return { bg: '#FFF7ED', text: '#F59E0B' };
      default: return { bg: '#F3F4F6', text: '#6B7280' };
    }
  };

  const renderItem = ({ item }: { item: HistoryItem }) => {
    const colors = getColors(item.type);
    return (
      <TouchableOpacity 
        style={styles.card} 
        onPress={() => setSelectedItem(item)}
      >
        <View style={[styles.iconContainer, { backgroundColor: colors.bg }]}>
            <Text style={{ fontSize: 20 }}>{getIcon(item.type)}</Text>
        </View>
        
        <View style={styles.contentContainer}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description} numberOfLines={2}>{item.description}</Text>
            
            <View style={styles.metaRow}>
                <Text style={styles.metaText}>🕒 {item.date}, {item.time}</Text>
                {item.isNew && (
                    <View style={styles.newBadge}>
                        <Text style={styles.newText}>BARU</Text>
                    </View>
                )}
            </View>
        </View>
        
         <Text style={{ color: '#9CA3AF', fontSize: 20, alignSelf:'flex-start' }}>›</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
          <Text style={styles.headerTitle}>History</Text>
      </View>

      <FlatList
        data={historyItems}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={() => (
             <View style={styles.infoBox}>
                 <Text style={{ fontSize: 18, color: '#1D4ED8' }}>ℹ️</Text>
                 <Text style={styles.infoText}>Tap pada item history untuk melihat detail</Text>
             </View>
        )}
      />

      <Modal
        visible={!!selectedItem}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedItem(null)}
      >
          <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                  {selectedItem && (
                      <>
                        <View style={styles.modalHeader}>
                             <View style={[styles.iconContainer, { backgroundColor: getColors(selectedItem.type).bg }]}>
                                <Text style={{ fontSize: 24 }}>{getIcon(selectedItem.type)}</Text>
                            </View>
                             <TouchableOpacity onPress={() => setSelectedItem(null)}>
                                 <Text style={{ fontSize: 24 }}>✕</Text>
                             </TouchableOpacity>
                        </View>
                        
                        <Text style={styles.modalTitle}>{selectedItem.title}</Text>
                        <Text style={styles.modalDesc}>{selectedItem.description}</Text>
                        
                        <View style={styles.modalDateBox}>
                             <Text style={styles.metaText}>🕒 {selectedItem.date} • {selectedItem.time}</Text>
                        </View>
                        
                        <ScrollView style={{ maxHeight: 200, marginVertical: 16 }}>
                            <DetailsSection item={selectedItem} />
                        </ScrollView>
                        
                        <TouchableOpacity style={styles.closeButton} onPress={() => setSelectedItem(null)}>
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

function DetailsSection({ item }: { item: HistoryItem }) {
    // A simplified generic details renderer
    const details = item.details || {};
    return (
        <View style={styles.detailsBox}>
             <Text style={styles.detailsHeader}>Detail {item.type === 'payment' ? 'Pembayaran' : item.type === 'installation' ? 'Instalasi' : 'Perubahan Paket'}</Text>
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
    // Simple formatter, e.g. oldPackage -> Old Package
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
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#1F2937',
  },
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
  description: {
      fontSize: 13,
      color: '#6B7280',
      fontFamily: 'Poppins-Regular',
      marginTop: 4,
  },
  metaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 8,
  },
  metaText: {
      fontSize: 12,
      color: '#6B7280',
      fontFamily: 'Poppins-Regular',
  },
  newBadge: {
      backgroundColor: 'red',
      borderRadius: 10,
      paddingHorizontal: 6,
      paddingVertical: 2,
      marginLeft: 8,
  },
  newText: {
      color: 'white',
      fontSize: 10,
      fontFamily: 'Poppins-Bold',
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
      backgroundColor: '#F8FAFC',
      borderRadius: 8,
      padding: 12,
      borderWidth: 1,
      borderColor: '#E2E8F0',
  },
  detailsHeader: { fontSize: 14, fontFamily: 'Poppins-Bold', color: '#1F2937', marginBottom: 8 },
  detailRow: { flexDirection: 'row', marginBottom: 4 },
  detailLabel: { width: 100, fontSize: 12, color: '#6B7280', fontFamily: 'Poppins-Medium' },
  detailValue: { flex: 1, fontSize: 12, color: '#1F2937', fontFamily: 'Poppins-Regular' },
});
