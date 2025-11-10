import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface SimpleCorrosionCalculatorProps {
  initialThickness: string;
  setInitialThickness: (value: string) => void;
  currentThickness: string;
  setCurrentThickness: (value: string) => void;
  operatingYears: string;
  setOperatingYears: (value: string) => void;
  onCalculate: () => void;
}

export default function SimpleCorrosionCalculator({
  initialThickness,
  setInitialThickness,
  currentThickness,
  setCurrentThickness,
  operatingYears,
  setOperatingYears,
  onCalculate
}: SimpleCorrosionCalculatorProps) {
  return (
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
            <Label htmlFor="operatingYears" className="flex items-center gap-2">
              Срок эксплуатации, лет
              <span className="text-xs font-normal text-slate-500">
                (время между начальным и текущим замером)
              </span>
            </Label>
            <Input
              id="operatingYears"
              type="number"
              placeholder="5"
              value={operatingYears}
              onChange={(e) => setOperatingYears(e.target.value)}
            />
          </div>
        </div>

        <Button onClick={onCalculate} className="w-full">
          <Icon name="Calculator" size={18} className="mr-2" />
          Рассчитать скорость коррозии
        </Button>
      </CardContent>
    </Card>
  );
}