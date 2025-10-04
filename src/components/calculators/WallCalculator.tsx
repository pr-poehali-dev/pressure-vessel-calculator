import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { Separator } from '@/components/ui/separator';
import { materials, getAllowableStress } from '@/lib/constants';
import VesselVisualization2D from '@/components/VesselVisualization2D';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useRef } from 'react';

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
  const reportRef = useRef<HTMLDivElement>(null);

  const exportToPDF = async () => {
    if (!reportRef.current || result === null) return;

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 15;

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(18);
    pdf.text('Расчетный отчет', pageWidth / 2, margin, { align: 'center' });
    
    pdf.setFontSize(12);
    pdf.text('Толщина стенки цилиндрического сосуда', pageWidth / 2, margin + 8, { align: 'center' });
    
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.text('По ГОСТ 14249-89', pageWidth / 2, margin + 14, { align: 'center' });

    let yPos = margin + 25;

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.text('Исходные данные:', margin, yPos);
    yPos += 8;

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.text(`Внутренний диаметр (D): ${diameter} мм`, margin, yPos);
    yPos += 6;
    pdf.text(`Расчетное давление (P): ${pressure} МПа`, margin, yPos);
    yPos += 6;
    pdf.text(`Температура стенки (T): ${temperature} °C`, margin, yPos);
    yPos += 6;
    pdf.text(`Материал: ${material}`, margin, yPos);
    yPos += 6;
    pdf.text(`Коэффициент прочности сварного шва (φ): ${weldCoeff}`, margin, yPos);
    yPos += 6;
    const stress = getAllowableStress(material, parseFloat(temperature));
    pdf.text(`Допускаемое напряжение: ${stress.toFixed(1)} МПа`, margin, yPos);
    yPos += 10;

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.text('Результаты расчета:', margin, yPos);
    yPos += 8;

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.text(`Расчетная толщина стенки: ${result.toFixed(1)} мм`, margin, yPos);
    yPos += 6;
    pdf.text('Норматив: ГОСТ 14249-89', margin, yPos);
    yPos += 12;

    const canvas = await html2canvas(reportRef.current, {
      scale: 2,
      backgroundColor: '#ffffff'
    });
    
    const imgData = canvas.toDataURL('image/png');
    const imgWidth = pageWidth - 2 * margin;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    if (yPos + imgHeight > pageHeight - margin) {
      pdf.addPage();
      yPos = margin;
    }

    pdf.addImage(imgData, 'PNG', margin, yPos, imgWidth, imgHeight);
    yPos += imgHeight + 10;

    if (yPos > pageHeight - 20) {
      pdf.addPage();
      yPos = margin;
    }

    pdf.setFontSize(8);
    pdf.setTextColor(100);
    pdf.text('Расчеты носят справочный характер', margin, pageHeight - 10);
    pdf.text(`Дата: ${new Date().toLocaleDateString('ru-RU')}`, pageWidth - margin, pageHeight - 10, { align: 'right' });

    pdf.save(`Расчет_толщины_стенки_${new Date().getTime()}.pdf`);
  };
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
              
              {result !== null && (
                <Button onClick={exportToPDF} variant="outline" size="lg" className="w-full">
                  <Icon name="FileDown" size={18} className="mr-2" />
                  Экспорт в PDF
                </Button>
              )}
            </div>

            <div className="space-y-4">
              {result !== null && (
                <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-white animate-scale-in">
                  <CardHeader>
                    <CardTitle className="text-lg">Результаты расчета</CardTitle>
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
                        <span className="text-slate-600">Рабочее давление:</span>
                        <span className="font-semibold">{pressure} МПа</span>
                      </div>
                      <div className="flex justify-between font-mono">
                        <span className="text-slate-600">Расчетное давление:</span>
                        <span className="font-semibold">{(parseFloat(pressure) * 1.1).toFixed(2)} МПа</span>
                      </div>
                      <div className="flex justify-between font-mono">
                        <span className="text-slate-600">Температура:</span>
                        <span className="font-semibold">{temperature} °C</span>
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

              {result !== null && diameter && pressure && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Визуализация сосуда</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div ref={reportRef}>
                      <VesselVisualization2D
                        diameter={parseFloat(diameter)}
                        thickness={result}
                        pressure={parseFloat(pressure)}
                        length={2000}
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {material && temperature && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Свойства материала</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm font-mono">
                    {materials.find(m => m.name === material) && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Допускаемое напряжение:</span>
                          <span className="font-semibold">{getAllowableStress(material, parseFloat(temperature)).toFixed(1)} МПа</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">При температуре:</span>
                          <span className="font-semibold">{temperature} °C</span>
                        </div>
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