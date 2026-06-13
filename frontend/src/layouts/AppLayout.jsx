import { Outlet } from 'react-router-dom';
import { LayoutProvider, useLayout } from '../contexts/LayoutContext';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import Breadcrumb from '../components/common/Breadcrumb';

function LayoutContent() {
  const { isSidebarCollapsed } = useLayout();

  return (
    <div className="flex h-screen bg-gray-50 font-sans selection:bg-primary-100 selection:text-primary-900">
      <Sidebar />
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'}`}>
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-6">
              <Breadcrumb />
            </div>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default function AppLayout() {
  return (
    <LayoutProvider>
      <LayoutContent />
    </LayoutProvider>
  );
}
