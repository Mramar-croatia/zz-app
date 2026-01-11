import { useState, useMemo } from 'react';
import {
  subWeeks,
  subMonths,
  subQuarters,
  subYears,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfQuarter,
  endOfQuarter,
  startOfYear,
  endOfYear,
} from 'date-fns';
import { calculateComparison } from '../utils/statistics';

const COMPARISON_PRESETS = [
  {
    id: 'week',
    label: 'Tjedan vs tjedan',
    shortLabel: 'Tjedan',
    getPeriods: () => {
      const now = new Date();
      return {
        period1: {
          start: startOfWeek(now, { weekStartsOn: 1 }),
          end: now,
          label: 'Ovaj tjedan',
          color: 'purple',
        },
        period2: {
          start: startOfWeek(subWeeks(now, 1), { weekStartsOn: 1 }),
          end: endOfWeek(subWeeks(now, 1), { weekStartsOn: 1 }),
          label: 'Prošli tjedan',
          color: 'amber',
        },
      };
    },
  },
  {
    id: 'month',
    label: 'Mjesec vs mjesec',
    shortLabel: 'Mjesec',
    getPeriods: () => {
      const now = new Date();
      return {
        period1: {
          start: startOfMonth(now),
          end: now,
          label: 'Ovaj mjesec',
          color: 'purple',
        },
        period2: {
          start: startOfMonth(subMonths(now, 1)),
          end: endOfMonth(subMonths(now, 1)),
          label: 'Prošli mjesec',
          color: 'amber',
        },
      };
    },
  },
  {
    id: 'quarter',
    label: 'Kvartal vs kvartal',
    shortLabel: 'Kvartal',
    getPeriods: () => {
      const now = new Date();
      return {
        period1: {
          start: startOfQuarter(now),
          end: now,
          label: 'Ovaj kvartal',
          color: 'purple',
        },
        period2: {
          start: startOfQuarter(subQuarters(now, 1)),
          end: endOfQuarter(subQuarters(now, 1)),
          label: 'Prošli kvartal',
          color: 'amber',
        },
      };
    },
  },
  {
    id: 'year',
    label: 'Godina vs godina',
    shortLabel: 'Godina',
    getPeriods: () => {
      const now = new Date();
      return {
        period1: {
          start: startOfYear(now),
          end: now,
          label: String(now.getFullYear()),
          color: 'purple',
        },
        period2: {
          start: startOfYear(subYears(now, 1)),
          end: endOfYear(subYears(now, 1)),
          label: String(now.getFullYear() - 1),
          color: 'amber',
        },
      };
    },
  },
];

export { COMPARISON_PRESETS };

export default function useComparison(volunteers, sessions) {
  const [showComparison, setShowComparison] = useState(false);
  const [comparisonPreset, setComparisonPreset] = useState('month');
  const [comparisonTab, setComparisonTab] = useState('overview');

  const comparisonData = useMemo(() => {
    if (!showComparison || !volunteers || !sessions) return null;
    const preset = COMPARISON_PRESETS.find(p => p.id === comparisonPreset);
    if (!preset) return null;
    const periods = preset.getPeriods();
    if (!periods) return null;
    return calculateComparison(volunteers, sessions, periods.period1, periods.period2);
  }, [showComparison, volunteers, sessions, comparisonPreset]);

  const currentPreset = useMemo(() =>
    COMPARISON_PRESETS.find(p => p.id === comparisonPreset),
    [comparisonPreset]
  );

  return {
    showComparison,
    setShowComparison,
    comparisonPreset,
    setComparisonPreset,
    comparisonTab,
    setComparisonTab,
    comparisonData,
    currentPreset,
    presets: COMPARISON_PRESETS,
  };
}
