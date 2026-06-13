import { useState } from 'react';
import useKDS from '../hooks/useKDS';
import KDSStats from '../components/kds/KDSStats';
import StatusTabs from '../components/kds/StatusTabs';
import KDSSearch from '../components/kds/KDSSearch';
import KDSFilters from '../components/kds/KDSFilters';
import KitchenBoard from '../components/kds/KitchenBoard';
import KDSOrderDetailsModal from '../components/kds/KDSOrderDetailsModal';

export default function KDS() {
  const { 
    orders, stats, loading, search, setSearch, 
    activeTab, setActiveTab, sortOrder, setSortOrder, updateStatus 
  } = useKDS();

  const [selectedOrderId, setSelectedOrderId] = useState(null);

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] gap-6">
      <KDSStats stats={stats} />

      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white p-4 rounded-xl border shadow-sm">
        <StatusTabs activeTab={activeTab} setActiveTab={setActiveTab} stats={stats} />
        
        <div className="flex w-full lg:w-auto items-center gap-3">
          <KDSSearch search={search} onSearchChange={setSearch} />
          <KDSFilters sortOrder={sortOrder} setSortOrder={setSortOrder} />
        </div>
      </div>

      <KitchenBoard 
        orders={orders} 
        activeTab={activeTab} 
        loading={loading}
        onUpdateStatus={updateStatus}
        onViewDetails={setSelectedOrderId}
      />

      <KDSOrderDetailsModal 
        isOpen={!!selectedOrderId}
        onClose={() => setSelectedOrderId(null)}
        orderId={selectedOrderId}
        onUpdateStatus={updateStatus}
      />
    </div>
  );
}
