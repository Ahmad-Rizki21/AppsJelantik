import { Ionicons } from '@expo/vector-icons';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AuthService from '../services/authService';

type Step = 'form' | 'success';

export default function SetPasswordScreen() {
  const [step, setStep] = useState<Step>('form');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSetPassword = async () => {
    if (!newPassword) {
      Alert.alert('Error', 'Password wajib diisi');
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
      const result = await AuthService.setPassword(newPassword, confirmPassword);

      if (result.success) {
        setStep('success');
      } else {
        Alert.alert('Gagal', result.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const isPasswordStrong = (password: string) => {
    return password.length >= 8;
  };

  const isPasswordMatch = () => {
    return newPassword && confirmPassword && newPassword === confirmPassword;
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar style="dark" />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            {/* AppBar */}
            <View style={styles.appBar}>
              <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color="#1E1E1E" />
              </TouchableOpacity>
              <Text style={styles.appBarTitle}>Set Password</Text>
              <View style={{ width: 40 }} />
            </View>

            {/* Header */}
            <View style={styles.header}>
              <View style={styles.iconContainer}>
                <Ionicons name="lock-closed" size={40} color="#1E3A8A" />
              </View>
              <Text style={styles.headerTitle}>Buat Password Login</Text>
              <Text style={styles.headerSubtitle}>
                Buat password untuk login dengan email Anda. Anda tetap bisa login dengan Google.
              </Text>
            </View>

            {/* Content based on step */}
            {step === 'form' && (
              <View style={styles.formContainer}>
                <View style={styles.infoBox}>
                  <Ionicons name="information-circle-outline" size={20} color="#1E3A8A" />
                  <Text style={styles.infoText}>
                    Setelah membuat password, Anda bisa login dengan email + password atau Google.
                  </Text>
                </View>
                <View style={{ height: 24 }} />

                <Text style={styles.label}>Password Baru</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    placeholder="Minimal 8 karakter"
                    value={newPassword}
                    onChangeText={setNewPassword}
                    secureTextEntry={!showPassword}
                    style={styles.input}
                    placeholderTextColor="rgba(0,0,0,0.38)"
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                    <Ionicons name={showPassword ? "eye-off" : "eye"} size={20} color="#6B7280" />
                  </TouchableOpacity>
                </View>

                {/* Password strength indicator */}
                {newPassword.length > 0 && (
                  <View style={styles.strengthContainer}>
                    <View style={[styles.strengthBar, isPasswordStrong(newPassword) && styles.strengthBarStrong]} />
                    <Text style={[styles.strengthText, isPasswordStrong(newPassword) && styles.strengthTextStrong]}>
                      {isPasswordStrong(newPassword) ? 'Kuat' : 'Lemah (min. 8 karakter)'}
                    </Text>
                  </View>
                )}

                <View style={{ height: 20 }} />

                <Text style={styles.label}>Konfirmasi Password</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    placeholder="Ulangi password baru"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showConfirmPassword}
                    style={styles.input}
                    placeholderTextColor="rgba(0,0,0,0.38)"
                  />
                  <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
                    <Ionicons name={showConfirmPassword ? "eye-off" : "eye"} size={20} color="#6B7280" />
                  </TouchableOpacity>
                </View>

                {/* Match indicator */}
                {confirmPassword.length > 0 && (
                  <View style={styles.matchContainer}>
                    <Ionicons
                      name={isPasswordMatch() ? "checkmark-circle" : "close-circle"}
                      size={16}
                      color={isPasswordMatch() ? "#10B981" : "#EF4444"}
                    />
                    <Text style={[styles.matchText, isPasswordMatch() && styles.matchTextMatch]}>
                      {isPasswordMatch() ? 'Password cocok' : 'Password tidak cocok'}
                    </Text>
                  </View>
                )}

                <View style={{ height: 32 }} />

                <TouchableOpacity
                  style={[styles.primaryButton, isLoading && styles.primaryButtonDisabled]}
                  onPress={handleSetPassword}
                  disabled={isLoading || !isPasswordStrong(newPassword) || !isPasswordMatch()}
                >
                  <Text style={styles.primaryButtonText}>
                    {isLoading ? "Memproses..." : "Set Password"}
                  </Text>
                </TouchableOpacity>

                <View style={{ height: 24 }} />

                <TouchableOpacity onPress={() => router.back()} style={styles.skipButton}>
                  <Text style={styles.skipText}>Nanti Saja</Text>
                </TouchableOpacity>
              </View>
            )}

            {step === 'success' && (
              <View style={styles.formContainer}>
                <View style={styles.successIcon}>
                  <Ionicons name="checkmark-circle" size={80} color="#10B981" />
                </View>
                <Text style={styles.successTitle}>Password Berhasil Dibuat!</Text>
                <Text style={styles.successMessage}>
                  Sekarang Anda bisa login dengan email + password atau tetap menggunakan Google.
                </Text>

                <View style={{ height: 32 }} />

                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={() => router.back()}
                >
                  <Text style={styles.primaryButtonText}>Selesai</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 8,
  },
  appBarTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#1E1E1E',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: 'Poppins-Bold',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: 'rgba(0,0,0,0.54)',
    textAlign: 'center',
  },
  formContainer: {
    marginTop: 10,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'flex-start',
    gap: 12,
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'Poppins-Regular',
    color: 'black',
  },
  eyeIcon: {
    padding: 8,
  },
  strengthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 8,
  },
  strengthBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
  },
  strengthBarStrong: {
    backgroundColor: '#10B981',
  },
  strengthText: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    color: '#EF4444',
  },
  strengthTextStrong: {
    color: '#10B981',
  },
  matchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 6,
  },
  matchText: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    color: '#EF4444',
  },
  matchTextMatch: {
    color: '#10B981',
  },
  primaryButton: {
    backgroundColor: '#1E3A8A',
    borderRadius: 12,
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
  skipButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  skipText: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'Poppins-Medium',
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
    marginBottom: 12,
  },
  successMessage: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: 'rgba(0,0,0,0.54)',
    textAlign: 'center',
    paddingHorizontal: 16,
  },
});
