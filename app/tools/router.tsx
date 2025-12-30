import { Ionicons } from '@expo/vector-icons';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import {
    Alert,
    Animated,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RouterSetupScreen() {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;

    const [ssid, setSsid] = useState('');
    const [password, setPassword] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    
    const [obscureNewPassword, setObscureNewPassword] = useState(true);
    const [obscureCurrentPassword, setObscureCurrentPassword] = useState(true);
    const [isConnecting, setIsConnecting] = useState(false);

    // Dialog States
    const [activeDialog, setActiveDialog] = useState<string | null>(null);

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 600,
                useNativeDriver: true,
            })
        ]).start();
    }, []);

    const handleApplySettings = () => {
        if (!ssid || !password || !currentPassword) {
            Alert.alert('Error', 'Semua field harus diisi');
            return;
        }

        if (password.length < 8) {
            Alert.alert('Error', 'Password minimal 8 karakter');
            return;
        }

        setIsConnecting(true);

        // Simulated connection process
        setTimeout(() => {
            setIsConnecting(false);
            setActiveDialog('success');
        }, 3000);
    };

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar style="dark" />

            {/* AppBar */}
            <View style={styles.appBar}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#1F2937" />
                </TouchableOpacity>
                <Text style={styles.appBarTitle}>Pengaturan Router/ONT</Text>
                <View style={{ width: 40 }} />
            </View>

            <Animated.ScrollView 
                contentContainerStyle={styles.content}
                style={{
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }]
                }}
            >
                {/* Header Section */}
                <View style={styles.sectionCard}>
                    <View style={styles.headerRow}>
                        <View style={styles.headerIconContainer}>
                            <Ionicons name="wifi" size={28} color="#3B82F6" />
                        </View>
                        <View style={styles.headerTextContainer}>
                            <Text style={styles.sectionTitle}>Pengaturan Router/ONT</Text>
                            <Text style={styles.sectionSubtitle}>Kelola SSID dan password WiFi Anda</Text>
                        </View>
                    </View>
                </View>

                {/* Quick Guides */}
                <Text style={styles.sectionLabel}>Panduan Cepat</Text>
                <GuideTile 
                    title="Cek Default Login" 
                    subtitle="Cara login ke router/ONT Anda" 
                    icon="log-in" 
                    color="#10B981" 
                    onPress={() => setActiveDialog('defaultLogin')}
                />
                <GuideTile 
                    title="Akses Router Web" 
                    subtitle="Buka panel admin via browser" 
                    icon="globe" 
                    color="#8B5CF6" 
                    onPress={() => setActiveDialog('webAccess')}
                />
                <GuideTile 
                    title="Troubleshooting" 
                    subtitle="Solusi masalah koneksi umum" 
                    icon="construct" 
                    color="#F59E0B" 
                    onPress={() => setActiveDialog('troubleshooting')}
                />

                {/* Settings Form */}
                {/* <Text style={styles.sectionLabel}>Ubah Pengaturan WiFi</Text>
                
                <FormTile icon="wifi" title="Nama SSID" subtitle="Nama jaringan WiFi Anda">
                    <CustomInput 
                        placeholder="Masukkan Nama SSID" 
                        value={ssid}
                        onChangeText={setSsid}
                    />
                </FormTile>

                <FormTile icon="lock-closed" title="Password Baru" subtitle="Password minimal 8 karakter">
                    <CustomInput 
                        placeholder="Masukkan Password Baru" 
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={obscureNewPassword}
                        onToggleSecure={() => setObscureNewPassword(!obscureNewPassword)}
                    />
                </FormTile>

                <FormTile icon="shield-checkmark" title="Password Saat Ini" subtitle="Masukkan password router untuk konfirmasi">
                    <CustomInput 
                        placeholder="Masukkan Password Saat Ini" 
                        value={currentPassword}
                        onChangeText={setCurrentPassword}
                        secureTextEntry={obscureCurrentPassword}
                        onToggleSecure={() => setObscureCurrentPassword(!obscureCurrentPassword)}
                    />
                </FormTile> */}

                <View style={{ height: 32 }} />

                {/* Action Button */}
                {/* <TouchableOpacity 
                    style={[styles.actionButton, isConnecting && styles.disabledButton]} 
                    onPress={handleApplySettings}
                    disabled={isConnecting}
                >
                    {isConnecting ? (
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <ActivityIndicator color="white" size="small" style={{ marginRight: 12 }} />
                            <Text style={styles.actionButtonText}>Menghubungkan...</Text>
                        </View>
                    ) : (
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Ionicons name="wifi" size={24} color="white" style={{ marginRight: 8 }} />
                            <Text style={styles.actionButtonText}>Terapkan Pengaturan</Text>
                        </View>
                    )}
                </TouchableOpacity> */}
                
                <View style={{ height: 40 }} />
            </Animated.ScrollView>

            {/* Custom Dialogs */}
            <InfoDialog 
                visible={activeDialog === 'defaultLogin'}
                onClose={() => setActiveDialog(null)}
                title="Login Default Router/ONT"
                content={`Kebanyakan router/ONT memiliki login default:\n\n1. Username: admin / user / root\n2. Password: admin / password / 123456\n3. Router Address: 192.168.1.1 atau 192.168.0.1\n\nCek label bawah router untuk informasi lebih detail.`}
            />
            
            <InfoDialog 
                visible={activeDialog === 'webAccess'}
                onClose={() => setActiveDialog(null)}
                title="Akses Web Router"
                content={`Langkah-langkah akses web admin:\n\n1. Hubungkan device ke WiFi router\n2. Buka browser (Chrome, Firefox, dll)\n3. Masuk ke alamat:\n   • 192.168.1.1 (umumnya)\n   • 192.168.0.1 (alternatif)\n4. Login dengan username dan password\n5. Cari menu WiFi/Wireless Settings\n6. Ubah SSID dan password`}
            />

            <InfoDialog 
                visible={activeDialog === 'troubleshooting'}
                onClose={() => setActiveDialog(null)}
                title="Troubleshooting"
                content={`Masalah umum dan solusi:\n\n🔹 Tidak bisa login:\n   • Reset router ke factory settings\n   • Coba password default (admin/password)\n   • Hubungi ISP untuk bantuan\n\n🔹 Halaman tidak muncul:\n   • Pastikan koneksi WiFi stabil\n   • Coba browser berbeda\n   • Clear cache browser\n   • Restart router\n\n🔹 Lupa password:\n   • Reset router ke factory settings\n   • Hubungi customer support`}
            />

            <SuccessDialog 
                visible={activeDialog === 'success'}
                onClose={() => { setActiveDialog(null); router.back(); }}
            />

        </SafeAreaView>
    );
}

