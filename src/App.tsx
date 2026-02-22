import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Utilization from './pages/Utilization';
import Products from './pages/Products';
import Profile from './pages/Profile';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [efficiencyScore, setEfficiencyScore] = useState(75);

  useEffect(() => {
    fetchEfficiencyScore();
  }, []);

  const fetchEfficiencyScore = async () => {
    const { data } = await supabase
      .from('warehouse_info')
      .select('efficiency_score')
      .maybeSingle();

    if (data) {
      setEfficiencyScore(data.efficiency_score);
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home />;
      case 'utilization':
        return <Utilization />;
      case 'products':
        return <Products />;
      case 'profile':
        return <Profile />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Navbar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        efficiencyScore={efficiencyScore}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderPage()}
      </main>

      <Footer />
    </div>
  );
}
export default App;
