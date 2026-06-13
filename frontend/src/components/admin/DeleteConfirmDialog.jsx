import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { AlertTriangle } from 'lucide-react';

export default function DeleteConfirmDialog({ isOpen, onClose, onConfirm, title, message, loading }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirm Deletion">
      <div className="flex flex-col items-center text-center py-4">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
          <AlertTriangle size={32} />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-500 mb-6">{message}</p>
        
        <div className="flex gap-3 w-full justify-center border-t pt-4">
          <Button variant="outline" onClick={onClose} disabled={loading} className="w-full">Cancel</Button>
          <Button variant="danger" onClick={onConfirm} disabled={loading} className="w-full">
            {loading ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
