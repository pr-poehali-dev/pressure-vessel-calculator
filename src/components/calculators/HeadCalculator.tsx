import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { Separator } from '@/components/ui/separator';
import { materials } from '@/lib/constants';

interface HeadCalculatorProps {
  vesselName: string;
  setVesselName: (val: string) => void;
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
  corrosionAllowance: string;
  setCorrosionAllowance: (val: string) => void;
  executiveThickness: string;
  setExecutiveThickness: (val: string) => void;
  actualThickness: string;
  setActualThickness: (val: string) => void;
  headResult: number | null;
  calcPressure: number | null;
  calculateHead: () => void;
}

export default function HeadCalculator({
  vesselName,
  setVesselName,
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
  corrosionAllowance,
  setCorrosionAllowance,
  executiveThickness,
  setExecutiveThickness,
  actualThickness,
  setActualThickness,
  headResult,
  calcPressure,
  calculateHead
}: HeadCalculatorProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="Circle" size={24} className="text-blue-600" />
            Расчет днищ
          </CardTitle>
          <CardDescription>По ГОСТ 34233.2-2017, раздел 6</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="vesselName" className="font-mono text-xs text-slate-600">Наименование сосуда</Label>
                <Input
                  id="vesselName"
                  type="text"
                  placeholder="Например: Емкость Е-201"
                  value={vesselName}
                  onChange={(e) => setVesselName(e.target.value)}
                  className="mt-1.5 font-mono"
                />
              </div>

              <div>
                <Label htmlFor="headType" className="font-mono text-xs text-slate-600">Тип днища</Label>
                <Select value={headType} onValueChange={setHeadType}>
                  <SelectTrigger className="mt-1.5 font-mono">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="elliptical" className="font-mono">Эллиптическое (2:1)</SelectItem>
                    <SelectItem value="hemispherical" className="font-mono">Полусферическое</SelectItem>
                    <SelectItem value="torispherical" className="font-mono">Торосферическое</SelectItem>
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

              <Separator />

              <div>
                <Label htmlFor="headCorrosion" className="font-mono text-xs text-slate-600">Прибавка на коррозию, мм</Label>
                <Input
                  id="headCorrosion"
                  type="number"
                  step="0.1"
                  placeholder="Введите прибавку"
                  value={corrosionAllowance}
                  onChange={(e) => setCorrosionAllowance(e.target.value)}
                  className="mt-1.5 font-mono"
                />
              </div>

              <div>
                <Label htmlFor="headExecutive" className="font-mono text-xs text-slate-600">Исполнительная толщина, мм</Label>
                <Input
                  id="headExecutive"
                  type="number"
                  step="0.1"
                  placeholder="По чертежу"
                  value={executiveThickness}
                  onChange={(e) => setExecutiveThickness(e.target.value)}
                  className="mt-1.5 font-mono"
                />
              </div>

              <div>
                <Label htmlFor="headActual" className="font-mono text-xs text-slate-600">Фактическая толщина, мм</Label>
                <Input
                  id="headActual"
                  type="number"
                  step="0.1"
                  placeholder="Замеренная"
                  value={actualThickness}
                  onChange={(e) => setActualThickness(e.target.value)}
                  className="mt-1.5 font-mono"
                />
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
                      {vesselName && (
                        <div className="flex justify-between font-mono">
                          <span className="text-slate-600">Наименование:</span>
                          <span className="font-semibold">{vesselName}</span>
                        </div>
                      )}
                      <div className="flex justify-between font-mono">
                        <span className="text-slate-600">Тип днища:</span>
                        <span className="font-semibold">
                          {headType === 'elliptical' && 'Эллиптическое'}
                          {headType === 'hemispherical' && 'Полусферическое'}
                          {headType === 'torispherical' && 'Торосферическое'}
                          {headType === 'flat' && 'Плоское'}
                        </span>
                      </div>
                      <div className="flex justify-between font-mono">
                        <span className="text-slate-600">Внутренний диаметр:</span>
                        <span className="font-semibold">{headDiameter} мм</span>
                      </div>
                      <div className="flex justify-between font-mono">
                        <span className="text-slate-600">Рабочее давление:</span>
                        <span className="font-semibold">{headPressure} МПа</span>
                      </div>
                      <div className="flex justify-between font-mono">
                        <span className="text-slate-600">Расчётное давление:</span>
                        <span className="font-semibold text-blue-600">{calcPressure?.toFixed(2)} МПа</span>
                      </div>
                      <div className="flex justify-between font-mono">
                        <span className="text-slate-600">Марка стали:</span>
                        <span className="font-semibold">{headMaterial}</span>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between font-mono">
                        <span className="text-slate-600">Расчётная толщина:</span>
                        <span className="font-semibold text-blue-600">{headResult.toFixed(1)} мм</span>
                      </div>
                      <div className="flex justify-between font-mono">
                        <span className="text-slate-600">Прибавка на коррозию:</span>
                        <span className="font-semibold">{corrosionAllowance || '-'} мм</span>
                      </div>
                      {executiveThickness && (
                        <div className="flex justify-between font-mono">
                          <span className="text-slate-600">Исполнительная толщина:</span>
                          <span className="font-semibold">{executiveThickness} мм</span>
                        </div>
                      )}
                      {actualThickness && (
                        <div className="flex justify-between font-mono">
                          <span className="text-slate-600">Фактическая толщина:</span>
                          <span className="font-semibold">{actualThickness} мм</span>
                        </div>
                      )}
                    </div>

                    <Separator />

                    <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                      <div className="text-xs text-blue-800 space-y-1">
                        <div><strong>Формула (ГОСТ 34233.2-2017):</strong></div>
                        {headType === 'elliptical' && <div className="font-mono">s = (P × D) / (4 × [σ] × φ - 0.4 × P)</div>}
                        {headType === 'hemispherical' && <div className="font-mono">s = (P × D) / (4 × [σ] × φ - P)</div>}
                        {headType === 'torispherical' && <div className="font-mono">s = (P × R) / (2 × [σ] × φ - 0.5 × P)</div>}
                        {headType === 'flat' && <div className="font-mono">s = D × √(K × P / [σ])</div>}
                      </div>
                    </div>

                    <div className="p-3 bg-amber-50 border border-amber-200 rounded">
                      <div className="flex items-start gap-2">
                        <Icon name="Info" size={18} className="text-amber-600 mt-0.5" />
                        <div className="text-xs text-amber-800">
                          <strong>По РД 03-421-01:</strong>
                          <ul className="mt-1 space-y-1 ml-2">
                            <li>• Округлите расчётную толщину до стандартной</li>
                            <li>• Для эллиптических: H = 0.25 × D</li>
                            <li>• Для торосферических: R = D, r = 0.1 × D</li>
                          </ul>
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