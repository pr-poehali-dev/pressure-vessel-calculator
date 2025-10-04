import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';
import { materials } from '@/lib/constants';

interface InputDataPageProps {
  vesselType: string;
  setVesselType: (value: string) => void;
  diameter: string;
  setDiameter: (value: string) => void;
  length: string;
  setLength: (value: string) => void;
  pressure: string;
  setPressure: (value: string) => void;
  temperature: string;
  setTemperature: (value: string) => void;
  material: string;
  setMaterial: (value: string) => void;
  weldCoeff: string;
  setWeldCoeff: (value: string) => void;
  medium: string;
  setMedium: (value: string) => void;
  corrosionAllowance: string;
  setCorrosionAllowance: (value: string) => void;
}

export default function InputDataPage({
  vesselType,
  setVesselType,
  diameter,
  setDiameter,
  length,
  setLength,
  pressure,
  setPressure,
  temperature,
  setTemperature,
  material,
  setMaterial,
  weldCoeff,
  setWeldCoeff,
  medium,
  setMedium,
  corrosionAllowance,
  setCorrosionAllowance,
}: InputDataPageProps) {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Icon name="ClipboardList" size={32} className="text-blue-600" />
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Исходные данные для расчета</h2>
          <p className="text-slate-600">Введите основные параметры сосуда, работающего под давлением</p>
        </div>
      </div>

      <Card className="p-6 bg-white border-slate-200 shadow-sm">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Icon name="Info" size={20} className="text-blue-600" />
              Общие сведения
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="vesselType" className="text-slate-700 font-medium">
                  Тип сосуда
                </Label>
                <Select value={vesselType} onValueChange={setVesselType}>
                  <SelectTrigger id="vesselType" className="mt-1.5 border-slate-300">
                    <SelectValue placeholder="Выберите тип сосуда" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vertical">Вертикальный</SelectItem>
                    <SelectItem value="horizontal">Горизонтальный</SelectItem>
                    <SelectItem value="spherical">Сферический</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="medium" className="text-slate-700 font-medium">
                  Рабочая среда
                </Label>
                <Input
                  id="medium"
                  value={medium}
                  onChange={(e) => setMedium(e.target.value)}
                  placeholder="Напр.: вода, пар, воздух"
                  className="mt-1.5 border-slate-300"
                />
              </div>
            </div>
          </div>

          <Separator className="bg-slate-200" />

          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Icon name="Ruler" size={20} className="text-blue-600" />
              Геометрические параметры
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="diameter" className="text-slate-700 font-medium">
                  Внутренний диаметр, мм
                </Label>
                <Input
                  id="diameter"
                  type="number"
                  value={diameter}
                  onChange={(e) => setDiameter(e.target.value)}
                  placeholder="1000"
                  className="mt-1.5 border-slate-300"
                />
              </div>

              <div>
                <Label htmlFor="length" className="text-slate-700 font-medium">
                  Длина цилиндрической части, мм
                </Label>
                <Input
                  id="length"
                  type="number"
                  value={length}
                  onChange={(e) => setLength(e.target.value)}
                  placeholder="3000"
                  className="mt-1.5 border-slate-300"
                />
              </div>
            </div>
          </div>

          <Separator className="bg-slate-200" />

          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Icon name="Gauge" size={20} className="text-blue-600" />
              Условия эксплуатации
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="pressure" className="text-slate-700 font-medium">
                  Рабочее давление, МПа
                </Label>
                <Input
                  id="pressure"
                  type="number"
                  step="0.1"
                  value={pressure}
                  onChange={(e) => setPressure(e.target.value)}
                  placeholder="1.6"
                  className="mt-1.5 border-slate-300"
                />
              </div>

              <div>
                <Label htmlFor="temperature" className="text-slate-700 font-medium">
                  Температура стенки, °C
                </Label>
                <Input
                  id="temperature"
                  type="number"
                  value={temperature}
                  onChange={(e) => setTemperature(e.target.value)}
                  placeholder="20"
                  className="mt-1.5 border-slate-300"
                />
              </div>
            </div>
          </div>

          <Separator className="bg-slate-200" />

          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Icon name="Layers" size={20} className="text-blue-600" />
              Материал и конструкция
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="material" className="text-slate-700 font-medium">
                  Материал обечайки
                </Label>
                <Select value={material} onValueChange={setMaterial}>
                  <SelectTrigger id="material" className="mt-1.5 border-slate-300">
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

              <div>
                <Label htmlFor="weldCoeff" className="text-slate-700 font-medium">
                  Коэффициент прочности сварного шва
                </Label>
                <Select value={weldCoeff} onValueChange={setWeldCoeff}>
                  <SelectTrigger id="weldCoeff" className="mt-1.5 border-slate-300">
                    <SelectValue placeholder="Выберите коэффициент" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1.0">1.0 - Сплошной контроль</SelectItem>
                    <SelectItem value="0.9">0.9 - Выборочный контроль</SelectItem>
                    <SelectItem value="0.8">0.8 - Без контроля</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="corrosionAllowance" className="text-slate-700 font-medium">
                  Прибавка на коррозию, мм
                </Label>
                <Input
                  id="corrosionAllowance"
                  type="number"
                  step="0.1"
                  value={corrosionAllowance}
                  onChange={(e) => setCorrosionAllowance(e.target.value)}
                  placeholder="1.0"
                  className="mt-1.5 border-slate-300"
                />
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-blue-50 border-blue-200">
        <div className="flex gap-3">
          <Icon name="Info" size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-slate-700">
            <p className="font-medium text-slate-900 mb-2">Рекомендации по заполнению:</p>
            <ul className="space-y-1">
              <li>• Все геометрические размеры указываются в миллиметрах</li>
              <li>• Давление указывается избыточное (манометрическое)</li>
              <li>• Температура - расчетная температура стенки при рабочем давлении</li>
              <li>• Для сварных швов с полным контролем используйте φ = 1.0</li>
              <li>• Прибавка на коррозию зависит от агрессивности среды (обычно 1-3 мм)</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
