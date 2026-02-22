import { Home, BarChart3, Package, User } from 'lucide-react';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  efficiencyScore: number;
}

export default function Navbar({ currentPage, onNavigate, efficiencyScore }: NavbarProps) {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'utilization', label: 'Utilization', icon: BarChart3 },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="bg-slate-900 border-b border-slate-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-white">Smart Warehouse Digital Twin</h1>
            </div>

            <div className="hidden md:flex space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      currentPage === item.id
                        ? 'bg-slate-800 text-white'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2 bg-slate-800 px-4 py-2 rounded-lg">
              <div className="text-right">
                <p className="text-xs text-slate-400">Efficiency Score</p>
                <p className={`text-lg font-bold ${
                  efficiencyScore >= 80 ? 'text-green-400' :
                  efficiencyScore >= 60 ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {efficiencyScore}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="md:hidden border-t border-slate-700">
        <div className="flex justify-around py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-md ${
                  currentPage === item.id
                    ? 'text-white'
                    : 'text-slate-400'
                }`}
              >
                <Icon size={20} />
                <span className="text-xs">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
