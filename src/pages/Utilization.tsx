import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import KPIStats from '../components/utilization/KPIStats';
import WarehouseGrid from '../components/utilization/WarehouseGrid';
import ChartsSection from '../components/utilization/ChartsSection';
import RecommendationPanel from '../components/utilization/RecommendationPanel';
import AlertsPanel from '../components/utilization/AlertsPanel';

interface RackData {
  id: string;
  rack_id: string;
  zone: string;
  row_position: number;
  col_position: number;
  utilization_percentage: number;
}

interface UtilizationData {
  date: string;
  zone: string;
  utilization_percentage: number;
  congestion_index: number;
  hour?: number;
}

interface ProductData {
  status: string;
  last_movement_date: string;
}

export default function Utilization() {
  const [racks, setRacks] = useState<RackData[]>([]);
  const [utilizationHistory, setUtilizationHistory] = useState<UtilizationData[]>([]);
  const [hourlyData, setHourlyData] = useState<UtilizationData[]>([]);
  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: racksData } = await supabase
      .from('warehouse_racks')
      .select('*')
      .order('row_position')
      .order('col_position');

    const { data: historyData } = await supabase
      .from('utilization_history')
      .select('*')
      .is('hour', null)
      .order('date', { ascending: true });

    const { data: hourlyUtilization } = await supabase
      .from('utilization_history')
      .select('*')
      .not('hour', 'is', null)
      .order('hour');

    const { data: productsData } = await supabase
      .from('products')
      .select('status, last_movement_date');

    if (racksData) setRacks(racksData);
    if (historyData) setUtilizationHistory(historyData);
    if (hourlyUtilization) setHourlyData(hourlyUtilization);
    if (productsData) setProducts(productsData);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="text-white text-xl">Loading utilization data...</div>
      </div>
    );
  }

  const calculateKPIs = () => {
    const totalUtilization = racks.reduce((sum, rack) => sum + rack.utilization_percentage, 0);
    const avgUtilization = racks.length > 0 ? Math.round(totalUtilization / racks.length) : 0;

    const underutilizedCount = racks.filter(r => r.utilization_percentage < 30).length;

    const deadStockCount = products.filter(p => {
      const daysSinceMovement = Math.floor(
        (Date.now() - new Date(p.last_movement_date).getTime()) / (1000 * 60 * 60 * 24)
      );
      return daysSinceMovement > 90;
    }).length;

    const avgCongestion = hourlyData.length > 0
      ? Math.round(hourlyData.reduce((sum, h) => sum + h.congestion_index, 0) / hourlyData.length)
      : 0;

    return { avgUtilization, underutilizedCount, deadStockCount, avgCongestion };
  };

  const kpis = calculateKPIs();

  return (
    <div className="space-y-6">
      <KPIStats {...kpis} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <WarehouseGrid racks={racks} />
        </div>
        <div>
          <RecommendationPanel
            underutilizedZones={racks.filter(r => r.utilization_percentage < 30)}
            deadStockCount={kpis.deadStockCount}
          />
        </div>
      </div>

      <AlertsPanel
        deadStockCount={kpis.deadStockCount}
        congestionIndex={kpis.avgCongestion}
        overstockedZones={racks.filter(r => r.utilization_percentage > 90)}
      />

      <ChartsSection
        utilizationHistory={utilizationHistory}
        hourlyData={hourlyData}
        racks={racks}
      />
    </div>
  );
}
