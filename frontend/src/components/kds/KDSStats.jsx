import { ChefHat, ListTodo, CheckCircle2, ClipboardList } from 'lucide-react';

export default function KDSStats({ stats }) {
  const cards = [
    { label: 'Total Orders', value: stats.total || 0, icon: ClipboardList, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'To Cook', value: stats.to_cook || 0, icon: ListTodo, color: 'text-yellow-600', bg: 'bg-yellow-100' },
    { label: 'Preparing', value: stats.preparing || 0, icon: ChefHat, color: 'text-primary-600', bg: 'bg-primary-100' },
    { label: 'Completed', value: stats.completed || 0, icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-100' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map(card => {
        const Icon = card.icon;
        return (
          <div key={card.label} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${card.bg} ${card.color}`}>
              <Icon size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{card.label}</p>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
