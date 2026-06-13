import StatusBadge from './StatusBadge';

function OrderDetailPanel({ order, onClose, onDelete, onEdit }) {
  if (!order) {
    return null;
  }

  const dateObj = new Date(order.date);
  const formattedDate = dateObj.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const isDraft = order.status.toLowerCase() === 'draft';

  return (
    <aside className="flex min-h-0 w-full flex-col border-l border-border bg-background lg:w-[360px] animate-modal-in">
      <header className="flex justify-between items-center border-b border-border p-4">
        <h2 className="text-section-title text-primary font-semibold">Order Details</h2>
        <button
          type="button"
          onClick={onClose}
          className="text-copy-secondary hover:text-copy-primary text-body font-semibold px-2 py-2 rounded hover:bg-surface transition-colors"
        >
          Close
        </button>
      </header>

      <div className="flex min-h-0 flex-1 flex-col gap-6 p-4 overflow-y-auto">
        {/* Basic Info */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <span className="text-label text-copy-secondary">Order Number</span>
            <span className="text-body font-semibold text-copy-primary">{order.orderNumber}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-label text-copy-secondary">Date</span>
            <span className="text-body text-copy-primary">{formattedDate}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-label text-copy-secondary">Status</span>
            <StatusBadge status={order.status} />
          </div>
        </div>

        {/* Customer Details */}
        <div className="border-t border-border pt-4 flex flex-col gap-2">
          <h3 className="text-label font-semibold text-copy-primary uppercase tracking-wider">Customer</h3>
          <div className="flex flex-col text-body">
            <span className="font-semibold text-copy-primary">{order.customer.name}</span>
            <span className="text-caption text-copy-secondary">{order.customer.email}</span>
            <span className="text-caption text-copy-secondary">{order.customer.phone}</span>
          </div>
        </div>

        {/* Line Items */}
        <div className="border-t border-border pt-4 flex flex-col gap-2">
          <h3 className="text-label font-semibold text-copy-primary uppercase tracking-wider mb-2">Items</h3>
          <ul className="flex flex-col gap-2">
            {order.items.map((item, index) => (
              <li key={index} className="flex justify-between items-start text-body rounded border border-border bg-surface/30 p-2">
                <div className="flex flex-col">
                  <span className="font-semibold text-copy-primary">{item.name}</span>
                  <span className="text-caption text-copy-secondary">
                    ₹{item.price.toFixed(2)} × {item.quantity}
                  </span>
                </div>
                <span className="font-semibold text-copy-primary">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Pricing Summary and Actions */}
      <footer className="mt-auto flex flex-col gap-4 border-t border-border p-4 bg-background">
        <div className="flex justify-between items-center text-price font-semibold pt-2">
          <span className="text-copy-primary">Total Amount</span>
          <span className="text-primary text-page-title">₹{order.amount.toFixed(2)}</span>
        </div>

        {isDraft && (
          <div className="grid grid-cols-2 gap-2 mt-2">
            <button
              type="button"
              onClick={() => onEdit(order)}
              className="min-h-12 rounded bg-accent text-body font-semibold text-background hover:bg-accent/90 transition-colors"
            >
              Edit Order
            </button>
            <button
              type="button"
              onClick={() => onDelete(order.id)}
              className="min-h-12 rounded border border-error bg-surface text-body font-semibold text-error hover:bg-error hover:text-background transition-colors"
            >
              Delete
            </button>
          </div>
        )}
      </footer>
    </aside>
  );
}

export default OrderDetailPanel;
