import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomAlert from '../../components/CustomAlert';
import { GOOGLE_WEB_CLIENT_ID } from '../../lib/supabase';
import AuthService, { LoginData, RegisterData } from '../services/authService';

export default function LoginScreen() {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  const [registerData, setRegisterData] = useState<RegisterData>({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
  });
  const [loginData, setLoginData] = useState<LoginData>({
    email: '',
    password: '',
  });
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Custom Alert State
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    title: '',
    message: '',
    type: 'info' as 'success' | 'error' | 'warning' | 'info',
    onConfirm: undefined as (() => void) | undefined,
    confirmText: 'OK',
    cancelText: 'Cancel'
  });

  const showAlert = (title: string, message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info', onConfirm?: () => void, confirmText = 'OK', cancelText = 'Cancel') => {
    setAlertConfig({ title, message, type, onConfirm, confirmText, cancelText });
    setAlertVisible(true);
  };

  const closeAlert = () => {
    setAlertVisible(false);
  };

  // Setup Google Sign-In
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: GOOGLE_WEB_CLIENT_ID,
    });
  }, []);

  const handleBack = () => {
    router.replace('/(auth)/onboarding');
  };

  const handleLogin = async () => {
    if (!loginData.email) {
      showAlert('Error', 'Email wajib diisi', 'error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(loginData.email)) {
      showAlert('Error', 'Format email tidak valid', 'error');
      return;
    }

    if (!loginData.password) {
      showAlert('Error', 'Password wajib diisi', 'error');
      return;
    }

    setIsLoggingIn(true);

    try {
      const result = await AuthService.login(loginData);

      if (result.success) {
        router.replace('/(tabs)');
      } else {
        showAlert('Login Gagal', result.message, 'error');
      }
    } catch (error) {
      showAlert('Error', 'Terjadi kesalahan. Silakan coba lagi.', 'error');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleRegister = async () => {
    if (!registerData.email) {
      showAlert('Error', 'Email wajib diisi', 'error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(registerData.email)) {
      showAlert('Error', 'Format email tidak valid', 'error');
      return;
    }

    if (!registerData.password) {
      showAlert('Error', 'Password wajib diisi', 'error');
      return;
    }

    if (registerData.password.length < 8) {
      showAlert('Error', 'Password minimal 8 karakter', 'error');
      return;
    }

    if (registerData.password !== registerData.confirmPassword) {
      showAlert('Error', 'Password tidak cocok', 'error');
      return;
    }

    setIsRegistering(true);

    try {
      const result = await AuthService.registerWithEmail(registerData);

      if (result.success) {
        if (result.session) {
          // Auto-login jika email confirmation dimatikan di Supabase
          router.replace('/(tabs)');
        } else if (result.needsVerification) {
          // Navigate ke OTP verification screen
          router.push({
            pathname: '/(auth)/verify-otp',
            params: { email: registerData.email }
          });
        } else {
          showAlert('Registrasi Berhasil', 'Silakan cek email untuk verifikasi.', 'success');
        }
      } else {
        showAlert('Registrasi Gagal', result.message, 'error');
      }
    } catch (error) {
      showAlert('Error', 'Terjadi kesalahan. Silakan coba lagi.', 'error');
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <View style={{ height: 40 }} />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* Header */}
        <View style={styles.header}>
            <Image source={require('../../assets/images/Jelantik_Logo.png')} style={styles.logo} resizeMode="contain" />
            <Text style={styles.headerTitle}>
                {activeTab === 'login' ? 'Login to your Account' : 'Create your Account'}
            </Text>
        </View>

        {/* content */}
        <View style={styles.formContainer}>
            {activeTab === 'login' ? (
                <LoginForm
                    onLogin={handleLogin}
                    onRegisterClick={() => setActiveTab('register')}
                    loginData={loginData}
                    setLoginData={setLoginData}
                    isLoggingIn={isLoggingIn}
                    showAlert={showAlert}
                />
            ) : (
                <RegisterForm
                  onRegister={handleRegister}
                  registerData={registerData}
                  setRegisterData={setRegisterData}
                  isRegistering={isRegistering}
                  onLoginClick={() => setActiveTab('login')}
                  showAlert={showAlert}
                />
            )}
        </View>



      </ScrollView>
      </KeyboardAvoidingView>

      <CustomAlert
        visible={alertVisible}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        onClose={closeAlert}
        onConfirm={alertConfig.onConfirm}
        confirmText={alertConfig.confirmText}
        cancelText={alertConfig.cancelText}
      />
    </SafeAreaView>
  );
}

function LoginForm({
  onLogin,
  onRegisterClick,
  loginData,
  setLoginData,
  isLoggingIn,
  showAlert
}: {
  onLogin: () => void;
  onRegisterClick: () => void;
  loginData: LoginData;
  setLoginData: React.Dispatch<React.SetStateAction<LoginData>>;
  isLoggingIn: boolean;
  showAlert: (title: string, message: string, type?: 'success' | 'error' | 'warning' | 'info', onConfirm?: () => void, confirmText?: string, cancelText?: string) => void;
}) {
    const [isSigningInWithGoogle, setIsSigningInWithGoogle] = useState(false);

    const handleGoogleSignIn = async () => {
      try {
        setIsSigningInWithGoogle(true);
        await GoogleSignin.hasPlayServices();
        const userInfo = await GoogleSignin.signIn();
        const tokens = await GoogleSignin.getTokens();
        const idToken = tokens.idToken;

        if (!idToken) {
          showAlert('Error', 'Gagal mendapatkan Google ID Token', 'error');
          return;
        }

        const result = await AuthService.loginWithGoogle(idToken);

        if (result.success) {
          // Cek apakah user sudah punya password
          // Jika belum, tawarkan untuk set password
          if (!AuthService.hasPassword()) {
            // Show alert dan navigasi ke set password
            showAlert(
              'Login Berhasil',
              'Anda login dengan Google. Ingin membuat password untuk login dengan email juga?',
              'info',
              () => router.replace('/settings/set-password'),
              'Buat Password',
              'Nanti Saja'
            );
          } else {
            router.replace('/(tabs)');
          }
        } else {
          showAlert('Google Sign-In Gagal', result.message, 'error');
        }
      } catch (error: any) {
        if (error.code === statusCodes.SIGN_IN_CANCELLED) {
          console.log('Google Sign-In cancelled');
        } else if (error.code === statusCodes.IN_PROGRESS) {
          showAlert('Error', 'Sign-in sedang berjalan', 'warning');
        } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
          showAlert('Error', 'Google Play Services tidak tersedia', 'error');
        } else {
          console.error('Google Sign-In error:', error);
          showAlert('Error', 'Gagal login dengan Google', 'error');
        }
      } finally {
        setIsSigningInWithGoogle(false);
      }
    };

    return (
        <View>
            <CustomTextField
              hint="Email"
              value={loginData.email}
              onChangeText={(text) => setLoginData({ ...loginData, email: text })}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <View style={{ height: 20 }} />
            <CustomTextField
              hint="Password"
              secureTextEntry
              value={loginData.password}
              onChangeText={(text) => setLoginData({ ...loginData, password: text })}
            />
            <View style={{ height: 12 }} />
            <View style={{ alignItems: 'flex-end' }}>
                <TouchableOpacity onPress={() => router.push('/(auth)/forgot-password')}>
                    <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                </TouchableOpacity>
            </View>
            <View style={{ height: 28 }} />

            <PrimaryButton
              title={isLoggingIn ? "Memproses..." : "Sign in"}
              onPress={onLogin}
              disabled={isLoggingIn}
            />

            <View style={{ height: 40 }} />
            <DividerWithText text="- Or sign in with -" />
            <View style={{ height: 20 }} />

            <SocialLoginSection
              onGoogleSignIn={handleGoogleSignIn}
              isGoogleSigningIn={isSigningInWithGoogle}
            />

            <View style={{ height: 40 }} />
            <View style={styles.bottomLinkContainer}>
                <Text style={styles.bottomLinkText}>Don't have an account? </Text>
                <TouchableOpacity onPress={onRegisterClick}>
                    <Text style={styles.bottomLinkHighlight}>Sign up</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

function RegisterForm({
  onRegister,
  registerData,
  setRegisterData,
  isRegistering,
  onLoginClick,
  showAlert
}: {
  onRegister: () => void;
  registerData: RegisterData;
  setRegisterData: React.Dispatch<React.SetStateAction<RegisterData>>;
  isRegistering: boolean;
  onLoginClick: () => void;
  showAlert: (title: string, message: string, type?: 'success' | 'error' | 'warning' | 'info', onConfirm?: () => void, confirmText?: string, cancelText?: string) => void;
}) {
    const [isSigningInWithGoogle, setIsSigningInWithGoogle] = useState(false);

    const handleGoogleSignIn = async () => {
      try {
        setIsSigningInWithGoogle(true);
        await GoogleSignin.hasPlayServices();
        const userInfo = await GoogleSignin.signIn();
        const tokens = await GoogleSignin.getTokens();
        const idToken = tokens.idToken;

        if (!idToken) {
          showAlert('Error', 'Gagal mendapatkan Google ID Token', 'error');
          return;
        }

        const result = await AuthService.loginWithGoogle(idToken);

        if (result.success) {
          // Cek apakah user sudah punya password
          // Jika belum, tawarkan untuk set password
          if (!AuthService.hasPassword()) {
            // Show alert dan navigasi ke set password
            showAlert(
              'Login Berhasil',
              'Anda login dengan Google. Ingin membuat password untuk login dengan email juga?',
              'info',
              () => router.replace('/settings/set-password'),
              'Buat Password',
              'Nanti Saja'
            );
          } else {
            router.replace('/(tabs)');
          }
        } else {
          showAlert('Google Sign-In Gagal', result.message, 'error');
        }
      } catch (error: any) {
        if (error.code === statusCodes.SIGN_IN_CANCELLED) {
          console.log('Google Sign-In cancelled');
        } else if (error.code === statusCodes.IN_PROGRESS) {
          showAlert('Error', 'Sign-in sedang berjalan', 'warning');
        } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
          showAlert('Error', 'Google Play Services tidak tersedia', 'error');
        } else {
          console.error('Google Sign-In error:', error);
          showAlert('Error', 'Gagal login dengan Google', 'error');
        }
      } finally {
        setIsSigningInWithGoogle(false);
      }
    };

    return (
        <View>
            <CustomTextField
              hint="Email"
              value={registerData.email}
              onChangeText={(text) => setRegisterData({ ...registerData, email: text })}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <View style={{ height: 12 }} />
            <CustomTextField
              hint="Password"
              secureTextEntry
              value={registerData.password}
              onChangeText={(text) => setRegisterData({ ...registerData, password: text })}
            />
            <View style={{ height: 12 }} />
            <CustomTextField
              hint="Confirm Password"
              secureTextEntry
              value={registerData.confirmPassword}
              onChangeText={(text) => setRegisterData({ ...registerData, confirmPassword: text })}
            />
            <View style={{ height: 24 }} />

            <PrimaryButton
              title={isRegistering ? "Memproses..." : "Sign up"}
              onPress={onRegister}
              disabled={isRegistering}
            />

            <View style={{ height: 24 }} />
            <DividerWithText text="- Or sign up with -" />
            <View style={{ height: 16 }} />

            <SocialLoginSection
              onGoogleSignIn={handleGoogleSignIn}
              isGoogleSigningIn={isSigningInWithGoogle}
            />

            <View style={{ height: 20 }} />
            <View style={styles.bottomLinkContainer}>
                <Text style={styles.bottomLinkText}>Already have an account? </Text>
                <TouchableOpacity onPress={onLoginClick}>
                     <Text style={styles.bottomLinkHighlight}>Sign in</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

function CustomTextField({
  hint,
  secureTextEntry,
  value,
  onChangeText,
  keyboardType,
  autoCapitalize
}: {
  hint: string,
  secureTextEntry?: boolean,
  value?: string,
  onChangeText?: (text: string) => void,
  keyboardType?: 'email-address' | 'default';
  autoCapitalize?: 'none' | 'sentences';
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
                style={styles.input}
                placeholderTextColor="rgba(0,0,0,0.38)"
            />
        </View>
    )
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
    )
}

function SocialLoginSection({
  onGoogleSignIn,
  isGoogleSigningIn
}: {
  onGoogleSignIn: () => void;
  isGoogleSigningIn: boolean;
}) {
    return (
        <View style={styles.socialContainer}>
            {/* Google */}
            <TouchableOpacity
              style={styles.socialButton}
              onPress={onGoogleSignIn}
              disabled={isGoogleSigningIn}
            >
                 <Image source={require('../../assets/images/google_logo.png')} style={{ width: 24, height: 24 }} />
            </TouchableOpacity>
        </View>
    )
}

function DividerWithText({ text }: { text: string }) {
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ marginHorizontal: 16, color: 'rgba(0,0,0,0.54)', fontFamily: 'Poppins-Regular', fontSize: 12 }}>{text}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 0,
  },
  logo: {
    width: 60,
    height: 60,
    marginBottom: 16,
  },
  headerTitle: {
      fontSize: 20,
      fontFamily: 'Poppins-Bold',
      color: '#1F2937',
      marginBottom: 0,
  },
  formContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
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
  socialContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 20,
  },
  socialButton: {
      width: 56,
      height: 56,
      borderRadius: 12,
      backgroundColor: 'white',
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
  },
  bottomLinkContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
  },
  bottomLinkText: {
      fontSize: 14,
      color: 'rgba(0,0,0,0.54)',
      fontFamily: 'Poppins-Regular',
  },
  bottomLinkHighlight: {
      fontSize: 14,
      color: '#1E3A8A',
      fontFamily: 'Poppins-SemiBold',
      marginLeft: 4,
  },
  forgotPasswordText: {
      fontSize: 13,
      color: '#1E3A8A',
      fontFamily: 'Poppins-SemiBold',
  },
});
