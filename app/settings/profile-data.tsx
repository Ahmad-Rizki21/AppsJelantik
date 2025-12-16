import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Alert, Image, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileDataScreen() {
    const [image, setImage] = useState<string | null>(null);
    const [isImageModalVisible, setIsImageModalVisible] = useState(false);
    
    // Edit Modal State
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [editConfig, setEditConfig] = useState({ title: '', value: '', field: '' });
    const [tempValue, setTempValue] = useState('');

    // Dummy Data State
    const [profile, setProfile] = useState({
        nama: 'Ahmad Rizki',
        email: 'ahmad.rizki21@gmail.com',
        telepon: '1222502221027',
        alamat: 'Bekasi, Jawa Barat, Indonesia'
    });

    const openEditModal = (field: keyof typeof profile, title: string) => {
        setEditConfig({ title, value: profile[field], field });
        setTempValue(profile[field]);
        setIsEditModalVisible(true);
    };

    const handleSave = () => {
        setProfile(prev => ({ ...prev, [editConfig.field]: tempValue }));
        setIsEditModalVisible(false);
    };

    const pickImage = async (useCamera: boolean) => {
        setIsImageModalVisible(false); // Close modal first
        
        let result;
        try {
             if (useCamera) {
                const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
                if (permissionResult.granted === false) {
                    Alert.alert("Permission to access camera is required!");
                    return;
                }
                result = await ImagePicker.launchCameraAsync({
                    mediaTypes: ['images'],
                    allowsEditing: true,
                    aspect: [1, 1],
                    quality: 0.8,
                });
            } else {
                const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
                 if (permissionResult.granted === false) {
                    Alert.alert("Permission to access library is required!");
                    return;
                }
                result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ['images'],
                    allowsEditing: true,
                    aspect: [1, 1],
                    quality: 0.8,
                });
            }

            if (!result.canceled) {
                setImage(result.assets[0].uri);
            }
        } catch (e) {
            console.log(e);
            Alert.alert("Error", "Could not pick image");
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar style="dark" />
            
            <View style={styles.appBar}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#1E1E1E" />
                </TouchableOpacity>
                <Text style={styles.appBarTitle}>Data Profil</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <Section title="Foto Profil">
                     <View style={styles.profileRow}>
                         <TouchableOpacity onPress={() => setIsImageModalVisible(true)}>
                             <Image 
                                source={image ? { uri: image } : require('../../assets/images/Ellipse 245.png')} 
                                style={styles.avatar}
                             />
                         </TouchableOpacity>
                         <View style={{ flex: 1, marginLeft: 16 }}>
                             <Text style={styles.sectionHeaderTitle}>Ubah Foto Profil</Text>
                             <Text style={styles.sectionSubtitle}>Ketuk untuk mengubah foto profil</Text>
                         </View>
                         <TouchableOpacity onPress={() => setIsImageModalVisible(true)}>
                             <Text style={{ fontSize: 24, color: '#3B82F6' }}>📷</Text>
                         </TouchableOpacity>
                     </View>
                </Section>

                <View style={{ height: 24 }} />

                <Section title="Informasi Pribadi">
                    <ProfileTile title="Nama Lengkap" value={profile.nama} onPress={() => openEditModal('nama', 'Ubah Nama Lengkap')} />
                    <Separator />
                    <ProfileTile title="Email" value={profile.email} onPress={() => openEditModal('email', 'Ubah Email')} />
                    <Separator />
                    <ProfileTile title="Nomor Telepon" value={profile.telepon} onPress={() => openEditModal('telepon', 'Ubah Nomor Telepon')} />
                    <Separator />
                    <ProfileTile title="Alamat" value={profile.alamat} onPress={() => openEditModal('alamat', 'Ubah Alamat')} />
                </Section>

                <View style={{ height: 24 }} />

                <Section title="Informasi Akun">
                    <ProfileTile title="ID Pelanggan" value="1222502221027" readOnly />
                    <Separator />
                    <ProfileTile title="Paket" value="Spark - 50 Mbps" onPress={() => router.push('/promo' as any)} />
                    <Separator />
                    <ProfileTile title="Status" value="Aktif hingga 28 Des 2025" readOnly />
                </Section>
            </ScrollView>

            {/* Image Picker Modal */}
            <Modal
                transparent={true}
                visible={isImageModalVisible}
                animationType="slide"
                onRequestClose={() => setIsImageModalVisible(false)}
            >
                <TouchableOpacity 
                    style={styles.modalOverlay} 
                    activeOpacity={1} 
                    onPress={() => setIsImageModalVisible(false)}
                >
                    <View style={styles.modalContent}>
                        <TouchableOpacity style={styles.modalItem} onPress={() => pickImage(false)}>
                            <Text style={styles.modalIcon}>🖼️</Text>
                            <Text style={styles.modalText}>Pilih dari Galeri</Text>
                        </TouchableOpacity>
                        <View style={styles.modalDivider} />
                        <TouchableOpacity style={styles.modalItem} onPress={() => pickImage(true)}>
                            <Text style={styles.modalIcon}>📸</Text>
                            <Text style={styles.modalText}>Ambil Foto dari Kamera</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>

            {/* Edit Text Modal */}
            <Modal
                transparent={true}
                visible={isEditModalVisible}
                animationType="fade"
                onRequestClose={() => setIsEditModalVisible(false)}
            >
                <View style={styles.centerModalOverlay}>
                    <View style={styles.centerModalContent}>
                        <Text style={styles.editModalTitle}>{editConfig.title}</Text>
                        <TextInput 
                            style={styles.editInput}
                            value={tempValue}
                            onChangeText={setTempValue}
                            autoFocus
                        />
                        <View style={styles.editModalActions}>
                            <TouchableOpacity onPress={() => setIsEditModalVisible(false)} style={styles.editModalButton}>
                                <Text style={styles.editModalCancel}>Batal</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleSave} style={styles.editModalButton}>
                                <Text style={styles.editModalSave}>Simpan</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

