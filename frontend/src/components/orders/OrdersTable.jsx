import OrderRow from './OrderRow';

function OrdersTable({ orders, selectedOrder, onSelectOrder }) {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-border/80 bg-surface shadow-sm animate-modal-in">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-border/60 bg-background/50 text-label font-bold text-copy-secondary uppercase tracking-wider">
            <th className="px-4 py-4 whitespace-nowrap">Date</th>
            <th className="px-4 py-4 whitespace-nowrap">Order #</th>
            <th className="px-4 py-4 whitespace-nowrap">Customer</th>
            <th className="px-4 py-4 whitespace-nowrap">Amount</th>
            <th className="px-4 py-4 whitespace-nowrap">Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <OrderRow
              key={order.id}
              order={order}
              isSelected={selectedOrder?.id === order.id}
              onClick={onSelectOrder}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default OrdersTable;
