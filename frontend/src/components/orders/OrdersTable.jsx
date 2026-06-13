import { Eye, Edit, Trash2 } from 'lucide-react';
import OrderStatusBadge from './OrderStatusBadge';

export default function OrdersTable({ 
  orders, 
  loading, 
  onView, 
  onEdit, 
  onDelete 
}) {
  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="h-16 bg-gray-100 rounded-lg"></div>
        ))}
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-dashed border-gray-300">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 className="text-sm font-medium text-gray-900">No orders found</h3>
        <p className="text-sm text-gray-500 mt-1">Try adjusting your filters or search.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg shadow-sm hidden md:block">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order #</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">KDS</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {orders.map((order) => (
            <tr key={order.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{order.id}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString()}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.customer?.name || 'Walk-in'}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${Number(order.total || 0).toFixed(2)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm"><OrderStatusBadge status={order.status} type="order" /></td>
              <td className="px-6 py-4 whitespace-nowrap text-sm"><OrderStatusBadge status={order.kds_status} type="kds" /></td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex items-center justify-end gap-2">
                  <button onClick={() => onView(order)} className="p-1 text-gray-400 hover:text-primary-600 rounded"><Eye size={18} /></button>
                  {order.status !== 'paid' && (
                    <>
                      <button onClick={() => onEdit(order)} className="p-1 text-gray-400 hover:text-blue-600 rounded"><Edit size={18} /></button>
                      <button onClick={() => onDelete(order)} className="p-1 text-gray-400 hover:text-red-600 rounded"><Trash2 size={18} /></button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
