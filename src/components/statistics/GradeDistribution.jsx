import { GraduationCap } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../Card';

export default function GradeDistribution({ byGrade = [] }) {
  if (!byGrade?.length) return null;

  return (
    <Card>
      <CardHeader className="border-b border-surface-100">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-brand-purple" />
          <CardTitle className="text-lg">Volonteri po razredu</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {byGrade.map((grade, index) => (
            <div
              key={index}
              className="bg-surface-50 rounded-xl p-4 text-center hover:bg-surface-100 transition-colors"
            >
              <p className="text-2xl lg:text-3xl font-bold text-brand-purple">{grade.count}</p>
              <p className="text-sm text-surface-600 mt-1">{grade.label}</p>
              <p className="text-xs text-surface-400 mt-0.5">{grade.hours}h ukupno</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
