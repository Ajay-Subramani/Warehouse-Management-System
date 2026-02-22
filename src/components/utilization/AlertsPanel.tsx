import { AlertTriangle, TrendingUp, PackageX } from 'lucide-react';

interface AlertsPanelProps {
  deadStockCount: number;
  congestionIndex: number;
  overstockedZones: Array<{ zone: string }>;
}

export default function AlertsPanel({
  deadStockCount,
  congestionIndex,
  overstockedZones,
}: AlertsPanelProps) {
  const alerts = [
    {
      type: 'warning',
      icon: PackageX,
      message: `${deadStockCount} items identified as dead stock`,
      visible: deadStockCount > 0,
    },
    {
      type: 'danger',
      icon: AlertTriangle,
      message: `High congestion detected (Index: ${congestionIndex})`,
      visible: congestionIndex > 70,
    },
    {
      type: 'info',
      icon: TrendingUp,
      message: `${overstockedZones.length} zones are overstocked (>90%)`,
      visible: overstockedZones.length > 0,
    },
  ];

  const visibleAlerts = alerts.filter((alert) => alert.visible);

  if (visibleAlerts.length === 0) {
    return null;
  }

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'danger':
        return 'bg-red-900/40 border-red-500 text-red-300';
      case 'warning':
        return 'bg-yellow-900/40 border-yellow-500 text-yellow-300';
      case 'info':
        return 'bg-blue-900/40 border-blue-500 text-blue-300';
      default:
        return 'bg-slate-900/40 border-slate-500 text-slate-300';
    }
  };

  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
      <h3 className="text-lg font-semibold text-white mb-4">Active Alerts</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {visibleAlerts.map((alert, index) => {
          const Icon = alert.icon;
          return (
            <div
              key={index}
              className={`${getAlertColor(alert.type)} border rounded-lg p-4`}
            >
              <div className="flex items-start space-x-3">
                <Icon size={24} className="flex-shrink-0" />
                <p className="text-sm font-medium">{alert.message}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
