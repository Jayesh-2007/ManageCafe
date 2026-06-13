function OrderSearch({ value, onChange }) {
  return (
    <div className="relative w-full max-w-md">
      <span className="absolute inset-y-0 left-0 flex items-center pl-4">
        <svg
          className="h-4 w-4 text-copy-secondary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </span>
      <input
        type="text"
        placeholder="Search by customer, order number, or date..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full min-h-12 rounded border border-border bg-background pl-12 pr-4 text-body text-copy-primary outline-none focus:border-accent transition-all"
      />
    </div>
  );
}

export default OrderSearch;