// Components

function GuideTile({ title, subtitle, icon, color, onPress }: any) {
    return (
        <TouchableOpacity style={styles.guideTile} onPress={onPress}>
            <View style={[styles.iconBox, { backgroundColor: `${color}1A` }]}>
                <Ionicons name={icon} size={24} color={color} />
            </View>
            <View style={{ flex: 1, marginLeft: 16 }}>
                <Text style={styles.tileTitle}>{title}</Text>
                <Text style={styles.tileSubtitle}>{subtitle}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#6B7280" />
        </TouchableOpacity>
    );
}

function FormTile({ icon, title, subtitle, children }: any) {
    return (
        <View style={styles.formTile}>
            <View style={{ flexDirection: 'row', marginBottom: 16 }}>
                <View style={[styles.iconBox, { backgroundColor: '#EFF6FF' }]}>
                    <Ionicons name={icon} size={24} color="#3B82F6" />
                </View>
                <View style={{ flex: 1, marginLeft: 16 }}>
                    <Text style={styles.tileTitle}>{title}</Text>
                    <Text style={styles.tileSubtitle}>{subtitle}</Text>
                </View>
            </View>
            {children}
        </View>
    );
}

function CustomInput({ placeholder, value, onChangeText, secureTextEntry, onToggleSecure }: any) {
    return (
        <View style={styles.inputContainer}>
            <TextInput
                style={styles.input}
                placeholder={placeholder}
                placeholderTextColor="#9CA3AF"
                value={value}
                onChangeText={onChangeText}
                secureTextEntry={secureTextEntry}
            />
            {onToggleSecure && (
                <TouchableOpacity onPress={onToggleSecure} style={{ padding: 8 }}>
                    <Ionicons name={secureTextEntry ? "eye-off" : "eye"} size={20} color="#9CA3AF" />
                </TouchableOpacity>
            )}
        </View>
    );
}

