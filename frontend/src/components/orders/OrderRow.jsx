import StatusBadge from './StatusBadge';

function OrderRow({ order, isSelected, onClick }) {
  const dateObj = new Date(order.date);
  const formattedDate = dateObj.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <tr
      onClick={() => onClick(order)}
      className={`cursor-pointer border-b border-border transition-colors hover:bg-surface/40 ${
        isSelected ? 'bg-surface font-semibold' : ''
      }`}
    >
      <td className="px-4 py-4 text-body text-copy-primary whitespace-nowrap">
        {formattedDate}
      </td>
      <td className="px-4 py-4 text-body text-primary font-semibold whitespace-nowrap">
        {order.orderNumber}
      </td>
      <td className="px-4 py-4 text-body text-copy-primary whitespace-nowrap">
        {order.customer.name}
      </td>
      <td className="px-4 py-4 text-body text-copy-primary font-semibold whitespace-nowrap">
        ₹{order.amount.toFixed(2)}
      </td>
      <td className="px-4 py-4 text-body whitespace-nowrap">
        <StatusBadge status={order.status} />
      </td>
    </tr>
  );
}

export default OrderRow;
