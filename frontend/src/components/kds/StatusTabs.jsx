export default function StatusTabs({ activeTab, setActiveTab, stats }) {
  const tabs = [
    { id: 'all', label: 'All Orders', count: stats.total || 0 },
    { id: 'to_cook', label: 'To Cook', count: stats.to_cook || 0 },
    { id: 'preparing', label: 'Preparing', count: stats.preparing || 0 },
    { id: 'completed', label: 'Completed', count: stats.completed || 0 },
  ];

  return (
    <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg overflow-x-auto scrollbar-hide border border-gray-200 shadow-inner">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-all ${
            activeTab === tab.id 
              ? 'bg-white text-gray-900 shadow-sm ring-1 ring-gray-200' 
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
          }`}
        >
          {tab.label}
          <span className={`px-2 py-0.5 rounded-full text-xs ${
            activeTab === tab.id ? 'bg-primary-100 text-primary-700' : 'bg-gray-200 text-gray-500'
          }`}>
            {tab.count}
          </span>
        </button>
      ))}
    </div>
  );
}
