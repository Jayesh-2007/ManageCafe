import { useState } from 'react';
import useOrders from '../hooks/useOrders';
import { orderService } from '../services/orderService';
import OrdersTable from '../components/orders/OrdersTable';
import OrderSearch from '../components/orders/OrderSearch';
import OrderFilters from '../components/orders/OrderFilters';
import OrderDetailsModal from '../components/orders/OrderDetailsModal';
import EditOrderModal from '../components/orders/EditOrderModal';
import DeleteOrderDialog from '../components/orders/DeleteOrderDialog';
import OrderStatusBadge from '../components/orders/OrderStatusBadge';

export default function Orders() {
  const { 
    orders, loading, search, setSearch, 
    status, setStatus, kdsStatus, setKdsStatus, 
    dateFilter, setDateFilter, refetch 
  } = useOrders();

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalType, setModalType] = useState(null); // 'view', 'edit', 'delete'

  const handleAction = (order, type) => {
    setSelectedOrder(order);
    setModalType(type);
  };

  const closeModal = () => {
    setSelectedOrder(null);
    setModalType(null);
  };

  const handleDeleteConfirm = async (id) => {
    try {
      await orderService.deleteOrder(id);
      closeModal();
      refetch();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete order');
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-lg border shadow-sm">
        <OrderSearch search={search} onSearchChange={setSearch} />
        <OrderFilters 
          status={status} setStatus={setStatus}
          kdsStatus={kdsStatus} setKdsStatus={setKdsStatus}
          dateFilter={dateFilter} setDateFilter={setDateFilter}
        />
      </div>

      {/* Main Table */}
      <OrdersTable 
        orders={orders} 
        loading={loading} 
        onView={(order) => handleAction(order, 'view')}
        onEdit={(order) => handleAction(order, 'edit')}
        onDelete={(order) => handleAction(order, 'delete')}
      />

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {loading ? (
          <div className="p-4 text-center">Loading...</div>
        ) : orders.map(order => (
          <div key={order.id} className="bg-white p-4 rounded-lg border shadow-sm flex flex-col gap-3">
            <div className="flex justify-between items-start">
              <span className="font-bold text-gray-900">#{order.id}</span>
              <span className="font-bold text-gray-900">${Number(order.total || 0).toFixed(2)}</span>
            </div>
            <div className="text-sm text-gray-500">{order.customer?.name || 'Walk-in'}</div>
            <div className="flex gap-2">
              <OrderStatusBadge status={order.status} type="order" />
              <OrderStatusBadge status={order.kds_status} type="kds" />
            </div>
            <div className="flex justify-end gap-3 pt-2 border-t">
              <button onClick={() => handleAction(order, 'view')} className="text-sm text-primary-600 font-medium">View</button>
              {order.status !== 'paid' && (
                <>
                  <button onClick={() => handleAction(order, 'edit')} className="text-sm text-blue-600 font-medium">Edit</button>
                  <button onClick={() => handleAction(order, 'delete')} className="text-sm text-red-600 font-medium">Delete</button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modals */}
      <OrderDetailsModal 
        isOpen={modalType === 'view'} 
        onClose={closeModal} 
        orderId={selectedOrder?.id} 
      />
      
      <EditOrderModal 
        isOpen={modalType === 'edit'} 
        onClose={closeModal} 
        order={selectedOrder} 
      />
      
      <DeleteOrderDialog 
        isOpen={modalType === 'delete'} 
        onClose={closeModal} 
        onConfirm={handleDeleteConfirm}
        order={selectedOrder} 
      />
    </div>
  );
}
