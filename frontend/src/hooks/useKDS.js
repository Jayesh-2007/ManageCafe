import { useState, useCallback, useEffect } from 'react';
import { kdsService } from '../services/kdsService';
import useDebounce from './useDebounce';
import useKDSPolling from './useKDSPolling';

export default function useKDS() {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({ total: 0, to_cook: 0, preparing: 0, completed: 0 });
  const [loading, setLoading] = useState(true);
  
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // all, to_cook, preparing, completed
  const [sortOrder, setSortOrder] = useState('oldest'); // oldest, newest
  
  const debouncedSearch = useDebounce(search, 500);

  const fetchKDSData = useCallback(async (showLoading = false) => {
    if (showLoading) setLoading(true);
    try {
      const [ordersRes, statsRes] = await Promise.all([
        kdsService.getKDSOrders({ 
          q: debouncedSearch,
          status: activeTab === 'all' ? '' : activeTab,
          sort: sortOrder
        }),
        kdsService.getKDSStats()
      ]);
      
      setOrders(ordersRes.data || ordersRes.orders || []);
      setStats(statsRes.stats || statsRes.data || { total: 0, to_cook: 0, preparing: 0, completed: 0 });
    } catch (error) {
      console.error('Failed to fetch KDS data:', error);
    } finally {
      if (showLoading) setLoading(false);
    }
  }, [debouncedSearch, activeTab, sortOrder]);

  // Initial load
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchKDSData(true);
  }, [fetchKDSData]);

  // Polling every 5 seconds (silent refresh)
  useKDSPolling(() => {
    fetchKDSData(false);
  }, 5000, true);

  const updateStatus = async (id, newStatus) => {
    try {
      // Optimistic update
      setOrders(prev => prev.map(o => o.id === id ? { ...o, kds_status: newStatus } : o));
      await kdsService.updateOrderStatus(id, newStatus);
      fetchKDSData(false); // resync
    } catch (error) {
      console.error('Failed to update status', error);
      fetchKDSData(false); // revert on failure
    }
  };

  return {
    orders,
    stats,
    loading,
    search,
    setSearch,
    activeTab,
    setActiveTab,
    sortOrder,
    setSortOrder,
    updateStatus,
    refetch: fetchKDSData
  };
}
