import { useState } from 'react';
import CartPanel from '../components/CartPanel';
import CategorySidebar from '../components/CategorySidebar';
import ProductGrid from '../components/ProductGrid';

const categories = ['Chaat', 'Beverages', 'Meal', 'Dessert'];

const products = [
  { id: 'chaat-1', name: 'Samosa Chaat', price: 50, category: 'Chaat' },
  { id: 'chaat-2', name: 'Pani Puri', price: 40, category: 'Chaat' },
  { id: 'chaat-3', name: 'Bhel Puri', price: 45, category: 'Chaat' },
  { id: 'bev-1', name: 'Masala Tea', price: 20, category: 'Beverages' },
  { id: 'bev-2', name: 'Cold Coffee', price: 80, category: 'Beverages' },
  { id: 'meal-1', name: 'Veg Thali', price: 150, category: 'Meal' },
  { id: 'dessert-1', name: 'Gulab Jamun', price: 60, category: 'Dessert' },
  { id: 'dessert-2', name: 'Kulfi', price: 50, category: 'Dessert' },
];

function POSPage() {
  const [cartItems, setCartItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Chaat');

  function addProductToCart(product) {
    setCartItems((currentItems) => {
      const existingItemIndex = currentItems.findIndex((item) => item.productId === product.id);

      if (existingItemIndex > -1) {
        const updatedItems = [...currentItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + 1,
        };
        return updatedItems;
      } else {
        return [
          ...currentItems,
          {
            cartId: `${product.id}-${currentItems.length}`,
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
          },
        ];
      }
    });
  }

  function updateCartItemQuantity(productId, quantity) {
    setCartItems((currentItems) => {
      if (quantity <= 0) {
        return currentItems.filter((item) => item.productId !== productId);
      }
      return currentItems.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      );
    });
  }

  const filteredProducts = products.filter((product) => product.category === selectedCategory);

  return (
    <main className="flex min-h-screen flex-col bg-background text-copy-primary lg:flex-row">
      <CategorySidebar
        categories={categories}
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
      />
      <ProductGrid products={filteredProducts} onProductSelect={addProductToCart} />
      <CartPanel items={cartItems} onQuantityChange={updateCartItemQuantity} />
    </main>
  );
}

export default POSPage;
