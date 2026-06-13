import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLayout } from '../../contexts/LayoutContext';
import { NAVIGATION } from '../../constants/navigation';
import { LogOut, X, ChevronLeft, ChevronRight, Store } from 'lucide-react';
import Badge from '../ui/Badge';

export default function Sidebar() {
  const { role, currentUser, logout } = useAuth();
  const { isSidebarOpen, setIsSidebarOpen, isSidebarCollapsed, toggleCollapse } = useLayout();

  const authorizedLinks = NAVIGATION.filter(item => item.roles.includes(role));

  const sidebarClasses = `
    fixed inset-y-0 left-0 z-50 flex flex-col bg-white border-r border-gray-200 transition-all duration-300 ease-in-out
    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
    ${isSidebarCollapsed ? 'w-20' : 'w-64'}
  `;

  return (
    <>
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Content */}
      <aside className={sidebarClasses}>
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-100">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-sm">
              <Store size={18} strokeWidth={2.5} />
            </div>
            {!isSidebarCollapsed && (
              <span className="text-xl font-bold text-gray-900 truncate tracking-tight">ManageCafe</span>
            )}
          </div>
          
          <button 
            className="lg:hidden text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1.5 rounded-md transition-colors"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1.5 scrollbar-hide">
          {!isSidebarCollapsed && (
            <div className="px-3 mb-3 text-xs font-semibold tracking-wider text-gray-400 uppercase">
              Main Menu
            </div>
          )}
          
          {authorizedLinks.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className={({ isActive }) => `
                  flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group
                  ${isActive 
                    ? 'bg-primary-50 text-primary-700 font-semibold shadow-sm ring-1 ring-primary-100/50' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-medium'}
                  ${isSidebarCollapsed ? 'justify-center' : ''}
                `}
                title={isSidebarCollapsed ? item.name : ''}
              >
                <Icon size={20} strokeWidth={2.2} className={({ isActive }) => `
                  flex-shrink-0 transition-colors
                  ${isActive ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-600'}
                `} />
                {!isSidebarCollapsed && <span>{item.name}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/50">
          <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-3'} mb-4`}>
            <div className="w-10 h-10 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-primary-600 font-semibold flex-shrink-0">
              {currentUser?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            {!isSidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{currentUser?.name}</p>
                <Badge variant={role === 'admin' ? 'purple' : 'blue'}>{role}</Badge>
              </div>
            )}
          </div>
          
          <button
            onClick={logout}
            className={`flex items-center gap-3 w-full px-3 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors ${isSidebarCollapsed ? 'justify-center' : ''}`}
            title={isSidebarCollapsed ? 'Logout' : ''}
          >
            <LogOut size={18} strokeWidth={2.2} />
            {!isSidebarCollapsed && <span>Logout</span>}
          </button>
        </div>

        {/* Collapse Toggle (Desktop Only) */}
        <button
          onClick={toggleCollapse}
          className="hidden lg:flex absolute -right-3 top-20 bg-white border border-gray-200 rounded-full p-1.5 text-gray-400 hover:text-primary-600 shadow-sm transition-colors"
        >
          {isSidebarCollapsed ? <ChevronRight size={14} strokeWidth={3} /> : <ChevronLeft size={14} strokeWidth={3} />}
        </button>
      </aside>
    </>
  );
}
