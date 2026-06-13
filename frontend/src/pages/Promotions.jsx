import { useState } from 'react';
import useCrud from '../hooks/useCrud';
import DataTable from '../components/admin/DataTable';
import SearchBar from '../components/admin/SearchBar';
import FormModal from '../components/admin/FormModal';
import DeleteConfirmDialog from '../components/admin/DeleteConfirmDialog';
import StatusBadge from '../components/admin/StatusBadge';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Plus } from 'lucide-react';

export default function Promotions() {
  const { data, loading, search, setSearch, createItem, updateItem, deleteItem } = useCrud('/promotions');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({ code: '', discount_type: 'percentage', discount_value: '', is_active: true });
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');

  const openCreate = () => {
    setFormData({ code: '', discount_type: 'percentage', discount_value: '', is_active: true });
    setSelectedItem(null);
    setError('');
    setIsModalOpen(true);
  };

  const openEdit = (item) => {
    setFormData({ code: item.code, discount_type: item.discount_type, discount_value: item.discount_value, is_active: item.is_active });
    setSelectedItem(item);
    setError('');
    setIsModalOpen(true);
  };

  const openDelete = (item) => {
    setSelectedItem(item);
    setIsDeleteOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.code || !formData.discount_value) return setError('Code and discount value required');
    setActionLoading(true);
    try {
      const payload = { ...formData, discount_value: Number(formData.discount_value), code: formData.code.toUpperCase() };
      if (selectedItem) await updateItem(selectedItem.id, payload);
      else await createItem(payload);
      setIsModalOpen(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Action failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    setActionLoading(true);
    try {
      await deleteItem(selectedItem.id);
      setIsDeleteOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const columns = [
    { key: 'code', label: 'Promo Code', render: (val) => <span className="font-mono font-bold">{val}</span> },
    { key: 'discount_type', label: 'Type', render: (val) => <span className="capitalize">{val}</span> },
    { key: 'discount_value', label: 'Value', render: (val, row) => row.discount_type === 'percentage' ? `${val}%` : `$${val}` },
    { key: 'is_active', label: 'Status', render: (val) => <StatusBadge active={val} /> }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Search promo codes..." />
        <Button onClick={openCreate} className="flex items-center gap-2">
          <Plus size={18} /> Add Promotion
        </Button>
      </div>

      <DataTable columns={columns} data={data} loading={loading} onEdit={openEdit} onDelete={openDelete} />

      <FormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedItem ? 'Edit Promotion' : 'New Promotion'} onSubmit={handleSubmit} loading={actionLoading} error={error}>
        <Input label="Code *" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} className="uppercase" required />
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="block text-sm font-medium text-gray-700">Type</label>
            <select 
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm px-3 py-2 border"
              value={formData.discount_type}
              onChange={e => setFormData({...formData, discount_type: e.target.value})}
            >
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed Amount</option>
            </select>
          </div>
          <Input label="Discount Value *" type="number" step="0.01" value={formData.discount_value} onChange={e => setFormData({...formData, discount_value: e.target.value})} required />
        </div>
        <div className="flex items-center gap-2 pt-2">
          <input type="checkbox" id="is_active" checked={formData.is_active} onChange={e => setFormData({...formData, is_active: e.target.checked})} className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500" />
          <label htmlFor="is_active" className="text-sm text-gray-700 font-medium">Promotion is active</label>
        </div>
      </FormModal>

      <DeleteConfirmDialog isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} onConfirm={handleDelete} title="Delete Promotion" message={`Are you sure you want to delete promo code "${selectedItem?.code}"?`} loading={actionLoading} />
    </div>
  );
}
