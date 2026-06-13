function CategorySidebar({ categories }) {
  return (
    <aside className="flex w-full flex-col border-r border-border bg-primary text-background lg:w-[200px]">
      <div className="border-b border-border p-4">
        <p className="text-section-title">ManageCafe</p>
      </div>

      <nav className="p-4" aria-label="Product categories">
        <ul className="flex flex-row gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
          {categories.map((category, index) => (
            <li key={category}>
              <div
                className={`min-h-12 whitespace-nowrap rounded px-4 py-2 text-body ${
                  index === 0 ? 'bg-accent text-background' : 'text-background'
                }`}
              >
                {category}
              </div>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

export default CategorySidebar;
