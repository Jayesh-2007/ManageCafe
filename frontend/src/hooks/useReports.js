import { useState, useCallback, useEffect } from 'react';
import { reportService } from '../services/reportService';

export default function useReports() {
  const [dateRange, setDateRange] = useState('last_7_days');
  
  const [summary, setSummary] = useState(null);
  const [salesTrend, setSalesTrend] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [topCategories, setTopCategories] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { range: dateRange };
      
      const [summaryRes, trendRes, productsRes, categoriesRes] = await Promise.all([
        reportService.getSummary(params).catch(() => ({ data: null })),
        reportService.getSalesTrend(params).catch(() => ({ data: [] })),
        reportService.getTopProducts(params).catch(() => ({ data: [] })),
        reportService.getTopCategories(params).catch(() => ({ data: [] }))
      ]);

      setSummary(summaryRes.data || summaryRes || null);
      setSalesTrend(trendRes.data || trendRes || []);
      setTopProducts(productsRes.data || productsRes || []);
      setTopCategories(categoriesRes.data || categoriesRes || []);
    } catch (err) {
      setError('Failed to load some report data.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchReports();
  }, [fetchReports]);

  return {
    dateRange,
    setDateRange,
    summary,
    salesTrend,
    topProducts,
    topCategories,
    loading,
    error,
    refetch: fetchReports
  };
}
