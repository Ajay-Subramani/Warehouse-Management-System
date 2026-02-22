import { useState } from 'react';

interface RackData {
  id: string;
  rack_id: string;
  zone: string;
  row_position: number;
  col_position: number;
  utilization_percentage: number;
}

interface WarehouseGridProps {
  racks: RackData[];
}

export default function WarehouseGrid({ racks }: WarehouseGridProps) {
  const [hoveredRack, setHoveredRack] = useState<string | null>(null);

  const getColorClass = (utilization: number) => {
    if (utilization === 0) return 'bg-green-500 border-green-400';
    if (utilization <= 60) return 'bg-yellow-500 border-yellow-400';
    if (utilization <= 85) return 'bg-orange-500 border-orange-400';
    return 'bg-red-500 border-red-400';
  };

  const grid: (RackData | null)[][] = Array(10)
    .fill(null)
    .map(() => Array(10).fill(null));

  racks.forEach((rack) => {
    if (rack.row_position >= 0 && rack.row_position < 10 &&
        rack.col_position >= 0 && rack.col_position < 10) {
      grid[rack.row_position][rack.col_position] = rack;
    }
  });

  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-white mb-2">Warehouse Heatmap</h2>
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 border border-green-400 rounded"></div>
            <span className="text-slate-300">Empty (0%)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-yellow-500 border border-yellow-400 rounded"></div>
            <span className="text-slate-300">Low (1-60%)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-orange-500 border border-orange-400 rounded"></div>
            <span className="text-slate-300">Medium (61-85%)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-500 border border-red-400 rounded"></div>
            <span className="text-slate-300">High (86%+)</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-10 gap-2 max-w-3xl mx-auto">
        {grid.map((row, rowIndex) =>
          row.map((rack, colIndex) => {
            if (!rack) {
              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className="aspect-square bg-slate-700 border border-slate-600 rounded"
                ></div>
              );
            }

            return (
              <div
                key={rack.id}
                className={`aspect-square ${getColorClass(
                  rack.utilization_percentage
                )} border-2 rounded cursor-pointer hover:scale-110 transition-transform relative group`}
                onMouseEnter={() => setHoveredRack(rack.id)}
                onMouseLeave={() => setHoveredRack(null)}
              >
                {hoveredRack === rack.id && (
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 border border-slate-700 rounded shadow-lg z-10 whitespace-nowrap">
                    <div className="text-white text-xs font-semibold">
                      {rack.rack_id}
                    </div>
                    <div className="text-slate-400 text-xs">
                      Zone {rack.zone} • {rack.utilization_percentage}%
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
