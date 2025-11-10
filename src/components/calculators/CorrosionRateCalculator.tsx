import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';

interface Measurement {
  id: string;
  date: string;
  thickness: number;
  years: number;
}

interface CorrosionResult {
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

export default function CorrosionRateCalculator() {
  const [initialThickness, setInitialThickness] = useState('');
  const [currentThickness, setCurrentThickness] = useState('');
  const [operatingYears, setOperatingYears] = useState('');
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [newMeasurementDate, setNewMeasurementDate] = useState('');
  const [newMeasurementThickness, setNewMeasurementThickness] = useState('');
  const [newMeasurementYears, setNewMeasurementYears] = useState('');
  const [result, setResult] = useState<CorrosionResult | null>(null);

  const calculateSimpleRate = () => {
    const s0 = parseFloat(initialThickness);
    const s1 = parseFloat(currentThickness);
    const t = parseFloat(operatingYears);

    if (!s0 || !s1 || !t || s1 >= s0) {
      return;
    }

    const totalLoss = s0 - s1;
    const corrosionRate = totalLoss / t;
    
    const prediction = {
      oneYear: s1 - corrosionRate * 1,
      fiveYears: s1 - corrosionRate * 5,
      tenYears: s1 - corrosionRate * 10,
    };

    let recommendation = '';
    if (corrosionRate < 0.1) {
      recommendation = 'Низкая скорость коррозии. Продолжайте регулярный контроль каждые 4-5 лет.';
    } else if (corrosionRate < 0.2) {
      recommendation = 'Умеренная скорость коррозии. Рекомендуется контроль каждые 2-3 года.';
    } else if (corrosionRate < 0.5) {
      recommendation = 'Повышенная скорость коррозии. Необходим ежегодный контроль толщины стенки.';
    } else {
      recommendation = 'ВНИМАНИЕ! Высокая скорость коррозии. Требуется немедленная оценка состояния и возможная замена элемента.';
    }

    setResult({
      corrosionRate: Math.round(corrosionRate * 1000) / 1000,
      totalLoss: Math.round(totalLoss * 100) / 100,
      averageRate: Math.round(corrosionRate * 1000) / 1000,
      trend: 'stable',
      prediction: {
        oneYear: Math.round(prediction.oneYear * 100) / 100,
        fiveYears: Math.round(prediction.fiveYears * 100) / 100,
        tenYears: Math.round(prediction.tenYears * 100) / 100,
      },
      recommendation
    });
  };

  const addMeasurement = () => {
    const thickness = parseFloat(newMeasurementThickness);
    const years = parseFloat(newMeasurementYears);

    if (!newMeasurementDate || !thickness || !years) {
      return;
    }

    const newMeasurement: Measurement = {
      id: Date.now().toString(),
      date: newMeasurementDate,
      thickness,
      years
    };

    const updatedMeasurements = [...measurements, newMeasurement].sort((a, b) => a.years - b.years);
    setMeasurements(updatedMeasurements);
    
    setNewMeasurementDate('');
    setNewMeasurementThickness('');
    setNewMeasurementYears('');
  };

  const removeMeasurement = (id: string) => {
    setMeasurements(measurements.filter(m => m.id !== id));
  };

  const calculateAdvancedRate = () => {
    if (measurements.length < 2) {
      return;
    }

    const sortedMeasurements = [...measurements].sort((a, b) => a.years - b.years);
    
    const totalLoss = sortedMeasurements[0].thickness - sortedMeasurements[sortedMeasurements.length - 1].thickness;
    const totalTime = sortedMeasurements[sortedMeasurements.length - 1].years - sortedMeasurements[0].years;
    const averageRate = totalLoss / totalTime;

    const rates: number[] = [];
    for (let i = 1; i < sortedMeasurements.length; i++) {
      const deltaThickness = sortedMeasurements[i - 1].thickness - sortedMeasurements[i].thickness;
      const deltaTime = sortedMeasurements[i].years - sortedMeasurements[i - 1].years;
      rates.push(deltaThickness / deltaTime);
    }

    let trend: 'increasing' | 'stable' | 'decreasing' = 'stable';
    if (rates.length >= 2) {
      const firstHalf = rates.slice(0, Math.floor(rates.length / 2));
      const secondHalf = rates.slice(Math.floor(rates.length / 2));
      const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
      const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
      
      if (secondAvg > firstAvg * 1.2) {
        trend = 'increasing';
      } else if (secondAvg < firstAvg * 0.8) {
        trend = 'decreasing';
      }
    }

    const currentRate = rates[rates.length - 1];
    const lastThickness = sortedMeasurements[sortedMeasurements.length - 1].thickness;
    
    const prediction = {
      oneYear: lastThickness - currentRate * 1,
      fiveYears: lastThickness - currentRate * 5,
      tenYears: lastThickness - currentRate * 10,
    };

    let recommendation = '';
    if (trend === 'increasing') {
      recommendation = 'ВНИМАНИЕ! Скорость коррозии увеличивается. Необходимо выявить причину ускорения процесса и принять меры защиты.';
    } else if (trend === 'decreasing') {
      recommendation = 'Скорость коррозии снижается. Возможно, защитные меры эффективны. Продолжайте мониторинг.';
    } else {
      if (currentRate < 0.1) {
        recommendation = 'Низкая стабильная скорость коррозии. Продолжайте регулярный контроль каждые 4-5 лет.';
      } else if (currentRate < 0.2) {
        recommendation = 'Умеренная стабильная скорость коррозии. Рекомендуется контроль каждые 2-3 года.';
      } else {
        recommendation = 'Повышенная стабильная скорость коррозии. Необходим ежегодный контроль и оценка необходимости защитных мер.';
      }
    }

    setResult({
      corrosionRate: Math.round(currentRate * 1000) / 1000,
      totalLoss: Math.round(totalLoss * 100) / 100,
      averageRate: Math.round(averageRate * 1000) / 1000,
      trend,
      prediction: {
        oneYear: Math.round(prediction.oneYear * 100) / 100,
        fiveYears: Math.round(prediction.fiveYears * 100) / 100,
        tenYears: Math.round(prediction.tenYears * 100) / 100,
      },
      recommendation
    });
  };

  const getTrendIcon = (trend: 'increasing' | 'stable' | 'decreasing') => {
    switch (trend) {
      case 'increasing':
        return 'TrendingUp';
      case 'decreasing':
        return 'TrendingDown';
      case 'stable':
        return 'Minus';
    }
  };

  const getTrendColor = (trend: 'increasing' | 'stable' | 'decreasing') => {
    switch (trend) {
      case 'increasing':
        return 'text-red-600';
      case 'decreasing':
        return 'text-green-600';
      case 'stable':
        return 'text-blue-600';
    }
  };

  const getTrendText = (trend: 'increasing' | 'stable' | 'decreasing') => {
    switch (trend) {
      case 'increasing':
        return 'Ускоряется';
      case 'decreasing':
        return 'Замедляется';
      case 'stable':
        return 'Стабильная';
    }
  };

  const generateChartData = () => {
    if (!result) return [];

    const chartData = [];

    if (measurements.length >= 2) {
      const sortedMeasurements = [...measurements].sort((a, b) => a.years - b.years);
      
      for (const m of sortedMeasurements) {
        chartData.push({
          year: m.years,
          actual: m.thickness,
          predicted: null
        });
      }

      const lastMeasurement = sortedMeasurements[sortedMeasurements.length - 1];
      const futureYears = [1, 5, 10];
      
      for (const deltaYear of futureYears) {
        const futureYear = lastMeasurement.years + deltaYear;
        const predictedThickness = lastMeasurement.thickness - result.corrosionRate * deltaYear;
        
        chartData.push({
          year: futureYear,
          actual: null,
          predicted: Math.max(0, predictedThickness)
        });
      }
    } else if (initialThickness && currentThickness && operatingYears) {
      const s0 = parseFloat(initialThickness);
      const years = parseFloat(operatingYears);
      
      chartData.push({
        year: 0,
        actual: s0,
        predicted: null
      });
      
      chartData.push({
        year: years,
        actual: parseFloat(currentThickness),
        predicted: null
      });

      const futureYears = [years + 1, years + 5, years + 10];
      for (const futureYear of futureYears) {
        const deltaYear = futureYear - years;
        const predictedThickness = parseFloat(currentThickness) - result.corrosionRate * deltaYear;
        
        chartData.push({
          year: futureYear,
          actual: null,
          predicted: Math.max(0, predictedThickness)
        });
      }
    }

    return chartData;
  };

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="Activity" size={24} className="text-orange-600" />
              Простой расчет скорости коррозии
            </CardTitle>
            <CardDescription>
              На основе двух замеров (начальная и текущая толщина)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="initialThickness">Начальная толщина, мм</Label>
                <Input
                  id="initialThickness"
                  type="number"
                  placeholder="10"
                  value={initialThickness}
                  onChange={(e) => setInitialThickness(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currentThickness">Текущая толщина, мм</Label>
                <Input
                  id="currentThickness"
                  type="number"
                  placeholder="9.5"
                  value={currentThickness}
                  onChange={(e) => setCurrentThickness(e.target.value)}
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="operatingYears">Срок эксплуатации, лет</Label>
                <Input
                  id="operatingYears"
                  type="number"
                  placeholder="5"
                  value={operatingYears}
                  onChange={(e) => setOperatingYears(e.target.value)}
                />
              </div>
            </div>

            <Button onClick={calculateSimpleRate} className="w-full">
              <Icon name="Calculator" size={18} className="mr-2" />
              Рассчитать скорость коррозии
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="LineChart" size={24} className="text-purple-600" />
              Расширенный расчет с трендом
            </CardTitle>
            <CardDescription>
              На основе нескольких измерений с анализом динамики
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="grid grid-cols-[1fr,1fr,1fr,auto] gap-2 text-sm font-medium text-slate-600">
                <div>Дата</div>
                <div>Толщина, мм</div>
                <div>Срок, лет</div>
                <div></div>
              </div>

              {measurements.map((m) => (
                <div key={m.id} className="grid grid-cols-[1fr,1fr,1fr,auto] gap-2 items-center">
                  <div className="text-sm">{m.date}</div>
                  <div className="text-sm font-medium">{m.thickness}</div>
                  <div className="text-sm">{m.years}</div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeMeasurement(m.id)}
                  >
                    <Icon name="Trash2" size={16} className="text-red-500" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <Input
                  type="date"
                  placeholder="Дата"
                  value={newMeasurementDate}
                  onChange={(e) => setNewMeasurementDate(e.target.value)}
                />
                <Input
                  type="number"
                  placeholder="Толщина"
                  value={newMeasurementThickness}
                  onChange={(e) => setNewMeasurementThickness(e.target.value)}
                />
                <Input
                  type="number"
                  placeholder="Срок"
                  value={newMeasurementYears}
                  onChange={(e) => setNewMeasurementYears(e.target.value)}
                />
              </div>

              <Button onClick={addMeasurement} variant="outline" className="w-full">
                <Icon name="Plus" size={18} className="mr-2" />
                Добавить замер
              </Button>

              <Button 
                onClick={calculateAdvancedRate} 
                className="w-full"
                disabled={measurements.length < 2}
              >
                <Icon name="Calculator" size={18} className="mr-2" />
                Рассчитать с анализом тренда
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="BarChart3" size={24} className="text-blue-600" />
              Результаты анализа коррозии
            </CardTitle>
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
              <div className="p-4 bg-slate-50 rounded-lg">
                <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Icon name="LineChart" size={18} />
                  График изменения толщины
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={generateChartData()} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
      )}
    </div>
  );
}