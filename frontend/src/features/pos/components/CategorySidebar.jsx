function CategorySidebar({ categories, selectedCategory, onCategorySelect }) {
  return (
    <aside className="flex w-full flex-col border-r border-background/10 bg-primary text-background lg:w-[200px] shrink-0 shadow-sm">
      <div className="border-b border-background/10 p-4">
        <p className="text-section-title font-bold tracking-tight text-background">ManageCafe</p>
      </div>

      <nav className="p-4" aria-label="Product categories">
        <ul className="flex flex-row gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
          {categories.map((category) => {
            const isSelected = category === selectedCategory;
            return (
              <li key={category} className="lg:w-full">
                <button
                  type="button"
                  onClick={() => onCategorySelect(category)}
                  className={`min-h-12 w-full text-left whitespace-nowrap rounded-lg px-4 py-2 text-body transition-all duration-150 active:scale-[0.97] ${
                    isSelected
                      ? 'bg-accent text-background font-bold shadow-md shadow-accent/20'
                      : 'text-background/80 hover:bg-background/10 hover:text-background'
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
