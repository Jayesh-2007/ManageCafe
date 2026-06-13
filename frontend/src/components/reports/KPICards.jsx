import { DollarSign, ShoppingBag, TrendingUp, Users } from 'lucide-react';

export default function KPICards({ summary, loading }) {
  const cards = [
    { label: 'Total Revenue', value: `$${(summary?.total_revenue || 0).toFixed(2)}`, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Total Orders', value: summary?.total_orders || 0, icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Avg Order Value', value: `$${(summary?.average_order_value || 0).toFixed(2)}`, icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: 'Total Customers', value: summary?.total_customers || 0, icon: Users, color: 'text-orange-600', bg: 'bg-orange-100' },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm animate-pulse flex items-center gap-4">
             <div className="w-14 h-14 bg-gray-200 rounded-full"></div>
             <div className="flex-1 space-y-2">
               <div className="h-4 bg-gray-200 rounded w-1/2"></div>
               <div className="h-6 bg-gray-200 rounded w-3/4"></div>
             </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map(card => {
        const Icon = card.icon;
        return (
          <div key={card.label} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center ${card.bg} ${card.color}`}>
              <Icon size={26} strokeWidth={2} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">{card.label}</p>
              <p className="text-2xl font-bold text-gray-900 tracking-tight">{card.value}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
