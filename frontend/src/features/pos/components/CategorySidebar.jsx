function CategorySidebar({ categories, selectedCategory, onCategorySelect }) {
  return (
    <aside className="flex w-full flex-col border-r border-border bg-primary text-background lg:w-[200px]">
      <div className="border-b border-border p-4">
        <p className="text-section-title">ManageCafe</p>
      </div>

      <nav className="p-4" aria-label="Product categories">
        <ul className="flex flex-row gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
          {categories.map((category) => {
            const isSelected = category === selectedCategory;
            return (
              <li key={category}>
                <button
                  type="button"
                  onClick={() => onCategorySelect(category)}
                  className={`min-h-12 w-full text-left whitespace-nowrap rounded px-4 py-2 text-body transition-colors ${
                    isSelected
                      ? 'bg-accent text-background font-semibold'
                      : 'text-background hover:bg-accent/20'
                  }`}
                >
                  {category}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}

export default CategorySidebar;
