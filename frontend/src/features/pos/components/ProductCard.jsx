function ProductCard({ product, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(product)}
      className="min-h-[96px] rounded border border-border bg-background p-4 text-left transition-colors hover:border-accent hover:bg-surface focus:border-accent focus:outline-none"
    >
      <p className="text-body font-semibold text-copy-primary">{product.name}</p>
      <p className="mt-2 text-price text-accent">₹{product.price}</p>
    </button>
  );
}

export default ProductCard;
