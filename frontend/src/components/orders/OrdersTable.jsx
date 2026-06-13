import OrderRow from './OrderRow';

function OrdersTable({ orders, selectedOrder, onSelectOrder }) {
  return (
    <div className="w-full overflow-x-auto rounded border border-border bg-background">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-border bg-surface text-label font-semibold text-copy-secondary">
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
