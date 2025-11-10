import { RefObject } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';

export interface CorrosionResult {
  corrosionRate: number;
  totalLoss: number;
  averageRate: number;
  trend: 'increasing' | 'stable' | 'decreasing';
  prediction: {
    oneYear: number;
    fiveYears: number;
    tenYears: number;
  };
  recommendation: string;
}

interface CorrosionResultsDisplayProps {
  result: CorrosionResult;
  chartData: Array<{ year: number; actual: number | null; predicted: number | null }>;
  chartRef: RefObject<HTMLDivElement>;
  onExportPDF: () => void;
  getTrendIcon: (trend: 'increasing' | 'stable' | 'decreasing') => string;
  getTrendColor: (trend: 'increasing' | 'stable' | 'decreasing') => string;
  getTrendText: (trend: 'increasing' | 'stable' | 'decreasing') => string;
}

export default function CorrosionResultsDisplay({
  result,
  chartData,
  chartRef,
  onExportPDF,
  getTrendIcon,
  getTrendColor,
  getTrendText
}: CorrosionResultsDisplayProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Icon name="BarChart3" size={24} className="text-blue-600" />
            Результаты анализа коррозии
          </CardTitle>
          <Button onClick={onExportPDF} variant="outline" size="sm">
            <Icon name="FileDown" size={18} className="mr-2" />
            Экспорт в PDF
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-orange-50 rounded-lg">
            <div className="text-sm text-orange-600 mb-1">Текущая скорость</div>
            <div className="text-2xl font-bold text-orange-700">
              {result.corrosionRate} мм/год
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-lg">
            <div className="text-sm text-slate-600 mb-1">Средняя скорость</div>
            <div className="text-2xl font-bold">
              {result.averageRate} мм/год
            </div>
          </div>

          <div className="p-4 bg-red-50 rounded-lg">
            <div className="text-sm text-red-600 mb-1">Общая потеря</div>
            <div className="text-2xl font-bold text-red-700">
              {result.totalLoss} мм
            </div>
          </div>

          <div className={`p-4 rounded-lg ${
            result.trend === 'increasing' ? 'bg-red-50' :
            result.trend === 'decreasing' ? 'bg-green-50' :
            'bg-blue-50'
          }`}>
            <div className="text-sm text-slate-600 mb-1">Тренд</div>
            <div className={`text-xl font-bold flex items-center gap-2 ${getTrendColor(result.trend)}`}>
              <Icon name={getTrendIcon(result.trend)} size={20} />
              {getTrendText(result.trend)}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-slate-50 rounded-lg" ref={chartRef}>
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Icon name="LineChart" size={18} />
              График изменения толщины
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="year" 
                  label={{ value: 'Срок эксплуатации (лет)', position: 'insideBottom', offset: -5 }}
                  stroke="#64748b"
                />
                <YAxis 
                  label={{ value: 'Толщина (мм)', angle: -90, position: 'insideLeft' }}
                  stroke="#64748b"
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                  formatter={(value: number) => `${value.toFixed(2)} мм`}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="actual" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', r: 5 }}
                  name="Фактические измерения"
                  connectNulls={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="predicted" 
                  stroke="#f97316" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ fill: '#f97316', r: 4 }}
                  name="Прогноз"
                  connectNulls={false}
                />
                {result && (
                  <ReferenceLine 
                    y={0} 
                    stroke="#ef4444" 
                    strokeDasharray="3 3"
                    label={{ value: 'Критический уровень', position: 'insideBottomRight', fill: '#ef4444' }}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
              <Icon name="Calendar" size={18} />
              Прогноз толщины стенки
            </h3>
            <div className="grid sm:grid-cols-3 gap-3">
              <div>
                <div className="text-sm text-blue-600">Через 1 год</div>
                <div className="text-lg font-bold text-blue-900">
                  {result.prediction.oneYear} мм
                </div>
              </div>
              <div>
                <div className="text-sm text-blue-600">Через 5 лет</div>
                <div className="text-lg font-bold text-blue-900">
                  {result.prediction.fiveYears} мм
                </div>
              </div>
              <div>
                <div className="text-sm text-blue-600">Через 10 лет</div>
                <div className="text-lg font-bold text-blue-900">
                  {result.prediction.tenYears} мм
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-amber-50 rounded-lg border-2 border-amber-200">
            <div className="flex items-start gap-3">
              <Icon name="AlertCircle" size={20} className="text-amber-600 mt-0.5" />
              <div>
                <div className="font-semibold text-amber-900 mb-1">
                  Рекомендации
                </div>
                <div className="text-sm text-slate-700">
                  {result.recommendation}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200 mt-6">
          <div className="text-xs text-slate-500 space-y-1">
            <p>ℹ️ Скорость коррозии определена по методике ГОСТ 9.908-85</p>
            <p>ℹ️ Прогноз основан на линейной экстраполяции текущей скорости</p>
            <p>ℹ️ Для точной оценки проводите УЗК-контроль в соответствии с графиком</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
