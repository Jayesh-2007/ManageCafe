import { useState, useEffect } from 'react';
import { orderService } from '../../services/orderService';
import Modal from '../ui/Modal';
import OrderStatusBadge from './OrderStatusBadge';
import OrderTimeline from './OrderTimeline';

export default function OrderDetailsModal({ orderId, isOpen, onClose }) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !orderId) return;
    const fetchOrder = async () => {
      setLoading(true);
      try {
        const res = await orderService.getOrder(orderId);
        setOrder(res.order || res);
      } catch {
        console.error('Failed to fetch order details');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [isOpen, orderId]);

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Order #${orderId}`}>
      {loading || !order ? (
        <div className="p-8 text-center text-gray-500">Loading order details...</div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-start bg-gray-50 p-4 rounded-lg border">
            <div>
              <p className="text-sm text-gray-500">Customer</p>
              <p className="font-semibold">{order.customer?.name || 'Walk-in'}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Date</p>
              <p className="font-semibold">{new Date(order.created_at).toLocaleString()}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <OrderStatusBadge status={order.status} type="order" />
            <OrderStatusBadge status={order.kds_status} type="kds" />
          </div>

          <OrderTimeline order={order} />

          <div>
            <h4 className="font-medium text-gray-900 mb-2 border-b pb-2">Order Items</h4>
            <div className="space-y-2">
              {(order.items || []).map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span>{item.quantity}x {item.product?.name || item.name}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t pt-4 space-y-1 text-sm text-gray-600">
            <div className="flex justify-between"><span>Subtotal</span><span>${(order.subtotal || 0).toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Tax</span><span>${(order.tax_total || 0).toFixed(2)}</span></div>
            {(order.discount_total > 0) && (
              <div className="flex justify-between text-green-600"><span>Discount</span><span>-${(order.discount_total || 0).toFixed(2)}</span></div>
            )}
            <div className="flex justify-between font-bold text-gray-900 text-lg pt-2 border-t">
              <span>Total</span><span>${(order.total || 0).toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}
