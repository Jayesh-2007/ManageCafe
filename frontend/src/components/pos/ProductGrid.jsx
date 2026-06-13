import { useState, useEffect } from 'react';
import api from '../../services/api';
import useDebounce from '../../hooks/useDebounce';
import { Plus } from 'lucide-react';

export default function ProductGrid({ categoryId, searchQuery, onAddProduct }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const debouncedSearch = useDebounce(searchQuery, 300);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = { page: 1, limit: 50 };
        if (categoryId) params.category_id = categoryId;
        if (debouncedSearch) params.search = debouncedSearch;
        
        const res = await api.get('/products', { params });
        // Assume standard pagination or direct array
        setProducts(res.data.data || res.data || []);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [categoryId, debouncedSearch]);

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
          <div key={i} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 animate-pulse">
            <div className="h-24 bg-gray-100 rounded-lg mb-3"></div>
            <div className="h-4 bg-gray-100 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-100 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-gray-500">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <span className="text-2xl">🍽️</span>
        </div>
        <p className="text-lg font-medium">No products found</p>
        <p className="text-sm">Try adjusting your filters or search.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4 overflow-y-auto">
      {products.map(product => (
        <button
          key={product.id}
          onClick={() => onAddProduct(product)}
          className="group flex flex-col bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-100 transition-all text-left overflow-hidden relative active:scale-95"
        >
          {/* Mock Image Area */}
          <div className="h-28 w-full bg-gray-50 flex items-center justify-center border-b border-gray-100 group-hover:bg-primary-50 transition-colors">
             <span className="text-3xl opacity-50">{product.name.charAt(0)}</span>
          </div>
          
          <div className="p-3 flex-1 flex flex-col">
            <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-1">{product.name}</h3>
            <div className="mt-auto flex items-center justify-between">
              <span className="text-primary-700 font-bold">${(product.price).toFixed(2)}</span>
              {product.tax_rate > 0 && (
                <span className="text-[10px] text-gray-400">+{product.tax_rate}% Tax</span>
              )}
            </div>
          </div>

          <div className="absolute top-2 right-2 w-6 h-6 bg-white shadow rounded-full flex items-center justify-center text-primary-600 opacity-0 group-hover:opacity-100 transition-opacity">
            <Plus size={16} />
          </div>
        </button>
      ))}
    </div>
  );
}
