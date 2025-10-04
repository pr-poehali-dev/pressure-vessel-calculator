import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { Separator } from '@/components/ui/separator';
import { materials } from '@/lib/constants';

interface HeadCalculatorProps {
  headDiameter: string;
  setHeadDiameter: (val: string) => void;
  headPressure: string;
  setHeadPressure: (val: string) => void;
  headTemperature: string;
  setHeadTemperature: (val: string) => void;
  headMaterial: string;
  setHeadMaterial: (val: string) => void;
  headType: string;
  setHeadType: (val: string) => void;
  headResult: number | null;
  calculateHead: () => void;
}

export default function HeadCalculator({
  headDiameter,
  setHeadDiameter,
  headPressure,
  setHeadPressure,
  headTemperature,
  setHeadTemperature,
  headMaterial,
  setHeadMaterial,
  headType,
  setHeadType,
  headResult,
  calculateHead
}: HeadCalculatorProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="Circle" size={24} className="text-blue-600" />
            Расчет толщины днища
          </CardTitle>
          <CardDescription>Расчет эллиптических, сферических и плоских днищ</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="headType" className="font-mono text-xs text-slate-600">Тип днища</Label>
                <Select value={headType} onValueChange={setHeadType}>
                  <SelectTrigger className="mt-1.5 font-mono">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="elliptical" className="font-mono">Эллиптическое (2:1)</SelectItem>
                    <SelectItem value="hemispherical" className="font-mono">Полусферическое</SelectItem>
                    <SelectItem value="flat" className="font-mono">Плоское</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="headDiameter" className="font-mono text-xs text-slate-600">Внутренний диаметр, мм</Label>
                <Input
                  id="headDiameter"
                  type="number"
                  placeholder="Введите диаметр"
                  value={headDiameter}
                  onChange={(e) => setHeadDiameter(e.target.value)}
                  className="mt-1.5 font-mono"
                />
              </div>

              <div>
                <Label htmlFor="headPressure" className="font-mono text-xs text-slate-600">Рабочее давление, МПа</Label>
                <Input
                  id="headPressure"
                  type="number"
                  step="0.1"
                  placeholder="Введите давление"
                  value={headPressure}
                  onChange={(e) => setHeadPressure(e.target.value)}
                  className="mt-1.5 font-mono"
                />
              </div>

              <div>
                <Label htmlFor="headTemperature" className="font-mono text-xs text-slate-600">Расчетная температура, °C</Label>
                <Input
                  id="headTemperature"
                  type="number"
                  placeholder="Введите температуру"
                  value={headTemperature}
                  onChange={(e) => setHeadTemperature(e.target.value)}
                  className="mt-1.5 font-mono"
                />
              </div>

              <div>
                <Label htmlFor="headMaterial" className="font-mono text-xs text-slate-600">Материал днища</Label>
                <Select value={headMaterial} onValueChange={setHeadMaterial}>
                  <SelectTrigger className="mt-1.5 font-mono">
                    <SelectValue placeholder="Выберите материал" />
                  </SelectTrigger>
                  <SelectContent>
                    {materials.map((m) => (
                      <SelectItem key={m.name} value={m.name} className="font-mono">
                        {m.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={calculateHead} className="w-full bg-blue-600 hover:bg-blue-700" size="lg">
                <Icon name="Play" size={18} className="mr-2" />
                Рассчитать
              </Button>
            </div>

            <div className="space-y-4">
              {headResult !== null && (
                <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-white animate-scale-in">
                  <CardHeader>
                    <CardTitle className="text-lg">Результаты расчета</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-6 bg-white rounded-lg border-2 border-blue-500">
                      <div className="text-xs font-mono text-slate-500 mb-2">Расчетная толщина днища</div>
                      <div className="text-4xl font-bold text-blue-600 font-mono">
                        {headResult.toFixed(1)} <span className="text-2xl text-slate-600">мм</span>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between font-mono">
                        <span className="text-slate-600">Тип днища:</span>
                        <span className="font-semibold">
                          {headType === 'elliptical' && 'Эллиптическое'}
                          {headType === 'hemispherical' && 'Полусферическое'}
                          {headType === 'flat' && 'Плоское'}
                        </span>
                      </div>
                      <div className="flex justify-between font-mono">
                        <span className="text-slate-600">Диаметр:</span>
                        <span className="font-semibold">{headDiameter} мм</span>
                      </div>
                      <div className="flex justify-between font-mono">
                        <span className="text-slate-600">Давление:</span>
                        <span className="font-semibold">{headPressure} МПа</span>
                      </div>
                      <div className="flex justify-between font-mono">
                        <span className="text-slate-600">Материал:</span>
                        <span className="font-semibold">{headMaterial}</span>
                      </div>
                    </div>

                    <Separator />

                    <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                      <div className="text-xs text-blue-800 space-y-1">
                        <div><strong>Формула:</strong></div>
                        {headType === 'elliptical' && <div className="font-mono">s = (P × D) / (4 × σ - 0.4 × P)</div>}
                        {headType === 'hemispherical' && <div className="font-mono">s = (P × D) / (4 × σ - P)</div>}
                        {headType === 'flat' && <div className="font-mono">s = (0.44 × P × D) / σ</div>}
                      </div>
                    </div>

                    <div className="p-3 bg-amber-50 border border-amber-200 rounded">
                      <div className="flex items-start gap-2">
                        <Icon name="Info" size={18} className="text-amber-600 mt-0.5" />
                        <div className="text-xs text-amber-800">
                          <strong>Примечание:</strong> Для плоских днищ рекомендуется использовать ребра жесткости при больших диаметрах
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}