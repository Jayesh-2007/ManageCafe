import { useState, useEffect } from 'react';
import { kdsService } from '../../services/kdsService';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

export default function KDSOrderDetailsModal({ orderId, isOpen, onClose, onUpdateStatus }) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !orderId) return;
    const fetchOrder = async () => {
      setLoading(true);
      try {
        const res = await kdsService.getKDSOrderDetails(orderId);
        setOrder(res.order || res);
      } catch {
        console.error('Failed to fetch details');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [isOpen, orderId]);

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Order #${orderId} Details`}>
      {loading || !order ? (
        <div className="p-8 text-center text-gray-500">Loading order details...</div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg border">
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Customer</p>
              <p className="font-semibold text-gray-900">{order.customer?.name || 'Walk-in'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Table</p>
              <p className="font-semibold text-gray-900">{order.table_id || 'Takeaway'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Time</p>
              <p className="font-semibold text-gray-900">{new Date(order.created_at).toLocaleTimeString()}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Current Status</p>
              <p className="font-semibold text-gray-900 capitalize">{order.kds_status.replace('_', ' ')}</p>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-3 uppercase tracking-wide text-sm border-b pb-2">Items to Prepare</h4>
            <div className="space-y-3">
              {(order.items || []).map((item, idx) => (
                <div key={idx} className="flex justify-between items-start text-sm bg-white p-3 border rounded-lg shadow-sm">
                  <div className="flex gap-3">
                    <span className="font-bold text-lg text-primary-600 bg-primary-50 px-2 py-0.5 rounded">{item.quantity}x</span>
                    <div>
                      <span className="font-semibold text-gray-900 block text-base">{item.product?.name || item.name}</span>
                      {item.notes && <span className="text-xs text-red-500 italic mt-1 block">Note: {item.notes}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t pt-4 flex gap-3 justify-end">
            <Button variant="outline" onClick={onClose}>Close</Button>
            {order.kds_status === 'to_cook' && (
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-white" onClick={() => { onUpdateStatus(order.id, 'preparing'); onClose(); }}>
                Start Preparing
              </Button>
            )}
            {order.kds_status === 'preparing' && (
              <Button onClick={() => { onUpdateStatus(order.id, 'completed'); onClose(); }}>
                Mark Complete
              </Button>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
}
