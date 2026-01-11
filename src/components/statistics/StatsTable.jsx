import { BarChart3 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../Card';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  EmptyState,
} from '../Table';
import { FilterChips } from '../Filters';
import Pagination from '../Pagination';
import { Badge, LocationBadge } from '../Badge';
import { STATISTICS_TABLE_VIEWS } from '../../constants';

export default function StatsTable({
  activeTableView,
  setActiveTableView,
  paginatedItems,
  currentPage,
  totalPages,
  handlePageChange,
  pageSize,
  handlePageSizeChange,
  totalItems,
}) {
  const renderTableHeader = () => {
    switch (activeTableView) {
      case 'location':
        return (
          <>
            <TableHead>Lokacija</TableHead>
            <TableHead className="text-center">Termina</TableHead>
            <TableHead className="text-center">Djece</TableHead>
            <TableHead className="text-center">Volontera</TableHead>
          </>
        );
      case 'school':
        return (
          <>
            <TableHead>Skola</TableHead>
            <TableHead className="text-center">Volontera</TableHead>
            <TableHead className="text-center">Sati</TableHead>
            <TableHead className="text-center">Termina</TableHead>
          </>
        );
      case 'month':
        return (
          <>
            <TableHead>Mjesec</TableHead>
            <TableHead className="text-center">Termina</TableHead>
            <TableHead className="text-center">Djece</TableHead>
            <TableHead className="text-center">Volontera</TableHead>
          </>
        );
      case 'top':
        return (
          <>
            <TableHead className="w-16">#</TableHead>
            <TableHead>Volonter</TableHead>
            <TableHead>Skola</TableHead>
            <TableHead className="text-center">Razred</TableHead>
            <TableHead className="text-right">Sati</TableHead>
          </>
        );
      default:
        return null;
    }
  };

  const renderTableRow = (item, index) => {
    switch (activeTableView) {
      case 'location':
        return (
          <>
            <TableCell>
              <LocationBadge location={item.name} />
            </TableCell>
            <TableCell className="text-center">
              <span className="font-semibold text-brand-purple text-lg">{item.sessions}</span>
            </TableCell>
            <TableCell className="text-center">
              <span className="font-semibold text-brand-gold text-lg">{item.children}</span>
            </TableCell>
            <TableCell className="text-center">
              <span className="font-semibold text-emerald-600 text-lg">{item.volunteers}</span>
            </TableCell>
          </>
        );
      case 'school':
        return (
          <>
            <TableCell>
              <span className="font-medium text-surface-900">{item.name}</span>
            </TableCell>
            <TableCell className="text-center">
              <span className="font-semibold text-brand-purple text-lg">{item.volunteers}</span>
            </TableCell>
            <TableCell className="text-center">
              <span className="font-semibold text-amber-600 text-lg">{item.hours}h</span>
            </TableCell>
            <TableCell className="text-center">
              <span className="font-semibold text-emerald-600 text-lg">{item.sessions}</span>
            </TableCell>
          </>
        );
      case 'month':
        return (
          <>
            <TableCell>
              <span className="font-medium text-surface-900">{item.label}</span>
            </TableCell>
            <TableCell className="text-center">
              <span className="font-semibold text-brand-purple text-lg">{item.sessions}</span>
            </TableCell>
            <TableCell className="text-center">
              <span className="font-semibold text-brand-gold text-lg">{item.children}</span>
            </TableCell>
            <TableCell className="text-center">
              <span className="font-semibold text-emerald-600 text-lg">{item.volunteers}</span>
            </TableCell>
          </>
        );
      case 'top':
        return (
          <>
            <TableCell>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                item.rank === 1 ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-white' :
                item.rank === 2 ? 'bg-gray-400 text-white' :
                item.rank === 3 ? 'bg-amber-700 text-white' :
                'bg-surface-100 text-surface-600'
              }`}>
                {item.rank}
              </div>
            </TableCell>
            <TableCell>
              <span className="font-medium text-surface-900">{item.name}</span>
            </TableCell>
            <TableCell>
              <span className="text-surface-600">{item.school}</span>
            </TableCell>
            <TableCell className="text-center">
              <Badge variant="purple">{item.grade}. razred</Badge>
            </TableCell>
            <TableCell className="text-right">
              <span className="text-xl font-bold text-amber-600">{item.hours}h</span>
            </TableCell>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader className="border-b border-surface-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-brand-purple" />
            <CardTitle className="text-lg">Detaljni pregled</CardTitle>
          </div>
        </div>
        <div className="mt-4">
          <FilterChips
            options={STATISTICS_TABLE_VIEWS}
            selected={activeTableView}
            onChange={setActiveTableView}
          />
        </div>
      </CardHeader>

      {/* Desktop Table */}
      <div className="hidden lg:block">
        <Table>
          <TableHeader>
            <TableRow hover={false}>
              {renderTableHeader()}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedItems.length === 0 ? (
              <TableRow hover={false}>
                <TableCell colSpan={activeTableView === 'top' ? 5 : 4} className="p-0">
                  <EmptyState
                    icon={BarChart3}
                    title="Nema podataka"
                    description="Nema podataka za prikaz"
                  />
                </TableCell>
              </TableRow>
            ) : (
              paginatedItems.map((item, index) => (
                <TableRow key={index}>
                  {renderTableRow(item, index)}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <CardContent className="lg:hidden">
        {paginatedItems.length === 0 ? (
          <EmptyState
            icon={BarChart3}
            title="Nema podataka"
            description="Nema podataka za prikaz"
          />
        ) : (
          <div className="space-y-3">
            {paginatedItems.map((item, index) => (
              <div key={index} className="bg-surface-50 rounded-xl p-4">
                {activeTableView === 'location' && (
                  <div className="flex items-center justify-between">
                    <LocationBadge location={item.name} />
                    <div className="flex gap-4 text-center">
                      <div>
                        <p className="text-lg font-bold text-brand-purple">{item.sessions}</p>
                        <p className="text-xs text-surface-500">termina</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-brand-gold">{item.children}</p>
                        <p className="text-xs text-surface-500">djece</p>
                      </div>
                    </div>
                  </div>
                )}
                {activeTableView === 'school' && (
                  <div>
                    <p className="font-medium text-surface-900 mb-2">{item.name}</p>
                    <div className="flex gap-4">
                      <div>
                        <span className="text-lg font-bold text-brand-purple">{item.volunteers}</span>
                        <span className="text-xs text-surface-500 ml-1">vol.</span>
                      </div>
                      <div>
                        <span className="text-lg font-bold text-amber-600">{item.hours}h</span>
                      </div>
                    </div>
                  </div>
                )}
                {activeTableView === 'month' && (
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-surface-900">{item.label}</span>
                    <div className="flex gap-4 text-center">
                      <div>
                        <p className="text-lg font-bold text-brand-purple">{item.sessions}</p>
                        <p className="text-xs text-surface-500">termina</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-brand-gold">{item.children}</p>
                        <p className="text-xs text-surface-500">djece</p>
                      </div>
                    </div>
                  </div>
                )}
                {activeTableView === 'top' && (
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      item.rank === 1 ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-white' :
                      item.rank === 2 ? 'bg-gray-400 text-white' :
                      item.rank === 3 ? 'bg-amber-700 text-white' :
                      'bg-surface-100 text-surface-600'
                    }`}>
                      {item.rank}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-surface-900 truncate">{item.name}</p>
                      <p className="text-sm text-surface-500 truncate">{item.school}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xl font-bold text-amber-600">{item.hours}h</p>
                      <Badge variant="purple" className="text-xs">{item.grade}. razred</Badge>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>

      {totalItems > 0 && (
        <div className="p-4 border-t border-surface-100">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            pageSize={pageSize}
            onPageSizeChange={handlePageSizeChange}
            totalItems={totalItems}
          />
        </div>
      )}
    </Card>
  );
}
