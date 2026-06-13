export default function OrderFilters({ 
  status, setStatus, 
  kdsStatus, setKdsStatus, 
  dateFilter, setDateFilter 
}) {
  return (
    <div className="flex flex-wrap gap-3">
      <select 
        value={status} 
        onChange={(e) => setStatus(e.target.value)}
        className="border border-gray-300 rounded-md text-sm py-2 px-3 focus:ring-primary-500 focus:border-primary-500"
      >
        <option value="">All Status</option>
        <option value="draft">Draft</option>
        <option value="paid">Paid</option>
      </select>
      
      <select 
        value={kdsStatus} 
        onChange={(e) => setKdsStatus(e.target.value)}
        className="border border-gray-300 rounded-md text-sm py-2 px-3 focus:ring-primary-500 focus:border-primary-500"
      >
        <option value="">All KDS Status</option>
        <option value="to_cook">To Cook</option>
        <option value="preparing">Preparing</option>
        <option value="completed">Completed</option>
      </select>
      
      <select 
        value={dateFilter} 
        onChange={(e) => setDateFilter(e.target.value)}
        className="border border-gray-300 rounded-md text-sm py-2 px-3 focus:ring-primary-500 focus:border-primary-500"
      >
        <option value="">Any Time</option>
        <option value="today">Today</option>
        <option value="last_7_days">Last 7 Days</option>
        <option value="last_30_days">Last 30 Days</option>
      </select>
    </div>
  );
}
