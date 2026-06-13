import { useState } from 'react';
import CategorySidebar from '../components/pos/CategorySidebar';
import ProductGrid from '../components/pos/ProductGrid';
import ProductSearch from '../components/pos/ProductSearch';
import CartPanel from '../components/pos/CartPanel';
import useCart from '../hooks/useCart';

export default function POS() {
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const cart = useCart();

  return (
    <div className="flex h-[calc(100vh-64px)] -mx-4 sm:-mx-6 lg:-mx-8 -my-8 overflow-hidden bg-gray-100">
      {/* Category Sidebar */}
      <CategorySidebar 
        activeCategoryId={activeCategoryId} 
        onSelectCategory={setActiveCategoryId} 
      />

      {/* Main Product Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <div className="bg-white p-4 shadow-sm z-10 border-b border-gray-200">
          <ProductSearch 
            searchQuery={searchQuery} 
            onSearchChange={setSearchQuery} 
          />
        </div>
        
        <ProductGrid 
          categoryId={activeCategoryId}
          searchQuery={searchQuery}
          onAddProduct={cart.addItem}
        />
      </div>

      {/* Right Cart Panel (Hidden on mobile unless toggled, handled by responsive classes if needed) */}
      <div className="hidden md:block">
        <CartPanel cart={cart} />
      </div>
      
      {/* Mobile Cart Toggle Overlay (Simplified for this version) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-40">
        <button 
          onClick={() => alert('Mobile cart panel can be opened here')}
          className="w-full bg-primary-600 text-white font-semibold py-3 rounded-xl flex justify-between px-6"
        >
          <span>{cart.itemCount} Items</span>
          <span>View Cart &rarr;</span>
        </button>
      </div>
    </div>
  );
}
