import { Clock, CheckCircle2 } from 'lucide-react';
import Button from '../ui/Button';

export default function OrderCard({ order, onUpdateStatus, onViewDetails }) {
  const getStatusColor = (status) => {
    switch(status) {
      case 'to_cook': return 'bg-yellow-500';
      case 'preparing': return 'bg-primary-500';
      case 'completed': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getBorderColor = (status) => {
    switch(status) {
      case 'to_cook': return 'border-yellow-200';
      case 'preparing': return 'border-primary-200';
      case 'completed': return 'border-green-200';
      default: return 'border-gray-200';
    }
  };

  const totalItems = (order.items || []).reduce((sum, item) => sum + item.quantity, 0);

  // Calculate elapsed time (naive approach for display)
  const created = new Date(order.created_at);
  const now = new Date();
  const diffMins = Math.floor((now - created) / 60000);
  const timeString = diffMins < 1 ? 'Just now' : `${diffMins} min ago`;

  return (
    <div className={`bg-white rounded-xl border shadow-sm flex flex-col overflow-hidden transition-shadow hover:shadow-md ${getBorderColor(order.kds_status)}`}>
      <div className="p-3 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${getStatusColor(order.kds_status)}`}></div>
          <span className="font-bold text-gray-900">#{order.id}</span>
        </div>
        <div className="flex items-center gap-1 text-sm font-medium text-gray-500">
          <Clock size={14} />
          {timeString}
        </div>
      </div>
      
      <div className="p-4 flex-1 cursor-pointer" onClick={() => onViewDetails(order.id)}>
        <div className="mb-3">
          <p className="text-sm font-semibold text-gray-900 truncate">
            {order.customer?.name || 'Walk-in Customer'}
          </p>
          <p className="text-xs text-gray-500">Table: {order.table_id || 'Takeaway'}</p>
        </div>

        <div className="space-y-1.5 border-t border-gray-100 pt-3">
          {(order.items || []).slice(0, 3).map((item, idx) => (
            <div key={idx} className="flex justify-between text-sm">
              <span className="text-gray-700 truncate pr-2"><span className="font-semibold text-gray-900">{item.quantity}x</span> {item.product?.name || item.name}</span>
            </div>
          ))}
          {(order.items || []).length > 3 && (
            <div className="text-xs text-gray-400 pt-1 font-medium italic">
              +{(order.items.length - 3)} more items
            </div>
          )}
        </div>
      </div>

      <div className="p-3 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-500 bg-gray-200 px-2 py-1 rounded">
          {totalItems} Items
        </span>
        
        {order.kds_status === 'to_cook' && (
          <Button size="sm" className="bg-yellow-500 hover:bg-yellow-600 text-white" onClick={() => onUpdateStatus(order.id, 'preparing')}>
            Start Preparing
          </Button>
        )}
        {order.kds_status === 'preparing' && (
          <Button size="sm" onClick={() => onUpdateStatus(order.id, 'completed')}>
            Mark Complete
          </Button>
        )}
        {order.kds_status === 'completed' && (
          <span className="text-sm font-bold text-green-600 flex items-center gap-1">
            <CheckCircle2 size={16} /> Done
          </span>
        )}
      </div>
    </div>
  );
}
