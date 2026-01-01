import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AuthService, { RegisterData } from '../services/authService';

export default function RegisterScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState<RegisterData>({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<RegisterData>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const updateFormData = (field: keyof RegisterData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user types
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<RegisterData> = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email wajib diisi';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password wajib diisi';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password minimal 8 karakter';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Konfirmasi password wajib diisi';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Password tidak cocok';
    }

    setErrors(newErrors);

    const isValid = Object.keys(newErrors).length === 0;

    if (!isValid) {
      // Show alert with first error
      const firstError = Object.values(newErrors)[0];
      Alert.alert('Validasi Gagal', firstError || 'Mohon lengkapi semua field yang wajib.');
    }

    return isValid;
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const result = await AuthService.registerWithEmail(formData);

      if (result.success) {
        // Navigate using href with params
        const emailEncoded = encodeURIComponent(formData.email);
        router.push(`/auth/otp-verification?email=${emailEncoded}`);
      } else {
        Alert.alert('Registrasi Gagal', result.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    Alert.alert('Info', 'Gunakan halaman login utama untuk Google Sign-In');
    router.push('/auth/login-screen');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar style="dark" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1E1E1E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Daftar Akun</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Icon */}
        <View style={styles.iconContainer}>
          <Ionicons name="person-add-outline" size={60} color="#3B82F6" />
        </View>

        {/* Title */}
        <Text style={styles.title}>Buat Akun Baru</Text>
        <Text style={styles.subtitle}>Daftar untuk menikmati layanan Jelantik</Text>

        {/* Form */}
        <View style={styles.formContainer}>
          {/* Email */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <View style={[styles.inputWrapper, errors.email && styles.inputWrapperError]}>
              <Ionicons name="mail-outline" size={20} color="#6B7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Masukkan email Anda"
                placeholderTextColor="#9CA3AF"
                value={formData.email}
                onChangeText={(value) => updateFormData('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!isLoading}
              />
            </View>
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          </View>

          {/* Password */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <View style={[styles.inputWrapper, errors.password && styles.inputWrapperError]}>
              <Ionicons name="lock-closed-outline" size={20} color="#6B7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Buat password (minimal 8 karakter)"
                placeholderTextColor="#9CA3AF"
                value={formData.password}
                onChangeText={(value) => updateFormData('password', value)}
                secureTextEntry={!showPassword}
                editable={!isLoading}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                <Ionicons name={showPassword ? 'eye-outline' : 'eye-off-outline'} size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>
            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
          </View>

          {/* Confirm Password */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Konfirmasi Password</Text>
            <View style={[styles.inputWrapper, errors.confirmPassword && styles.inputWrapperError]}>
              <Ionicons name="lock-closed-outline" size={20} color="#6B7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Ulangi password"
                placeholderTextColor="#9CA3AF"
                value={formData.confirmPassword}
                onChangeText={(value) => updateFormData('confirmPassword', value)}
                secureTextEntry={!showConfirmPassword}
                editable={!isLoading}
              />
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
                <Ionicons name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'} size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>
            {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
          </View>

          {/* Name (Optional) */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nama Lengkap (Opsional)</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="person-outline" size={20} color="#6B7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Masukkan nama lengkap"
                placeholderTextColor="#9CA3AF"
                value={formData.name}
                onChangeText={(value) => updateFormData('name', value)}
                editable={!isLoading}
              />
            </View>
          </View>

          {/* Phone (Optional) */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nomor Telepon (Opsional)</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="call-outline" size={20} color="#6B7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Masukkan nomor telepon"
                placeholderTextColor="#9CA3AF"
                value={formData.phone}
                onChangeText={(value) => updateFormData('phone', value.replace(/[^0-9]/g, ''))}
                keyboardType="phone-pad"
                editable={!isLoading}
              />
            </View>
          </View>
        </View>

        {/* Register Button */}
        <TouchableOpacity
          style={[styles.registerButton, isLoading && styles.registerButtonDisabled]}
          onPress={handleRegister}
          disabled={isLoading}
        >
          {isLoading ? (
            <Text style={styles.registerButtonText}>Memproses...</Text>
          ) : (
            <Text style={styles.registerButtonText}>Daftar</Text>
          )}
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>ATAU</Text>
          <View style={styles.divider} />
        </View>

        {/* Google Sign In */}
        <TouchableOpacity
          style={styles.googleButton}
          onPress={handleGoogleSignIn}
          disabled={isLoading}
        >
          <View style={styles.googleButtonContent}>
            {/* Google Logo */}
            <View style={styles.googleIcon}>
              <Text style={styles.googleIconText}>G</Text>
            </View>
            <Text style={styles.googleButtonText}>Daftar dengan Google</Text>
          </View>
        </TouchableOpacity>

        {/* Login Link */}
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Sudah punya akun? </Text>
          <TouchableOpacity onPress={() => router.push('/auth/login-screen')}>
            <Text style={styles.loginLink}>Login</Text>
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
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#1E1E1E',
    marginLeft: 8,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 32,
  },
  formContainer: {
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#1F2937',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 52,
  },
  inputWrapperError: {
    borderColor: '#EF4444',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#1F2937',
  },
  eyeIcon: {
    padding: 4,
  },
  errorText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#EF4444',
    marginTop: 4,
  },
  registerButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  registerButtonDisabled: {
    backgroundColor: '#D1D5DB',
    shadowOpacity: 0,
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    paddingHorizontal: 16,
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#6B7280',
  },
  googleButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    paddingVertical: 16,
    marginBottom: 24,
  },
  googleButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  googleIconText: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#4285F4',
  },
  googleButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#1F2937',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#6B7280',
  },
  loginLink: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#3B82F6',
  },
});
