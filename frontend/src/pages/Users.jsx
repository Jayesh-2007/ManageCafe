import { Lock } from 'lucide-react';
import DataTable from '../components/admin/DataTable';
import StatusBadge from '../components/admin/StatusBadge';

export default function Users() {
  // Read-only mock data for demonstration as backend lacks user management endpoints
  const mockUsers = [
    { id: 1, name: 'Admin User', email: 'admin@cafepos.com', role: 'admin', is_active: true },
    { id: 2, name: 'Cashier One', email: 'cashier1@cafepos.com', role: 'employee', is_active: true },
    { id: 3, name: 'Kitchen Staff', email: 'kitchen@cafepos.com', role: 'employee', is_active: false },
  ];

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role', render: (val) => <span className="capitalize font-medium">{val}</span> },
    { key: 'is_active', label: 'Status', render: (val) => <StatusBadge active={val} /> }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-lg flex items-start gap-4">
        <Lock className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-bold text-blue-900 mb-1">System Users Managed Externally</h3>
          <p className="text-sm">
            Backend user management endpoints are currently unavailable. This is a read-only view of the system's users. 
            User creation, modification, and deletion actions have been disabled to maintain system integrity.
          </p>
        </div>
      </div>

      <div className="relative">
        <DataTable columns={columns} data={mockUsers} loading={false} readOnly={true} />
        {/* Subtle overlay to reinforce read-only nature without completely hiding data */}
        <div className="absolute inset-0 bg-gray-50/20 pointer-events-none rounded-lg border border-gray-100"></div>
      </div>
    </div>
  );
}
