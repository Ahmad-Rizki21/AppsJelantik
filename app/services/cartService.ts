import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Package {
  id: string;
  name: string;
  speed: string;
  price: number;
  priceFormatted?: string;
  description: string;
  features: string[];
  activePeriod: string;
  isPromo?: boolean;
  color?: string; // For UI styling based on speed
}

export interface CustomerData {
  nik: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  installationDate?: string;
  installationTime?: string;
}

export interface CartItem extends Package {
  quantity: number;
  addedAt: Date;
}

class CartService {
  private static instance: CartService;
  private cartItems: CartItem[] = [];
  private customerData: CustomerData | null = null;
  private readonly STORAGE_KEY = 'jelantik_cart';
  private readonly CUSTOMER_KEY = 'jelantik_customer';

  private constructor() {}

  static getInstance(): CartService {
    if (!CartService.instance) {
      CartService.instance = new CartService();
    }
    return CartService.instance;
  }

  // Initialize cart from storage
  async initialize(): Promise<void> {
    try {
      // Load cart items
      const storedCart = await AsyncStorage.getItem(this.STORAGE_KEY);
      if (storedCart) {
        this.cartItems = JSON.parse(storedCart).map((item: any) => ({
          ...item,
          addedAt: new Date(item.addedAt)
        }));
      }

      // Load customer data
      const storedCustomer = await AsyncStorage.getItem(this.CUSTOMER_KEY);
      if (storedCustomer) {
        this.customerData = JSON.parse(storedCustomer);
      }
    } catch (error) {
      console.error('Error initializing cart:', error);
      this.cartItems = [];
      this.customerData = null;
    }
  }

  // Get all cart items
  getCartItems(): CartItem[] {
    return [...this.cartItems];
  }

  // Add package to cart
  async addToCart(packageItem: Package): Promise<void> {
    try {
      // Check if item already exists (prevent duplicates)
      const existingIndex = this.cartItems.findIndex(item => item.id === packageItem.id);

      if (existingIndex < 0) {
        // Add new item if not exists (no duplicates)
        const cartItem: CartItem = {
          ...packageItem,
          quantity: 1,
          addedAt: new Date()
        };
        this.cartItems.push(cartItem);
        await this.saveToStorage();
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  }

  // Remove item from cart
  async removeFromCart(packageId: string): Promise<void> {
    try {
      this.cartItems = this.cartItems.filter(item => item.id !== packageId);
      await this.saveToStorage();
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  }

  // Update item quantity
  async updateQuantity(packageId: string, quantity: number): Promise<void> {
    try {
      const item = this.cartItems.find(item => item.id === packageId);
      if (item) {
        item.quantity = Math.max(1, quantity);
        await this.saveToStorage();
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      throw error;
    }
  }

  // Clear cart
  async clearCart(): Promise<void> {
    try {
      this.cartItems = [];
      await this.saveToStorage();
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  }

  // Get cart total
  getCartTotal(): number {
    return this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  // Get item count
  getItemCount(): number {
    return this.cartItems.reduce((count, item) => count + item.quantity, 0);
  }

  // Check if item is in cart
  isItemInCart(packageId: string): boolean {
    return this.cartItems.some(item => item.id === packageId);
  }

  // Customer data methods
  async saveCustomerData(data: CustomerData): Promise<void> {
    try {
      this.customerData = data;
      await AsyncStorage.setItem(this.CUSTOMER_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving customer data:', error);
      throw error;
    }
  }

  getCustomerData(): CustomerData | null {
    return this.customerData ? { ...this.customerData } : null;
  }

  async clearCustomerData(): Promise<void> {
    try {
      this.customerData = null;
      await AsyncStorage.removeItem(this.CUSTOMER_KEY);
    } catch (error) {
      console.error('Error clearing customer data:', error);
      throw error;
    }
  }

  // Save cart to storage
  private async saveToStorage(): Promise<void> {
    try {
      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.cartItems));
    } catch (error) {
      console.error('Error saving cart to storage:', error);
      throw error;
    }
  }

  // Format price to Indonesian currency
  formatPrice(price: number): string {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  }

  // Get color based on speed
  getSpeedColor(speed: string): string {
    const speedNum = parseInt(speed.replace(/[^\d]/g, ''));
    if (speedNum <= 10) return '#10B981'; // Green for Basic
    if (speedNum <= 20) return '#3B82F6'; // Blue for Family
    if (speedNum <= 30) return '#8B5CF6'; // Purple for Pro
    return '#EF4444'; // Red for Ultra
  }
}

export default CartService.getInstance();