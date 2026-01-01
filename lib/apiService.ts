/**
 * APIService - Service untuk handle semua HTTP request ke backend API
 * Otomatis menambahkan JWT token dari Supabase ke setiap request
 */

import configService from '../app/services/configService';
import authService from '../app/services/authService';

// API Configuration - Direct read from env var
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.8:8080/api/v1';

console.log('[API] Base URL configured:', API_BASE_URL);

// API Error Types
export class APIError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public data?: any
  ) {
    super(message);
    this.name = 'APIError';
  }
}

// API Response Types
export interface APIResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}

// Request Options
interface RequestOptions extends RequestInit {
  params?: Record<string, string | number>;
  skipAuth?: boolean; // Skip auth header for public endpoints
  isBlob?: boolean; // For file downloads
}

class APIService {
  private static instance: APIService;
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  private constructor() {
    this.baseURL = API_BASE_URL;
    console.log('[API] APIService constructor - baseURL set to:', this.baseURL);
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
  }

  static getInstance(): APIService {
    if (!APIService.instance) {
      APIService.instance = new APIService();
    }
    return APIService.instance;
  }

  /**
   * Build URL with query parameters
   */
  private buildURL(endpoint: string, params?: Record<string, string | number>): string {
    // Ensure baseURL doesn't have trailing slash and endpoint doesn't have leading slash
    const cleanBaseURL = this.baseURL.replace(/\/$/, '');
    const cleanEndpoint = endpoint.replace(/^\//, '');

    const url = new URL(`${cleanBaseURL}/${cleanEndpoint}`);
    console.log('[API] buildURL - baseURL:', this.baseURL, 'endpoint:', endpoint, 'final:', url.toString());

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
    }

    return url.toString();
  }

  /**
   * Get auth token from authService
   */
  private getAuthToken(): string | null {
    const token = authService.getAccessToken();
    console.log('[API] getAuthToken() - token exists:', !!token, 'length:', token?.length || 0);
    return token;
  }

  /**
   * Build headers with auth token
   */
  private async buildHeaders(options: RequestOptions): Promise<Headers> {
    const headers = new Headers({
      ...this.defaultHeaders,
      ...options.headers,
    });

    // Add auth token if not skipped
    if (!options.skipAuth) {
      const token = this.getAuthToken();
      if (token) {
        headers.append('Authorization', `Bearer ${token}`);
      }
    }

    return headers;
  }

  /**
   * Handle API response
   */
  private async handleResponse<T>(response: Response): Promise<T> {
    // Handle blob response (file downloads)
    if (response.headers.get('content-type')?.includes('application/octet-stream')) {
      return (await response.blob()) as T;
    }

    // Parse JSON response
    const contentType = response.headers.get('content-type');
    let data: any;

    if (contentType?.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    // Handle error responses
    if (!response.ok) {
      throw new APIError(
        response.status,
        data.error || data.message || 'An error occurred',
        data
      );
    }

    return data as T;
  }

  /**
   * Handle API errors with specific actions
   */
  private handleError(error: any): never {
    if (error instanceof APIError) {
      // Handle 401 Unauthorized - token expired
      if (error.statusCode === 401) {
        console.warn('[API] Token expired or invalid');
        // Could trigger auto-refresh or redirect to login
        // For now, just log the warning
      }

      // Handle 403 Forbidden
      if (error.statusCode === 403) {
        console.warn('[API] Access forbidden');
      }

      // Handle 404 Not Found
      if (error.statusCode === 404) {
        console.warn('[API] Resource not found');
      }

      // Handle 500 Server Error
      if (error.statusCode >= 500) {
        console.error('[API] Server error:', error.message);
      }

      throw error;
    }

    // Network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new APIError(0, 'Network error. Please check your connection.');
    }

    // Unknown errors
    throw new APIError(0, error.message || 'An unexpected error occurred');
  }

  /**
   * Generic request method
   */
  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    try {
      const url = this.buildURL(endpoint, options.params);
      const headers = await this.buildHeaders(options);

      // Remove headers that shouldn't be in the RequestInit
      const { skipAuth, params: _, ...fetchOptions } = options;

      const response = await fetch(url, {
        ...fetchOptions,
        headers,
      });

      return await this.handleResponse<T>(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'GET',
    });
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, body?: any, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  /**
   * PUT request
   */
  async put<T>(endpoint: string, body?: any, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  /**
   * PATCH request
   */
  async patch<T>(endpoint: string, body?: any, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'DELETE',
    });
  }

  /**
   * Upload file (multipart/form-data)
   */
  async upload<T>(endpoint: string, formData: FormData, options: RequestOptions = {}): Promise<T> {
    const token = this.getAuthToken();
    const headers: HeadersInit = {
      ...(token && { 'Authorization': `Bearer ${token}` }),
      // Don't set Content-Type for FormData, let browser set it with boundary
    };

    const url = this.buildURL(endpoint, options.params);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: formData,
      });

      return await this.handleResponse<T>(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Download file as blob
   */
  async download(endpoint: string, options: RequestOptions = {}): Promise<Blob> {
    const token = this.getAuthToken();
    const headers: HeadersInit = {
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };

    const url = this.buildURL(endpoint, options.params);

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        throw new APIError(response.status, 'Download failed');
      }

      return await response.blob();
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Set base URL dynamically (saved to AsyncStorage)
   * Berguna untuk mengubah IP saat testing di physical device
   */
  async setBaseURL(url: string): Promise<void> {
    this.baseURL = url;
    await configService.setAPIURL(url);
  }

  /**
   * Get current base URL
   */
  getBaseURL(): string {
    return this.baseURL;
  }

  /**
   * Reset to default base URL
   */
  async resetBaseURL(): Promise<void> {
    await configService.clearAPIURL();
    const defaultURL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.7:8080/api/v1';
    this.baseURL = defaultURL;
  }
}

// Export singleton instance
const apiClient = APIService.getInstance();
export default apiClient;

// Export typed API methods for specific endpoints
export const api = {
  // Health check
  healthCheck: () => apiClient.get('/health'),

  // Config (ubah IP tanpa recompile)
  config: {
    setBaseURL: (url: string) => apiClient.setBaseURL(url),
    getBaseURL: () => apiClient.getBaseURL(),
    resetBaseURL: () => apiClient.resetBaseURL(),
  },

  // Packages (public)
  packages: {
    getAll: () => apiClient.get<APIResponse>('/packages', { skipAuth: true }),
    getByID: (id: string) => apiClient.get<APIResponse>(`/packages/${id}`, { skipAuth: true }),
  },

  // Users (authenticated)
  users: {
    getMe: () => apiClient.get<APIResponse>('/users/me'),
    sync: () => apiClient.post<APIResponse>('/users/sync'),
    updateProfile: (data: any) => apiClient.put<APIResponse>('/users/me', data),
  },
};
