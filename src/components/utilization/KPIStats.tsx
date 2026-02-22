import { Percent, AlertTriangle, Package, Activity } from 'lucide-react';

interface KPIStatsProps {
  avgUtilization: number;
  underutilizedCount: number;
  deadStockCount: number;
  avgCongestion: number;
}

export default function KPIStats({
  avgUtilization,
  underutilizedCount,
  deadStockCount,
  avgCongestion,
}: KPIStatsProps) {
  const stats = [
    {
      label: 'Overall Utilization',
      value: `${avgUtilization}%`,
      icon: Percent,
      color: 'blue',
      bgColor: 'bg-blue-900/30',
      textColor: 'text-blue-400',
      borderColor: 'border-blue-500',
    },
    {
      label: 'Underutilized Zones',
      value: underutilizedCount,
      icon: AlertTriangle,
      color: 'yellow',
      bgColor: 'bg-yellow-900/30',
      textColor: 'text-yellow-400',
      borderColor: 'border-yellow-500',
    },
    {
      label: 'Dead Stock Items',
      value: deadStockCount,
      icon: Package,
      color: 'red',
      bgColor: 'bg-red-900/30',
      textColor: 'text-red-400',
      borderColor: 'border-red-500',
    },
    {
      label: 'Congestion Index',
      value: avgCongestion,
      icon: Activity,
      color: 'green',
      bgColor: 'bg-green-900/30',
      textColor: 'text-green-400',
      borderColor: 'border-green-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className={`${stat.bgColor} border ${stat.borderColor} rounded-lg p-5 hover:scale-105 transition-transform`}
          >
            <div className="flex items-center justify-between mb-3">
              <Icon className={stat.textColor} size={28} />
            </div>
            <div className={`text-3xl font-bold ${stat.textColor} mb-1`}>
              {stat.value}
            </div>
            <div className="text-slate-400 text-sm">{stat.label}</div>
          </div>
        );
      })}
    </div>
  );
}
