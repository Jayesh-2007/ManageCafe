import ProductCard from './ProductCard';

function ProductGrid({ products, onProductSelect }) {
  return (
    <section className="min-h-0 flex-1 bg-surface p-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} onSelect={onProductSelect} />
        ))}
      </div>
    </section>
  );
}

export default ProductGrid;
