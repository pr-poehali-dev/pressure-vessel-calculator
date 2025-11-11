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
import { Document, Paragraph, TextRun, Table, TableRow, TableCell, Packer, WidthType, AlignmentType, HeadingLevel } from 'docx';

interface WallCalculatorProps {
  vesselName: string;
  setVesselName: (val: string) => void;
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
  corrosionAllowance: string;
  setCorrosionAllowance: (val: string) => void;
  executiveThickness: string;
  setExecutiveThickness: (val: string) => void;
  actualThickness: string;
  setActualThickness: (val: string) => void;
  result: number | null;
  calcPressure: string;
  setCalcPressure: (val: string) => void;
  allowableStress20: number | null;
  allowablePressure: number | null;
  calculateThickness: () => void;
}

export default function WallCalculator({
  vesselName,
  setVesselName,
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
  corrosionAllowance,
  setCorrosionAllowance,
  executiveThickness,
  setExecutiveThickness,
  actualThickness,
  setActualThickness,
  result,
  calcPressure,
  setCalcPressure,
  allowableStress20,
  allowablePressure,
  calculateThickness
}: WallCalculatorProps) {
  const reportRef = useRef<HTMLDivElement>(null);

  const exportToPDF = async () => {
    if (result === null) return;

    const reportElement = document.getElementById('pdf-report-content');
    if (!reportElement) return;

    const canvas = await html2canvas(reportElement, {
      scale: 2,
      backgroundColor: '#ffffff',
      logging: false,
      useCORS: true
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pdfWidth - 20;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    let heightLeft = imgHeight;
    let position = 10;

    pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight + 10;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    pdf.save(`Raschet_obechayok_GOST_34233.2_${new Date().getTime()}.pdf`);
  };

  const exportToWord = async () => {
    if (result === null) return;

    const calcPressureValue = parseFloat(calcPressure);
    const allowableStress = getAllowableStress(material, parseFloat(temperature));

    const tableRows = [
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph('Внутренний диаметр (D):')],
            width: { size: 60, type: WidthType.PERCENTAGE }
          }),
          new TableCell({
            children: [new Paragraph({ text: `${diameter} мм`, bold: true })],
            width: { size: 40, type: WidthType.PERCENTAGE }
          })
        ]
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph('Рабочее давление:')]}),
          new TableCell({ children: [new Paragraph({ text: `${pressure} МПа`, bold: true })]})
        ]
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph('Расчетное давление (P):')]}),
          new TableCell({ children: [new Paragraph({ text: `${calcPressure} МПа`, bold: true })]})
        ]
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph('Температура стенки (T):')]}),
          new TableCell({ children: [new Paragraph({ text: `${temperature} °C`, bold: true })]})
        ]
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph('Материал:')]}),
          new TableCell({ children: [new Paragraph({ text: material, bold: true })]})
        ]
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph('Коэффициент прочности сварного шва (φ):')]}),
          new TableCell({ children: [new Paragraph({ text: weldCoeff, bold: true })]})
        ]
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph('Допускаемое напряжение:')]}),
          new TableCell({ children: [new Paragraph({ text: `${allowableStress.toFixed(1)} МПа`, bold: true })]})
        ]
      })
    ];

    const resultsParagraphs = [
      new Paragraph({
        text: 'РЕЗУЛЬТАТЫ РАСЧЕТА',
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 400, after: 200 }
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: 'Расчетная толщина стенки: ',
            size: 28
          }),
          new TextRun({
            text: `${result.toFixed(1)} мм`,
            bold: true,
            size: 32,
            color: '2563EB'
          })
        ],
        spacing: { after: 200 }
      })
    ];

    if (allowableStress20 !== null) {
      resultsParagraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: 'Допускаемое напряжение при 20°C: ',
              size: 24
            }),
            new TextRun({
              text: `${allowableStress20.toFixed(1)} МПа`,
              bold: true,
              size: 24
            })
          ],
          spacing: { after: 200 }
        })
      );
    }

    if (allowablePressure !== null) {
      resultsParagraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: 'Допускаемое внутреннее избыточное давление: ',
              size: 28
            }),
            new TextRun({
              text: `${allowablePressure.toFixed(2)} МПа`,
              bold: true,
              size: 32,
              color: '2563EB'
            })
          ],
          spacing: { after: 100 }
        }),
        new Paragraph({
          text: `ГОСТ 34233.2-2017`,
          spacing: { after: 200 }
        })
      );
    }

    resultsParagraphs.push(
      new Paragraph({
        text: `Норматив: ГОСТ 34233.2-2017, раздел 5`,
        spacing: { after: 400 }
      })
    );

    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            text: 'РАСЧЕТНЫЙ ОТЧЕТ',
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 }
          }),
          new Paragraph({
            text: 'Расчет цилиндрических обечаек',
            heading: HeadingLevel.HEADING_2,
            alignment: AlignmentType.CENTER,
            spacing: { after: 100 }
          }),
          new Paragraph({
            text: 'По ГОСТ 34233.2-2017, раздел 5',
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 }
          }),
          new Paragraph({
            text: `Дата: ${new Date().toLocaleDateString('ru-RU')}`,
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 }
          }),
          new Paragraph({
            text: 'ИСХОДНЫЕ ДАННЫЕ',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 200 }
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: tableRows
          }),
          ...resultsParagraphs,
          new Paragraph({
            text: 'РЕКОМЕНДАЦИЯ',
            heading: HeadingLevel.HEADING_3,
            spacing: { before: 200, after: 100 }
          }),
          new Paragraph({
            text: 'Добавьте припуск на коррозию (обычно 1-3 мм) и округлите до стандартной толщины листа',
            spacing: { after: 400 }
          }),
          new Paragraph({
            text: 'Расчеты носят справочный характер',
            alignment: AlignmentType.CENTER,
            italics: true,
            spacing: { before: 400 }
          })
        ]
      }]
    });

    const blob = await Packer.toBlob(doc);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Raschet_obechayok_GOST_34233.2_${new Date().getTime()}.docx`;
    link.click();
    window.URL.revokeObjectURL(url);
  };
  return (
    <div className="space-y-6 animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="Calculator" size={24} className="text-blue-600" />
            Расчет цилиндрических обечаек
          </CardTitle>
          <CardDescription>
            По ГОСТ 34233.2-2017, раздел 5
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div>
              <Label htmlFor="vesselName">Название аппарата</Label>
              <Input
                id="vesselName"
                type="text"
                placeholder="Введите название аппарата"
                value={vesselName}
                onChange={(e) => setVesselName(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="diameter">Внутренний диаметр, мм</Label>
              <Input
                id="diameter"
                type="number"
                placeholder="Введите внутренний диаметр"
                value={diameter}
                onChange={(e) => setDiameter(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="pressure">Рабочее давление, МПа</Label>
              <Input
                id="pressure"
                type="number"
                step="0.1"
                placeholder="Введите рабочее давление"
                value={pressure}
                onChange={(e) => setPressure(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="calcPressure">Расчетное давление, МПа</Label>
              <Input
                id="calcPressure"
                type="number"
                step="0.1"
                placeholder="Введите расчетное давление"
                value={calcPressure}
                onChange={(e) => setCalcPressure(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="temperature">Расчетная температура стенки, °C</Label>
              <Input
                id="temperature"
                type="number"
                placeholder="Введите температуру"
                value={temperature}
                onChange={(e) => setTemperature(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="material">Материал</Label>
              <Select value={material} onValueChange={setMaterial}>
                <SelectTrigger id="material">
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
              <Label htmlFor="weldCoeff">Коэффициент прочности сварного шва</Label>
              <Select value={weldCoeff} onValueChange={setWeldCoeff}>
                <SelectTrigger id="weldCoeff">
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
              <Label htmlFor="corrosionAllowance">Прибавка на коррозию, мм</Label>
              <Input
                id="corrosionAllowance"
                type="number"
                step="0.1"
                placeholder="Введите прибавку на коррозию"
                value={corrosionAllowance}
                onChange={(e) => setCorrosionAllowance(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="executiveThickness">Исполнительная толщина стенки, мм</Label>
              <Input
                id="executiveThickness"
                type="number"
                step="0.1"
                placeholder="Введите исполнительную толщину"
                value={executiveThickness}
                onChange={(e) => setExecutiveThickness(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="actualThickness">Фактическая толщина стенки, мм</Label>
              <Input
                id="actualThickness"
                type="number"
                step="0.1"
                placeholder="Введите фактическую толщину"
                value={actualThickness}
                onChange={(e) => setActualThickness(e.target.value)}
              />
            </div>
          </div>

          <Button onClick={calculateThickness} className="w-full">
            <Icon name="Calculator" size={20} className="mr-2" />
            Рассчитать
          </Button>
        </CardContent>
      </Card>

      {result !== null && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <Icon name="CheckCircle2" size={24} className="text-green-600" />
              Результаты расчета
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="text-sm text-slate-600">Расчетная толщина стенки</div>
              <div className="text-4xl font-bold text-blue-600">{result.toFixed(1)} мм</div>
              <div className="text-xs text-slate-500">По ГОСТ 34233.2-2017, раздел 5</div>
            </div>

            {allowableStress20 !== null && (
              <div className="space-y-2">
                <div className="text-sm text-slate-600">Допускаемое напряжение при 20°C</div>
                <div className="text-2xl font-semibold text-slate-700">{allowableStress20.toFixed(1)} МПа</div>
              </div>
            )}

            {allowablePressure !== null && (
              <div className="space-y-2">
                <div className="text-sm text-slate-600">Допускаемое внутреннее избыточное давление</div>
                <div className="text-xs text-slate-500 mb-1">ГОСТ 34233.2-2017</div>
                <div className="text-4xl font-bold text-blue-600">{allowablePressure.toFixed(2)} МПа</div>
              </div>
            )}

            <Separator />

            <div className="space-y-2 text-sm">
              <div className="font-semibold text-slate-700">Формулы расчёта:</div>
              <div className="bg-slate-50 p-3 rounded font-mono text-xs">
                <div>s = (Pр × D) / (2 × [σ] × φ - Pр)</div>
                <div className="text-slate-500 mt-1">где:</div>
                <div className="text-slate-500">s - расчетная толщина стенки, мм</div>
                <div className="text-slate-500">Pр - расчетное давление, МПа</div>
                <div className="text-slate-500">D - внутренний диаметр, мм</div>
                <div className="text-slate-500">[σ] - допускаемое напряжение, МПа</div>
                <div className="text-slate-500">φ - коэффициент прочности сварного шва</div>
              </div>
              {allowablePressure !== null && (
                <div className="bg-slate-50 p-3 rounded font-mono text-xs mt-2">
                  <div>[P] = (2 × [σ] × φ × sэф) / (D + sэф)</div>
                  <div className="text-slate-500 mt-1">где:</div>
                  <div className="text-slate-500">[P] - допускаемое давление, МПа</div>
                  <div className="text-slate-500">sэф = sисп - c (эффективная толщина)</div>
                  <div className="text-slate-500">c - прибавка на коррозию, мм</div>
                </div>
              )}
            </div>

            <Separator />

            <div className="flex gap-2">
              <Button onClick={exportToPDF} variant="outline" className="flex-1">
                <Icon name="FileText" size={20} className="mr-2" />
                Экспорт в PDF
              </Button>
              <Button onClick={exportToWord} variant="outline" className="flex-1">
                <Icon name="FileText" size={20} className="mr-2" />
                Экспорт в Word
              </Button>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <div className="flex gap-2">
                <Icon name="AlertCircle" size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-amber-800">
                  <div className="font-semibold mb-1">Важное примечание:</div>
                  <div>Добавьте припуск на коррозию (обычно 1-3 мм) и округлите до стандартной толщины листа по ГОСТ 19903</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {result !== null && (
        <div style={{ position: 'absolute', left: '-9999px' }}>
          <div id="pdf-report-content" ref={reportRef} style={{ width: '210mm', padding: '20mm', backgroundColor: 'white' }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px' }}>РАСЧЕТНЫЙ ОТЧЕТ</h1>
            <h2 style={{ fontSize: '18px', marginBottom: '5px' }}>Расчет цилиндрических обечаек</h2>
            <p style={{ fontSize: '14px', color: '#666' }}>По ГОСТ 34233.2-2017, раздел 5</p>
            <p style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
              Дата: {new Date().toLocaleDateString('ru-RU')}
            </p>
          </div>

          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '15px' }}>ИСХОДНЫЕ ДАННЫЕ</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                <tr style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '8px' }}>Внутренний диаметр (D):</td>
                  <td style={{ padding: '8px', fontWeight: 'bold' }}>{diameter} мм</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '8px' }}>Рабочее давление:</td>
                  <td style={{ padding: '8px', fontWeight: 'bold' }}>{pressure} МПа</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '8px' }}>Расчетное давление (P):</td>
                  <td style={{ padding: '8px', fontWeight: 'bold' }}>{calcPressure} МПа</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '8px' }}>Температура стенки (T):</td>
                  <td style={{ padding: '8px', fontWeight: 'bold' }}>{temperature} °C</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '8px' }}>Материал:</td>
                  <td style={{ padding: '8px', fontWeight: 'bold' }}>{material}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '8px' }}>Коэффициент прочности сварного шва (φ):</td>
                  <td style={{ padding: '8px', fontWeight: 'bold' }}>{weldCoeff}</td>
                </tr>
                {material && temperature && (
                  <tr style={{ borderBottom: '1px solid #ddd' }}>
                    <td style={{ padding: '8px' }}>Допускаемое напряжение:</td>
                    <td style={{ padding: '8px', fontWeight: 'bold' }}>
                      {getAllowableStress(material, parseFloat(temperature)).toFixed(1)} МПа
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '15px' }}>РЕЗУЛЬТАТЫ РАСЧЕТА</h3>
            <div style={{ marginBottom: '15px' }}>
              <p style={{ fontSize: '14px', marginBottom: '5px' }}>Расчетная толщина стенки:</p>
              <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#2563EB' }}>{result.toFixed(1)} мм</p>
            </div>
            {allowableStress20 !== null && (
              <div style={{ marginBottom: '15px' }}>
                <p style={{ fontSize: '14px', marginBottom: '5px' }}>Допускаемое напряжение при 20°C:</p>
                <p style={{ fontSize: '20px', fontWeight: 'bold' }}>{allowableStress20.toFixed(1)} МПа</p>
              </div>
            )}
            {allowablePressure !== null && (
              <div style={{ marginBottom: '15px' }}>
                <p style={{ fontSize: '14px', marginBottom: '5px' }}>Допускаемое внутреннее избыточное давление:</p>
                <p style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>ГОСТ 34233.2-2017</p>
                <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#2563EB' }}>{allowablePressure.toFixed(2)} МПа</p>
              </div>
            )}
            <p style={{ fontSize: '12px', color: '#666' }}>Норматив: ГОСТ 34233.2-2017, раздел 5</p>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '10px' }}>РЕКОМЕНДАЦИЯ</h4>
            <p style={{ fontSize: '12px' }}>
              Добавьте припуск на коррозию (обычно 1-3 мм) и округлите до стандартной толщины листа
            </p>
          </div>

          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <p style={{ fontSize: '10px', color: '#999', fontStyle: 'italic' }}>
              Расчеты носят справочный характер
            </p>
          </div>
        </div>
        </div>
      )}

      {result !== null && diameter && calcPressure && (
        <VesselVisualization2D 
          diameter={parseFloat(diameter)} 
          thickness={result}
          pressure={parseFloat(calcPressure)}
        />
      )}
    </div>
  );
}