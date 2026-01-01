import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AuthService from '../services/authService';

type Step = 'email' | 'otp' | 'success';

export default function ForgotPasswordScreen() {
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOTP = async () => {
    if (!email) {
      Alert.alert('Error', 'Email wajib diisi');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Format email tidak valid');
      return;
    }

    setIsLoading(true);

    try {
      const result = await AuthService.sendPasswordResetOTP(email);

      if (result.success) {
        Alert.alert('Berhasil', result.message, [
          { text: 'OK', onPress: () => setStep('otp') }
        ]);
      } else {
        Alert.alert('Gagal', result.message);
      }
    } catch (_error) {
      Alert.alert('Error', 'Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!otp) {
      Alert.alert('Error', 'Kode OTP wajib diisi');
      return;
    }

    if (!newPassword) {
      Alert.alert('Error', 'Password baru wajib diisi');
      return;
    }

    if (newPassword.length < 8) {
      Alert.alert('Error', 'Password minimal 8 karakter');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Password dan konfirmasi password tidak cocok');
      return;
    }

    setIsLoading(true);

    try {
      const result = await AuthService.resetPasswordWithOTP(email, otp, newPassword);

      if (result.success) {
        setStep('success');
      } else {
        Alert.alert('Gagal', result.message);
      }
    } catch (_error) {
      Alert.alert('Error', 'Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    router.replace('/(auth)/login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <View style={{ height: 40 }} />
          {/* Header */}
          <View style={styles.header}>
            <Image source={require('../../assets/images/Jelantik_Logo.png')} style={styles.logo} resizeMode="contain" />
            <Text style={styles.headerTitle}>Reset Password</Text>
            <Text style={styles.headerSubtitle}>
              {step === 'email' && 'Masukkan email untuk menerima kode OTP reset password'}
              {step === 'otp' && 'Masukkan kode OTP dan password baru'}
              {step === 'success' && 'Password berhasil diubah!'}
            </Text>
          </View>

          {/* Content based on step */}
          {step === 'email' && (
            <View style={styles.formContainer}>
              <View style={styles.infoBox}>
                <Ionicons name="information-circle-outline" size={24} color="#1E3A8A" />
                <Text style={styles.infoText}>
                  Kami akan mengirimkan kode OTP ke email Anda untuk mereset password.
                </Text>
              </View>
              <View style={{ height: 24 }} />

              <Text style={styles.label}>Email</Text>
              <CustomTextField
                hint="Masukkan email Anda"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <View style={{ height: 40 }} />

              <PrimaryButton
                title={isLoading ? "Mengirim..." : "Kirim OTP"}
                onPress={handleSendOTP}
                disabled={isLoading}
              />

              <View style={{ height: 40 }} />
              <TouchableOpacity onPress={handleBackToLogin}>
                <Text style={styles.backLinkText}>
                  <Ionicons name="arrow-back" size={16} color="#1E3A8A" /> Kembali ke Login
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {step === 'otp' && (
            <View style={styles.formContainer}>
              <Text style={styles.label}>Kode OTP</Text>
              <CustomTextField
                hint="Masukkan kode OTP"
                value={otp}
                onChangeText={setOtp}
                keyboardType="number-pad"
                maxLength={10}
              />
              <View style={{ height: 20 }} />

              <Text style={styles.label}>Password Baru</Text>
              <CustomTextField
                hint="Minimal 8 karakter"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
              />
              <View style={{ height: 20 }} />

              <Text style={styles.label}>Konfirmasi Password Baru</Text>
              <CustomTextField
                hint="Ulangi password baru"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
              <View style={{ height: 40 }} />

              <PrimaryButton
                title={isLoading ? "Memproses..." : "Reset Password"}
                onPress={handleResetPassword}
                disabled={isLoading}
              />

              <View style={{ height: 20 }} />
              <TouchableOpacity onPress={() => setStep('email')}>
                <Text style={styles.backLinkText}>
                  <Ionicons name="arrow-back" size={16} color="#1E3A8A" /> Kembali
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {step === 'success' && (
            <View style={styles.formContainer}>
              <View style={styles.successIcon}>
                <Ionicons name="checkmark-circle" size={80} color="#10B981" />
              </View>
              <Text style={styles.successTitle}>Password Berhasil Diubah!</Text>
              <Text style={styles.successMessage}>Silakan login dengan password baru Anda.</Text>

              <View style={{ height: 40 }} />
              <PrimaryButton
                title="Login Sekarang"
                onPress={handleBackToLogin}
              />
            </View>
          )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function CustomTextField({
  hint,
  secureTextEntry,
  value,
  onChangeText,
  keyboardType,
  autoCapitalize,
  maxLength
}: {
  hint: string,
  secureTextEntry?: boolean,
  value?: string,
  onChangeText?: (text: string) => void,
  keyboardType?: 'email-address' | 'number-pad' | 'default';
  autoCapitalize?: 'none' | 'sentences';
  maxLength?: number;
}) {
  return (
    <View style={styles.inputContainer}>
      <TextInput
        placeholder={hint}
        secureTextEntry={secureTextEntry}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        maxLength={maxLength}
        style={styles.input}
        placeholderTextColor="rgba(0,0,0,0.38)"
      />
    </View>
  );
}

function PrimaryButton({ title, onPress, disabled }: { title: string, onPress: () => void, disabled?: boolean }) {
  return (
    <TouchableOpacity
      style={[styles.primaryButton, disabled && styles.primaryButtonDisabled]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles.primaryButtonText}>{title}</Text>
    </TouchableOpacity>
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
  },
  header: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 40,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: 'rgba(0,0,0,0.54)',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  formContainer: {
    marginTop: 20,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
    padding: 12,
    alignItems: 'flex-start',
    gap: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    color: '#1E3A8A',
    lineHeight: 18,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#1F2937',
    marginBottom: 8,
  },
  inputContainer: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: Platform.OS === 'ios' ? 16 : 4,
    height: 56,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  input: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: 'black',
  },
  primaryButton: {
    backgroundColor: '#1E3A8A',
    borderRadius: 8,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#1E3A8A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  primaryButtonDisabled: {
    backgroundColor: '#9CA3AF',
    shadowOpacity: 0,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
  backLinkText: {
    fontSize: 14,
    color: '#1E3A8A',
    fontFamily: 'Poppins-SemiBold',
    textAlign: 'center',
  },
  successIcon: {
    alignItems: 'center',
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  successMessage: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: 'rgba(0,0,0,0.54)',
    textAlign: 'center',
    marginBottom: 24,
  },
});
