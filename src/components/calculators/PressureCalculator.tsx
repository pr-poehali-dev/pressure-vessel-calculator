import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Icon from '@/components/ui/icon';
import { materials } from '@/lib/constants';

interface PressureCalculatorProps {
  diameter: string;
  setDiameter: (value: string) => void;
  wallThickness: string;
  setWallThickness: (value: string) => void;
  temperature: string;
  setTemperature: (value: string) => void;
  material: string;
  setMaterial: (value: string) => void;
  weldCoeff: string;
  setWeldCoeff: (value: string) => void;
  result: number | null;
  calculatePressure: () => void;
}

export default function PressureCalculator({
  diameter,
  setDiameter,
  wallThickness,
  setWallThickness,
  temperature,
  setTemperature,
  material,
  setMaterial,
  weldCoeff,
  setWeldCoeff,
  result,
  calculatePressure,
}: PressureCalculatorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon name="Gauge" size={24} className="text-blue-600" />
          Расчет допускаемого внутреннего избыточного давления
        </CardTitle>
        <CardDescription>
          Расчет по ГОСТ 34233.2-2017 для цилиндрической обечайки
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="diameter-pressure">Внутренний диаметр D, мм</Label>
            <Input
              id="diameter-pressure"
              type="number"
              placeholder="Например: 1000"
              value={diameter}
              onChange={(e) => setDiameter(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="wall-thickness">Толщина стенки s, мм</Label>
            <Input
              id="wall-thickness"
              type="number"
              placeholder="Например: 10"
              value={wallThickness}
              onChange={(e) => setWallThickness(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="temperature-pressure">Расчетная температура T, °C</Label>
            <Input
              id="temperature-pressure"
              type="number"
              placeholder="Например: 200"
              value={temperature}
              onChange={(e) => setTemperature(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="material-pressure">Материал</Label>
            <Select value={material} onValueChange={setMaterial}>
              <SelectTrigger id="material-pressure">
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
            <Label htmlFor="weld-coeff-pressure">Коэффициент прочности сварного шва φ</Label>
            <Select value={weldCoeff} onValueChange={setWeldCoeff}>
              <SelectTrigger id="weld-coeff-pressure">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1.0">1.0 - Двусторонний шов с контролем</SelectItem>
                <SelectItem value="0.9">0.9 - Односторонний шов с контролем</SelectItem>
                <SelectItem value="0.8">0.8 - Шов без контроля</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button onClick={calculatePressure} className="w-full">
          <Icon name="Calculator" size={18} className="mr-2" />
          Рассчитать допускаемое давление
        </Button>

        {result !== null && (
          <Alert className="border-green-200 bg-green-50">
            <Icon name="CheckCircle" className="h-4 w-4 text-green-600" />
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-semibold text-green-900">
                  Допускаемое внутреннее избыточное давление: <span className="text-2xl">{result.toFixed(3)} МПа</span>
                </p>
                <p className="text-sm text-green-800">
                  Формула: [P] = (2 × [σ] × φ × s) / (D + s)
                </p>
                <p className="text-xs text-green-700 mt-2">
                  Согласно ГОСТ 34233.2-2017, п. 6.2.2
                </p>
              </div>
            </AlertDescription>
          </Alert>
        )}

        <Alert>
          <Icon name="Info" className="h-4 w-4" />
          <AlertDescription className="text-sm">
            <strong>Справка:</strong> Допускаемое давление показывает максимальное безопасное давление
            для сосуда с заданными параметрами. Используется для проверки прочности существующих сосудов.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
