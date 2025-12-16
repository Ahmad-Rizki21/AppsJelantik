import { Ionicons } from '@expo/vector-icons';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Linking from 'expo-linking';

export default function ReportIssueScreen() {
    const [issueType, setIssueType] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const issueTypes = [
        { id: 'internet_down', name: 'Internet Tidak Ada', icon: '🌐' },
        { id: 'slow_connection', name: 'Koneksi Lambat', icon: '🐌' },
        { id: 'intermittent', name: 'Koneksi Putus-Nyambung', icon: '🔄' },
        { id: 'wifi_issue', name: 'Masalah WiFi', icon: '📶' },
        { id: 'billing', name: 'Tagihan', icon: '💳' },
        { id: 'other', name: 'Lainnya', icon: '❓' },
    ];

    const handleSubmit = async () => {
        if (!issueType || !description || !email || !phone) {
            Alert.alert('Error', 'Mohon lengkapi semua field yang wajib diisi');
            return;
        }

        setIsSubmitting(true);

        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            Alert.alert(
                'Laporan Terkirim',
                'Terima kasih atas laporan Anda. Tim kami akan segera menindaklanjuti dalam 2x24 jam.',
                [
                    {
                        text: 'OK',
                        onPress: () => {
                            // Reset form
                            setIssueType('');
                            setDescription('');
                            setLocation('');
                            setEmail('');
                            setPhone('');
                            router.back();
                        }
                    }
                ]
            );
        }, 2000);
    };

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar style="dark" />

            <View style={styles.appBar}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#1E1E1E" />
                </TouchableOpacity>
                <Text style={styles.appBarTitle}>Lapor Gangguan</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {/* Header */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>⚠️ Laporkan Gangguan</Text>
                    <Text style={styles.cardText}>
                        Laporkan masalah yang Anda alami. Kami akan segera memproses laporan Anda dan memberikan solusi terbaik.
                    </Text>
                </View>

                {/* Quick Emergency */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>🚨 Darurat? Hubungi Langsung</Text>
                    <View style={styles.emergencyContainer}>
                        <TouchableOpacity style={styles.emergencyButton} onPress={() => Linking.openURL('tel:6282223616884')}>
                            <Ionicons name="call" size={24} color="white" />
                            <Text style={styles.emergencyText}>Hotline Emergency</Text>
                            <Text style={styles.emergencyNumber}>6282223616884</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Issue Type */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>📝 Jenis Gangguan</Text>
                    <Text style={styles.label}>Pilih jenis gangguan yang dialami *</Text>
                    <View style={styles.typeContainer}>
                        {issueTypes.map((type) => (
                            <TouchableOpacity
                                key={type.id}
                                style={[
                                    styles.typeButton,
                                    issueType === type.id && styles.typeButtonSelected
                                ]}
                                onPress={() => setIssueType(type.id)}
                            >
                                <Text style={styles.typeIcon}>{type.icon}</Text>
                                <Text style={[
                                    styles.typeText,
                                    issueType === type.id && styles.typeTextSelected
                                ]}>
                                    {type.name}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Description */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>📄 Deskripsi Masalah</Text>
                    <Text style={styles.label}>Jelaskan masalah yang Anda alami secara detail *</Text>
                    <TextInput
                        style={styles.textArea}
                        multiline
                        numberOfLines={4}
                        value={description}
                        onChangeText={setDescription}
                        placeholder="Contoh: Internet mati sejak pukul 14.00, lampu modem merah semua..."
                        placeholderTextColor="#9CA3AF"
                    />
                    <View style={styles.helperContainer}>
                        <Ionicons name="information-circle" size={16} color="#6B7280" />
                        <Text style={styles.helperText}>
                            Semakin detail deskripsi, semakin cepat kami membantu Anda
                        </Text>
                    </View>
                </View>

                {/* Location */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>📍 Lokasi</Text>
                    <Text style={styles.label}>Lokasi terjadi gangguan</Text>
                    <TextInput
                        style={styles.input}
                        value={location}
                        onChangeText={setLocation}
                        placeholder="Alamat lengkap atau keterangan lokasi"
                        placeholderTextColor="#9CA3AF"
                    />
                </View>

                {/* Contact Info */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>👤 Info Kontak</Text>
                    <Text style={styles.label}>Email *</Text>
                    <TextInput
                        style={styles.input}
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        placeholder="email@example.com"
                        placeholderTextColor="#9CA3AF"
                    />

                    <Text style={[styles.label, { marginTop: 16 }]}>Nomor Telepon/WhatsApp *</Text>
                    <TextInput
                        style={styles.input}
                        value={phone}
                        onChangeText={setPhone}
                        keyboardType="phone-pad"
                        placeholder="08xx-xxxx-xxxx"
                        placeholderTextColor="#9CA3AF"
                    />
                </View>

                {/* Checklist */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>✅ Checklist Sebelum Lapor</Text>
                    <View style={styles.checklistContainer}>
                        <View style={styles.checklistItem}>
                            <View style={styles.checkBox}>
                                <Ionicons name="square-outline" size={20} color="#9CA3AF" />
                            </View>
                            <Text style={styles.checklistText}>
                                Restart modem/router sudah dilakukan
                            </Text>
                        </View>
                        <View style={styles.checklistItem}>
                            <View style={styles.checkBox}>
                                <Ionicons name="square-outline" size={20} color="#9CA3AF" />
                            </View>
                            <Text style={styles.checklistText}>
                                Kabel sudah dicek koneksinya
                            </Text>
                        </View>
                        <View style={styles.checklistItem}>
                            <View style={styles.checkBox}>
                                <Ionicons name="square-outline" size={20} color="#9CA3AF" />
                            </View>
                            <Text style={styles.checklistText}>
                                Status tagihan sudah lunas
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Upload */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>📎 Upload Bukti (Opsional)</Text>
                    <TouchableOpacity style={styles.uploadButton}>
                        <Ionicons name="camera" size={24} color="#6B7280" />
                        <Text style={styles.uploadText}>
                            Tambahkan foto/screenshot untuk mempercepat proses
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Submit */}
                <View style={styles.card}>
                    <TouchableOpacity
                        style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
                        onPress={handleSubmit}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <Text style={styles.submitButtonText}>Mengirim laporan...</Text>
                        ) : (
                            <Text style={styles.submitButtonText}>Kirim Laporan</Text>
                        )}
                    </TouchableOpacity>

                    <Text style={styles.noteText}>
                        Nomor tiket akan dikirim ke email Anda. Simpan nomor tiket untuk tracking status laporan.
                    </Text>
                </View>

                {/* Previous Reports */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>📊 Laporan Sebelumnya</Text>
                    <TouchableOpacity style={styles.previousButton}>
                        <Ionicons name="time" size={20} color="#6B7280" />
                        <Text style={styles.previousText}>Lihat Riwayat Laporan</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ height: 40 }} />
            </ScrollView>
        </SafeAreaView>
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
    card: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        shadowColor: 'black',
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    cardTitle: {
        fontSize: 18,
        fontFamily: 'Poppins-Bold',
        color: '#1F2937',
        marginBottom: 12,
    },
    cardText: {
        fontSize: 14,
        color: '#6B7280',
        fontFamily: 'Poppins-Regular',
        lineHeight: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontFamily: 'Poppins-SemiBold',
        color: '#1F2937',
        marginBottom: 12,
    },
    label: {
        fontSize: 14,
        fontFamily: 'Poppins-Medium',
        color: '#374151',
        marginBottom: 8,
    },
    emergencyContainer: {
        backgroundColor: '#FEE2E2',
        borderRadius: 12,
        overflow: 'hidden',
    },
    emergencyButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#DC2626',
        padding: 16,
    },
    emergencyText: {
        flex: 1,
        fontSize: 16,
        fontFamily: 'Poppins-SemiBold',
        color: 'white',
        marginLeft: 12,
    },
    emergencyNumber: {
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
        color: 'white',
    },
    typeContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -4,
    },
    typeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        padding: 12,
        margin: 4,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    typeButtonSelected: {
        backgroundColor: '#EBF5FF',
        borderColor: '#3B82F6',
    },
    typeIcon: {
        fontSize: 20,
        marginRight: 8,
    },
    typeText: {
        fontSize: 14,
        fontFamily: 'Poppins-Medium',
        color: '#6B7280',
    },
    typeTextSelected: {
        color: '#3B82F6',
    },
    textArea: {
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        padding: 16,
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
        color: '#1F2937',
        textAlignVertical: 'top',
        minHeight: 100,
    },
    input: {
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        padding: 16,
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
        color: '#1F2937',
    },
    helperContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    helperText: {
        fontSize: 12,
        color: '#6B7280',
        fontFamily: 'Poppins-Regular',
        marginLeft: 4,
        flex: 1,
    },
    checklistContainer: {
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        padding: 16,
    },
    checklistItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    checkBox: {
        marginRight: 12,
    },
    checklistText: {
        fontSize: 14,
        color: '#4B5563',
        fontFamily: 'Poppins-Regular',
        flex: 1,
    },
    uploadButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        padding: 16,
        borderWidth: 2,
        borderColor: '#E5E7EB',
        borderStyle: 'dashed',
    },
    uploadText: {
        fontSize: 14,
        color: '#6B7280',
        fontFamily: 'Poppins-Regular',
        marginLeft: 12,
        flex: 1,
    },
    submitButton: {
        backgroundColor: '#3B82F6',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        marginBottom: 12,
    },
    submitButtonDisabled: {
        backgroundColor: '#9CA3AF',
    },
    submitButtonText: {
        fontSize: 16,
        fontFamily: 'Poppins-Bold',
        color: 'white',
    },
    noteText: {
        fontSize: 13,
        color: '#6B7280',
        fontFamily: 'Poppins-Regular',
        textAlign: 'center',
    },
    previousButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        padding: 16,
    },
    previousText: {
        fontSize: 15,
        fontFamily: 'Poppins-Medium',
        color: '#3B82F6',
        marginLeft: 12,
    },
});