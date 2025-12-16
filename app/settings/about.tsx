import { Ionicons } from '@expo/vector-icons';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AboutScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar style="dark" />
            
            <View style={styles.appBar}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#1E1E1E" />
                </TouchableOpacity>
                <Text style={styles.appBarTitle}>Tentang</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                
                <Section title="Informasi Aplikasi">
                    <InfoTile label="Nama Aplikasi" value="Jelantik App" />
                    <Separator />
                    <InfoTile label="Versi" value="1.0.0" />
                    <Separator />
                    <InfoTile label="Build Number" value="1" />
                    <Separator />
                    <InfoTile label="Terakhir Diperbarui" value="September 2025" />
                </Section>

                <View style={{ height: 24 }} />

                <Section title="Informasi Perusahaan">
                    <InfoTile label="Perusahaan" value="PT. Artacom Indo Jejaring" />
                    <Separator />
                    <InfoTile label="Alamat" value="Bekasi, Jawa Barat, Indonesia" />
                    <Separator />
                    <InfoTile label="Email" value="info@jelantik.com" />
                    <Separator />
                    <InfoTile label="Website" value="www.jelantik.com" />
                </Section>

                <View style={{ height: 24 }} />

                <Section title="Ikuti Kami">
                    <SocialTile title="Instagram" subtitle="@artacomindojejaring" icon="📷" onPress={() => console.log('IG')} />
                    <Separator />
                    <SocialTile title="Twitter / X" subtitle="@artacomindo" icon="🐦" onPress={() => console.log('X')} />
                    <Separator />
                    <SocialTile title="Website" subtitle="www.jelantik.com" icon="🌐" onPress={() => console.log('Web')} />
                </Section>

                <View style={{ height: 24 }} />

                <Section title="Legal">
                    <ActionTile 
                        title="Syarat dan Ketentuan"
                        subtitle="Baca syarat dan ketentuan kami"
                        icon="📝"
                        onPress={() => router.push('/settings/legal/terms')}
                    />
                    <Separator />
                    <ActionTile 
                        title="Kebijakan Privasi"
                        subtitle="Pelajari cara kami melindungi data Anda"
                        icon="🔒"
                        onPress={() => router.push('/settings/legal/privacy')}
                    />
                    <Separator />
                    <ActionTile 
                        title="Lisensi Open Source"
                        subtitle="Lihat lisensi pihak ketiga"
                        icon="📜"
                        onPress={() => router.push('/settings/legal/license')}
                    />
                </Section>

                <View style={{ height: 24 }} />

                <View style={styles.logoSection}>
                    <View style={styles.logoContainer}>
                        <Text style={{ fontSize: 40 }}>📶</Text>
                    </View>
                    <Text style={styles.logoText}>Jelantik App</Text>
                    <Text style={styles.logoSubtext}>Pendamping layanan internet terpercaya Anda</Text>
                    <Text style={styles.copyright}>© 2025 PT. Artacom Indo Jejaring{'\n'}Semua hak dilindungi undang-undang</Text>
                </View>

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

function InfoTile({ label, value }: { label: string, value: string }) {
    return (
        <View style={styles.tile}>
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.value}>{value}</Text>
        </View>
    )
}

function SocialTile({ title, subtitle, icon, onPress }: any) {
    return (
        <TouchableOpacity style={styles.tile} onPress={onPress}>
            <View style={styles.iconBox}>
                <Text>{icon}</Text>
            </View>
             <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.tileTitle}>{title}</Text>
                <Text style={styles.tileSubtitle}>{subtitle}</Text>
            </View>
            <Text>↗️</Text>
        </TouchableOpacity>
    )
}

function ActionTile({ title, subtitle, icon, onPress }: any) {
    return (
        <TouchableOpacity style={styles.tile} onPress={onPress}>
            <View style={[styles.iconBox, { backgroundColor: '#F3F4F6' }]}>
                <Text>{icon}</Text>
            </View>
             <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.tileTitle}>{title}</Text>
                <Text style={styles.tileSubtitle}>{subtitle}</Text>
            </View>
            <Text style={{ fontSize: 18, color: '#9CA3AF' }}>›</Text>
        </TouchableOpacity>
    )
}

function Separator() { return <View style={styles.separator} /> }

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
  tile: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      justifyContent: 'space-between',
  },
  label: {
      fontSize: 16,
      color: '#1E1E1E',
      fontFamily: 'Poppins-Medium',
  },
  value: {
      fontSize: 16,
      color: '#6B7280',
      fontFamily: 'Poppins-Regular',
  },
  separator: {
      height: 1,
      backgroundColor: '#F0F3FF',
      marginHorizontal: 16,
  },
  iconBox: {
      padding: 8,
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      borderRadius: 8,
  },
  tileTitle: {
      fontSize: 16,
      fontFamily: 'Poppins-Medium',
      color: '#1E1E1E',
  },
  tileSubtitle: {
      fontSize: 14,
      color: '#6B7280',
      fontFamily: 'Poppins-Regular',
  },
  logoSection: {
      backgroundColor: 'white',
      padding: 24,
      borderRadius: 14,
      alignItems: 'center',
      shadowColor: 'black',
      shadowOpacity: 0.05,
      shadowRadius: 10,
      elevation: 2,
  },
  logoContainer: {
      width: 80,
      height: 80,
      backgroundColor: '#3B82F6',
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 16,
  },
  logoText: {
      fontSize: 24,
      fontFamily: 'Poppins-Bold',
      color: '#1E1E1E',
      marginBottom: 8,
  },
  logoSubtext: {
      fontSize: 16,
      color: '#6B7280',
      textAlign: 'center',
      fontFamily: 'Poppins-Regular',
      marginBottom: 16,
  },
  copyright: {
      fontSize: 14,
      color: '#9CA3AF',
      textAlign: 'center',
      fontFamily: 'Poppins-Regular',
  },
});
