import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Warehouse, MapPin, Package, Video, Camera } from 'lucide-react';

interface WarehouseInfo {
  name: string;
  location: string;
  total_capacity: number;
  total_zones: number;
  total_racks: number;
  efficiency_score: number;
}

interface CameraData {
  id: string;
  camera_id: string;
  name: string;
  zone: string;
  video_url: string;
  status: string;
}

export default function Home() {
  const [warehouseInfo, setWarehouseInfo] = useState<WarehouseInfo | null>(null);
  const [cameras, setCameras] = useState<CameraData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: warehouseData } = await supabase
      .from('warehouse_info')
      .select('*')
      .maybeSingle();

    const { data: cameraData } = await supabase
      .from('cameras')
      .select('*')
      .order('camera_id');

    if (warehouseData) setWarehouseInfo(warehouseData);
    if (cameraData) setCameras(cameraData);
    setLoading(false);
  };

  const handleViewVideo = (camera: CameraData) => {
    alert(`Opening video feed for ${camera.name}\nURL: ${camera.video_url}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-lg p-8">
        <div className="flex items-center space-x-4 mb-4">
          <Warehouse className="text-blue-400" size={48} />
          <div>
            <h1 className="text-3xl font-bold text-white">{warehouseInfo?.name}</h1>
            <div className="flex items-center text-slate-300 mt-1">
              <MapPin size={16} className="mr-1" />
              <span>{warehouseInfo?.location}</span>
            </div>
          </div>
        </div>
        <p className="text-slate-300 text-lg">
          Welcome to our state-of-the-art warehouse management system. Monitor operations in real-time,
          optimize space utilization, and maximize efficiency with our digital twin technology.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 hover:border-blue-500 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <Package className="text-blue-400" size={32} />
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            {warehouseInfo?.total_capacity.toLocaleString()}
          </div>
          <div className="text-slate-400 text-sm">Total Capacity (units)</div>
        </div>

        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 hover:border-green-500 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <Warehouse className="text-green-400" size={32} />
          </div>
          <div className="text-3xl font-bold text-white mb-1">{warehouseInfo?.total_zones}</div>
          <div className="text-slate-400 text-sm">Operational Zones</div>
        </div>

        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 hover:border-yellow-500 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <Package className="text-yellow-400" size={32} />
          </div>
          <div className="text-3xl font-bold text-white mb-1">{warehouseInfo?.total_racks}</div>
          <div className="text-slate-400 text-sm">Rack Locations</div>
        </div>

        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 hover:border-purple-500 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <Camera className="text-purple-400" size={32} />
          </div>
          <div className="text-3xl font-bold text-white mb-1">{cameras.length}</div>
          <div className="text-slate-400 text-sm">Security Cameras</div>
        </div>
      </div>

      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
          <Video className="mr-3 text-blue-400" size={28} />
          Camera Monitoring System
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cameras.map((camera) => (
            <div
              key={camera.id}
              className="bg-slate-900 rounded-lg p-4 border border-slate-700 hover:border-slate-600 transition-all hover:scale-105"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-white font-semibold">{camera.name}</h3>
                  <p className="text-slate-400 text-sm">{camera.camera_id}</p>
                </div>
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold ${
                    camera.status === 'online'
                      ? 'bg-green-900 text-green-300'
                      : camera.status === 'offline'
                      ? 'bg-red-900 text-red-300'
                      : 'bg-yellow-900 text-yellow-300'
                  }`}
                >
                  {camera.status}
                </span>
              </div>

              <div className="mb-4">
                <div className="bg-slate-800 rounded aspect-video flex items-center justify-center">
                  <Camera className="text-slate-600" size={48} />
                </div>
              </div>

              <div className="flex items-center justify-between text-sm mb-3">
                <span className="text-slate-400">Zone: {camera.zone}</span>
              </div>

              <button
                onClick={() => handleViewVideo(camera)}
                disabled={camera.status !== 'online'}
                className={`w-full py-2 rounded font-medium transition-colors ${
                  camera.status === 'online'
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                }`}
              >
                {camera.status === 'online' ? 'View Live Feed' : 'Unavailable'}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h2 className="text-2xl font-bold text-white mb-4">About Our Facility</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-slate-300">
          <div>
            <h3 className="text-white font-semibold mb-2">Advanced Technology</h3>
            <p className="text-sm leading-relaxed">
              Our warehouse utilizes cutting-edge IoT sensors, real-time tracking systems, and AI-powered
              analytics to ensure optimal space utilization and inventory management.
            </p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-2">24/7 Monitoring</h3>
            <p className="text-sm leading-relaxed">
              With {cameras.length} security cameras covering all zones, we maintain continuous surveillance
              to ensure safety, security, and operational efficiency around the clock.
            </p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-2">Smart Organization</h3>
            <p className="text-sm leading-relaxed">
              Our digital twin system provides real-time visibility into {warehouseInfo?.total_racks} rack
              locations across {warehouseInfo?.total_zones} zones, making inventory management seamless.
            </p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-2">Optimized Operations</h3>
            <p className="text-sm leading-relaxed">
              With a capacity of {warehouseInfo?.total_capacity.toLocaleString()} units and an efficiency
              score of {warehouseInfo?.efficiency_score}%, we continuously improve our operations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
