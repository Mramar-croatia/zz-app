import { Calendar, MapPin, Baby, Users, AlertTriangle, Info } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../Card';
import { DateInput, NumberInput, Select } from '../Form';
import { Badge } from '../Badge';
import { formatDateShort } from '../../utils/croatian';

export default function EntryFormCard({
  selectedDate,
  setSelectedDate,
  location,
  setLocation,
  childrenCount,
  setChildrenCount,
  volunteerCount,
  setVolunteerCount,
  locations,
  duplicateEntry,
  recentLocationEntries = [],
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3">
            <Calendar className="w-6 h-6 text-surface-800" />
            Podaci o terminu
          </CardTitle>
          {location && (
            <Badge variant="purple" className="hidden sm:flex">
              <MapPin className="w-3.5 h-3.5 mr-1" />
              {location}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {/* Duplicate Warning */}
        {duplicateEntry && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-800 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-800">
                Termin za ovaj datum i lokaciju već postoji
              </p>
              <p className="text-xs text-amber-800 mt-1">
                Evidentirano: {duplicateEntry.volunteerCount || duplicateEntry.volunteers?.length || 0} volontera, {duplicateEntry.childrenCount || 0} djece
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <DateInput
            label="Datum"
            value={selectedDate}
            onChange={setSelectedDate}
            required
          />
          <Select
            label="Lokacija"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            options={locations.map(l => ({ value: l, label: l }))}
            placeholder="Odaberi lokaciju"
            required
          />
          <NumberInput
            label="Broj djece"
            value={childrenCount}
            onChange={setChildrenCount}
            min={0}
          />
          <NumberInput
            label="Broj volontera"
            value={volunteerCount}
            onChange={setVolunteerCount}
            min={0}
          />
        </div>

        {/* Recent entries for this location */}
        {location && recentLocationEntries.length > 0 && (
          <div className="mt-4 pt-4 border-t border-surface-100">
            <div className="flex items-center gap-2 mb-3">
              <Info className="w-4 h-4 text-surface-400" />
              <p className="text-sm font-medium text-surface-600">
                Nedavni termini na lokaciji {location}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {recentLocationEntries.slice(0, 5).map((entry, i) => (
                <div
                  key={i}
                  className="px-3 py-1.5 bg-surface-50 text-xs text-surface-600 flex items-center gap-2"
                >
                  <span className="font-medium">{formatDateShort(entry.date)}</span>
                  <span className="text-surface-400">|</span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {entry.volunteerCount || entry.volunteers?.length || 0}
                  </span>
                  <span className="flex items-center gap-1">
                    <Baby className="w-3 h-3" />
                    {entry.childrenCount || 0}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
