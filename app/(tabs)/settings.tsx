import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AuthService from '../services/authService';

export default function SettingsScreen() {
    const [hasPassword, setHasPassword] = useState(true); // Default true to avoid flash

    useEffect(() => {
        // Cek apakah user sudah punya password
        setHasPassword(AuthService.hasPassword());
    }, []);

    const handleLogout = () => {
        Alert.alert(
            "Logout",
            "Apakah Anda yakin ingin keluar?",
            [
                { text: "Batal", style: "cancel" },
                {
                    text: "Keluar",
                    style: "destructive",
                    onPress: async () => {
                        const result = await AuthService.logout();
                        if (result.success) {
                            router.replace('/(auth)/login');
                        } else {
                            Alert.alert("Gagal", result.message);
                        }
                    }
                }
            ]
        );
    };

    const navigateTo = (path: string) => {
        // Map simplified keys to actual routes
        const routes: { [key: string]: string } = {
            'profile-data': '/settings/profile-data',
            'help-center': '/settings/help-center',
            'about': '/settings/about',
            'feedback': '/settings/feedback',
        };

        const route = routes[path];
        if (route) {
            router.push(route as any);
        } else {
             Alert.alert("Info", `Navigasi ke ${path} belum diimplementasikan.`);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="dark" />
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Settings</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <Section title="My Data">
                    <SettingTile title="Profile Data" onPress={() => navigateTo('profile-data')} />
                    <Separator />
                    {!hasPassword && (
                        <>
                            <SettingTile title="Set Password" onPress={() => router.push('/settings/set-password' as any)} />
                            <Separator />
                        </>
                    )}
                    <SettingTile title="Help Center" onPress={() => navigateTo('help-center')} />
                </Section>

                <View style={{ height: 24 }} />

                <Section title="App Settings">
                    <SettingTile title="About" onPress={() => navigateTo('about')} />
                    <Separator />
                    <SettingTile title="Feedback" onPress={() => navigateTo('feedback')} />
                    <Separator />
                    <SettingTile title="Logout" onPress={handleLogout} isDestructive />
                </Section>
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
    );
}

function SettingTile({ title, onPress, isDestructive }: { title: string, onPress: () => void, isDestructive?: boolean }) {
    return (
        <TouchableOpacity style={styles.tile} onPress={onPress}>
            <Text style={[styles.tileText, isDestructive && styles.destructiveText]}>{title}</Text>
            <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>
    );
}

function Separator() {
    return <View style={styles.separator} />;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0F3FF',
    },
    header: {
        padding: 16,
        backgroundColor: '#F0F3FF', // Match body bg
    },
    headerTitle: {
        fontSize: 24,
        fontFamily: 'Poppins-Bold',
        color: '#1E1E1E',
    },
    content: {
        padding: 16,
    },
    sectionContainer: {
        marginBottom: 8,
    },
    sectionTitle: {
        fontSize: 16,
        fontFamily: 'Poppins-SemiBold',
        color: '#1E1E1E',
        marginBottom: 8,
        marginLeft: 16,
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
        justifyContent: 'space-between',
        paddingVertical: 14,
        paddingHorizontal: 16,
    },
    tileText: {
        fontSize: 16,
        fontFamily: 'Poppins-Medium',
        color: '#1E1E1E',
    },
    destructiveText: {
        color: '#B91C1C', // Red
    },
    chevron: {
        fontSize: 20,
        color: '#9CA3AF',
        fontWeight: '300',
    },
    separator: {
        height: 1,
        backgroundColor: '#F0F3FF',
        marginLeft: 16,
        marginRight: 16,
    },
});
