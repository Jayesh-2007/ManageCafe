import { useState } from 'react';
import useCrud from '../hooks/useCrud';
import DataTable from '../components/admin/DataTable';
import SearchBar from '../components/admin/SearchBar';
import Pagination from '../components/admin/Pagination';
import FormModal from '../components/admin/FormModal';
import DeleteConfirmDialog from '../components/admin/DeleteConfirmDialog';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Plus } from 'lucide-react';

export default function Customers() {
  const { data, total, loading, page, setPage, search, setSearch, createItem, updateItem, deleteItem } = useCrud('/customers');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');

  const openCreate = () => {
    setFormData({ name: '', email: '', phone: '' });
    setSelectedItem(null);
    setError('');
    setIsModalOpen(true);
  };

  const openEdit = (item) => {
    setFormData({ name: item.name, email: item.email || '', phone: item.phone || '' });
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
    if (formData.phone && formData.phone.length !== 10) return setError('Phone must be 10 digits');
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
    { key: 'name', label: 'Name' },
    { key: 'phone', label: 'Phone', render: (val) => val || '-' },
    { key: 'email', label: 'Email', render: (val) => val || '-' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Search customers..." />
        <Button onClick={openCreate} className="flex items-center gap-2">
          <Plus size={18} /> Add Customer
        </Button>
      </div>

      <DataTable columns={columns} data={data} loading={loading} onEdit={openEdit} onDelete={openDelete} />
      <Pagination page={page} setPage={setPage} total={total} />

      <FormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedItem ? 'Edit Customer' : 'New Customer'} onSubmit={handleSubmit} loading={actionLoading} error={error}>
        <Input label="Name *" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
        <Input label="Phone (10 digits)" type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
        <Input label="Email" type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
      </FormModal>

      <DeleteConfirmDialog isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} onConfirm={handleDelete} title="Delete Customer" message={`Are you sure you want to delete "${selectedItem?.name}"?`} loading={actionLoading} />
    </div>
  );
}
