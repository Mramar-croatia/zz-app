import { useState, useMemo } from 'react';
import { Layout } from './components';
import { Baza, Termini, Statistika, Unos } from './modules';
import { useDashboardData } from './hooks/useApi';

function App() {
  const [activeTab, setActiveTab] = useState('baza');
  const { volunteers, sessions, statistics, loading, error, refetchAll } = useDashboardData();

  // Dynamic hero stats based on active tab
  const heroStats = useMemo(() => {
    if (!volunteers || !sessions || !statistics) return null;

    switch (activeTab) {
      case 'baza':
        return [
          { label: 'Volontera', value: volunteers.length },
          { label: 'Aktivnih', value: statistics.summaryCards?.find(c => c.label === 'AKTIVNI VOLONTERI')?.value || '-' },
        ];
      case 'termini':
        return [
          { label: 'Termina', value: sessions.length },
          { label: 'Djece', value: statistics.summaryCards?.find(c => c.label === 'DOLASCI DJECE')?.value || '-' },
        ];
      case 'statistika':
        return [
          { label: 'Sati', value: statistics.summaryCards?.find(c => c.label === 'VOLONTERSKI SATI')?.value || '-' },
          { label: 'Omjer', value: statistics.summaryCards?.find(c => c.label === 'OMJER')?.value || '-' },
        ];
      case 'unos':
        return [
          { label: 'Volontera', value: volunteers.length },
        ];
      default:
        return null;
    }
  }, [activeTab, volunteers, sessions, statistics]);

  // Render active module
  const renderModule = () => {
    switch (activeTab) {
      case 'baza':
        return <Baza volunteers={volunteers} sessions={sessions} loading={loading} />;
      case 'termini':
        return <Termini sessions={sessions} volunteers={volunteers} loading={loading} />;
      case 'statistika':
        return <Statistika statistics={statistics} loading={loading} onRefresh={refetchAll} />;
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
