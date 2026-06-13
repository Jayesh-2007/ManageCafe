import { useState } from 'react';
import Navbar from '../components/common/Navbar';
import Toast from '../components/common/Toast';
import EmptyOrdersState from '../components/orders/EmptyOrdersState';
import OrderDetailPanel from '../components/orders/OrderDetailPanel';
import OrderSearch from '../components/orders/OrderSearch';
import OrdersTable from '../components/orders/OrdersTable';

const initialMockOrders = [
  {
    id: 'ord-1006',
    orderNumber: 'ORD-1006',
    date: '2026-06-13T15:30:00Z',
    customer: { name: 'Aarav Patel', email: 'aarav@example.com', phone: '9876543210' },
    amount: 180.00,
    status: 'Draft',
    items: [
      { productId: 'chaat-1', name: 'Samosa Chaat', price: 50, quantity: 2 },
      { productId: 'chaat-2', name: 'Pani Puri', price: 40, quantity: 2 },
    ],
  },
  {
    id: 'ord-1005',
    orderNumber: 'ORD-1005',
    date: '2026-06-13T14:15:00Z',
    customer: { name: 'Priya Sharma', email: 'priya@example.com', phone: '9876501234' },
    amount: 230.00,
    status: 'Paid',
    items: [
      { productId: 'meal-1', name: 'Veg Thali', price: 150, quantity: 1 },
      { productId: 'bev-2', name: 'Cold Coffee', price: 80, quantity: 1 },
    ],
  },
  {
    id: 'ord-1004',
    orderNumber: 'ORD-1004',
    date: '2026-06-12T18:45:00Z',
    customer: { name: 'Kabir Mehta', email: 'kabir@example.com', phone: '9123456780' },
    amount: 90.00,
    status: 'Draft',
    items: [
      { productId: 'chaat-3', name: 'Bhel Puri', price: 45, quantity: 2 },
    ],
  },
  {
    id: 'ord-1003',
    orderNumber: 'ORD-1003',
    date: '2026-06-12T12:00:00Z',
    customer: { name: 'Neha Gupta', email: 'neha@example.com', phone: '9234567890' },
    amount: 320.00,
    status: 'Paid',
    items: [
      { productId: 'meal-1', name: 'Veg Thali', price: 150, quantity: 2 },
      { productId: 'bev-1', name: 'Masala Tea', price: 20, quantity: 1 },
    ],
  },
  {
    id: 'ord-1002',
    orderNumber: 'ORD-1002',
    date: '2026-06-11T16:20:00Z',
    customer: { name: 'Rohan Shah', email: 'rohan@example.com', phone: '9345678901' },
    amount: 130.00,
    status: 'Draft',
    items: [
      { productId: 'chaat-1', name: 'Samosa Chaat', price: 50, quantity: 1 },
      { productId: 'bev-2', name: 'Cold Coffee', price: 80, quantity: 1 },
    ],
  },
  {
    id: 'ord-1001',
    orderNumber: 'ORD-1001',
    date: '2026-06-11T10:00:00Z',
    customer: { name: 'Anjali Desai', email: 'anjali@example.com', phone: '9456789012' },
    amount: 40.00,
    status: 'Paid',
    items: [
      { productId: 'chaat-2', name: 'Pani Puri', price: 40, quantity: 1 },
    ],
  },
];

function Orders() {
  const [orders, setOrders] = useState(() =>
    [...initialMockOrders].sort((a, b) => new Date(b.date) - new Date(a.date))
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  // Handle order deletion
  function handleDeleteOrder(orderId) {
    setOrders((currentOrders) => currentOrders.filter((o) => o.id !== orderId));
    setSelectedOrder(null);
    showToast('Order deleted successfully');
  }

  // Handle edit click
  function handleEditOrder(order) {
    showToast(`Edit Order ${order.orderNumber} clicked (Simulated)`);
  }

  function showToast(message) {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage('');
    }, 3000);
  }

  // Filter orders by customer name, order number, or date string
  const filteredOrders = orders.filter((order) => {
    const query = searchQuery.toLowerCase();
    const dateObj = new Date(order.date);
    const dateStr = dateObj.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).toLowerCase();

    return (
      order.customer.name.toLowerCase().includes(query) ||
      order.orderNumber.toLowerCase().includes(query) ||
      dateStr.includes(query)
    );
  });

  return (
    <main className="flex min-h-screen flex-col bg-background text-copy-primary lg:flex-row">
      <Navbar />

      <div className="flex-1 p-6 flex flex-col gap-6 overflow-x-auto">
        <div className="flex flex-col gap-2">
          <h1 className="text-page-title text-primary">Orders</h1>
          <p className="text-body text-copy-secondary">View and manage customer orders.</p>
        </div>

        {toastMessage && <Toast message={toastMessage} type="success" />}

        <div className="flex flex-col gap-4">
          <OrderSearch value={searchQuery} onChange={setSearchQuery} />

          {filteredOrders.length === 0 ? (
            <EmptyOrdersState />
          ) : (
            <OrdersTable
              orders={filteredOrders}
              selectedOrder={selectedOrder}
              onSelectOrder={setSelectedOrder}
            />
          )}
        </div>
      </div>

      {selectedOrder && (
        <OrderDetailPanel
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onDelete={handleDeleteOrder}
          onEdit={handleEditOrder}
        />
      )}
    </main>
  );
}

export default Orders;
