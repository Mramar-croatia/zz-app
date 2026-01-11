import { Trophy, Medal, Star } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../Card';

const RANK_STYLES = {
  1: 'bg-gradient-to-r from-amber-400 to-yellow-500 text-white',
  2: 'bg-gradient-to-r from-slate-300 to-slate-400 text-white',
  3: 'bg-gradient-to-r from-amber-600 to-amber-700 text-white',
};

export default function Leaderboard({
  weeklyLeaderboard = [],
  monthlyLeaderboard = [],
  type = 'weekly',
  setType
}) {
  const leaderboard = type === 'weekly' ? weeklyLeaderboard : monthlyLeaderboard;

  if (!leaderboard?.length) return null;

  return (
    <Card>
      <CardHeader className="border-b border-surface-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-brand-gold" />
            <CardTitle className="text-lg">Ljestvica</CardTitle>
          </div>
          <div className="flex items-center gap-1 bg-surface-100 rounded-lg p-1">
            <button
              onClick={() => setType('weekly')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                type === 'weekly'
                  ? 'bg-white shadow-sm text-brand-purple'
                  : 'text-surface-600 hover:text-surface-900'
              }`}
            >
              Tjedan
            </button>
            <button
              onClick={() => setType('monthly')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                type === 'monthly'
                  ? 'bg-white shadow-sm text-brand-purple'
                  : 'text-surface-600 hover:text-surface-900'
              }`}
            >
              Mjesec
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {leaderboard.slice(0, 5).map((entry, i) => {
            const rank = i + 1;
            const rankStyle = RANK_STYLES[rank] || 'bg-surface-100 text-surface-600';

            return (
              <div
                key={i}
                className={`flex items-center gap-3 p-3 rounded-lg ${rank <= 3 ? 'bg-surface-50' : ''}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${rankStyle}`}>
                  {rank}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-surface-900 truncate">{entry.name}</p>
                  <p className="text-xs text-surface-500">{entry.school}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-brand-purple">{entry.hours}h</p>
                  <p className="text-xs text-surface-500">{entry.sessions} termina</p>
                </div>
                {rank === 1 && <Star className="w-5 h-5 text-amber-500" />}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
