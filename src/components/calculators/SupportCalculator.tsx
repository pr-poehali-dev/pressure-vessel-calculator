import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { Separator } from '@/components/ui/separator';
import { materials } from '@/lib/constants';

interface SupportCalculatorProps {
  supportType: string;
  setSupportType: (val: string) => void;
  vesselDiameter: string;
  setVesselDiameter: (val: string) => void;
  vesselLength: string;
  setVesselLength: (val: string) => void;
  vesselWeight: string;
  setVesselWeight: (val: string) => void;
  supportMaterial: string;
  setSupportMaterial: (val: string) => void;
  supportResult: {stress: number; deflection: number; recommendation: string} | null;
  calculateSupport: () => void;
}

export default function SupportCalculator({
  supportType,
  setSupportType,
  vesselDiameter,
  setVesselDiameter,
  vesselLength,
  setVesselLength,
  vesselWeight,
  setVesselWeight,
  supportMaterial,
  setSupportMaterial,
  supportResult,
  calculateSupport
}: SupportCalculatorProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="Columns3" size={24} className="text-blue-600" />
            Расчет опорных конструкций
          </CardTitle>
          <CardDescription>Расчет седловых опор, опорных лап и юбочных опор</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="supportType" className="font-mono text-xs text-slate-600">Тип опоры</Label>
                <Select value={supportType} onValueChange={setSupportType}>
                  <SelectTrigger className="mt-1.5 font-mono">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="saddle" className="font-mono">Седловая опора</SelectItem>
                    <SelectItem value="legs" className="font-mono">Опорные лапы</SelectItem>
                    <SelectItem value="skirt" className="font-mono">Юбочная опора</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="vesselDiameter" className="font-mono text-xs text-slate-600">Диаметр сосуда, мм</Label>
                <Input
                  id="vesselDiameter"
                  type="number"
                  placeholder="Введите диаметр"
                  value={vesselDiameter}
                  onChange={(e) => setVesselDiameter(e.target.value)}
                  className="mt-1.5 font-mono"
                />
              </div>

              <div>
                <Label htmlFor="vesselLength" className="font-mono text-xs text-slate-600">Длина сосуда, мм</Label>
                <Input
                  id="vesselLength"
                  type="number"
                  placeholder="Введите длину"
                  value={vesselLength}
                  onChange={(e) => setVesselLength(e.target.value)}
                  className="mt-1.5 font-mono"
                />
              </div>

              <div>
                <Label htmlFor="vesselWeight" className="font-mono text-xs text-slate-600">Вес сосуда (заполненного), Н</Label>
                <Input
                  id="vesselWeight"
                  type="number"
                  placeholder="Введите вес"
                  value={vesselWeight}
                  onChange={(e) => setVesselWeight(e.target.value)}
                  className="mt-1.5 font-mono"
                />
              </div>

              <div>
                <Label htmlFor="supportMaterial" className="font-mono text-xs text-slate-600">Материал опоры</Label>
                <Select value={supportMaterial} onValueChange={setSupportMaterial}>
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

              <Button onClick={calculateSupport} className="w-full bg-blue-600 hover:bg-blue-700" size="lg">
                <Icon name="Play" size={18} className="mr-2" />
                Рассчитать
              </Button>
            </div>

            <div className="space-y-4">
              {supportResult && (
                <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-white animate-scale-in">
                  <CardHeader>
                    <CardTitle className="text-lg">Результаты расчета</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-white rounded-lg border">
                      <div className="text-xs font-mono text-slate-500 mb-2">Напряжение в опоре</div>
                      <div className="text-3xl font-bold text-blue-600 font-mono">
                        {supportResult.stress.toFixed(1)} <span className="text-xl text-slate-600">МПа</span>
                      </div>
                    </div>

                    {supportType === 'saddle' && supportResult.deflection > 0 && (
                      <div className="p-4 bg-white rounded-lg border">
                        <div className="text-xs font-mono text-slate-500 mb-2">Прогиб сосуда</div>
                        <div className="text-3xl font-bold text-blue-600 font-mono">
                          {supportResult.deflection.toFixed(2)} <span className="text-xl text-slate-600">мм</span>
                        </div>
                      </div>
                    )}

                    <Separator />

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between font-mono">
                        <span className="text-slate-600">Тип опоры:</span>
                        <span className="font-semibold">
                          {supportType === 'saddle' && 'Седловая'}
                          {supportType === 'legs' && 'Опорные лапы'}
                          {supportType === 'skirt' && 'Юбочная'}
                        </span>
                      </div>
                      <div className="flex justify-between font-mono">
                        <span className="text-slate-600">Диаметр:</span>
                        <span className="font-semibold">{vesselDiameter} мм</span>
                      </div>
                      <div className="flex justify-between font-mono">
                        <span className="text-slate-600">Вес:</span>
                        <span className="font-semibold">{parseFloat(vesselWeight).toLocaleString()} Н</span>
                      </div>
                      <div className="flex justify-between font-mono">
                        <span className="text-slate-600">Материал:</span>
                        <span className="font-semibold">{supportMaterial}</span>
                      </div>
                    </div>

                    <Separator />

                    <div className={`p-3 rounded border ${
                      supportResult.recommendation.includes('корректно')
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-amber-50 border-amber-200'
                    }`}>
                      <div className="flex items-start gap-2">
                        <Icon 
                          name={supportResult.recommendation.includes('корректно') ? "CheckCircle" : "AlertTriangle"} 
                          size={18} 
                          className={`mt-0.5 ${supportResult.recommendation.includes('корректно') ? 'text-green-600' : 'text-amber-600'}`} 
                        />
                        <div className={`text-xs ${supportResult.recommendation.includes('корректно') ? 'text-green-800' : 'text-amber-800'}`}>
                          <strong>Рекомендация:</strong> {supportResult.recommendation}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Информация о типах опор</CardTitle>
                </CardHeader>
                <CardContent className="text-xs space-y-2 text-slate-600">
                  <div>
                    <strong className="text-slate-900">Седловая опора:</strong> Для горизонтальных сосудов большого диаметра
                  </div>
                  <div>
                    <strong className="text-slate-900">Опорные лапы:</strong> Для вертикальных и горизонтальных сосудов малого/среднего размера
                  </div>
                  <div>
                    <strong className="text-slate-900">Юбочная опора:</strong> Для вертикальных колонных аппаратов
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
