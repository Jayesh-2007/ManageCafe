import EmptyCartState from './EmptyCartState';

const tabs = ['Product', 'Cart', 'Payment'];

function CartPanel({ items }) {
  return (
    <aside className="flex min-h-0 w-full flex-col border-l border-border bg-background lg:w-[320px]">
      <header className="border-b border-border p-4">
        <div className="grid grid-cols-3 overflow-hidden rounded border border-border text-center text-label">
          {tabs.map((tab, index) => (
            <div
              key={tab}
              className={`px-2 py-2 ${
                index === 1 ? 'bg-accent text-background' : 'bg-surface text-copy-secondary'
              }`}
            >
              {tab}
            </div>
          ))}
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col p-4">
        {items.length === 0 ? (
          <EmptyCartState />
        ) : (
          <ul className="flex flex-col gap-2">
            {items.map((item) => (
              <li key={item.cartId} className="rounded border border-border bg-surface p-4">
                <p className="text-body font-semibold text-copy-primary">{item.name}</p>
                <p className="mt-1 text-label text-copy-secondary">Qty: 1</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
}

export default CartPanel;
