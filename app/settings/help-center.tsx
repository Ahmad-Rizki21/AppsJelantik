import { Ionicons } from '@expo/vector-icons';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Animated, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useRef } from 'react';
import * as Linking from 'expo-linking';

export default function HelpCenterScreen() {
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start();
    }, []);

    const openLink = async (url: string) => {
        await Linking.openURL(url);
    };
    
    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar style="dark" />
            
            <View style={styles.appBar}>
                 <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <View style={styles.backBtnBg}>
                        <Ionicons name="arrow-back" size={20} color="#1F2937" />
                    </View>
                </TouchableOpacity>
                <Text style={styles.appBarTitle}>Customer Support</Text>
                <View style={{ width: 44 }} />
            </View>

            <Animated.View style={{ opacity: fadeAnim, flex: 1 }}>
                <ScrollView contentContainerStyle={styles.content}>
                
                {/* Header Section */}
                <View style={styles.headerCard}>
                    <View style={styles.headerRow}>
                        <View style={styles.headerIconBg}>
                            <Text style={{ fontSize: 28 }}>🎧</Text>
                        </View>
                        <View style={{ marginLeft: 16, flex: 1 }}>
                            <Text style={styles.headerTitle}>Hai, Ada yang bisa kami bantu?</Text>
                            <Text style={styles.headerSubtitle}>Tim support kami siap membantu Anda 24/7</Text>
                        </View>
                    </View>
                </View>

                <View style={{ height: 32 }} />

                {/* Quick Actions */}
                <Section title="Layanan Cepat">
                     <HelpTile
                        title="Hubungi Support"
                        subtitle="Chat langsung dengan tim support kami"
                        icon="🎧"
                        color="#10B981"
                        onPress={() => router.push('/support')}
                     />
                     <HelpTile
                        title="Lapor Gangguan"
                        subtitle="Laporkan masalah koneksi atau layanan"
                        icon="⚠️"
                        color="#F59E0B"
                        onPress={() => router.push('/support/report')}
                     />
                </Section>

                <View style={{ height: 32 }} />

                {/* FAQ */}
                <Section title="Pertanyaan Umum">
                     <HelpTile
                        title="Cara Pembayaran"
                        subtitle="Metode dan panduan pembayaran tagihan"
                        icon="💳"
                        color="#8B5CF6"
                        onPress={() => router.push('/guides/payment')}
                     />
                     <HelpTile
                        title="Troubleshooting Koneksi"
                        subtitle="Solusi masalah internet umum"
                        icon="📶"
                        color="#EF4444"
                        onPress={() => router.push('/guides/troubleshooting')}
                     />
                     <HelpTile
                        title="Upgrade Paket"
                        subtitle="Cara ubah atau tingkatkan paket internet"
                        icon="⬆️"
                        color="#06B6D4"
                        onPress={() => router.push('/guides/upgrade')}
                     />
                </Section>

                <View style={{ height: 32 }} />
                
                {/* Contact */}
                <Section title="Hubungi Kami">
                     <ContactTile 
                        title="WhatsApp Support" 
                        value="6282223616884" 
                        icon="💬"
                        color="#25D366"
                        onPress={() => openLink('https://wa.me/6282223616884')}
                     />
                     <ContactTile 
                        title="Email Support" 
                        value="support@ajnusa.com" 
                        icon="✉️"
                        color="#3B82F6"
                        onPress={() => openLink('mailto:support@ajnusa.com')}
                     />
                </Section>

                 <View style={{ height: 32 }} />

                {/* Documentation */}
                 <Section title="Dokumentasi">
                     <HelpTile
                        title="Panduan Pengguna"
                        subtitle="Tutorial lengkap penggunaan layanan"
                        icon="📚"
                        color="#6366F1"
                        onPress={() => router.push('/docs/user-guide')}
                     />
                     <HelpTile
                        title="Syarat & Ketentuan"
                        subtitle="Kebijakan layanan dan perjanjian"
                        icon="📝"
                        color="#64748B"
                        onPress={() => router.push('/settings/legal/terms')}
                     />
                     <HelpTile
                        title="Kebijakan Privasi"
                        subtitle="Perlindungan data pengguna"
                        icon="🔒"
                        color="#84CC16"
                        onPress={() => router.push('/settings/legal/privacy')}
                     />
                </Section>
                
                <View style={{ height: 40 }} />
                </ScrollView>
            </Animated.View>
        </SafeAreaView>
    );
}

function Section({ title, children }: { title: string, children: React.ReactNode }) {
    return (
        <View>
            <Text style={styles.sectionTitle}>{title}</Text>
            {children}
        </View>
    )
}

function HelpTile({ title, subtitle, icon, color, onPress }: any) {
    return (
        <TouchableOpacity style={styles.tile} onPress={onPress}>
            <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
                <Text style={{ fontSize: 20 }}>{icon}</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 16 }}>
                <Text style={styles.tileTitle}>{title}</Text>
                <Text style={styles.tileSubtitle}>{subtitle}</Text>
            </View>
            <Text style={{ color: '#6B7280', fontSize: 18 }}>›</Text>
        </TouchableOpacity>
    )
}

function ContactTile({ title, value, icon, color, onPress }: any) {
     return (
        <TouchableOpacity style={styles.tile} onPress={onPress}>
            <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
                 <Text style={{ fontSize: 20 }}>{icon}</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 16 }}>
                <Text style={styles.tileTitle}>{title}</Text>
                <Text style={styles.tileSubtitle}>{value}</Text>
            </View>
            <Text style={{ fontSize: 18 }}>↗️</Text>
        </TouchableOpacity>
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
    justifyContent: 'space-between',
  },
  backButton: {
      padding: 4,
  },
  backBtnBg: {
      backgroundColor: 'white',
      borderRadius: 12,
      padding: 8,
      shadowColor: 'black',
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
  },
  appBarTitle: {
      fontSize: 20,
      fontFamily: 'Poppins-SemiBold',
      color: '#1F2937',
  },
  content: {
      padding: 24,
  },
  headerCard: {
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 24,
      shadowColor: 'black',
      shadowOpacity: 0.05,
      shadowRadius: 10,
      elevation: 2,
  },
  headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
  },
  headerIconBg: {
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      padding: 12,
      borderRadius: 12,
  },
  headerTitle: {
      fontSize: 18,
      fontFamily: 'Poppins-SemiBold',
      color: '#1F2937',
      marginBottom: 4,
  },
  headerSubtitle: {
      fontSize: 14,
      color: '#6B7280',
      fontFamily: 'Poppins-Regular',
  },
  sectionTitle: {
      fontSize: 18,
      fontFamily: 'Poppins-SemiBold',
      color: '#1F2937',
      marginBottom: 16,
      marginLeft: 4,
  },
  tile: {
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
  iconContainer: {
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
      color: '#6B7280',
      fontFamily: 'Poppins-Regular',
  },
});