function Section({ title, children }: { title: string, children: React.ReactNode }) {
    return (
        <View style={styles.sectionContainer}>
             <Text style={styles.sectionTitle}>{title}</Text>
             <View style={styles.sectionCard}>
                 {children}
             </View>
        </View>
    )
}

function ProfileTile({ title, value, onPress, readOnly }: { title: string, value: string, onPress?: () => void, readOnly?: boolean }) {
    return (
        <TouchableOpacity style={styles.tile} onPress={onPress} disabled={readOnly}>
            <View style={{ flex: 1 }}>
                <Text style={styles.tileTitle}>{title}</Text>
                <Text style={styles.tileValue}>{value}</Text>
            </View>
            {!readOnly && <Text style={styles.chevron}>›</Text>}
        </TouchableOpacity>
    )
}

function Separator() {
    return <View style={styles.separator} />
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
  },
  backButton: {
      padding: 8,
  },
  appBarTitle: {
      fontSize: 20,
      fontFamily: 'Poppins-SemiBold',
      color: '#1E1E1E',
  },
  content: {
      padding: 16,
  },
  sectionContainer: {
      marginBottom: 0,
  },
  sectionTitle: {
      fontSize: 16,
      fontFamily: 'Poppins-SemiBold',
      color: '#1E1E1E',
      marginLeft: 16,
      marginBottom: 8,
  },
  sectionCard: {
      backgroundColor: 'white',
      borderRadius: 14,
      shadowColor: 'black',
      shadowOpacity: 0.05,
      shadowRadius: 10,
      elevation: 2,
      overflow: 'hidden',
  },
  profileRow: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 20,
  },
  avatar: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: '#E5E7EB',
  },
  sectionHeaderTitle: {
      fontSize: 16,
      fontFamily: 'Poppins-Medium',
      color: '#1E1E1E',
  },
  sectionSubtitle: {
      fontSize: 14,
      color: '#6B7280',
      fontFamily: 'Poppins-Regular',
  },
  tile: {
      flexDirection: 'row',
      alignItems: 'center', 
      padding: 16,
  },
  tileTitle: {
      fontSize: 14,
      color: '#6B7280',
      fontFamily: 'Poppins-Medium',
      marginBottom: 4,
  },
  tileValue: {
      fontSize: 16,
      color: '#1E1E1E',
      fontFamily: 'Poppins-Medium',
  },
  chevron: {
      fontSize: 20,
      color: '#6B7280',
  },
  separator: {
      height: 1,
      backgroundColor: '#F0F3FF',
      marginHorizontal: 16,
  },
  modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'flex-end',
  },
  modalContent: {
      backgroundColor: 'white',
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      padding: 24,
  },
  modalItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 16,
  },
  modalIcon: {
      fontSize: 24,
      marginRight: 16,
  },
  modalText: {
      fontSize: 16,
      fontFamily: 'Poppins-Medium',
      color: '#1E1E1E',
  },
  modalDivider: {
      height: 1, 
      backgroundColor: '#E5E7EB',
  },
  // Edit Modal Styles
  centerModalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      padding: 20
  },
  centerModalContent: {
      backgroundColor: 'white',
      borderRadius: 16,
      padding: 24,
  },
  editModalTitle: {
      fontSize: 18,
      fontFamily: 'Poppins-Bold',
      marginBottom: 16,
      color: '#1E1E1E',
  },
  editInput: {
      borderWidth: 1,
      borderColor: '#E5E7EB',
      borderRadius: 8,
      paddingHorizontal: 16,
      paddingVertical: 12,
      fontFamily: 'Poppins-Regular',
      fontSize: 16,
      marginBottom: 24,
  },
  editModalActions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      gap: 16,
  },
  editModalButton: {
      paddingVertical: 8,
      paddingHorizontal: 12,
  },
  editModalCancel: {
      color: '#6B7280',
      fontFamily: 'Poppins-Medium',
  },
  editModalSave: {
      color: '#3B82F6',
      fontFamily: 'Poppins-Bold',
  },
});
