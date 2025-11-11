import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';

export interface Measurement {
  id: string;
  date: string;
  thickness: number;
  years: number;
}

interface AdvancedCorrosionCalculatorProps {
  measurements: Measurement[];
  newMeasurementDate: string;
  setNewMeasurementDate: (value: string) => void;
  newMeasurementThickness: string;
  setNewMeasurementThickness: (value: string) => void;
  newMeasurementYears: string;
  setNewMeasurementYears: (value: string) => void;
  initialThickness: string;
  setInitialThickness: (value: string) => void;
  rejectionThickness: string;
  setRejectionThickness: (value: string) => void;
  commissioningDate: string;
  setCommissioningDate: (value: string) => void;
  onAddMeasurement: () => void;
  onRemoveMeasurement: (id: string) => void;
  onCalculate: () => void;
}

export default function AdvancedCorrosionCalculator({
  measurements,
  newMeasurementDate,
  setNewMeasurementDate,
  newMeasurementThickness,
  setNewMeasurementThickness,
  newMeasurementYears,
  setNewMeasurementYears,
  initialThickness,
  setInitialThickness,
  rejectionThickness,
  setRejectionThickness,
  commissioningDate,
  setCommissioningDate,
  onAddMeasurement,
  onRemoveMeasurement,
  onCalculate
}: AdvancedCorrosionCalculatorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon name="LineChart" size={24} className="text-purple-600" />
          Расширенный расчет с трендом
        </CardTitle>
        <CardDescription>
          Приказ Ростехнадзора №536 от 15.12.2020 - метод множественных замеров с прогнозированием
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="advancedCommissioningDate">Дата ввода в эксплуатацию</Label>
            <Input
              id="advancedCommissioningDate"
              type="date"
              value={commissioningDate}
              onChange={(e) => setCommissioningDate(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="advancedInitialThickness">Начальная толщина, мм</Label>
            <Input
              id="advancedInitialThickness"
              type="number"
              step="0.1"
              placeholder="10.0"
              value={initialThickness}
              onChange={(e) => setInitialThickness(e.target.value)}
            />
          </div>
        </div>
        
        <div className="p-3 bg-blue-50 rounded-lg mb-3 text-sm text-slate-700">
          <Icon name="Info" size={16} className="inline mr-1 text-blue-600" />
          <strong>Срок</strong> — это количество лет с момента ввода в эксплуатацию. Например: 0, 2, 5, 7 лет.
        </div>
        
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
                onClick={() => onRemoveMeasurement(m.id)}
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
              placeholder="Толщина, мм"
              value={newMeasurementThickness}
              onChange={(e) => setNewMeasurementThickness(e.target.value)}
            />
            <Input
              type="number"
              placeholder="Лет с начала"
              value={newMeasurementYears}
              onChange={(e) => setNewMeasurementYears(e.target.value)}
            />
          </div>

          <Button onClick={onAddMeasurement} variant="outline" className="w-full">
            <Icon name="Plus" size={18} className="mr-2" />
            Добавить замер
          </Button>

          <div className="space-y-2 pt-2">
            <Label htmlFor="advancedRejectionThickness" className="flex items-center gap-2">
              Отбраковочная толщина, мм
              <span className="text-xs font-normal text-slate-500">
                (минимально допустимая)
              </span>
            </Label>
            <Input
              id="advancedRejectionThickness"
              type="number"
              step="0.1"
              placeholder="6.0"
              value={rejectionThickness}
              onChange={(e) => setRejectionThickness(e.target.value)}
            />
          </div>

          <Button 
            onClick={onCalculate} 
            className="w-full"
            disabled={measurements.length < 2}
          >
            <Icon name="Calculator" size={18} className="mr-2" />
            Рассчитать с анализом тренда
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}