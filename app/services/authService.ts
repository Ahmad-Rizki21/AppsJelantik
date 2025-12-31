/**
 * AuthService - Service untuk menangani autentikasi user dengan Supabase
 */

import { supabase } from '../../lib/supabase';
import { Session, User } from '@supabase/supabase-js';
import type { AuthChangeEvent } from '@supabase/supabase-js';

export interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  name?: string;
  phone?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface OTPData {
  email: string;
  token: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User | null;
  session?: Session | null;
  needsVerification?: boolean; // True jika user perlu verifikasi email
}

class AuthService {
  private static instance: AuthService;
  private currentUser: User | null = null;
  private currentSession: Session | null = null;

  private constructor() {
    // Listen to auth changes
    supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
      console.log('Auth state changed:', event);
      this.currentSession = session;
      this.currentUser = session?.user ?? null;
    });
  }

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  getCurrentSession(): Session | null {
    return this.currentSession;
  }

  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  /**
   * Register user baru dengan email dan password
   * Mengirimkan OTP ke email untuk verifikasi
   */
  async registerWithEmail(data: RegisterData): Promise<AuthResponse> {
    try {
      if (data.password !== data.confirmPassword) {
        return { success: false, message: 'Password dan konfirmasi password tidak cocok' };
      }

      if (data.password.length < 8) {
        return { success: false, message: 'Password minimal 8 karakter' };
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        return { success: false, message: 'Format email tidak valid' };
      }

      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.name,
            phone: data.phone,
          },
          emailRedirectTo: undefined, // Disable auto redirect, use manual OTP
        },
      });

      if (error) {
        return { success: false, message: error.message };
      }

      // Cek apakah user perlu verifikasi email
      if (authData.user && !authData.session) {
        // User dibuat tapi belum verified - email OTP dikirim
        return {
          success: true,
          message: 'Kode verifikasi telah dikirim ke email Anda. Silakan cek inbox.',
          user: authData.user,
          session: null,
          needsVerification: true,
        };
      }

      this.currentUser = authData.user;
      this.currentSession = authData.session;

      return {
        success: true,
        message: 'Registrasi berhasil',
        user: authData.user,
        session: authData.session,
      };
    } catch (error: any) {
      return { success: false, message: error.message || 'Terjadi kesalahan' };
    }
  }

  /**
   * Resend OTP ke email
   */
  async resendOTP(email: string): Promise<AuthResponse> {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });

      if (error) {
        return { success: false, message: error.message };
      }

      return {
        success: true,
        message: 'Kode verifikasi baru telah dikirim ke email Anda.',
      };
    } catch (error: any) {
      return { success: false, message: error.message || 'Gagal mengirim ulang kode' };
    }
  }

  /**
   * Verifikasi OTP dengan email dan token
   */
  async verifyOTP(email: string, token: string): Promise<AuthResponse> {
    try {
      const { data: authData, error } = await supabase.auth.verifyOtp({
        email: email,
        token: token,
        type: 'signup',
      });

      if (error) {
        return { success: false, message: error.message };
      }

      this.currentUser = authData.user;
      this.currentSession = authData.session;

      return {
        success: true,
        message: 'Verifikasi berhasil!',
        user: authData.user,
        session: authData.session,
      };
    } catch (error: any) {
      return { success: false, message: error.message || 'Kode verifikasi tidak valid' };
    }
  }

  /**
   * Login dengan email dan password
   */
  async login(data: LoginData): Promise<AuthResponse> {
    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        return { success: false, message: error.message };
      }

      this.currentUser = authData.user;
      this.currentSession = authData.session;

      return {
        success: true,
        message: 'Login berhasil',
        user: authData.user,
        session: authData.session,
      };
    } catch (error: any) {
      return { success: false, message: error.message || 'Terjadi kesalahan' };
    }
  }

  /**
   * Login dengan Google
   */
  async loginWithGoogle(idToken: string): Promise<AuthResponse> {
    try {
      const { data: authData, error } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token: idToken,
      });

      if (error) {
        return { success: false, message: error.message };
      }

      this.currentUser = authData.user;
      this.currentSession = authData.session;

      return {
        success: true,
        message: 'Login dengan Google berhasil',
        user: authData.user,
        session: authData.session,
      };
    } catch (error: any) {
      return { success: false, message: error.message || 'Gagal login dengan Google' };
    }
  }

  /**
   * Logout
   */
  async logout(): Promise<{ success: boolean; message: string }> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        return { success: false, message: error.message };
      }

      this.currentUser = null;
      this.currentSession = null;

      return { success: true, message: 'Logout berhasil' };
    } catch (error: any) {
      return { success: false, message: error.message || 'Terjadi kesalahan' };
    }
  }
}

export default AuthService.getInstance();
