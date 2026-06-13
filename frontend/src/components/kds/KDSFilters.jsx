export default function KDSFilters({ sortOrder, setSortOrder }) {
  return (
    <div className="flex gap-3">
      <select 
        value={sortOrder} 
        onChange={(e) => setSortOrder(e.target.value)}
        className="border border-gray-300 rounded-md text-sm py-2 px-3 focus:ring-primary-500 focus:border-primary-500 bg-white"
      >
        <option value="oldest">Oldest First</option>
        <option value="newest">Recently Created</option>
      </select>
    </div>
  );
}
