import { Ionicons } from '@expo/vector-icons';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useRef, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function FeedbackScreen() {
    const [rating, setRating] = useState(5);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    // ref for scrolling to form if needed, though simple state update works
    const scrollViewRef = useRef<ScrollView>(null);

    const fillQuickFeedback = (type: string, defaultMessage: string) => {
        setSubject(type);
        setMessage(defaultMessage);
        Alert.alert('Info', `Form telah diisi untuk ${type}. Silakan lengkapi detailnya di bawah.`);
    };

    const handleSubmit = async () => {
        if (!name || !email || !subject || !message) {
            Alert.alert('Error', 'Mohon lengkapi semua field');
            return;
        }

        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            Alert.alert('Terima Kasih', 'Umpan balik Anda telah terkirim', [
                { text: 'OK', onPress: () => router.back() }
            ]);
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
                <Text style={styles.appBarTitle}>Umpan Balik</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView ref={scrollViewRef} contentContainerStyle={styles.content}>
                
                {/* Quick Feedback */}
                <Section title="Umpan Balik Cepat">
                    <QuickTile 
                        title="Laporkan Bug" 
                        subtitle="Menemukan bug? Beritahu kami" 
                        icon="bug-outline"
                        color="#EF4444"
                        onPress={() => fillQuickFeedback('Laporan Bug', 'Saya menemukan bug: ')}
                    />
                    <QuickTile 
                        title="Saran Fitur" 
                        subtitle="Punya ide untuk fitur baru?" 
                        icon="bulb-outline"
                        color="#F59E0B"
                        onPress={() => fillQuickFeedback('Permintaan Fitur', 'Saya ingin mengusulkan fitur: ')}
                    />
                    <QuickTile 
                        title="Umpan Balik Layanan" 
                        subtitle="Bagikan pengalaman Anda" 
                        icon="star-outline"
                        color="#3B82F6"
                        onPress={() => fillQuickFeedback('Kualitas Layanan', 'Pengalaman saya: ')}
                    />
                </Section>

                <View style={{ height: 24 }} />

                {/* Rating */}
                <Section title="Beri Nilai Aplikasi Kami">
                    <View style={styles.ratingContainer}>
                        <Text style={styles.ratingQuestion}>Bagaimana penilaian Anda terhadap aplikasi kami?</Text>
                        <View style={styles.starsRow}>
                             {[1,2,3,4,5].map(star => (
                                 <TouchableOpacity key={star} onPress={() => setRating(star)}>
                                     <Ionicons 
                                        name="star" 
                                        size={32} 
                                        color={star <= rating ? "#F59E0B" : "#E5E7EB"} 
                                        style={{ marginHorizontal: 4 }}
                                     />
                                 </TouchableOpacity>
                             ))}
                        </View>
                        <Text style={styles.ratingLabel}>
                            {rating === 5 ? 'Sangat Baik' : rating === 4 ? 'Baik' : rating === 3 ? 'Cukup' : rating === 2 ? 'Buruk' : 'Sangat Buruk'}
                        </Text>
                    </View>
                </Section>

                <View style={{ height: 24 }} />

                {/* Form */}
                <Section title="Kirim Umpan Balik Detail">
                    <View style={styles.formContainer}>
                        <Input label="Nama Anda" hint="Masukkan nama lengkap" value={name} onChange={setName} icon="person-outline"/>
                        <View style={{ height: 16 }} />
                        <Input label="Alamat Email" hint="Masukkan email Anda" value={email} onChange={setEmail} icon="mail-outline" keyboardType="email-address"/>
                        <View style={{ height: 16 }} />
                        <Input label="Subjek" hint="Ringkasan singkat" value={subject} onChange={setSubject} icon="document-text-outline"/>
                        <View style={{ height: 16 }} />
                        <Input label="Pesan Anda" hint="Ceritakan lebih detail..." value={message} onChange={setMessage} icon="chatbox-outline" multiline numberOfLines={5}/>
                        
                        <View style={{ height: 24 }} />
                        
                        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={isLoading}>
                             {isLoading ? <ActivityIndicator color="white"/> : <Text style={styles.submitText}>Kirim Umpan Balik</Text>}
                        </TouchableOpacity>
                    </View>
                </Section>
                
                 <View style={{ height: 40 }} />
            </ScrollView>
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

function QuickTile({ title, subtitle, icon, color, onPress }: any) {
    return (
        <TouchableOpacity style={styles.quickTile} onPress={onPress}>
            <View style={[styles.quickIconBox, { backgroundColor: `${color}1A` }]}>
                <Ionicons name={icon} size={24} color={color} />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.tileTitle}>{title}</Text>
                <Text style={styles.tileSubtitle}>{subtitle}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </TouchableOpacity>
    )
}

function Input({ label, hint, value, onChange, icon, multiline, numberOfLines, keyboardType }: any) {
    return (
        <View>
             <Text style={styles.inputLabel}>{label}</Text>
             <View style={[styles.inputBox, multiline && { alignItems: 'flex-start' }]}>
                 <Ionicons name={icon} size={20} color="#6B7280" style={{ marginRight: 10, marginTop: multiline ? 12 : 0 }} />
                 <TextInput 
                    style={[styles.textInput, multiline && { height: 100, textAlignVertical: 'top', paddingTop: 10 }]}
                    placeholder={hint}
                    placeholderTextColor="#9CA3AF"
                    value={value}
                    onChangeText={onChange}
                    multiline={multiline}
                    numberOfLines={numberOfLines}
                    keyboardType={keyboardType}
                 />
             </View>
        </View>
    )
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
      color: '#1E1E1E',
      marginLeft: 16,
  },
  content: {
      padding: 16,
  },
  sectionContainer: {
      marginBottom: 0,
  },
  sectionTitle: {
      fontSize: 16,
      fontFamily: 'Poppins-Bold',
      color: '#1F2937',
      marginBottom: 12,
  },
  sectionCard: {
      backgroundColor: 'white',
      borderRadius: 16,
      padding: 16,
      shadowColor: 'black',
      shadowOpacity: 0.05,
      shadowRadius: 10,
      elevation: 2,
  },
  quickTile: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
      paddingVertical: 4,
  },
  quickIconBox: {
      width: 48,
      height: 48,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
  },
  tileTitle: {
      fontSize: 16,
      fontFamily: 'Poppins-SemiBold',
      color: '#1F2937',
      marginBottom: 2,
  },
  tileSubtitle: {
      fontSize: 13,
      fontFamily: 'Poppins-Regular',
      color: '#6B7280',
  },
  ratingContainer: {
      alignItems: 'center',
      padding: 8,
  },
  ratingQuestion: {
      fontSize: 16,
      fontFamily: 'Poppins-Medium',
      color: '#1F2937',
      textAlign: 'center',
      marginBottom: 16,
  },
  starsRow: {
      flexDirection: 'row',
      marginBottom: 12,
  },
  ratingLabel: {
      fontSize: 14,
      fontFamily: 'Poppins-Medium',
      color: '#6B7280',
  },
  formContainer: {
      width: '100%',
  },
  inputLabel: {
      fontSize: 14,
      fontFamily: 'Poppins-Medium',
      color: '#374151',
      marginBottom: 6,
  },
  inputBox: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#F9FAFB',
      borderWidth: 1,
      borderColor: '#E5E7EB',
      borderRadius: 12,
      paddingHorizontal: 16,
      height: 50,
  },
  textInput: {
      flex: 1,
      fontFamily: 'Poppins-Regular',
      fontSize: 14,
      color: '#1F2937',
  },
  submitButton: {
      backgroundColor: '#3B82F6',
      borderRadius: 12,
      height: 50,
      justifyContent: 'center',
      alignItems: 'center',
  },
  submitText: {
      fontSize: 16,
      fontFamily: 'Poppins-SemiBold',
      color: 'white',
  },
});
