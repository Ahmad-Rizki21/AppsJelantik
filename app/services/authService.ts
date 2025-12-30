/**
 * AuthService - Service untuk menangani autentikasi user (UI Only)
 * Untuk demo/testing tanpa backend
 */

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

class AuthService {
  private static instance: AuthService;

  // Simpan OTP sementara (untuk demo/development)
  private currentOtp: string = '';
  private currentEmail: string = '';

  private constructor() {}

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * Generate random 6-digit OTP
   */
  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Kirim OTP ke email user
   * Untuk demo: OTP akan ditampilkan di console/alert
   */
  async sendOtp(email: string): Promise<boolean> {
    try {
      // Generate OTP baru
      this.currentOtp = this.generateOtp();
      this.currentEmail = email;

      // Tampilkan OTP di console untuk testing
      console.log('='.repeat(50));
      console.log('OTP VERIFICATION - DEMO MODE');
      console.log('Email:', email);
      console.log('OTP Code:', this.currentOtp);
      console.log('='.repeat(50));

      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Verifikasi OTP
   * Untuk demo: validasi dengan currentOtp
   */
  async verifyOtp(email: string, otp: string): Promise<boolean> {
    try {
      // Simulasi verifikasi
      // Di production ini akan memanggil API
      return this.currentOtp === otp && this.currentEmail === email;
    } catch (error) {
      console.error('Error verifying OTP:', error);
      return false;
    }
  }

  /**
   * Register user baru dengan OTP
   */
  async registerWithEmail(data: RegisterData): Promise<{ success: boolean; message: string }> {
    try {
      // Validasi password
      if (data.password !== data.confirmPassword) {
        return {
          success: false,
          message: 'Password dan konfirmasi password tidak cocok',
        };
      }

      if (data.password.length < 8) {
        return {
          success: false,
          message: 'Password minimal 8 karakter',
        };
      }

      // Validasi email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        return {
          success: false,
          message: 'Format email tidak valid',
        };
      }

      // Kirim OTP untuk verifikasi
      const otpSent = await this.sendOtp(data.email);

      if (!otpSent) {
        return {
          success: false,
          message: 'Gagal mengirim kode OTP. Silakan coba lagi.',
        };
      }

      return {
        success: true,
        message: 'Kode OTP telah dikirim ke email Anda',
      };
    } catch (error) {
      console.error('Error registering:', error);
      return {
        success: false,
        message: 'Terjadi kesalahan. Silakan coba lagi.',
      };
    }
  }

  /**
   * Login dengan email dan password
   */
  async login(data: LoginData): Promise<{ success: boolean; message: string; user?: any }> {
    // TODO: Implementasi login dengan backend
    return {
      success: false,
      message: 'Fitur login akan segera tersedia',
    };
  }

  /**
   * Login dengan Google
   */
  async loginWithGoogle(): Promise<{ success: boolean; message: string; user?: any }> {
    // TODO: Implementasi Google Sign-In
    return {
      success: false,
      message: 'Google Sign-In akan segera tersedia',
    };
  }
}

export default AuthService.getInstance();
