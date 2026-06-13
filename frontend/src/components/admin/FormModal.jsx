import Modal from '../ui/Modal';
import Button from '../ui/Button';

export default function FormModal({ isOpen, onClose, title, onSubmit, loading, error, children }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-4">
        {error && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}
        
        {children}

        <div className="pt-4 border-t flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} type="button" disabled={loading}>Cancel</Button>
          <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</Button>
        </div>
      </form>
    </Modal>
  );
}
