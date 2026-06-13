import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#6B7280'];

export default function TopCategoriesChart({ data, loading }) {
  const chartData = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];
    return data.map(item => ({
      name: item.name || item.category_name,
      value: Number(item.revenue || item.total || 0)
    })).filter(item => item.value > 0);
  }, [data]);

  if (loading) {
    return <div className="h-64 bg-gray-50 rounded-lg animate-pulse"></div>;
  }

  if (chartData.length === 0) {
    return <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center text-gray-500 border border-dashed border-gray-300">No category data available.</div>;
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col h-full">
      <div className="p-5 border-b border-gray-100">
        <h3 className="font-bold text-gray-900">Revenue by Category</h3>
      </div>
      <div className="flex-1 p-4 flex items-center justify-center min-h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => `$${value.toFixed(2)}`}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Legend verticalAlign="bottom" height={36} iconType="circle" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
