import { useState, useMemo } from 'react';
import { Layout } from './components';
import { Baza, Termini, Statistika, Unos } from './modules';
import { useDashboardData } from './hooks/useApi';
import { getQuickStats } from './utils/statistics';

function App() {
  const [activeTab, setActiveTab] = useState('baza');
  const { volunteers, sessions, loading, error, refetchAll } = useDashboardData();

  // Calculate quick stats from local data
  const quickStats = useMemo(() => {
    if (!volunteers || !sessions) return null;
    return getQuickStats(volunteers, sessions);
  }, [volunteers, sessions]);

  // Dynamic hero stats based on active tab
  const heroStats = useMemo(() => {
    if (!quickStats) return null;

    switch (activeTab) {
      case 'baza':
        return [
          { label: 'Volontera', value: quickStats.totalVolunteers },
          { label: 'Aktivnih', value: quickStats.activeVolunteers },
        ];
      case 'termini':
        return [
          { label: 'Termina', value: quickStats.totalSessions },
          { label: 'Djece', value: quickStats.totalChildren },
        ];
      case 'statistika':
        return [
          { label: 'Sati', value: quickStats.totalHours },
          { label: 'Omjer', value: quickStats.avgRatio },
        ];
      case 'unos':
        return [
          { label: 'Volontera', value: quickStats.totalVolunteers },
        ];
      default:
        return null;
    }
  }, [activeTab, quickStats]);

  // Render active module
  const renderModule = () => {
    switch (activeTab) {
      case 'baza':
        return <Baza volunteers={volunteers} sessions={sessions} loading={loading} />;
      case 'termini':
        return <Termini sessions={sessions} volunteers={volunteers} loading={loading} />;
      case 'statistika':
        return <Statistika volunteers={volunteers} sessions={sessions} loading={loading} onRefresh={refetchAll} onNavigate={setActiveTab} />;
      case 'unos':
        return <Unos volunteers={volunteers} loading={loading} />;
      default:
        return null;
    }
  };

  return (
    <Layout
      activeTab={activeTab}
      onTabChange={setActiveTab}
      heroStats={heroStats}
    >
      {error ? (
        <div className="card p-8 text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="font-semibold text-surface-900 mb-2">Greška pri učitavanju podataka</h3>
          <p className="text-surface-500 mb-4">{error.message}</p>
          <button
            onClick={refetchAll}
            className="btn btn-primary"
          >
            Pokušaj ponovo
          </button>
        </div>
      ) : (
        renderModule()
      )}
    </Layout>
  );
}

export default App;
