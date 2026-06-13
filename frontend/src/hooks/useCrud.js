import { useState, useCallback, useEffect } from 'react';
import api from '../services/api';
import useDebounce from './useDebounce';

export default function useCrud(endpoint, initialLimit = 20) {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({});
  const debouncedSearch = useDebounce(search, 500);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: initialLimit, search: debouncedSearch, ...filters };
      const res = await api.get(endpoint, { params });
      // Adaptive unpacking for different backend response formats
      setData(res.data.data || res.data || []);
      setTotal(res.data.total || 0);
    } catch (error) {
      console.error(`Failed to fetch ${endpoint}`, error);
    } finally {
      setLoading(false);
    }
  }, [endpoint, page, initialLimit, debouncedSearch, filters]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, [fetchData]);

  const createItem = async (payload) => {
    const res = await api.post(endpoint, payload);
    await fetchData();
    return res.data;
  };

  const updateItem = async (id, payload) => {
    const res = await api.put(`${endpoint}/${id}`, payload);
    await fetchData();
    return res.data;
  };

  const deleteItem = async (id) => {
    const res = await api.delete(`${endpoint}/${id}`);
    await fetchData();
    return res.data;
  };

  return {
    data,
    total,
    loading,
    page,
    setPage,
    search,
    setSearch,
    filters,
    setFilters,
    createItem,
    updateItem,
    deleteItem,
    refetch: fetchData
  };
}
