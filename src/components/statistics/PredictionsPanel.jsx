import { Zap, AlertTriangle, Check, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../Card';

export default function PredictionsPanel({ predictions, anomalies = [] }) {
  if (!predictions) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Predictions */}
      <Card>
        <CardHeader className="border-b border-surface-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-indigo-500" />
              <CardTitle className="text-lg">Predvidjanja</CardTitle>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full ${
              predictions.trend === 'growing' ? 'bg-emerald-100 text-emerald-700' :
              predictions.trend === 'declining' ? 'bg-red-100 text-red-700' :
              'bg-surface-100 text-surface-600'
            }`}>
              {predictions.trend === 'growing' ? 'Rast' :
               predictions.trend === 'declining' ? 'Pad' : 'Stabilan'}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <p className="text-sm text-surface-600">
              Predvidjeni broj termina za sljedeca 3 mjeseca:
            </p>
            <div className="grid grid-cols-3 gap-3">
              {predictions.predicted?.map((pred, i) => (
                <div key={i} className="bg-surface-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-surface-500">{pred.month}</p>
                  <p className="text-2xl font-bold text-indigo-600">{pred.sessions}</p>
                  <p className="text-xs text-surface-400">termina</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-surface-400 text-center">
              Pouzdanost: {predictions.confidence}%
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Anomalies */}
      <Card>
        <CardHeader className="border-b border-surface-100">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <CardTitle className="text-lg">Anomalije</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {anomalies.length === 0 ? (
            <div className="text-center py-6 text-surface-500">
              <Check className="w-8 h-8 mx-auto mb-2 text-emerald-500" />
              <p>Nema uocenih anomalija</p>
            </div>
          ) : (
            <div className="space-y-3">
              {anomalies.slice(0, 3).map((anomaly, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-3 p-3 rounded-lg ${
                    anomaly.type === 'spike' ? 'bg-emerald-50 border border-emerald-200' :
                    'bg-red-50 border border-red-200'
                  }`}
                >
                  {anomaly.type === 'spike' ? (
                    <ArrowUpRight className="w-5 h-5 text-emerald-600 mt-0.5" />
                  ) : (
                    <ArrowDownRight className="w-5 h-5 text-red-600 mt-0.5" />
                  )}
                  <div>
                    <p className="font-medium text-surface-900">{anomaly.month}</p>
                    <p className="text-sm text-surface-600">{anomaly.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
