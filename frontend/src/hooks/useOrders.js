import { useState, useEffect, useCallback } from 'react';
import { orderService } from '../services/orderService';
import useDebounce from './useDebounce';

export default function useOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [kdsStatus, setKdsStatus] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const debouncedSearch = useDebounce(search, 500);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit };
      if (debouncedSearch) params.search = debouncedSearch;
      if (status) params.status = status;
      if (kdsStatus) params.kds_status = kdsStatus;
      if (dateFilter) params.date_filter = dateFilter;
      
      const res = await orderService.getOrders(params);
      setOrders(res.data || res.orders || []);
      setTotal(res.total || 0);
    } catch (error) {
      console.error('Failed to fetch orders', error);
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedSearch, status, kdsStatus, dateFilter]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchOrders();
  }, [fetchOrders]);

  return {
    orders,
    loading,
    total,
    page,
    setPage,
    search,
    setSearch,
    status,
    setStatus,
    kdsStatus,
    setKdsStatus,
    dateFilter,
    setDateFilter,
    refetch: fetchOrders
  };
}
