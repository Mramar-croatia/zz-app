import { useState } from 'react';
import {
  Send,
  RotateCcw,
  CheckCircle2,
  Keyboard,
} from 'lucide-react';
import {
  Button,
  Alert,
  PageLoader,
  SessionDetailDrawer,
} from '../components';
import {
  EntryStatsPanel,
  EntryFormCard,
  VolunteerSelector,
  RecentEntriesPreview,
} from '../components/entry';
import { useSubmitAttendance } from '../hooks/useApi';
import useEntryForm from '../hooks/useEntryForm';

export default function Unos({ volunteers, sessions = [], loading }) {
  // Form and filter state from custom hook
  const form = useEntryForm(volunteers, sessions);

  // Submission hook
  const { submit, loading: submitting, error, success, reset } = useSubmitAttendance();

  // UI state
  const [showRecentEntries, setShowRecentEntries] = useState(true);
  const [selectedSession, setSelectedSession] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    reset();

    try {
      await submit(form.getFormData());
    } catch (err) {
      // Error handled by hook
    }
  };

  const handleReset = () => {
    form.resetForm();
    reset();
  };

  const handleSuccessClose = () => {
    reset();
    // Optionally reset form after successful submission
    // form.resetForm();
  };

  if (loading) {
    return <PageLoader />;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Status Alerts */}
      {success && (
        <Alert variant="success" title="Uspješno spremljeno!" onClose={handleSuccessClose}>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            <span>
              Termin je uspješno zabilježen za {form.selectedVolunteers.size} volonter{form.selectedVolunteers.size === 1 ? 'a' : 'a'}.
            </span>
          </div>
        </Alert>
      )}
      {error && (
        <Alert variant="error" title="Greška pri spremanju" onClose={reset}>
          {error}
        </Alert>
      )}

      {/* Stats Dashboard */}
      <EntryStatsPanel
        todayEntries={form.todayEntries}
        thisWeekEntries={form.thisWeekEntries}
        sessions={sessions}
      />

      {/* Form Section */}
      <EntryFormCard
        selectedDate={form.selectedDate}
        setSelectedDate={form.setSelectedDate}
        location={form.location}
        setLocation={form.setLocation}
        childrenCount={form.childrenCount}
        setChildrenCount={form.setChildrenCount}
        volunteerCount={form.volunteerCount}
        setVolunteerCount={form.setVolunteerCount}
        locations={form.locations}
        duplicateEntry={form.duplicateEntry}
        recentLocationEntries={form.recentLocationEntries}
      />

      {/* Volunteer Selection */}
      <VolunteerSelector
        filteredVolunteers={form.filteredVolunteers}
        selectedVolunteers={form.selectedVolunteers}
        toggleVolunteer={form.toggleVolunteer}
        selectAll={form.selectAll}
        deselectAll={form.deselectAll}
        search={form.search}
        setSearch={form.setSearch}
        filterLocation={form.filterLocation}
        setFilterLocation={form.setFilterLocation}
        filterSchool={form.filterSchool}
        setFilterSchool={form.setFilterSchool}
        showSelected={form.showSelected}
        setShowSelected={form.setShowSelected}
        viewMode={form.viewMode}
        setViewMode={form.setViewMode}
        locations={form.locations}
        schools={form.schools}
        hasFilters={form.hasFilters}
        clearFilters={form.clearFilters}
        allVolunteersCount={volunteers?.length || 0}
        formLocation={form.location}
      />

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 sm:justify-between">
        <div className="flex items-center gap-2 order-2 sm:order-1">
          {/* Keyboard Shortcuts Hint */}
          <div className="hidden lg:flex items-center gap-2 text-sm text-surface-400">
            <Keyboard className="w-4 h-4" />
            <span>Tab za navigaciju</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 order-1 sm:order-2">
          <Button
            type="button"
            variant="secondary"
            onClick={handleReset}
          >
            <RotateCcw className="w-5 h-5" />
            Resetiraj
          </Button>
          <Button
            type="submit"
            variant="gold"
            size="lg"
            disabled={!form.isValid || submitting}
            loading={submitting}
          >
            <Send className="w-5 h-5" />
            Spremi termin
          </Button>
        </div>
      </div>

      {/* Validation Helper */}
      {!form.isValid && (
        <div className="text-center">
          <p className="text-sm text-surface-500 inline-flex items-center gap-2 bg-surface-50 px-4 py-2 rounded-lg">
            {!form.selectedDate && <span className="text-amber-600">Odaberite datum</span>}
            {!form.selectedDate && !form.location && <span className="text-surface-300">•</span>}
            {!form.location && <span className="text-amber-600">Odaberite lokaciju</span>}
            {(!form.selectedDate || !form.location) && form.selectedVolunteers.size === 0 && <span className="text-surface-300">•</span>}
            {form.selectedVolunteers.size === 0 && <span className="text-amber-600">Odaberite volontere</span>}
          </p>
        </div>
      )}

      {/* Recent Entries Preview */}
      {showRecentEntries && sessions.length > 0 && (
        <RecentEntriesPreview
          sessions={sessions}
          onSelectSession={setSelectedSession}
          limit={5}
        />
      )}

      {/* Session Detail Drawer */}
      {selectedSession && (
        <SessionDetailDrawer
          session={selectedSession}
          allVolunteers={volunteers}
          onClose={() => setSelectedSession(null)}
        />
      )}
    </form>
  );
}
