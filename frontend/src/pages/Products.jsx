import { useState, useEffect } from 'react';
import useCrud from '../hooks/useCrud';
import { categoryService } from '../services/categoryService';
import DataTable from '../components/admin/DataTable';
import SearchBar from '../components/admin/SearchBar';
import Pagination from '../components/admin/Pagination';
import FormModal from '../components/admin/FormModal';
import DeleteConfirmDialog from '../components/admin/DeleteConfirmDialog';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Plus } from 'lucide-react';

export default function Products() {
  const { data, total, loading, page, setPage, search, setSearch, filters, setFilters, createItem, updateItem, deleteItem } = useCrud('/products');
  const [categories, setCategories] = useState([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({ name: '', price: '', category_id: '', tax_rate: '', description: '' });
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    categoryService.getAll().then(res => setCategories(res.data || [])).catch(() => {});
  }, []);

  const openCreate = () => {
    setFormData({ name: '', price: '', category_id: '', tax_rate: '0', description: '' });
    setSelectedItem(null);
    setError('');
    setIsModalOpen(true);
  };

  const openEdit = (item) => {
    setFormData({ name: item.name, price: item.price, category_id: item.category_id || '', tax_rate: item.tax_rate || '0', description: item.description || '' });
    setSelectedItem(item);
    setError('');
    setIsModalOpen(true);
  };

  const openDelete = (item) => {
    setSelectedItem(item);
    setIsDeleteOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.price || !formData.category_id) return setError('Please fill all required fields.');
    setActionLoading(true);
    try {
      const payload = { ...formData, price: Number(formData.price), tax_rate: Number(formData.tax_rate) };
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
    { key: 'name', label: 'Name' },
    { key: 'category', label: 'Category', render: (_, row) => row.category?.name || 'Uncategorized' },
    { key: 'price', label: 'Price', render: (val) => `$${Number(val).toFixed(2)}` },
    { key: 'tax_rate', label: 'Tax', render: (val) => `${val}%` }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex gap-4 flex-1">
          <SearchBar value={search} onChange={setSearch} placeholder="Search products..." />
          <select 
            className="border-gray-300 rounded-md text-sm bg-white focus:ring-primary-500 focus:border-primary-500"
            value={filters.category_id || ''}
            onChange={(e) => setFilters(e.target.value ? { category_id: e.target.value } : {})}
          >
            <option value="">All Categories</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <Button onClick={openCreate} className="flex items-center gap-2">
          <Plus size={18} /> Add Product
        </Button>
      </div>

      <DataTable columns={columns} data={data} loading={loading} onEdit={openEdit} onDelete={openDelete} />
      <Pagination page={page} setPage={setPage} total={total} />

      <FormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedItem ? 'Edit Product' : 'New Product'} onSubmit={handleSubmit} loading={actionLoading} error={error}>
        <Input label="Name *" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
        <div className="grid grid-cols-2 gap-4">
          <Input label="Price *" type="number" step="0.01" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required />
          <Input label="Tax Rate (%)" type="number" step="0.01" value={formData.tax_rate} onChange={e => setFormData({...formData, tax_rate: e.target.value})} />
        </div>
        <div className="flex flex-col gap-1">
          <label className="block text-sm font-medium text-gray-700">Category *</label>
          <select 
            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm px-3 py-2 border"
            value={formData.category_id}
            onChange={e => setFormData({...formData, category_id: e.target.value})}
            required
          >
            <option value="">Select Category</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
      </FormModal>

      <DeleteConfirmDialog isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} onConfirm={handleDelete} title="Delete Product" message={`Are you sure you want to delete "${selectedItem?.name}"?`} loading={actionLoading} />
    </div>
  );
}
