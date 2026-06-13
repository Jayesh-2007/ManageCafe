import { Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';

export default function AppLayout() {
  const { logout, currentUser, role } = useAuth();

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar Placeholder */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:block">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold text-primary-600">ManageCafe</h1>
        </div>
        <nav className="p-4">
          <div className="text-gray-500 text-sm mb-4">Navigation</div>
          {/* Menu items will go here */}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header Placeholder */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <div className="font-semibold text-gray-800">
            {role === 'admin' ? 'Admin Dashboard' : 'Employee Dashboard'}
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              <span className="font-medium">{currentUser?.name}</span> ({role})
            </div>
            <Button variant="outline" onClick={logout} className="text-sm py-1.5 px-3">
              Logout
            </Button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
