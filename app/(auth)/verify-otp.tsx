import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api } from '../../lib/apiService';
import AuthService from '../services/authService';

export default function VerifyOTPScreen() {
  const params = useLocalSearchParams<{ email: string }>();
  const email = params.email || '';

  const [otpCode, setOtpCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const handleVerify = async () => {
    if (!otpCode) {
      Alert.alert('Error', 'Kode verifikasi wajib diisi');
      return;
    }

    if (otpCode.length !== 8) {
      Alert.alert('Error', 'Kode verifikasi harus 8 digit');
      return;
    }

    setIsVerifying(true);

    try {
      const result = await AuthService.verifyOTP(email, otpCode);

      if (result.success) {
        // Sync ke backend (auto-create user di PostgreSQL)
        try {
          console.log('[OTP] Syncing user to backend...');
          await api.users.getMe();
          console.log('[OTP] User synced successfully');
        } catch (syncError: any) {
          console.warn('[OTP] Sync failed (non-blocking):', syncError.message);
        }

        Alert.alert('Berhasil', 'Email berhasil diverifikasi!', [
          {
            text: 'OK',
            onPress: () => router.replace('/(tabs)')
          }
        ]);
      } else {
        Alert.alert('Verifikasi Gagal', result.message);
      }
    } catch {
      Alert.alert('Error', 'Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);

    try {
      const result = await AuthService.resendOTP(email);

      if (result.success) {
        Alert.alert('Berhasil', result.message);
      } else {
        Alert.alert('Gagal', result.message);
      }
    } catch {
      Alert.alert('Error', 'Gagal mengirim ulang kode.');
    } finally {
      setIsResending(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <View style={{ height: 80 }} />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Image source={require('../../assets/images/Jelantik_Logo.png')} style={styles.logo} resizeMode="contain" />
            <Text style={styles.title}>Verify Your Email</Text>
            <Text style={styles.subtitle}>
              Kami telah mengirimkan kode 8-digit ke{'\n'}
              <Text style={styles.emailText}>{email}</Text>
            </Text>
          </View>

          {/* OTP Input */}
          <View style={styles.otpContainer}>
            <TextInput
              style={styles.otpInput}
              placeholder="00000000"
              placeholderTextColor="rgba(0,0,0,0.3)"
              value={otpCode}
              onChangeText={(text) => {
                // Only allow numbers and max 8 digits
                const numericText = text.replace(/[^0-9]/g, '').slice(0, 8);
                setOtpCode(numericText);
              }}
              keyboardType="number-pad"
              maxLength={8}
              textAlign="center"
              autoFocus
            />
          </View>

          {/* Verify Button */}
          <TouchableOpacity
            style={[styles.verifyButton, (!otpCode || otpCode.length !== 8) && styles.verifyButtonDisabled]}
            onPress={handleVerify}
            disabled={!otpCode || otpCode.length !== 8 || isVerifying}
          >
            <Text style={styles.verifyButtonText}>
              {isVerifying ? 'Memverifikasi...' : 'Verify'}
            </Text>
          </TouchableOpacity>

          {/* Resend Link */}
          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>Tidak menerima kode? </Text>
            <TouchableOpacity
              onPress={handleResend}
              disabled={isResending}
            >
              <Text style={styles.resendLink}>
                {isResending ? 'Mengirim...' : 'Kirim Ulang'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Back Button */}
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons name="arrow-back" size={20} color="#1E3A8A" />
            <Text style={styles.backButtonText}>Kembali</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
    paddingHorizontal: 40,
    paddingVertical: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 60,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#1F2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: 'rgba(0,0,0,0.6)',
    textAlign: 'center',
    lineHeight: 20,
  },
  emailText: {
    fontFamily: 'Poppins-SemiBold',
    color: '#1E3A8A',
  },
  otpContainer: {
    marginBottom: 32,
  },
  otpInput: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    height: 64,
    fontSize: 28,
    fontFamily: 'Poppins-SemiBold',
    color: '#1F2937',
    letterSpacing: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  verifyButton: {
    backgroundColor: '#1E3A8A',
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#1E3A8A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 24,
  },
  verifyButtonDisabled: {
    backgroundColor: '#9CA3AF',
    shadowOpacity: 0,
  },
  verifyButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  resendText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: 'rgba(0,0,0,0.6)',
  },
  resendLink: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#1E3A8A',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  backButtonText: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#1E3A8A',
    marginLeft: 8,
  },
});
