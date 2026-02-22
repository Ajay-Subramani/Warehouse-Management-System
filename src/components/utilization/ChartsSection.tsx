import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface UtilizationData {
  date: string;
  zone: string;
  utilization_percentage: number;
  congestion_index: number;
  hour?: number;
}

interface RackData {
  zone: string;
  utilization_percentage: number;
}

interface ChartsSectionProps {
  utilizationHistory: UtilizationData[];
  hourlyData: UtilizationData[];
  racks: RackData[];
}

export default function ChartsSection({
  utilizationHistory,
  hourlyData,
  racks,
}: ChartsSectionProps) {
  const dailyData = utilizationHistory
    .filter((item) => !item.hour)
    .reduce((acc: any[], item) => {
      const existing = acc.find((d) => d.date === item.date);
      if (existing) {
        existing[item.zone] = item.utilization_percentage;
      } else {
        acc.push({
          date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          [item.zone]: item.utilization_percentage,
        });
      }
      return acc;
    }, []);

  const zoneData = ['A', 'B', 'C'].map((zone) => {
    const zoneRacks = racks.filter((r) => r.zone === zone);
    const avgUtilization = zoneRacks.length > 0
      ? Math.round(zoneRacks.reduce((sum, r) => sum + r.utilization_percentage, 0) / zoneRacks.length)
      : 0;
    return { zone: `Zone ${zone}`, utilization: avgUtilization };
  });

  const congestionData = hourlyData.map((item) => ({
    hour: `${item.hour}:00`,
    congestion: item.congestion_index,
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-4">
          Utilization Trend (Last 7 Days)
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={dailyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="date" stroke="#9CA3AF" fontSize={12} />
            <YAxis stroke="#9CA3AF" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                border: '1px solid #475569',
                borderRadius: '0.5rem',
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="A"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ fill: '#3b82f6' }}
            />
            <Line
              type="monotone"
              dataKey="B"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ fill: '#10b981' }}
            />
            <Line
              type="monotone"
              dataKey="C"
              stroke="#f59e0b"
              strokeWidth={2}
              dot={{ fill: '#f59e0b' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-4">
          Zone-wise Utilization Comparison
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={zoneData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="zone" stroke="#9CA3AF" fontSize={12} />
            <YAxis stroke="#9CA3AF" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                border: '1px solid #475569',
                borderRadius: '0.5rem',
              }}
            />
            <Bar dataKey="utilization" fill="#3b82f6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 lg:col-span-2">
        <h3 className="text-lg font-semibold text-white mb-4">
          Congestion Trend by Hour
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={congestionData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="hour" stroke="#9CA3AF" fontSize={12} />
            <YAxis stroke="#9CA3AF" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                border: '1px solid #475569',
                borderRadius: '0.5rem',
              }}
            />
            <Area
              type="monotone"
              dataKey="congestion"
              stroke="#f59e0b"
              fill="#f59e0b"
              fillOpacity={0.3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
