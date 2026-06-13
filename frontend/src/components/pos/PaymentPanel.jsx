import { useState } from 'react';
import { orderService } from '../../services/orderService';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { CreditCard, Banknote, CheckCircle2 } from 'lucide-react';

export default function PaymentPanel({ orderId, orderTotal, isOpen, onClose, onSuccess }) {
  const [method, setMethod] = useState('card');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handlePay = async () => {
    setLoading(true);
    setError('');
    try {
      await orderService.payOrder(orderId, { method });
      setSuccess(true);
      setTimeout(() => {
        onSuccess();
        setSuccess(false);
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Payment Complete">
        <div className="flex flex-col items-center py-8">
          <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900">Payment Successful</h2>
          <p className="text-gray-500 mt-2">The order has been completed.</p>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Process Payment">
      <div className="space-y-6">
        <div className="bg-gray-50 p-4 rounded-lg flex justify-between items-center text-lg font-bold border">
          <span>Amount Due:</span>
          <span>${Number(orderTotal || 0).toFixed(2)}</span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setMethod('card')}
            className={`p-4 border rounded-lg flex flex-col items-center gap-2 transition-all ${method === 'card' ? 'bg-primary-50 border-primary-500 text-primary-700 ring-1 ring-primary-500' : 'hover:bg-gray-50'}`}
          >
            <CreditCard size={28} />
            <span className="font-medium">Credit Card</span>
          </button>
          
          <button
            onClick={() => setMethod('cash')}
            className={`p-4 border rounded-lg flex flex-col items-center gap-2 transition-all ${method === 'cash' ? 'bg-primary-50 border-primary-500 text-primary-700 ring-1 ring-primary-500' : 'hover:bg-gray-50'}`}
          >
            <Banknote size={28} />
            <span className="font-medium">Cash</span>
          </button>
        </div>

        {error && <div className="text-red-500 text-sm bg-red-50 p-3 rounded">{error}</div>}

        <div className="pt-4 border-t flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={loading}>Cancel</Button>
          <Button onClick={handlePay} disabled={loading} className="w-32">
            {loading ? 'Processing...' : 'Pay Now'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
