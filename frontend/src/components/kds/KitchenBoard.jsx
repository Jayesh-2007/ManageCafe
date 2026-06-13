import OrderCard from './OrderCard';

export default function KitchenBoard({ orders, activeTab, onUpdateStatus, onViewDetails, loading }) {
  if (loading && orders.length === 0) {
    return <div className="p-8 text-center text-gray-500">Loading kitchen board...</div>;
  }

  const columns = [
    { id: 'to_cook', title: 'To Cook', borderColor: 'border-yellow-300' },
    { id: 'preparing', title: 'Preparing', borderColor: 'border-primary-300' },
    { id: 'completed', title: 'Completed', borderColor: 'border-green-300' },
  ];

  const visibleColumns = activeTab === 'all' 
    ? columns 
    : columns.filter(col => col.id === activeTab);

  if (orders.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 rounded-xl border border-dashed border-gray-300 p-8">
        <p className="text-gray-500 font-medium">No orders in the kitchen matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className={`flex-1 grid gap-6 ${visibleColumns.length === 1 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:pr-24' : 'grid-cols-1 lg:grid-cols-3'}`}>
      {visibleColumns.map(column => {
        const columnOrders = orders.filter(o => o.kds_status === column.id);
        
        return (
          <div key={column.id} className="flex flex-col bg-gray-50 rounded-xl border border-gray-200 overflow-hidden h-[calc(100vh-280px)]">
            <div className={`p-3 bg-white border-b border-gray-200 border-t-4 ${column.borderColor} flex justify-between items-center shadow-sm z-10`}>
              <h3 className="font-bold text-gray-800 uppercase tracking-wide text-sm">{column.title}</h3>
              <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded-full">{columnOrders.length}</span>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {columnOrders.length === 0 ? (
                <div className="text-center text-sm text-gray-400 mt-8 font-medium">No orders</div>
              ) : (
                columnOrders.map(order => (
                  <OrderCard 
                    key={order.id} 
                    order={order} 
                    onUpdateStatus={onUpdateStatus}
                    onViewDetails={onViewDetails}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
