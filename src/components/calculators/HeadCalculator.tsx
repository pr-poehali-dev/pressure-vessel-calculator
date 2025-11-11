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
  calcPressure: string;
  setCalcPressure: (val: string) => void;
  headRadius: string;
  setHeadRadius: (val: string) => void;
  allowablePressure: number | null;
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
  setCalcPressure,
  headRadius,
  setHeadRadius,
  allowablePressure,
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
                <Label htmlFor="headRadius" className="font-mono text-xs text-slate-600">Радиус кривизны днища, мм</Label>
                <Input
                  id="headRadius"
                  type="number"
                  placeholder="Для торосферического"
                  value={headRadius}
                  onChange={(e) => setHeadRadius(e.target.value)}
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
                <Label htmlFor="calcPressure" className="font-mono text-xs text-slate-600">Расчетное давление, МПа</Label>
                <Input
                  id="calcPressure"
                  type="number"
                  step="0.1"
                  placeholder="Введите расчетное давление"
                  value={calcPressure}
                  onChange={(e) => setCalcPressure(e.target.value)}
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

                    {allowablePressure !== null && (
                      <div className="p-6 bg-white rounded-lg border-2 border-blue-500">
                        <div className="text-xs font-mono text-slate-500 mb-1">Допускаемое внутреннее избыточное давление</div>
                        <div className="text-xs font-mono text-slate-400 mb-2">ГОСТ 34233.2-2017</div>
                        <div className="text-4xl font-bold text-blue-600 font-mono">
                          {allowablePressure.toFixed(2)} <span className="text-2xl text-slate-600">МПа</span>
                        </div>
                      </div>
                    )}

                    <Separator />

                    <div className="space-y-2 text-sm">
                      <div className="font-semibold text-slate-700">Формулы расчёта:</div>
                      
                      {headType === 'elliptical' && (
                        <div className="bg-slate-50 p-3 rounded font-mono text-xs">
                          <div>s = (Pр × D) / (4 × [σ] × φ - 0.4 × Pр)</div>
                          <div className="text-slate-500 mt-1">Эллиптическое днище (2:1)</div>
                        </div>
                      )}
                      
                      {headType === 'hemispherical' && (
                        <div className="bg-slate-50 p-3 rounded font-mono text-xs">
                          <div>s = (Pр × D) / (4 × [σ] × φ - Pр)</div>
                          <div className="text-slate-500 mt-1">Полусферическое днище</div>
                        </div>
                      )}
                      
                      {headType === 'torispherical' && (
                        <div className="bg-slate-50 p-3 rounded font-mono text-xs">
                          <div>s = (Pр × R) / (2 × [σ] × φ - 0.5 × Pр)</div>
                          <div className="text-slate-500 mt-1">Торосферическое днище</div>
                        </div>
                      )}
                      
                      {headType === 'flat' && (
                        <div className="bg-slate-50 p-3 rounded font-mono text-xs">
                          <div>s = D × √((K × Pр) / [σ])</div>
                          <div className="text-slate-500 mt-1">Плоское днище, K = 0.42</div>
                        </div>
                      )}
                      
                      <div className="bg-slate-50 p-3 rounded font-mono text-xs">
                        <div className="text-slate-500">где:</div>
                        <div className="text-slate-500">s - расчетная толщина, мм</div>
                        <div className="text-slate-500">Pр - расчетное давление, МПа</div>
                        <div className="text-slate-500">D - внутренний диаметр, мм</div>
                        <div className="text-slate-500">R - радиус кривизны, мм</div>
                        <div className="text-slate-500">[σ] - допускаемое напряжение, МПа</div>
                        <div className="text-slate-500">φ - коэффициент прочности (обычно 1.0)</div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2 text-sm">
                      {vesselName && (
                        <div className="flex justify-between font-mono">
                          <span className="text-slate-600">Аппарат:</span>
                          <span className="font-semibold">{vesselName}</span>
                        </div>
                      )}
                      <div className="flex justify-between font-mono">
                        <span className="text-slate-600">Тип:</span>
                        <span className="font-semibold">
                          {headType === 'elliptical' && 'Эллиптическое'}
                          {headType === 'hemispherical' && 'Полусферическое'}
                          {headType === 'torispherical' && 'Торосферическое'}
                          {headType === 'flat' && 'Плоское'}
                        </span>
                      </div>
                      <div className="flex justify-between font-mono">
                        <span className="text-slate-600">Диаметр:</span>
                        <span className="font-semibold">{headDiameter} мм</span>
                      </div>
                      {headRadius && headType === 'torispherical' && (
                        <div className="flex justify-between font-mono">
                          <span className="text-slate-600">Радиус:</span>
                          <span className="font-semibold">{headRadius} мм</span>
                        </div>
                      )}
                      <div className="flex justify-between font-mono">
                        <span className="text-slate-600">Давление:</span>
                        <span className="font-semibold">{calcPressure || headPressure} МПа</span>
                      </div>
                      <div className="flex justify-between font-mono">
                        <span className="text-slate-600">Температура:</span>
                        <span className="font-semibold">{headTemperature} °C</span>
                      </div>
                      <div className="flex justify-between font-mono">
                        <span className="text-slate-600">Материал:</span>
                        <span className="font-semibold text-xs">{headMaterial}</span>
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
