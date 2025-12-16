import { Ionicons } from '@expo/vector-icons';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LicenseScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar style="dark" />

            <View style={styles.appBar}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#1E1E1E" />
                </TouchableOpacity>
                <Text style={styles.appBarTitle}>Lisensi Opensource</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {/* Header */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>📄 Lisensi Opensource</Text>
                    <Text style={styles.cardText}>
                        Aplikasi Jelantik Internet dibangun menggunakan berbagai library dan komponen opensource. Terima kasih kepada para pengembang yang telah berkontribusi.
                    </Text>
                </View>

                {/* React Native */}
                <View style={styles.card}>
                    <Text style={styles.licenseTitle}>React Native</Text>
                    <Text style={styles.licenseVersion}>Version 0.73.x</Text>
                    <Text style={styles.licenseType}>MIT License</Text>
                    <Text style={styles.licenseDesc}>
                        Framework untuk membangun aplikasi native iOS dan Android menggunakan React.
                    </Text>
                    <TouchableOpacity style={styles.licenseButton}>
                        <Ionicons name="open" size={16} color="#3B82F6" />
                        <Text style={styles.licenseButtonText}>View License</Text>
                    </TouchableOpacity>
                </View>

                {/* Expo */}
                <View style={styles.card}>
                    <Text style={styles.licenseTitle}>Expo SDK</Text>
                    <Text style={styles.licenseVersion}>Version 51.x</Text>
                    <Text style={styles.licenseType}>MIT License</Text>
                    <Text style={styles.licenseDesc}>
                        Platform dan framework untuk pengembangan aplikasi universal.
                    </Text>
                    <TouchableOpacity style={styles.licenseButton}>
                        <Ionicons name="open" size={16} color="#3B82F6" />
                        <Text style={styles.licenseButtonText}>View License</Text>
                    </TouchableOpacity>
                </View>

                {/* Navigation */}
                <View style={styles.card}>
                    <Text style={styles.licenseTitle}>Expo Router</Text>
                    <Text style={styles.licenseVersion}>Version 6.x</Text>
                    <Text style={styles.licenseType}>MIT License</Text>
                    <Text style={styles.licenseDesc}>
                        File-based routing untuk React Native applications.
                    </Text>
                    <TouchableOpacity style={styles.licenseButton}>
                        <Ionicons name="open" size={16} color="#3B82F6" />
                        <Text style={styles.licenseButtonText}>View License</Text>
                    </TouchableOpacity>
                </View>

                {/* Icons */}
                <View style={styles.card}>
                    <Text style={styles.licenseTitle}>Expo Vector Icons</Text>
                    <Text style={styles.licenseType}>MIT License</Text>
                    <Text style={styles.licenseDesc}>
                        Icon library yang kompatibel dengan React Native.
                    </Text>
                    <TouchableOpacity style={styles.licenseButton}>
                        <Ionicons name="open" size={16} color="#3B82F6" />
                        <Text style={styles.licenseButtonText}>View License</Text>
                    </TouchableOpacity>
                </View>

                {/* UI Components */}
                <View style={styles.card}>
                    <Text style={styles.licenseTitle}>React Native Elements</Text>
                    <Text style={styles.licenseType}>MIT License</Text>
                    <Text style={styles.licenseDesc}>
                        UI toolkit untuk React Native dengan components yang telah dikustomisasi.
                    </Text>
                    <TouchableOpacity style={styles.licenseButton}>
                        <Ionicons name="open" size={16} color="#3B82F6" />
                        <Text style={styles.licenseButtonText}>View License</Text>
                    </TouchableOpacity>
                </View>

                {/* Animation */}
                <View style={styles.card}>
                    <Text style={styles.licenseTitle}>React Native Reanimated</Text>
                    <Text style={styles.licenseType}>MIT License</Text>
                    <Text style={styles.licenseDesc}>
                        Library animasi untuk React Native yang lebih performant.
                    </Text>
                    <TouchableOpacity style={styles.licenseButton}>
                        <Ionicons name="open" size={16} color="#3B82F6" />
                        <Text style={styles.licenseButtonText}>View License</Text>
                    </TouchableOpacity>
                </View>

                {/* Image Picker */}
                <View style={styles.card}>
                    <Text style={styles.licenseTitle}>Expo Image Picker</Text>
                    <Text style={styles.licenseType}>MIT License</Text>
                    <Text style={styles.licenseDesc}>
                        Module untuk mengakses kamera dan galeri foto.
                    </Text>
                    <TouchableOpacity style={styles.licenseButton}>
                        <Ionicons name="open" size={16} color="#3B82F6" />
                        <Text style={styles.licenseButtonText}>View License</Text>
                    </TouchableOpacity>
                </View>

                {/* Linear Gradient */}
                <View style={styles.card}>
                    <Text style={styles.licenseTitle}>Expo Linear Gradient</Text>
                    <Text style={styles.licenseType}>MIT License</Text>
                    <Text style={styles.licenseDesc}>
                        Component untuk membuat gradient backgrounds.
                    </Text>
                    <TouchableOpacity style={styles.licenseButton}>
                        <Ionicons name="open" size={16} color="#3B82F6" />
                        <Text style={styles.licenseButtonText}>View License</Text>
                    </TouchableOpacity>
                </View>

                {/* Safe Area Context */}
                <View style={styles.card}>
                    <Text style={styles.licenseTitle}>React Native Safe Area Context</Text>
                    <Text style={styles.licenseType}>MIT License</Text>
                    <Text style={styles.licenseDesc}>
                        Flexible system untuk menangani safe area insets.
                    </Text>
                    <TouchableOpacity style={styles.licenseButton}>
                        <Ionicons name="open" size={16} color="#3B82F6" />
                        <Text style={styles.licenseButtonText}>View License</Text>
                    </TouchableOpacity>
                </View>

                {/* Status Bar */}
                <View style={styles.card}>
                    <Text style={styles.licenseTitle}>Expo Status Bar</Text>
                    <Text style={styles.licenseType}>MIT License</Text>
                    <Text style={styles.licenseDesc}>
                        Control status bar configuration dan style.
                    </Text>
                    <TouchableOpacity style={styles.licenseButton}>
                        <Ionicons name="open" size={16} color="#3B82F6" />
                        <Text style={styles.licenseButtonText}>View License</Text>
                    </TouchableOpacity>
                </View>

                {/* Splash Screen */}
                <View style={styles.card}>
                    <Text style={styles.licenseTitle}>Expo Splash Screen</Text>
                    <Text style={styles.licenseType}>MIT License</Text>
                    <Text style={styles.licenseDesc}>
                        Customizable splash screen API.
                    </Text>
                    <TouchableOpacity style={styles.licenseButton}>
                        <Ionicons name="open" size={16} color="#3B82F6" />
                        <Text style={styles.licenseButtonText}>View License</Text>
                    </TouchableOpacity>
                </View>

                {/* Fonts */}
                <View style={styles.card}>
                    <Text style={styles.licenseTitle}>Poppins Font Family</Text>
                    <Text style={styles.licenseType}>SIL Open Font License 1.1</Text>
                    <Text style={styles.licenseDesc}>
                        Geometric sans-serif typeface designed by Indian Type Foundry.
                    </Text>
                    <TouchableOpacity style={styles.licenseButton}>
                        <Ionicons name="open" size={16} color="#3B82F6" />
                        <Text style={styles.licenseButtonText}>View License</Text>
                    </TouchableOpacity>
                </View>

                {/* Additional Libraries */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>📚 Library Tambahan</Text>
                    <View style={styles.libraryList}>
                        <View style={styles.libraryItem}>
                            <Text style={styles.libraryName}>Expo Linking</Text>
                            <Text style={styles.libraryLicense}>MIT License</Text>
                        </View>
                        <View style={styles.libraryItem}>
                            <Text style={styles.libraryName}>Expo Font</Text>
                            <Text style={styles.libraryLicense}>MIT License</Text>
                        </View>
                        <View style={styles.libraryItem}>
                            <Text style={styles.libraryName}>@react-navigation/native</Text>
                            <Text style={styles.libraryLicense}>MIT License</Text>
                        </View>
                        <View style={styles.libraryItem}>
                            <Text style={styles.libraryName}>React Native Screens</Text>
                            <Text style={styles.libraryLicense}>MIT License</Text>
                        </View>
                        <View style={styles.libraryItem}>
                            <Text style={styles.libraryName}>React Native Gesture Handler</Text>
                            <Text style={styles.libraryLicense}>MIT License</Text>
                        </View>
                    </View>
                </View>

                {/* Attribution */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>🙏 Attribusi</Text>
                    <Text style={styles.attributionText}>
                        Kami berterima kasih kepada semua kontributor opensource yang telah membuat library-library ini tersedia. Tanpa kontribusi Anda, aplikasi ini tidak akan mungkin ada.
                    </Text>
                    <View style={styles.attributionNote}>
                        <Text style={styles.attributionTitle}>Informasi Lisensi</Text>
                        <Text style={styles.attributionDesc}>
                            • Semua library opensource digunakan sesuai dengan lisensi masing-masing{'\n'}
                            • Source code aplikasi ini juga akan tersedia secara opensource{'\n'}
                            • Untuk informasi lebih lanjut tentang lisensi, hubungi legal@ajnusa.com
                        </Text>
                    </View>
                </View>

                {/* Contact */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>📞 Pertanyaan?</Text>
                    <Text style={styles.cardText}>
                        Jika Anda memiliki pertanyaan tentang lisensi atau penggunaan opensource:
                    </Text>
                    <View style={styles.contactInfo}>
                        <Text style={styles.contactItem}>📧 Email: ahmad@ajnusa.com</Text>
                        <Text style={styles.contactItem}>🔗 GitHub: github.com/jelantik/mobile-app</Text>
                        <Text style={styles.contactItem}>📄 Source Code: Akan segera tersedia</Text>
                    </View>
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
        marginBottom: 16,
    },
    licenseTitle: {
        fontSize: 16,
        fontFamily: 'Poppins-SemiBold',
        color: '#1F2937',
        marginBottom: 4,
    },
    licenseVersion: {
        fontSize: 13,
        color: '#3B82F6',
        fontFamily: 'Poppins-Medium',
        marginBottom: 4,
    },
    licenseType: {
        fontSize: 13,
        color: '#10B981',
        fontFamily: 'Poppins-Medium',
        marginBottom: 8,
    },
    licenseDesc: {
        fontSize: 14,
        color: '#6B7280',
        fontFamily: 'Poppins-Regular',
        lineHeight: 20,
        marginBottom: 12,
    },
    licenseButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        borderRadius: 8,
        padding: 10,
        alignSelf: 'flex-start',
    },
    licenseButtonText: {
        fontSize: 14,
        color: '#3B82F6',
        fontFamily: 'Poppins-Medium',
        marginLeft: 8,
    },
    libraryList: {
        marginTop: 12,
    },
    libraryItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
    },
    libraryName: {
        fontSize: 14,
        fontFamily: 'Poppins-Medium',
        color: '#1F2937',
        flex: 1,
    },
    libraryLicense: {
        fontSize: 13,
        color: '#6B7280',
        fontFamily: 'Poppins-Regular',
    },
    attributionText: {
        fontSize: 14,
        color: '#6B7280',
        fontFamily: 'Poppins-Regular',
        lineHeight: 20,
        marginBottom: 16,
    },
    attributionNote: {
        backgroundColor: '#EBF5FF',
        borderRadius: 12,
        padding: 16,
    },
    attributionTitle: {
        fontSize: 15,
        fontFamily: 'Poppins-SemiBold',
        color: '#1E3A8A',
        marginBottom: 8,
    },
    attributionDesc: {
        fontSize: 14,
        color: '#1E3A8A',
        fontFamily: 'Poppins-Regular',
        lineHeight: 20,
    },
    contactInfo: {
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        padding: 16,
        marginTop: 16,
    },
    contactItem: {
        fontSize: 14,
        color: '#1F2937',
        fontFamily: 'Poppins-Regular',
        marginBottom: 8,
    },
});