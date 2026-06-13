import { useLocation } from 'react-router-dom';
import { useLayout } from '../../contexts/LayoutContext';
import { Menu, Bell, Search } from 'lucide-react';

export default function Header() {
  const { toggleSidebar } = useLayout();
  const location = useLocation();
  
  const path = location.pathname.substring(1);
  const title = path.charAt(0).toUpperCase() + path.slice(1) || 'Dashboard';

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 bg-white/80 backdrop-blur-md border-b border-gray-200 lg:px-8 shadow-sm">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2 -ml-2 text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 transition-colors"
        >
          <Menu size={24} />
        </button>
        
        <div className="hidden sm:block">
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">{title}</h1>
        </div>
      </div>

      {/* Future Ready Slots */}
      <div className="flex items-center gap-3">
        <button className="p-2 text-gray-400 rounded-full hover:text-gray-600 hover:bg-gray-100 transition-all relative">
          <Search size={20} strokeWidth={2.2} />
        </button>
        <button className="p-2 text-gray-400 rounded-full hover:text-gray-600 hover:bg-gray-100 transition-all relative">
          <Bell size={20} strokeWidth={2.2} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
        </button>
      </div>
    </header>
  );
}
