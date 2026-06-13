import { CheckCircle2, Clock, ChefHat, PlayCircle } from 'lucide-react';

export default function OrderTimeline({ order }) {
  if (!order) return null;

  const steps = [
    { name: 'Created', active: true, icon: Clock },
    { name: 'Sent To Kitchen', active: !!order.kds_status || order.status === 'paid', icon: SendIcon },
    { name: 'Preparing', active: order.kds_status === 'preparing' || order.kds_status === 'completed' || order.status === 'paid', icon: ChefHat },
    { name: 'Completed', active: order.kds_status === 'completed' || order.status === 'paid', icon: CheckCircle2 },
    { name: 'Paid', active: order.status === 'paid', icon: DollarIcon }
  ];

  return (
    <div className="py-4">
      <div className="flex items-center justify-between">
        {steps.map((step, i) => {
          const Icon = step.icon;
          return (
            <div key={step.name} className="flex flex-col items-center relative flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${step.active ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-400'}`}>
                <Icon size={16} />
              </div>
              <span className={`text-xs mt-2 font-medium text-center ${step.active ? 'text-gray-900' : 'text-gray-400'}`}>{step.name}</span>
              {i < steps.length - 1 && (
                <div className={`absolute top-4 left-1/2 w-full h-[2px] ${steps[i+1].active ? 'bg-primary-600' : 'bg-gray-200'}`}></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SendIcon({ size }) { return <PlayCircle size={size} />; }
function DollarIcon({ size }) { return <span style={{fontSize: size-4, fontWeight: 'bold'}}>$</span>; }
