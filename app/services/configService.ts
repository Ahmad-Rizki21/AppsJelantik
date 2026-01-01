/**
 * ConfigService - Service untuk menyimpan konfigurasi runtime
 * Berguna untuk mengubah API URL tanpa recompile app
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

class ConfigService {
  private static instance: ConfigService;
  private apiURL: string | null = null;
  private readonly API_URL_KEY = 'jelantik_api_url';

  private constructor() {
    this.loadFromStorage();
  }

  static getInstance(): ConfigService {
    if (!ConfigService.instance) {
      ConfigService.instance = new ConfigService();
    }
    return ConfigService.instance;
  }

  /**
   * Load API URL from AsyncStorage
   */
  private async loadFromStorage(): Promise<void> {
    try {
      const storedURL = await AsyncStorage.getItem(this.API_URL_KEY);
      if (storedURL) {
        this.apiURL = storedURL;
        console.log('[Config] API URL loaded from storage:', storedURL);
      }
    } catch (error) {
      console.error('[Config] Failed to load API URL:', error);
    }
  }

  /**
   * Get current API URL
   * Priority: AsyncStorage > .env > Default
   */
  async getAPIURL(): Promise<string> {
    // Load from storage if not yet loaded
    if (this.apiURL === null) {
      await this.loadFromStorage();
    }

    // Return stored URL or env var or default
    return this.apiURL || process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.7:8080/api/v1';
  }

  /**
   * Set custom API URL (saved to AsyncStorage)
   * Berguna untuk physical device yang IP-nya berubah-ubah
   */
  async setAPIURL(url: string): Promise<void> {
    try {
      this.apiURL = url;
      await AsyncStorage.setItem(this.API_URL_KEY, url);
      console.log('[Config] API URL saved:', url);
    } catch (error) {
      console.error('[Config] Failed to save API URL:', error);
      throw error;
    }
  }

  /**
   * Clear custom API URL (revert to default)
   */
  async clearAPIURL(): Promise<void> {
    try {
      this.apiURL = null;
      await AsyncStorage.removeItem(this.API_URL_KEY);
      console.log('[Config] API URL cleared, using default');
    } catch (error) {
      console.error('[Config] Failed to clear API URL:', error);
      throw error;
    }
  }

  /**
   * Check if using custom URL
   */
  isUsingCustomURL(): boolean {
    return this.apiURL !== null;
  }
}

export default ConfigService.getInstance();
