import { useState, useEffect } from 'react';
import api from '../../services/api';
import useDebounce from '../../hooks/useDebounce';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { Search, UserPlus } from 'lucide-react';

export default function CustomerModal({ isOpen, onClose, onSelect }) {
  const [search, setSearch] = useState('');
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const debouncedSearch = useDebounce(search, 300);

  const [mode, setMode] = useState('search'); // 'search' or 'create'
  const [formData, setFormData] = useState({ name: '', phone: '', email: '' });
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    const fetchCustomers = async () => {
      setLoading(true);
      try {
        const res = await api.get('/customers', { params: { search: debouncedSearch, limit: 5 } });
        setCustomers(res.data.data || res.data || []);
      } catch {
        console.error('Failed to fetch customers');
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, [debouncedSearch, isOpen]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.name) return setFormError('Name is required');
    if (formData.phone && formData.phone.length !== 10) return setFormError('Phone must be 10 digits');
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) return setFormError('Invalid email format');
    
    setFormError('');
    try {
      const res = await api.post('/customers', formData);
      onSelect(res.data.customer || res.data);
      onClose();
    } catch (error) {
      setFormError(error.response?.data?.message || 'Failed to create customer');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={mode === 'search' ? 'Select Customer' : 'New Customer'}>
      {mode === 'search' ? (
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or phone..."
              className="w-full pl-10 pr-4 py-2 border rounded-md"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div className="border rounded-md divide-y max-h-60 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-500">Loading...</div>
            ) : customers.length > 0 ? (
              customers.map(c => (
                <button
                  key={c.id}
                  onClick={() => { onSelect(c); onClose(); }}
                  className="w-full flex justify-between items-center p-3 hover:bg-gray-50 text-left"
                >
                  <div>
                    <div className="font-medium">{c.name}</div>
                    <div className="text-xs text-gray-500">{c.phone || 'No phone'} | {c.email || 'No email'}</div>
                  </div>
                  <span className="text-primary-600 font-medium text-sm">Select</span>
                </button>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">No customers found</div>
            )}
          </div>
          
          <Button variant="outline" className="w-full flex justify-center gap-2" onClick={() => setMode('create')}>
            <UserPlus size={18} /> Create New Customer
          </Button>
        </div>
      ) : (
        <form onSubmit={handleCreate} className="space-y-4">
          {formError && <div className="text-red-500 text-sm bg-red-50 p-2 rounded">{formError}</div>}
          <Input label="Full Name" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          <Input label="Phone (10 digits)" type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
          <Input label="Email" type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
          
          <div className="flex gap-3 justify-end pt-2">
            <Button variant="outline" onClick={() => setMode('search')} type="button">Cancel</Button>
            <Button type="submit">Save Customer</Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
