function EmptyOrdersState() {
  return (
    <div className="flex flex-col items-center justify-center p-8 border border-dashed border-border rounded bg-surface/30">
      <svg
        className="w-12 h-12 text-copy-secondary/50 mb-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
        />
      </svg>
      <p className="text-body font-semibold text-copy-primary">No orders found</p>
      <p className="text-caption text-copy-secondary mt-1">Try adjusting your search query.</p>
    </div>
  );
}

export default EmptyOrdersState;
