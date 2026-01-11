import { format } from 'date-fns';
import { hr } from 'date-fns/locale';
import { GraduationCap, Sparkles } from 'lucide-react';
import {
  getCurrentSchoolYear,
  getCurrentHoliday,
  getSchoolYearLabel,
  formatSchoolYearPeriod,
} from '../../utils/schoolYear';

export default function SchoolYearBanner() {
  const currentHoliday = getCurrentHoliday();
  const schoolYearInfo = formatSchoolYearPeriod();
  const schoolYear = getCurrentSchoolYear();

  if (currentHoliday) {
    return (
      <div className="bg-gradient-to-r from-sky-500 to-indigo-500 text-white rounded-xl p-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-lg">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-lg">{currentHoliday.name}</h3>
            <p className="text-white/80 text-sm">
              Volontiranje nastavlja nakon {format(currentHoliday.end, 'd. MMMM', { locale: hr })}
            </p>
          </div>
        </div>
        <div className="hidden sm:block text-right">
          <p className="text-sm text-white/80">Školska godina</p>
          <p className="font-bold">{getSchoolYearLabel(schoolYear)}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between bg-surface-50 rounded-xl px-4 py-3">
      <div className="flex items-center gap-2 text-surface-600">
        <GraduationCap className="w-5 h-5 text-brand-purple" />
        <span className="font-medium">{schoolYearInfo.label}</span>
      </div>
      <span className="text-sm text-surface-500">{schoolYearInfo.message}</span>
    </div>
  );
}
