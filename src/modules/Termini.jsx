import { useState } from 'react';
import { Calendar } from 'lucide-react';
import {
  Card,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  EmptyState,
  PageLoader,
  SessionDetailDrawer,
  VolunteerDetailDrawer,
  Pagination,
} from '../components';
import {
  SessionCard,
  SessionRow,
  SessionStatsPanel,
  SessionFilters,
} from '../components/sessions';
import { HOURS_GOALS } from '../constants';
import useSessionFilters from '../hooks/useSessionFilters';
import usePagination from '../hooks/usePagination';

export default function Termini({ sessions, volunteers = [], loading }) {
  const {
    search,
    locationFilter,
    yearFilter,
    statusFilter,
    setSearch,
    setLocationFilter,
    setYearFilter,
    setStatusFilter,
    filterOptions,
    filteredSessions,
    totals,
    sessionCounts,
    hasFilters,
    clearFilters,
    filterDeps,
  } = useSessionFilters(sessions);

  const {
    currentPage,
    pageSize,
    totalPages,
    paginatedItems: paginatedSessions,
    handlePageChange,
    handlePageSizeChange,
  } = usePagination(filteredSessions, { resetDeps: filterDeps });

  const [viewMode, setViewMode] = useState('table');
  const [expandedId, setExpandedId] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);

  if (loading) {
    return <PageLoader />;
  }

  const renderPagination = () => (
    filteredSessions.length > 0 && (
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        pageSize={pageSize}
        onPageSizeChange={handlePageSizeChange}
        totalItems={filteredSessions.length}
      />
    )
  );

  const renderEmptyState = () => (
    <EmptyState
      icon={Calendar}
      title="Nema pronađenih termina"
      description="Pokušajte s drugim filterima"
    />
  );

  return (
    <div className="space-y-4">
      <SessionStatsPanel
        totals={totals}
        sessionCounts={sessionCounts}
        statusFilter={statusFilter}
      />

      <SessionFilters
        viewMode={viewMode}
        setViewMode={setViewMode}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        sessionCounts={sessionCounts}
        search={search}
        setSearch={setSearch}
        locationFilter={locationFilter}
        setLocationFilter={setLocationFilter}
        yearFilter={yearFilter}
        setYearFilter={setYearFilter}
        filterOptions={filterOptions}
        hasFilters={hasFilters}
        clearFilters={clearFilters}
        filteredCount={filteredSessions.length}
        totalCount={sessions?.length || 0}
      />

      {/* Desktop Table View */}
      {viewMode === 'table' && (
        <Card className="hidden lg:block">
          <Table>
            <TableHeader>
              <TableRow hover={false}>
                <TableHead>Datum</TableHead>
                <TableHead>Lokacija</TableHead>
                <TableHead className="text-center">Djeca</TableHead>
                <TableHead className="text-center">Volonteri</TableHead>
                <TableHead>Prisutni volonteri</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedSessions.length === 0 ? (
                <TableRow hover={false}>
                  <TableCell colSpan={5} className="p-0">
                    <div className="flex justify-center">
                      <div className="w-full max-w-xl">
                        {renderEmptyState()}
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedSessions.map((session, index) => (
                  <SessionRow
                    key={`${session.date}-${session.location}-${index}`}
                    session={session}
                    onClick={() => setSelectedSession(session)}
                  />
                ))
              )}
            </TableBody>
          </Table>
          <div className="px-6 pb-4">{renderPagination()}</div>
        </Card>
      )}

      {/* Desktop Card View */}
      {viewMode === 'cards' && (
        <div className="hidden lg:block">
          {paginatedSessions.length === 0 ? (
            <Card className="p-6">{renderEmptyState()}</Card>
          ) : (
            <>
              <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
                {paginatedSessions.map((session, index) => (
                  <SessionCard
                    key={`${session.date}-${session.location}-${index}`}
                    session={session}
                    variant="desktop"
                    onClick={() => setSelectedSession(session)}
                  />
                ))}
              </div>
              <Card className="mt-4 p-4">{renderPagination()}</Card>
            </>
          )}
        </div>
      )}

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-3">
        {paginatedSessions.length === 0 ? (
          <Card className="p-6">{renderEmptyState()}</Card>
        ) : (
          paginatedSessions.map((session, index) => {
            const id = `${session.date}-${session.location}-${index}`;
            return (
              <SessionCard
                key={id}
                session={session}
                variant="mobile"
                isExpanded={expandedId === id}
                onToggleExpand={() => setExpandedId(prev => prev === id ? null : id)}
              />
            );
          })
        )}
        <Card className="p-4">{renderPagination()}</Card>
      </div>

      {selectedSession && (
        <SessionDetailDrawer
          session={selectedSession}
          allVolunteers={volunteers}
          onClose={() => setSelectedSession(null)}
          onSelectVolunteer={volunteer => {
            setSelectedSession(null);
            setSelectedVolunteer(volunteer);
          }}
        />
      )}

      {selectedVolunteer && (
        <VolunteerDetailDrawer
          volunteer={selectedVolunteer}
          sessions={sessions}
          allVolunteers={volunteers}
          onClose={() => setSelectedVolunteer(null)}
          onSelectVolunteer={setSelectedVolunteer}
          onSelectSession={session => {
            setSelectedVolunteer(null);
            setSelectedSession(session);
          }}
          hoursGoal={HOURS_GOALS.basic}
          hoursGoals={HOURS_GOALS}
        />
      )}
    </div>
  );
}
