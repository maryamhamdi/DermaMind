// Utility functions for cart and wishlist localStorage

export function getGuestCart() {
  try {
    return JSON.parse(localStorage.getItem('cart-guest') || '[]');
  } catch {
    return [];
  }
}

export function setGuestCart(products: unknown) {
  localStorage.setItem('cart-guest', JSON.stringify(products));
}

export function clearGuestCart() {
  localStorage.removeItem('cart-guest');
}

export function getGuestWishlist() {
  try {
    return JSON.parse(localStorage.getItem('wishlist-guest') || '[]');
  } catch {
    return [];
  }
}

export function setGuestWishlist(products: unknown) {
  localStorage.setItem('wishlist-guest', JSON.stringify(products));
}

export function clearGuestWishlist() {
  localStorage.removeItem('wishlist-guest');
}
