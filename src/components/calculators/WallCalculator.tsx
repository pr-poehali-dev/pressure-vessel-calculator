import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { Separator } from '@/components/ui/separator';
import { materials } from '@/lib/constants';

interface WallCalculatorProps {
  diameter: string;
  setDiameter: (val: string) => void;
  pressure: string;
  setPressure: (val: string) => void;
  temperature: string;
  setTemperature: (val: string) => void;
  material: string;
  setMaterial: (val: string) => void;
  weldCoeff: string;
  setWeldCoeff: (val: string) => void;
  result: number | null;
  calculateThickness: () => void;
}

export default function WallCalculator({
  diameter,
  setDiameter,
  pressure,
  setPressure,
  temperature,
  setTemperature,
  material,
  setMaterial,
  weldCoeff,
  setWeldCoeff,
  result,
  calculateThickness
}: WallCalculatorProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="Calculator" size={24} className="text-blue-600" />
            Расчет толщины стенки цилиндрического сосуда
          </CardTitle>
          <CardDescription>По ГОСТ 14249-89</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="diameter" className="font-mono text-xs text-slate-600">Внутренний диаметр, мм</Label>
                <Input
                  id="diameter"
                  type="number"
                  placeholder="Введите диаметр"
                  value={diameter}
                  onChange={(e) => setDiameter(e.target.value)}
                  className="mt-1.5 font-mono"
                />
              </div>

              <div>
                <Label htmlFor="pressure" className="font-mono text-xs text-slate-600">Рабочее давление, МПа</Label>
                <Input
                  id="pressure"
                  type="number"
                  step="0.1"
                  placeholder="Введите давление"
                  value={pressure}
                  onChange={(e) => setPressure(e.target.value)}
                  className="mt-1.5 font-mono"
                />
              </div>

              <div>
                <Label htmlFor="temperature" className="font-mono text-xs text-slate-600">Расчетная температура, °C</Label>
                <Input
                  id="temperature"
                  type="number"
                  placeholder="Введите температуру"
                  value={temperature}
                  onChange={(e) => setTemperature(e.target.value)}
                  className="mt-1.5 font-mono"
                />
              </div>

              <div>
                <Label htmlFor="material" className="font-mono text-xs text-slate-600">Материал сосуда</Label>
                <Select value={material} onValueChange={setMaterial}>
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

              <div>
                <Label htmlFor="weld" className="font-mono text-xs text-slate-600">Коэффициент прочности сварного шва</Label>
                <Select value={weldCoeff} onValueChange={setWeldCoeff}>
                  <SelectTrigger className="mt-1.5 font-mono">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1.0" className="font-mono">1.0 (100% контроль)</SelectItem>
                    <SelectItem value="0.95" className="font-mono">0.95 (выборочный)</SelectItem>
                    <SelectItem value="0.9" className="font-mono">0.9 (без контроля)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={calculateThickness} className="w-full bg-blue-600 hover:bg-blue-700" size="lg">
                <Icon name="Play" size={18} className="mr-2" />
                Рассчитать
              </Button>
            </div>

            <div className="space-y-4">
              {result !== null && (
                <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-white animate-scale-in">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center justify-between">
                      Результаты расчета
                      <Button
                        onClick={() => {
                          const printContent = document.getElementById('report-content');
                          if (printContent) {
                            const printWindow = window.open('', '', 'height=800,width=800');
                            if (printWindow) {
                              printWindow.document.write('<html><head><title>Отчет расчета</title>');
                              printWindow.document.write('<style>body{font-family:Arial,sans-serif;padding:20px;}h1{color:#2563EB;}table{width:100%;border-collapse:collapse;}td{padding:8px;border-bottom:1px solid #ddd;}.label{color:#64748B;}.value{font-weight:bold;}</style>');
                              printWindow.document.write('</head><body>');
                              printWindow.document.write(printContent.innerHTML);
                              printWindow.document.write('</body></html>');
                              printWindow.document.close();
                              printWindow.print();
                            }
                          }
                        }}
                        variant="outline"
                        size="sm"
                        className="gap-2"
                      >
                        <Icon name="FileDown" size={16} />
                        PDF
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-6 bg-white rounded-lg border-2 border-blue-500">
                      <div className="text-xs font-mono text-slate-500 mb-2">Расчетная толщина стенки</div>
                      <div className="text-4xl font-bold text-blue-600 font-mono">
                        {result.toFixed(1)} <span className="text-2xl text-slate-600">мм</span>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between font-mono">
                        <span className="text-slate-600">Диаметр:</span>
                        <span className="font-semibold">{diameter} мм</span>
                      </div>
                      <div className="flex justify-between font-mono">
                        <span className="text-slate-600">Давление:</span>
                        <span className="font-semibold">{pressure} МПа</span>
                      </div>
                      <div className="flex justify-between font-mono">
                        <span className="text-slate-600">Материал:</span>
                        <span className="font-semibold">{material}</span>
                      </div>
                      <div className="flex justify-between font-mono">
                        <span className="text-slate-600">Коэфф. сварки:</span>
                        <span className="font-semibold">{weldCoeff}</span>
                      </div>
                    </div>

                    <Separator />

                    <div className="p-3 bg-amber-50 border border-amber-200 rounded">
                      <div className="flex items-start gap-2">
                        <Icon name="AlertTriangle" size={18} className="text-amber-600 mt-0.5" />
                        <div className="text-xs text-amber-800">
                          <strong>Рекомендация:</strong> Добавьте припуск на коррозию (обычно 1-3 мм) и округлите до стандартной толщины листа
                        </div>
                      </div>
                    </div>

                    <div id="report-content" className="hidden">
                      <h1>Отчет расчета сосуда под давлением</h1>
                      <p><strong>Дата:</strong> {new Date().toLocaleDateString('ru-RU')}</p>
                      <h2>Исходные данные:</h2>
                      <table>
                        <tr><td className="label">Внутренний диаметр:</td><td className="value">{diameter} мм</td></tr>
                        <tr><td className="label">Рабочее давление:</td><td className="value">{pressure} МПа</td></tr>
                        <tr><td className="label">Материал:</td><td className="value">{material}</td></tr>
                        <tr><td className="label">Коэффициент сварки:</td><td className="value">{weldCoeff}</td></tr>
                      </table>
                      <h2>Результаты расчета:</h2>
                      <table>
                        <tr><td className="label">Расчетная толщина стенки:</td><td className="value">{result.toFixed(1)} мм</td></tr>
                        <tr><td className="label">Норматив:</td><td className="value">ГОСТ 14249-89</td></tr>
                      </table>
                      <p style={{marginTop: '20px', color: '#64748B', fontSize: '12px'}}>Расчеты носят справочный характер</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {material && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Свойства материала</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm font-mono">
                    {materials.find(m => m.name === material) && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Модуль упругости:</span>
                          <span className="font-semibold">{materials.find(m => m.name === material)?.youngModulus.toLocaleString()} МПа</span>
                        </div>
                      </>
                    )}
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