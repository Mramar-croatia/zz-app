import { useState } from 'react';
import {
  Users,
  Clock,
  Baby,
  TrendingUp,
  RefreshCw,
  MapPin,
  GraduationCap,
  Award,
} from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  StatCard,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  DynamicChart,
  PageLoader,
  FilterChips,
  Badge,
} from '../components';
import { formatDateLong } from '../utils/croatian';

// Map label to icon
const STAT_ICONS = {
  'VOLONTERSKI SATI': Clock,
  'DOLASCI DJECE': Baby,
  'BROJ VOLONTERA': Users,
  'AKTIVNI VOLONTERI': Award,
  'POSTOTAK AKTIVNIH': TrendingUp,
  'OMJER': Users,
};

export default function Statistika({ statistics, loading, onRefresh }) {
  const [activeTableId, setActiveTableId] = useState('by-location');

  if (loading) {
    return <PageLoader />;
  }

  if (!statistics) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <p className="text-surface-500">Podaci nisu dostupni</p>
        </CardContent>
      </Card>
    );
  }

  const { summaryCards, tables, charts, lastUpdated } = statistics;
  const activeTable = tables?.find(t => t.id === activeTableId);

  return (
    <div className="space-y-6">
      {/* Last Updated */}
      {lastUpdated && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-surface-500">
            Posljednje ažuriranje:{' '}
            <span className="font-medium text-surface-700">
              {new Date(lastUpdated).toLocaleString('hr-HR')}
            </span>
          </p>
          <button
            onClick={onRefresh}
            className="flex items-center gap-2 text-sm text-brand-purple hover:text-brand-purple-dark font-medium"
          >
            <RefreshCw className="w-4 h-4" />
            Osvježi
          </button>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {summaryCards?.map((card, index) => {
          const Icon = STAT_ICONS[card.label] || TrendingUp;
          return (
            <StatCard
              key={index}
              label={card.label}
              value={card.value}
              delta={card.delta}
              icon={Icon}
              trend={card.delta?.includes('-') ? 'down' : 'up'}
            />
          );
        })}
      </div>

      {/* Charts */}
      {charts && charts.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {charts.map((chart, index) => (
            <DynamicChart key={index} chart={chart} height={280} />
          ))}
        </div>
      )}

      {/* Tables Section */}
      {tables && tables.length > 0 && (
        <Card>
          <CardHeader className="border-b border-surface-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle>Detaljni pregled</CardTitle>
              <FilterChips
                options={tables.map(t => ({ value: t.id, label: t.title }))}
                selected={activeTableId}
                onChange={setActiveTableId}
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {activeTable && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      {activeTable.columns.map((col, i) => (
                        <th
                          key={i}
                          className={`table-header ${i > 0 ? 'text-right' : ''}`}
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {activeTable.rows.map((row, rowIndex) => (
                      <tr key={rowIndex} className="hover:bg-surface-50">
                        {row.map((cell, cellIndex) => (
                          <td
                            key={cellIndex}
                            className={`table-cell ${cellIndex > 0 ? 'text-right' : ''}`}
                          >
                            {cellIndex === 0 ? (
                              <span className="font-medium text-surface-900">
                                {cell}
                              </span>
                            ) : (
                              <span className="text-surface-600 tabular-nums">
                                {cell}
                              </span>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Mobile Table Cards - Alternative view for small screens */}
      {activeTable && (
        <div className="lg:hidden space-y-3">
          <h3 className="font-semibold text-surface-900 px-1">{activeTable.title}</h3>
          {activeTable.rows.map((row, rowIndex) => (
            <Card key={rowIndex}>
              <CardContent className="p-4">
                <h4 className="font-semibold text-surface-900 mb-3">{row[0]}</h4>
                <div className="grid grid-cols-2 gap-2">
                  {activeTable.columns.slice(1).map((col, colIndex) => (
                    <div key={colIndex} className="bg-surface-50 rounded-lg p-2">
                      <p className="text-xs text-surface-500">{col}</p>
                      <p className="font-semibold text-surface-900 tabular-nums">
                        {row[colIndex + 1]}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
