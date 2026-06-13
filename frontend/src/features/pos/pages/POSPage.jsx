import { useState } from 'react';
import CartPanel from '../components/CartPanel';
import CategorySidebar from '../components/CategorySidebar';
import ProductGrid from '../components/ProductGrid';

const categories = ['Chaat', 'Beverages', 'Meal', 'Desert'];

const products = [
  { id: 'chaat-1', name: 'Samosa Chaat', price: 50 },
  { id: 'chaat-2', name: 'Pani Puri', price: 40 },
  { id: 'chaat-3', name: 'Bhel Puri', price: 45 },
  { id: 'bev-1', name: 'Masala Tea', price: 20 },
  { id: 'bev-2', name: 'Cold Coffee', price: 80 },
  { id: 'meal-1', name: 'Veg Thali', price: 150 },
];

function POSPage() {
  const [cartItems, setCartItems] = useState([]);

  function addProductToCart(product) {
    setCartItems((currentItems) => [
      ...currentItems,
      {
        cartId: `${product.id}-${currentItems.length}`,
        productId: product.id,
        name: product.name,
        quantity: 1,
      },
    ]);
  }

  return (
    <main className="flex min-h-screen flex-col bg-background text-copy-primary lg:flex-row">
      <CategorySidebar categories={categories} />
      <ProductGrid products={products} onProductSelect={addProductToCart} />
      <CartPanel items={cartItems} />
    </main>
  );
}

export default POSPage;
