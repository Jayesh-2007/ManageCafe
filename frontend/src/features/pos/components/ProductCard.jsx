function ProductCard({ product, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(product)}
      className="group flex flex-col justify-between min-h-[108px] rounded-lg border border-border bg-surface p-4 text-left shadow-sm hover:shadow-md hover:border-accent hover:-translate-y-0.5 active:translate-y-0 focus:ring-2 focus:ring-accent/10 focus:border-accent focus:outline-none transition-all duration-150"
    >
      <p className="text-body font-bold text-copy-primary group-hover:text-primary transition-colors">
        {product.name}
      </p>
      <p className="text-price font-bold text-accent mt-2">
        ₹{product.price.toFixed(2)}
      </p>
    </button>
  );
}

export default ProductCard;
