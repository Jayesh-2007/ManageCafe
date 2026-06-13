import useReports from '../hooks/useReports';
import DateRangeFilter from '../components/reports/DateRangeFilter';
import ExportReports from '../components/reports/ExportReports';
import KPICards from '../components/reports/KPICards';
import SalesTrendChart from '../components/reports/SalesTrendChart';
import TopProductsTable from '../components/reports/TopProductsTable';
import TopCategoriesChart from '../components/reports/TopCategoriesChart';
import { AlertCircle } from 'lucide-react';

export default function Reports() {
  const { 
    dateRange, setDateRange, 
    summary, salesTrend, topProducts, topCategories, 
    loading, error 
  } = useReports();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <DateRangeFilter value={dateRange} onChange={setDateRange} />
        <ExportReports dateRange={dateRange} />
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-3 border border-red-200">
          <AlertCircle size={20} />
          <p className="font-medium">{error}</p>
        </div>
      )}

      {/* KPI Cards */}
      <KPICards summary={summary} loading={loading} />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SalesTrendChart data={salesTrend} loading={loading} />
        </div>
        <div className="lg:col-span-1">
          <TopCategoriesChart data={topCategories} loading={loading} />
        </div>
      </div>

      {/* Tables Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopProductsTable data={topProducts} loading={loading} />
      </div>
    </div>
  );
}
