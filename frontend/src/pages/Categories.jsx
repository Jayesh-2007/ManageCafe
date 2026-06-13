import { useState } from 'react';
import useCrud from '../hooks/useCrud';
import DataTable from '../components/admin/DataTable';
import SearchBar from '../components/admin/SearchBar';
import FormModal from '../components/admin/FormModal';
import DeleteConfirmDialog from '../components/admin/DeleteConfirmDialog';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Plus } from 'lucide-react';

export default function Categories() {
  const { data, loading, search, setSearch, createItem, updateItem, deleteItem } = useCrud('/categories');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({ name: '', color: '#9CA3AF' });
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');

  const openCreate = () => {
    setFormData({ name: '', color: '#9CA3AF' });
    setSelectedItem(null);
    setError('');
    setIsModalOpen(true);
  };

  const openEdit = (item) => {
    setFormData({ name: item.name, color: item.color || '#9CA3AF' });
    setSelectedItem(item);
    setError('');
    setIsModalOpen(true);
  };

  const openDelete = (item) => {
    setSelectedItem(item);
    setIsDeleteOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.name) return setError('Name is required');
    setActionLoading(true);
    try {
      if (selectedItem) await updateItem(selectedItem.id, formData);
      else await createItem(formData);
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
    { key: 'color', label: 'Color', render: (val) => <div className="w-6 h-6 rounded-md shadow-sm border" style={{backgroundColor: val || '#ccc'}}></div> },
    { key: 'name', label: 'Category Name' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Search categories..." />
        <Button onClick={openCreate} className="flex items-center gap-2">
          <Plus size={18} /> Add Category
        </Button>
      </div>

      <DataTable columns={columns} data={data} loading={loading} onEdit={openEdit} onDelete={openDelete} />

      <FormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedItem ? 'Edit Category' : 'New Category'} onSubmit={handleSubmit} loading={actionLoading} error={error}>
        <Input label="Name *" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
        <div className="flex flex-col gap-1">
          <label className="block text-sm font-medium text-gray-700">Color Tag</label>
          <div className="flex items-center gap-3">
            <input type="color" value={formData.color} onChange={e => setFormData({...formData, color: e.target.value})} className="h-10 w-14 rounded border border-gray-300 p-1 cursor-pointer" />
            <span className="text-gray-500 font-mono">{formData.color}</span>
          </div>
        </div>
      </FormModal>

      <DeleteConfirmDialog isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} onConfirm={handleDelete} title="Delete Category" message={`Are you sure you want to delete "${selectedItem?.name}"?`} loading={actionLoading} />
    </div>
  );
}
