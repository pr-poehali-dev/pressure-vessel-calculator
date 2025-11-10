import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { materials, getAllowableStress } from '@/lib/constants';

interface LifetimeResult {
  currentThickness: number;
  remainingLife: number;
  totalLife: number;
  status: 'good' | 'warning' | 'critical';
  recommendation: string;
}

export default function LifetimeCalculator() {
  const [diameter, setDiameter] = useState('');
  const [initialThickness, setInitialThickness] = useState('');
  const [operatingYears, setOperatingYears] = useState('');
  const [corrosionRate, setCorrosionRate] = useState('');
  const [pressure, setPressure] = useState('');
  const [temperature, setTemperature] = useState('20');
  const [material, setMaterial] = useState('');
  const [weldCoeff, setWeldCoeff] = useState('1.0');
  const [rejectionThickness, setRejectionThickness] = useState('');
  const [result, setResult] = useState<LifetimeResult | null>(null);

  const calculateRemainingLife = () => {
    const D = parseFloat(diameter);
    const s0 = parseFloat(initialThickness);
    const t = parseFloat(operatingYears);
    const v = parseFloat(corrosionRate);
    const P = parseFloat(pressure);
    const T = parseFloat(temperature);
    const phi = parseFloat(weldCoeff);
    const sRej = rejectionThickness ? parseFloat(rejectionThickness) : null;

    if (!D || !s0 || !t || !v || !P || !material || !phi || isNaN(T)) {
      return;
    }

    const sigma = getAllowableStress(material, T);
    const currentThickness = s0 - v * t;
    
    const minRequiredThickness = (P * D) / (2 * sigma * phi - P);
    const corrosionAllowance = 2.0;
    const calculatedMinThickness = minRequiredThickness + corrosionAllowance;
    const minAllowedThickness = sRej && sRej > calculatedMinThickness ? sRej : calculatedMinThickness;
    
    const remainingWear = currentThickness - minAllowedThickness;
    const remainingLife = remainingWear > 0 ? remainingWear / v : 0;
    const totalLife = (s0 - minAllowedThickness) / v;
    const lifePercentage = (remainingLife / totalLife) * 100;

    let status: 'good' | 'warning' | 'critical' = 'good';
    let recommendation = '';

    if (currentThickness <= minAllowedThickness) {
      status = 'critical';
      recommendation = 'КРИТИЧНО! Толщина стенки ниже минимально допустимой. Немедленно остановите эксплуатацию и замените элемент.';
    } else if (lifePercentage < 20) {
      status = 'critical';
      recommendation = 'Остаточный ресурс менее 20%. Планируйте срочную замену элемента в ближайшее время.';
    } else if (lifePercentage < 50) {
      status = 'warning';
      recommendation = 'Остаточный ресурс 20-50%. Рекомендуется запланировать замену элемента в следующий ремонтный период.';
    } else {
      status = 'good';
      recommendation = 'Остаточный ресурс превышает 50%. Продолжайте регулярный контроль толщины стенки.';
    }

    setResult({
      currentThickness: Math.round(currentThickness * 100) / 100,
      remainingLife: Math.round(remainingLife * 10) / 10,
      totalLife: Math.round(totalLife * 10) / 10,
      status,
      recommendation
    });
  };

  const getStatusColor = (status: 'good' | 'warning' | 'critical') => {
    switch (status) {
      case 'good':
        return 'text-green-600';
      case 'warning':
        return 'text-yellow-600';
      case 'critical':
        return 'text-red-600';
    }
  };

  const getStatusIcon = (status: 'good' | 'warning' | 'critical') => {
    switch (status) {
      case 'good':
        return 'CheckCircle';
      case 'warning':
        return 'AlertTriangle';
      case 'critical':
        return 'XCircle';
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="Clock" size={24} className="text-blue-600" />
            Расчет остаточного ресурса
          </CardTitle>
          <CardDescription>
            По РД 03-421-01 (Правила безопасной эксплуатации сосудов под давлением)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="diameter">Внутренний диаметр, мм</Label>
              <Input
                id="diameter"
                type="number"
                placeholder="1000"
                value={diameter}
                onChange={(e) => setDiameter(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="initialThickness">Исходная толщина, мм</Label>
              <Input
                id="initialThickness"
                type="number"
                placeholder="10"
                value={initialThickness}
                onChange={(e) => setInitialThickness(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="operatingYears">Срок эксплуатации, лет</Label>
              <Input
                id="operatingYears"
                type="number"
                placeholder="5"
                value={operatingYears}
                onChange={(e) => setOperatingYears(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="corrosionRate">Скорость коррозии, мм/год</Label>
              <Input
                id="corrosionRate"
                type="number"
                step="0.01"
                placeholder="0.1"
                value={corrosionRate}
                onChange={(e) => setCorrosionRate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pressure">Рабочее давление, МПа</Label>
              <Input
                id="pressure"
                type="number"
                step="0.1"
                placeholder="1.6"
                value={pressure}
                onChange={(e) => setPressure(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="temperature">Температура, °C</Label>
              <Input
                id="temperature"
                type="number"
                placeholder="20"
                value={temperature}
                onChange={(e) => setTemperature(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="material">Материал</Label>
              <Select value={material} onValueChange={setMaterial}>
                <SelectTrigger id="material">
                  <SelectValue placeholder="Выберите материал" />
                </SelectTrigger>
                <SelectContent>
                  {materials.map((mat) => (
                    <SelectItem key={mat.name} value={mat.name}>
                      {mat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="weldCoeff">Коэф. прочности сварки</Label>
              <Select value={weldCoeff} onValueChange={setWeldCoeff}>
                <SelectTrigger id="weldCoeff">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1.0">1.0 (100% контроль)</SelectItem>
                  <SelectItem value="0.9">0.9 (выборочный)</SelectItem>
                  <SelectItem value="0.8">0.8 (без контроля)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="rejectionThickness">
                Отбраковочная толщина, мм
                <span className="text-xs font-normal text-slate-500 ml-1">(необязательно)</span>
              </Label>
              <Input
                id="rejectionThickness"
                type="number"
                step="0.1"
                placeholder="Мин. допустимая толщина"
                value={rejectionThickness}
                onChange={(e) => setRejectionThickness(e.target.value)}
              />
            </div>
          </div>

          <Button onClick={calculateRemainingLife} className="w-full">
            <Icon name="Calculator" size={18} className="mr-2" />
            Рассчитать остаточный ресурс
          </Button>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon 
                name={getStatusIcon(result.status)} 
                size={24} 
                className={getStatusColor(result.status)} 
              />
              Результаты расчета
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="p-4 bg-slate-50 rounded-lg">
                <div className="text-sm text-slate-600 mb-1">Текущая толщина стенки</div>
                <div className="text-2xl font-bold">{result.currentThickness} мм</div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-sm text-blue-600 mb-1">Остаточный ресурс</div>
                <div className="text-2xl font-bold text-blue-700">
                  {result.remainingLife} лет
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-lg">
                <div className="text-sm text-slate-600 mb-1">Общий расчетный срок службы</div>
                <div className="text-2xl font-bold">{result.totalLife} лет</div>
              </div>

              <div className="p-4 bg-slate-50 rounded-lg">
                <div className="text-sm text-slate-600 mb-1">Использовано ресурса</div>
                <div className="text-2xl font-bold">
                  {Math.round(((result.totalLife - result.remainingLife) / result.totalLife) * 100)}%
                </div>
              </div>

              <div className={`p-4 rounded-lg border-2 ${
                result.status === 'good' ? 'bg-green-50 border-green-200' :
                result.status === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-start gap-3">
                  <Icon 
                    name={getStatusIcon(result.status)} 
                    size={20} 
                    className={getStatusColor(result.status)}
                  />
                  <div>
                    <div className={`font-semibold mb-1 ${getStatusColor(result.status)}`}>
                      {result.status === 'good' ? 'Состояние нормальное' :
                       result.status === 'warning' ? 'Требуется внимание' :
                       'Критическое состояние'}
                    </div>
                    <div className="text-sm text-slate-700">
                      {result.recommendation}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200">
              <div className="text-xs text-slate-500 space-y-1">
                <p>ℹ️ Расчет выполнен по методике РД 03-421-01 (п. 5.3)</p>
                <p>ℹ️ Учтена прибавка на коррозию 2.0 мм (РД 03-421-01)</p>
                <p>ℹ️ Срок следующего освидетельствования назначается по РД 03-421-01</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}