function InfoDialog({ visible, onClose, title, content }: any) {
    return (
        <Modal transparent visible={visible} animationType="fade">
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>{title}</Text>
                    <ScrollView style={{ maxHeight: 300 }}>
                        <Text style={styles.modalText}>{content}</Text>
                    </ScrollView>
                    <View style={styles.modalActions}>
                        <TouchableOpacity onPress={onClose} style={styles.modalButton}>
                            <Text style={styles.modalButtonText}>OK</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

function SuccessDialog({ visible, onClose }: any) {
    return (
        <Modal transparent visible={visible} animationType="fade">
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={{ alignItems: 'center' }}>
                        <Ionicons name="checkmark-circle" size={64} color="#10B981" />
                        <Text style={[styles.modalTitle, { marginTop: 16 }]}>Berhasil!</Text>
                        <Text style={[styles.modalText, { textAlign: 'center' }]}>
                            Pengaturan WiFi berhasil diterapkan!{'\n'}
                            Perangkat Anda akan otomatis terhubung ke jaringan baru.
                        </Text>
                    </View>
                    <View style={[styles.modalActions, { justifyContent: 'center', marginTop: 24 }]}>
                         <TouchableOpacity onPress={onClose} style={styles.modalButton}>
                            <Text style={styles.modalButtonText}>OK</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
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
        justifyContent: 'space-between',
    },
    backButton: {
        backgroundColor: 'white',
        padding: 8,
        borderRadius: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    appBarTitle: {
        fontSize: 18,
        fontFamily: 'Poppins-SemiBold',
        color: '#1F2937',
    },
    content: {
        padding: 24,
        paddingBottom: 40,
    },
    sectionCard: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 24,
        marginBottom: 32,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerIconContainer: {
        backgroundColor: '#EFF6FF',
        padding: 12,
        borderRadius: 12,
    },
    headerTextContainer: {
        marginLeft: 16,
        flex: 1,
    },
    sectionTitle: {
        fontSize: 18,
        fontFamily: 'Poppins-SemiBold',
        color: '#1F2937',
    },
    sectionSubtitle: {
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
        color: '#6B7280',
        marginTop: 4,
    },
    sectionLabel: {
        fontSize: 18,
        fontFamily: 'Poppins-SemiBold',
        color: '#1F2937',
        marginBottom: 16,
        marginLeft: 4,
    },
    guideTile: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: 'black',
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 1,
    },
    formTile: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        shadowColor: 'black',
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 1,
    },
    iconBox: {
        padding: 12,
        borderRadius: 12,
    },
    tileTitle: {
        fontSize: 16,
        fontFamily: 'Poppins-SemiBold',
        color: '#1F2937',
    },
    tileSubtitle: {
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
        color: '#6B7280',
        marginTop: 4,
    },
    inputContainer: {
        backgroundColor: '#F9FAFB',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 4,
    },
    input: {
        flex: 1,
        padding: 12,
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
        color: '#1F2937',
    },
    actionButton: {
        backgroundColor: '#3B82F6',
        borderRadius: 20,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#3B82F6',
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 5,
    },
    disabledButton: {
        backgroundColor: '#9CA3AF',
        shadowOpacity: 0,
    },
    actionButtonText: {
        color: 'white',
        fontSize: 18,
        fontFamily: 'Poppins-SemiBold',
        letterSpacing: 0.5,
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: 24,
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 24,
        shadowColor: 'black',
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 18,
        fontFamily: 'Poppins-SemiBold',
        color: '#1F2937',
        marginBottom: 12,
    },
    modalText: {
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
        color: '#6B7280',
        lineHeight: 22,
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 24,
    },
    modalButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    modalButtonText: {
        color: '#3B82F6',
        fontFamily: 'Poppins-SemiBold',
        fontSize: 14,
    },
});
