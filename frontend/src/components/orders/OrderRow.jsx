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
      className={`cursor-pointer border-b border-border/60 transition-all duration-150 hover:bg-surface/60 ${
        isSelected ? 'bg-accent/5 text-accent' : ''
      }`}
    >
      <td className={`px-4 py-4 text-body whitespace-nowrap transition-colors ${isSelected ? 'font-bold text-accent' : 'text-copy-primary'}`}>
        {formattedDate}
      </td>
      <td className={`px-4 py-4 text-body font-bold whitespace-nowrap transition-colors ${isSelected ? 'text-accent' : 'text-primary'}`}>
        {order.orderNumber}
      </td>
      <td className={`px-4 py-4 text-body whitespace-nowrap transition-colors ${isSelected ? 'font-bold text-accent' : 'text-copy-primary'}`}>
        {order.customer.name}
      </td>
      <td className={`px-4 py-4 text-body font-bold whitespace-nowrap transition-colors ${isSelected ? 'text-accent' : 'text-copy-primary'}`}>
        ₹{order.amount.toFixed(2)}
      </td>
      <td className="px-4 py-4 text-body whitespace-nowrap">
        <StatusBadge status={order.status} />
      </td>
    </tr>
  );
}

export default OrderRow;
