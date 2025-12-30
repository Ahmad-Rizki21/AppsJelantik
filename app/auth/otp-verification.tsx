import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AuthService from '../services/authService';

export default function OtpVerificationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const email = decodeURIComponent((params.email as string) || '');

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const inputRefs = useRef<(TextInput | null)[]>([]);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // Start resend timer
    startResendTimer();

    return () => {
      // Cleanup timer on unmount
    };
  }, []);

  const startResendTimer = () => {
    setCanResend(false);
    setResendTimer(60);

    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleOtpChange = (value: string, index: number) => {
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) {
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto focus previous input if empty
    if (!value && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    // Auto-submit when all fields are filled
    if (newOtp.every((digit) => digit !== '')) {
      handleVerifyOtp(newOtp.join(''));
    }
  };

  const handleVerifyOtp = async (otpCode?: string) => {
    const code = otpCode || otp.join('');

    if (code.length !== 6) {
      Alert.alert('Error', 'Masukkan 6 digit kode OTP');
      return;
    }

    setIsLoading(true);

    try {
      const isValid = await AuthService.verifyOtp(email, code);

      if (isValid) {
        Alert.alert(
          'Sukses',
          'Verifikasi berhasil! Akun Anda telah terdaftar.',
          [
            {
              text: 'OK',
              onPress: () => {
                router.replace('/(tabs)');
              },
            },
          ]
        );
      } else {
        Alert.alert('Error', 'Kode OTP salah. Silakan coba lagi.');
        // Clear OTP
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (error) {
      Alert.alert('Error', 'Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;

    try {
      await AuthService.sendOtp(email);
      Alert.alert('Sukses', 'Kode OTP baru telah dikirim ke email Anda.');
      startResendTimer();
      // Clear OTP
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (error) {
      Alert.alert('Error', 'Gagal mengirim ulang kode OTP.');
    }
  };

  const renderOtpInputs = () => {
    return (
      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <View key={index} style={styles.otpInputWrapper}>
            <TextInput
              ref={(ref) => {
                inputRefs.current[index] = ref;
              }}
              style={[
                styles.otpInput,
                digit !== '' && styles.otpInputFilled,
              ]}
              value={digit}
              onChangeText={(value) => handleOtpChange(value, index)}
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
              textAlign="center"
            />
          </View>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar style="dark" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={24} color="#1E1E1E" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Verifikasi Email</Text>
            <View style={{ width: 40 }} />
          </View>

          <Animated.View
            style={[styles.content, { opacity: fadeAnim }]}
          >
            {/* Icon */}
            <View style={styles.iconContainer}>
              <Ionicons name="mail-outline" size={50} color="#3B82F6" />
            </View>

            {/* Title */}
            <Text style={styles.title}>Verifikasi Email</Text>

            {/* Subtitle */}
            <Text style={styles.subtitle}>
              Kami telah mengirimkan kode 6 digit ke{'\n'}
              <Text style={styles.emailText}>{email}</Text>
            </Text>

            {/* OTP Inputs */}
            {renderOtpInputs()}

            {/* Verify Button */}
            <TouchableOpacity
              style={[
                styles.verifyButton,
                isLoading && styles.verifyButtonDisabled,
              ]}
              onPress={() => handleVerifyOtp()}
              disabled={isLoading || otp.every((d) => d === '')}
            >
              {isLoading ? (
                <Text style={styles.verifyButtonText}>Memverifikasi...</Text>
              ) : (
                <Text style={styles.verifyButtonText}>Verifikasi</Text>
              )}
            </TouchableOpacity>

            {/* Resend OTP */}
            <View style={styles.resendContainer}>
              <Text style={styles.resendText}>Tidak menerima kode? </Text>
              <TouchableOpacity
                onPress={handleResendOtp}
                disabled={!canResend}
              >
                <Text
                  style={[
                    styles.resendLink,
                    !canResend && styles.resendLinkDisabled,
                  ]}
                >
                  {canResend ? 'Kirim Ulang' : `Kirim Ulang (${resendTimer})`}
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
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
    paddingHorizontal: 24,
    paddingTop: 40,
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
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 48,
  },
  emailText: {
    fontFamily: 'Poppins-SemiBold',
    color: '#1F2937',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  otpInputWrapper: {
    flex: 1,
    marginHorizontal: 4,
  },
  otpInput: {
    height: 60,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    color: '#1F2937',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  otpInputFilled: {
    borderColor: '#3B82F6',
    borderWidth: 2,
    backgroundColor: '#FFFFFF',
  },
  verifyButton: {
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
  verifyButtonDisabled: {
    backgroundColor: '#D1D5DB',
    shadowOpacity: 0,
  },
  verifyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resendText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#6B7280',
  },
  resendLink: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#3B82F6',
    textDecorationLine: 'underline',
  },
  resendLinkDisabled: {
    color: '#9CA3AF',
    textDecorationLine: 'none',
  },
});
