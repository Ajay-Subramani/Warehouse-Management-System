import { Lightbulb, ArrowRight, AlertCircle } from 'lucide-react';

interface RackData {
  zone: string;
}

interface RecommendationPanelProps {
  underutilizedZones: RackData[];
  deadStockCount: number;
}

export default function RecommendationPanel({
  underutilizedZones,
  deadStockCount,
}: RecommendationPanelProps) {
  const recommendations = [
    {
      priority: 'high',
      message: 'Move fast-moving SKUs closer to loading dock',
      action: 'Optimize placement',
    },
    {
      priority: 'medium',
      message: `Zone B has ${underutilizedZones.filter(z => z.zone === 'B').length} underutilized racks`,
      action: 'Consolidate inventory',
    },
    {
      priority: deadStockCount > 5 ? 'high' : 'low',
      message: `${deadStockCount} items inactive for 90+ days`,
      action: 'Review dead stock',
    },
    {
      priority: 'medium',
      message: 'Peak congestion at 10 AM daily',
      action: 'Adjust workflow schedule',
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-900/40 border-red-500 text-red-300';
      case 'medium':
        return 'bg-yellow-900/40 border-yellow-500 text-yellow-300';
      case 'low':
        return 'bg-blue-900/40 border-blue-500 text-blue-300';
      default:
        return 'bg-slate-900/40 border-slate-500 text-slate-300';
    }
  };

  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
      <div className="flex items-center space-x-2 mb-4">
        <Lightbulb className="text-yellow-400" size={24} />
        <h3 className="text-lg font-semibold text-white">
          Optimization Recommendations
        </h3>
      </div>

      <div className="space-y-3">
        {recommendations.map((rec, index) => (
          <div
            key={index}
            className={`${getPriorityColor(rec.priority)} border rounded-lg p-4 hover:scale-105 transition-transform`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-start space-x-2">
                <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                <p className="text-sm font-medium">{rec.message}</p>
              </div>
              <span className="text-xs font-semibold uppercase px-2 py-1 rounded bg-black/30">
                {rec.priority}
              </span>
            </div>
            <button className="flex items-center space-x-1 text-xs font-medium hover:underline">
              <span>{rec.action}</span>
              <ArrowRight size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
