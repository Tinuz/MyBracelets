// Cart utility functions for managing shopping cart

export interface CartItem {
  id: string;
  type: 'bracelet';
  name: string;
  description: string;
  price: number;
  quantity: number;
  details: {
    braceletType: 'CHAIN' | 'BEADS';
    beads?: Array<{
      id: string;
      name: string;
      color: string;
      colorHex?: string;
      position: number;
      quantity: number;
    }>;
    charms?: Array<{
      id: string;
      name: string;
      position: number;
    }>;
    baseConfig?: {
      metalType?: string;
      chainType?: string;
      thickness?: number;
      length?: number;
      beadSize?: number;
    };
  };
}

export function addToCart(item: Omit<CartItem, 'id'>): string {
  // Generate unique ID
  const itemId = `cart-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  const cartItem: CartItem = {
    ...item,
    id: itemId
  };

  // Get existing cart
  const existingCart = getCart();
  
  // Add new item
  const updatedCart = [...existingCart, cartItem];
  
  // Save to localStorage
  localStorage.setItem('bracelet-cart', JSON.stringify(updatedCart));
  
  console.log('✅ Added to cart:', cartItem);
  
  return itemId;
}

export function getCart(): CartItem[] {
  try {
    const savedCart = localStorage.getItem('bracelet-cart');
    return savedCart ? JSON.parse(savedCart) : [];
  } catch (error) {
    console.error('Error loading cart:', error);
    return [];
  }
}

export function getCartCount(): number {
  const cart = getCart();
  return cart.reduce((total, item) => total + item.quantity, 0);
}

export function getCartTotal(): number {
  const cart = getCart();
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

export function removeFromCart(itemId: string): void {
  const existingCart = getCart();
  const updatedCart = existingCart.filter(item => item.id !== itemId);
  localStorage.setItem('bracelet-cart', JSON.stringify(updatedCart));
}

export function clearCart(): void {
  localStorage.removeItem('bracelet-cart');
}

export function updateCartItemQuantity(itemId: string, quantity: number): void {
  if (quantity <= 0) {
    removeFromCart(itemId);
    return;
  }
  
  const existingCart = getCart();
  const updatedCart = existingCart.map(item => 
    item.id === itemId ? { ...item, quantity } : item
  );
  localStorage.setItem('bracelet-cart', JSON.stringify(updatedCart));
}