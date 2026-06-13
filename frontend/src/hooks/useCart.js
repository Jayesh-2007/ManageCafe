import { useState } from 'react';

export default function useCart() {
  const [cartItems, setCartItems] = useState([]);

  const addItem = (product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.product_id === product.id);
      if (existing) {
        return prev.map(item => 
          item.product_id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, {
        product_id: product.id,
        name: product.name,
        price: product.price,
        tax_rate: product.tax_rate,
        quantity: 1
      }];
    });
  };

  const removeItem = (productId) => {
    setCartItems(prev => prev.filter(item => item.product_id !== productId));
  };

  const updateQuantity = (productId, delta) => {
    setCartItems(prev => prev.map(item => {
      if (item.product_id === productId) {
        const newQuantity = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  const clearCart = () => setCartItems([]);

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const estimatedTax = cartItems.reduce((sum, item) => sum + ((item.price * (item.tax_rate / 100)) * item.quantity), 0);

  return {
    cartItems,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    subtotal,
    estimatedTax,
    itemCount: cartItems.reduce((sum, item) => sum + item.quantity, 0)
  };
}
