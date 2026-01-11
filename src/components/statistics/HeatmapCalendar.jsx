import { format, subMonths, startOfMonth, eachDayOfInterval, getDay } from 'date-fns';
import { hr } from 'date-fns/locale';
import { Calendar } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../Card';

const INTENSITY_COLORS = {
  0: 'bg-surface-100',
  1: 'bg-emerald-200',
  2: 'bg-emerald-400',
  3: 'bg-emerald-600',
  4: 'bg-emerald-800',
};

function getIntensity(date, heatmapData) {
  if (!date) return 0;
  const dateKey = format(date, 'yyyy-MM-dd');
  const data = heatmapData[dateKey];
  if (!data) return 0;
  if (data.sessions >= 3) return 4;
  if (data.sessions >= 2) return 3;
  if (data.sessions >= 1) return 2;
  return 1;
}

function CalendarGrid({ heatmapData }) {
  const today = new Date();
  const startDate = subMonths(today, 11);
  const startOfCalendar = startOfMonth(startDate);

  const allDates = eachDayOfInterval({
    start: startOfCalendar,
    end: today,
  });

  const weeks = [];
  let currentWeek = [];

  const firstDayOfWeek = getDay(startOfCalendar);
  for (let i = 0; i < firstDayOfWeek; i++) {
    currentWeek.push(null);
  }

  allDates.forEach((date) => {
    currentWeek.push(date);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push(null);
    }
    weeks.push(currentWeek);
  }

  const monthLabels = [];
  let lastMonth = -1;
  weeks.forEach((week, weekIndex) => {
    const firstValidDate = week.find(d => d !== null);
    if (firstValidDate) {
      const month = firstValidDate.getMonth();
      if (month !== lastMonth) {
        monthLabels.push({ weekIndex, label: format(firstValidDate, 'MMM', { locale: hr }) });
        lastMonth = month;
      }
    }
  });

  return (
    <div>
      {/* Month labels */}
      <div className="flex mb-2 text-xs text-surface-500">
        <div className="w-8" />
        <div className="flex-1 flex">
          {monthLabels.map((m, i) => (
            <div
              key={i}
              className="text-center"
              style={{
                marginLeft: i === 0 ? `${m.weekIndex * 14}px` : undefined,
                width: i < monthLabels.length - 1
                  ? `${(monthLabels[i + 1].weekIndex - m.weekIndex) * 14}px`
                  : undefined,
              }}
            >
              {m.label}
            </div>
          ))}
        </div>
      </div>

      {/* Calendar grid */}
      <div className="flex gap-1">
        {/* Day labels */}
        <div className="flex flex-col gap-1 text-xs text-surface-400 pr-2">
          <div className="h-3"></div>
          <div className="h-3">Pon</div>
          <div className="h-3"></div>
          <div className="h-3">Sri</div>
          <div className="h-3"></div>
          <div className="h-3">Pet</div>
          <div className="h-3"></div>
        </div>

        {/* Weeks */}
        <div className="flex gap-1">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              {week.map((date, dayIndex) => {
                const intensity = getIntensity(date, heatmapData);
                const dateKey = date ? format(date, 'yyyy-MM-dd') : null;
                const data = dateKey ? heatmapData[dateKey] : null;

                return (
                  <div
                    key={dayIndex}
                    className={`w-3 h-3 rounded-sm ${INTENSITY_COLORS[intensity]} ${
                      date ? 'cursor-pointer hover:ring-2 hover:ring-brand-purple/50' : ''
                    }`}
                    title={date ? `${format(date, 'd. MMM yyyy', { locale: hr })}: ${data?.sessions || 0} termina, ${data?.children || 0} djece` : ''}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end gap-2 mt-4 text-xs text-surface-500">
        <span>Manje</span>
        {[0, 1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={`w-3 h-3 rounded-sm ${INTENSITY_COLORS[level]}`}
          />
        ))}
        <span>Vise</span>
      </div>
    </div>
  );
}

export default function HeatmapCalendar({ heatmapData }) {
  if (!heatmapData) return null;

  return (
    <Card>
      <CardHeader className="border-b border-surface-100">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-brand-purple" />
          <CardTitle className="text-lg">Kalendar aktivnosti</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="min-w-[700px]">
            <CalendarGrid heatmapData={heatmapData} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
