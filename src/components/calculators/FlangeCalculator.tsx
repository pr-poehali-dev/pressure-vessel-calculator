import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { Separator } from '@/components/ui/separator';

interface FlangeCalculatorProps {
  flangeDiameter: string;
  setFlangeDiameter: (val: string) => void;
  flangeThickness: string;
  setFlangeThickness: (val: string) => void;
  boltDiameter: string;
  setBoltDiameter: (val: string) => void;
  numBolts: string;
  setNumBolts: (val: string) => void;
  flangeResult: {gasketLoad: number; boltStress: number} | null;
  calculateFlange: () => void;
}

export default function FlangeCalculator({
  flangeDiameter,
  setFlangeDiameter,
  flangeThickness,
  setFlangeThickness,
  boltDiameter,
  setBoltDiameter,
  numBolts,
  setNumBolts,
  flangeResult,
  calculateFlange
}: FlangeCalculatorProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="Disc" size={24} className="text-blue-600" />
            Расчет фланцевых соединений
          </CardTitle>
          <CardDescription>Расчет нагрузки на прокладку и болты</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="flangeDiameter" className="font-mono text-xs text-slate-600">Диаметр прокладки, мм</Label>
                <Input
                  id="flangeDiameter"
                  type="number"
                  placeholder="Введите диаметр"
                  value={flangeDiameter}
                  onChange={(e) => setFlangeDiameter(e.target.value)}
                  className="mt-1.5 font-mono"
                />
              </div>

              <div>
                <Label htmlFor="flangeThickness" className="font-mono text-xs text-slate-600">Толщина фланца, мм</Label>
                <Input
                  id="flangeThickness"
                  type="number"
                  placeholder="Введите толщину"
                  value={flangeThickness}
                  onChange={(e) => setFlangeThickness(e.target.value)}
                  className="mt-1.5 font-mono"
                />
              </div>

              <div>
                <Label htmlFor="boltDiameter" className="font-mono text-xs text-slate-600">Диаметр болтов, мм</Label>
                <Input
                  id="boltDiameter"
                  type="number"
                  placeholder="Введите диаметр"
                  value={boltDiameter}
                  onChange={(e) => setBoltDiameter(e.target.value)}
                  className="mt-1.5 font-mono"
                />
              </div>

              <div>
                <Label htmlFor="numBolts" className="font-mono text-xs text-slate-600">Количество болтов</Label>
                <Input
                  id="numBolts"
                  type="number"
                  placeholder="Введите количество"
                  value={numBolts}
                  onChange={(e) => setNumBolts(e.target.value)}
                  className="mt-1.5 font-mono"
                />
              </div>

              <Button onClick={calculateFlange} className="w-full bg-blue-600 hover:bg-blue-700" size="lg">
                <Icon name="Play" size={18} className="mr-2" />
                Рассчитать
              </Button>
            </div>

            <div className="space-y-4">
              {flangeResult && (
                <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-white animate-scale-in">
                  <CardHeader>
                    <CardTitle className="text-lg">Результаты расчета</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-white rounded-lg border">
                      <div className="text-xs font-mono text-slate-500 mb-2">Нагрузка на прокладку</div>
                      <div className="text-3xl font-bold text-blue-600 font-mono">
                        {flangeResult.gasketLoad.toLocaleString()} <span className="text-xl text-slate-600">Н</span>
                      </div>
                    </div>

                    <div className="p-4 bg-white rounded-lg border">
                      <div className="text-xs font-mono text-slate-500 mb-2">Напряжение в болтах</div>
                      <div className="text-3xl font-bold text-blue-600 font-mono">
                        {flangeResult.boltStress.toLocaleString()} <span className="text-xl text-slate-600">МПа</span>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between font-mono">
                        <span className="text-slate-600">Диаметр прокладки:</span>
                        <span className="font-semibold">{flangeDiameter} мм</span>
                      </div>
                      <div className="flex justify-between font-mono">
                        <span className="text-slate-600">Количество болтов:</span>
                        <span className="font-semibold">{numBolts} шт</span>
                      </div>
                      <div className="flex justify-between font-mono">
                        <span className="text-slate-600">Диаметр болтов:</span>
                        <span className="font-semibold">{boltDiameter} мм</span>
                      </div>
                    </div>

                    <Separator />

                    <div className={`p-3 rounded border ${
                      flangeResult.boltStress > 200 
                        ? 'bg-red-50 border-red-200' 
                        : 'bg-green-50 border-green-200'
                    }`}>
                      <div className="flex items-start gap-2">
                        <Icon 
                          name={flangeResult.boltStress > 200 ? "AlertTriangle" : "CheckCircle"} 
                          size={18} 
                          className={`mt-0.5 ${flangeResult.boltStress > 200 ? 'text-red-600' : 'text-green-600'}`} 
                        />
                        <div className={`text-xs ${flangeResult.boltStress > 200 ? 'text-red-800' : 'text-green-800'}`}>
                          <strong>
                            {flangeResult.boltStress > 200 
                              ? 'Внимание:' 
                              : 'Успешно:'}
                          </strong> 
                          {flangeResult.boltStress > 200 
                            ? ' Напряжение в болтах превышает допустимое. Увеличьте количество или диаметр болтов.'
                            : ' Напряжение в болтах в пределах нормы.'}
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
