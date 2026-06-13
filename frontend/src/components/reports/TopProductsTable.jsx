export default function TopProductsTable({ data, loading }) {
  if (loading) {
    return <div className="h-64 bg-gray-50 rounded-lg animate-pulse"></div>;
  }

  if (!data || data.length === 0) {
    return <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center text-gray-500 border border-dashed border-gray-300">No product data available.</div>;
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col h-full">
      <div className="p-5 border-b border-gray-100">
        <h3 className="font-bold text-gray-900">Top Products</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Rank</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Product</th>
              <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Sold</th>
              <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Revenue</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {data.slice(0, 5).map((item, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="px-5 py-3 whitespace-nowrap">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${idx === 0 ? 'bg-yellow-100 text-yellow-700' : idx === 1 ? 'bg-gray-200 text-gray-700' : idx === 2 ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-500'}`}>
                    {idx + 1}
                  </span>
                </td>
                <td className="px-5 py-3 text-sm font-medium text-gray-900">{item.name || item.product_name}</td>
                <td className="px-5 py-3 text-sm text-gray-600 text-right">{item.quantity_sold || item.sold || 0}</td>
                <td className="px-5 py-3 text-sm font-bold text-primary-600 text-right">${(Number(item.revenue || item.total || 0)).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
