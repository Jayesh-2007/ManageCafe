import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { useNavigate } from 'react-router-dom';

export default function EditOrderModal({ isOpen, onClose, order }) {
  const navigate = useNavigate();

  if (!isOpen || !order) return null;

  // Since POS already has the full cart logic, for editing a draft order, 
  // it's highly recommended to open it in the POS screen, but per requirements we create an edit modal.
  // We'll provide a button to "Open in POS" or show a message.
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Draft Order">
      <div className="space-y-4">
        <p className="text-gray-600">
          You are about to edit draft order <strong>#{order.id}</strong>. 
          To add/remove items or change customers, please open this order in the POS terminal.
        </p>
        <div className="flex gap-3 justify-end pt-4 border-t">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={() => {
            // Ideally navigate to POS with orderId param to load the cart
            navigate('/pos?orderId=' + order.id);
          }}>Open in POS</Button>
        </div>
      </div>
    </Modal>
  );
}
