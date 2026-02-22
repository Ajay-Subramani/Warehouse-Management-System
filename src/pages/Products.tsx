import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Package, Search, Filter, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';

interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  quantity: number;
  status: string;
  last_movement_date: string;
  rack_id: string;
}

interface RackData {
  rack_id: string;
  zone: string;
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [racks, setRacks] = useState<Map<string, RackData>>(new Map());
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: productsData } = await supabase
      .from('products')
      .select('*')
      .order('sku');

    const { data: racksData } = await supabase
      .from('warehouse_racks')
      .select('id, rack_id, zone');

    if (productsData) setProducts(productsData);

    if (racksData) {
      const rackMap = new Map();
      racksData.forEach((rack: any) => {
        rackMap.set(rack.id, { rack_id: rack.rack_id, zone: rack.zone });
      });
      setRacks(rackMap);
    }

    setLoading(false);
  };

  const getDaysSinceMovement = (date: string) => {
    return Math.floor((Date.now() - new Date(date).getTime()) / (1000 * 60 * 60 * 24));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'fast_moving':
        return <TrendingUp className="text-green-400" size={18} />;
      case 'dead_stock':
        return <AlertCircle className="text-red-400" size={18} />;
      default:
        return <CheckCircle className="text-blue-400" size={18} />;
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      fast_moving: 'bg-green-900/40 text-green-300 border-green-500',
      dead_stock: 'bg-red-900/40 text-red-300 border-red-500',
      active: 'bg-blue-900/40 text-blue-300 border-blue-500',
    };
    return styles[status as keyof typeof styles] || styles.active;
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || product.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const categories = ['all', ...new Set(products.map((p) => p.category))];
  const statuses = ['all', 'active', 'fast_moving', 'dead_stock'];

  const stats = {
    total: products.length,
    active: products.filter((p) => p.status === 'active').length,
    fastMoving: products.filter((p) => p.status === 'fast_moving').length,
    deadStock: products.filter((p) => p.status === 'dead_stock').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="text-white text-xl">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total Products</p>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
            </div>
            <Package className="text-blue-400" size={32} />
          </div>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Active</p>
              <p className="text-2xl font-bold text-blue-400">{stats.active}</p>
            </div>
            <CheckCircle className="text-blue-400" size={32} />
          </div>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Fast Moving</p>
              <p className="text-2xl font-bold text-green-400">{stats.fastMoving}</p>
            </div>
            <TrendingUp className="text-green-400" size={32} />
          </div>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Dead Stock</p>
              <p className="text-2xl font-bold text-red-400">{stats.deadStock}</p>
            </div>
            <AlertCircle className="text-red-400" size={32} />
          </div>
        </div>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search by SKU or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex gap-2">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="pl-10 pr-8 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500 appearance-none cursor-pointer"
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status === 'all' ? 'All Status' : status.replace('_', ' ')}
                  </option>
                ))}
              </select>
            </div>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500 appearance-none cursor-pointer"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-3 px-4 text-slate-400 font-semibold text-sm">SKU</th>
                <th className="text-left py-3 px-4 text-slate-400 font-semibold text-sm">Product Name</th>
                <th className="text-left py-3 px-4 text-slate-400 font-semibold text-sm">Category</th>
                <th className="text-left py-3 px-4 text-slate-400 font-semibold text-sm">Quantity</th>
                <th className="text-left py-3 px-4 text-slate-400 font-semibold text-sm">Location</th>
                <th className="text-left py-3 px-4 text-slate-400 font-semibold text-sm">Status</th>
                <th className="text-left py-3 px-4 text-slate-400 font-semibold text-sm">Last Movement</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => {
                const rack = product.rack_id ? racks.get(product.rack_id) : null;
                const daysSince = getDaysSinceMovement(product.last_movement_date);

                return (
                  <tr
                    key={product.id}
                    className="border-b border-slate-700 hover:bg-slate-700/30 transition-colors"
                  >
                    <td className="py-3 px-4 text-white font-mono text-sm">{product.sku}</td>
                    <td className="py-3 px-4 text-white">{product.name}</td>
                    <td className="py-3 px-4 text-slate-300">{product.category}</td>
                    <td className="py-3 px-4 text-white font-semibold">{product.quantity}</td>
                    <td className="py-3 px-4 text-slate-300">
                      {rack ? (
                        <span>
                          {rack.rack_id} <span className="text-xs text-slate-500">(Zone {rack.zone})</span>
                        </span>
                      ) : (
                        <span className="text-slate-500">Unassigned</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(
                          product.status
                        )}`}
                      >
                        {getStatusIcon(product.status)}
                        <span className="ml-1">{product.status.replace('_', ' ')}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-300 text-sm">
                      {daysSince === 0 ? 'Today' : `${daysSince} days ago`}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Package className="mx-auto text-slate-600 mb-3" size={48} />
            <p className="text-slate-400">No products found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}
