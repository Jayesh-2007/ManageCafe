export default function DateRangeFilter({ value, onChange }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">Date Range</span>
      <select 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        className="border border-gray-200 rounded-lg text-sm py-2 px-3 focus:ring-primary-500 focus:border-primary-500 bg-white font-medium shadow-sm cursor-pointer"
      >
        <option value="today">Today</option>
        <option value="last_7_days">Last 7 Days</option>
        <option value="last_30_days">Last 30 Days</option>
        <option value="this_month">This Month</option>
      </select>
    </div>
  );
}
