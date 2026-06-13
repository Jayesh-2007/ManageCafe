import { useState, useEffect } from 'react';
import api from '../../services/api';
import { LayoutGrid } from 'lucide-react';

export default function CategorySidebar({ activeCategoryId, onSelectCategory }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        setCategories(res.data.data || res.data || []);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="w-24 lg:w-48 bg-white border-r border-gray-200 p-2 flex flex-col gap-2">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="w-24 lg:w-48 bg-white border-r border-gray-200 overflow-y-auto flex flex-col gap-2 p-2">
      <button
        onClick={() => onSelectCategory(null)}
        className={`flex flex-col items-center justify-center p-3 rounded-lg transition-all ${
          activeCategoryId === null 
            ? 'bg-primary-50 text-primary-700 ring-1 ring-primary-200' 
            : 'text-gray-600 hover:bg-gray-50'
        }`}
      >
        <LayoutGrid size={24} className="mb-1" />
        <span className="text-xs font-medium text-center">All Items</span>
      </button>

      {categories.map(category => (
        <button
          key={category.id}
          onClick={() => onSelectCategory(category.id)}
          className={`flex flex-col items-center justify-center p-3 rounded-lg transition-all ${
            activeCategoryId === category.id 
              ? 'bg-primary-50 text-primary-700 ring-1 ring-primary-200' 
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <div 
            className="w-8 h-8 rounded-full mb-1 flex items-center justify-center text-white"
            style={{ backgroundColor: category.color || '#9CA3AF' }}
          >
            {category.name.charAt(0)}
          </div>
          <span className="text-xs font-medium text-center line-clamp-2">{category.name}</span>
          {category.product_count !== undefined && (
             <span className="text-[10px] text-gray-400 mt-0.5">{category.product_count} items</span>
          )}
        </button>
      ))}
    </div>
  );
}
