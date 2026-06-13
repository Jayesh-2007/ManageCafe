import Modal from '../ui/Modal';
import Button from '../ui/Button';

export default function DeleteOrderDialog({ isOpen, onClose, onConfirm, order }) {
  if (!isOpen || !order) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Draft Order">
      <div className="space-y-4 text-center">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </div>
        <p className="text-gray-600">
          Are you sure you want to delete order <strong>#{order.id}</strong>?
        </p>
        <p className="text-sm text-gray-500">
          Customer: {order.customer?.name || 'Walk-in'} <br/>
          Total: ${Number(order.total || 0).toFixed(2)}
        </p>
        <p className="text-red-500 text-sm font-medium">This action cannot be undone.</p>
        
        <div className="flex gap-3 justify-center pt-4 border-t">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="danger" onClick={() => onConfirm(order.id)}>Delete Order</Button>
        </div>
      </div>
    </Modal>
  );
}
