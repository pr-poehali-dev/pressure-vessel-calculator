import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import VesselVisualization from '@/components/VesselVisualization';

const materials = [
  { name: 'Сталь 20', allowableStress: 142, youngModulus: 200000 },
  { name: '09Г2С', allowableStress: 165, youngModulus: 200000 },
  { name: '12Х18Н10Т', allowableStress: 133, youngModulus: 200000 },
  { name: '16ГС', allowableStress: 157, youngModulus: 200000 },
];

const standards = [
  { code: 'ГОСТ 14249-89', title: 'Сосуды и аппараты. Нормы и методы расчета на прочность' },
  { code: 'ГОСТ 34233.1-2017', title: 'Сосуды и аппараты. Нормы и методы расчета на прочность. Общие требования' },
  { code: 'ГОСТ 52857.1-2007', title: 'Сосуды и аппараты. Нормы и методы расчета на прочность. Расчет цилиндрических и конических обечаек' },
];

export default function Index() {
  const [activeTab, setActiveTab] = useState('home');
  const [diameter, setDiameter] = useState('');
  const [pressure, setPressure] = useState('');
  const [material, setMaterial] = useState('');
  const [weldCoeff, setWeldCoeff] = useState('1.0');
  const [result, setResult] = useState<number | null>(null);

  const calculateThickness = () => {
    const D = parseFloat(diameter);
    const P = parseFloat(pressure);
    const materialData = materials.find(m => m.name === material);
    const phi = parseFloat(weldCoeff);

    if (!D || !P || !materialData || !phi) return;

    const sigma = materialData.allowableStress;
    const s = (P * D) / (2 * sigma * phi - P);
    
    setResult(Math.ceil(s * 10) / 10);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-slate-900 text-white border-b border-slate-700">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-4">
            <Icon name="Gauge" size={32} className="text-blue-500" />
            <h1 className="text-3xl font-bold tracking-tight">Калькулятор Сосудов Под Давлением</h1>
          </div>
          <p className="text-slate-300 font-mono text-sm">Инженерные расчеты по ГОСТ</p>
        </div>
      </header>

      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex gap-1">
            {[
              { id: 'home', label: 'Главная', icon: 'Home' },
              { id: 'calculator', label: 'Калькулятор', icon: 'Calculator' },
              { id: 'standards', label: 'Нормативы', icon: 'BookOpen' },
              { id: 'docs', label: 'Документация', icon: 'FileText' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <Icon name={tab.icon as any} size={18} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        {activeTab === 'home' && (
          <div className="space-y-8 animate-fade-in">
            <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-white">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-3">
                  <Icon name="Gauge" size={28} className="text-blue-600" />
                  Профессиональный расчет сосудов
                </CardTitle>
                <CardDescription className="text-base">
                  Онлайн система для расчета прочности и подбора параметров сосудов, работающих под давлением
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="flex items-start gap-3 p-4 bg-white rounded-lg border">
                    <Icon name="Shield" size={24} className="text-blue-600 mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">Расчеты по ГОСТ</h3>
                      <p className="text-sm text-slate-600">Соответствие актуальным нормативам</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-white rounded-lg border">
                    <Icon name="Database" size={24} className="text-blue-600 mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">База материалов</h3>
                      <p className="text-sm text-slate-600">Свойства сталей и сплавов</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-white rounded-lg border">
                    <Icon name="FileDown" size={24} className="text-blue-600 mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">Отчеты</h3>
                      <p className="text-sm text-slate-600">Генерация документации</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="Wrench" size={20} />
                    Возможности калькулятора
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {[
                      'Расчет толщины стенки цилиндрических сосудов',
                      'Проверка прочности конструкции',
                      'Подбор фланцевых соединений',
                      'Расчет опорных конструкций',
                      'Учет коррозионных припусков',
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Icon name="Check" size={18} className="text-green-600 mt-0.5" />
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="BarChart3" size={20} />
                    Техническая информация
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-slate-50 rounded border">
                      <div className="text-xs text-slate-500 font-mono mb-1">Диапазон давлений</div>
                      <div className="font-semibold">0.1 - 100 МПа</div>
                    </div>
                    <div className="p-3 bg-slate-50 rounded border">
                      <div className="text-xs text-slate-500 font-mono mb-1">Диапазон диаметров</div>
                      <div className="font-semibold">100 - 10000 мм</div>
                    </div>
                    <div className="p-3 bg-slate-50 rounded border">
                      <div className="text-xs text-slate-500 font-mono mb-1">Материалов в базе</div>
                      <div className="font-semibold">{materials.length} типов сталей</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'calculator' && (
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
                            <p style="margin-top:20px;color:#64748B;font-size:12px;">Расчеты носят справочный характер</p>
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
                          <VesselVisualization
                            diameter={parseFloat(diameter)}
                            thickness={result}
                            pressure={parseFloat(pressure)}
                          />
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
                                <span className="text-slate-600">Допуск. напряжение:</span>
                                <span className="font-semibold">{materials.find(m => m.name === material)?.allowableStress} МПа</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-600">Модуль Юнга:</span>
                                <span className="font-semibold">{materials.find(m => m.name === material)?.youngModulus} МПа</span>
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
        )}

        {activeTab === 'standards' && (
          <div className="space-y-6 animate-fade-in">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="BookOpen" size={24} className="text-blue-600" />
                  Нормативные документы
                </CardTitle>
                <CardDescription>Актуальные ГОСТы и стандарты для расчета сосудов под давлением</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {standards.map((std, i) => (
                    <div key={i} className="p-4 border rounded-lg hover:border-blue-300 transition-colors">
                      <div className="flex items-start gap-3">
                        <Icon name="FileText" size={20} className="text-blue-600 mt-1" />
                        <div className="flex-1">
                          <Badge variant="outline" className="font-mono text-xs mb-2">{std.code}</Badge>
                          <h3 className="font-semibold text-sm">{std.title}</h3>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">База данных материалов</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-mono">Марка стали</TableHead>
                      <TableHead className="font-mono">Допускаемое напряжение, МПа</TableHead>
                      <TableHead className="font-mono">Модуль упругости, МПа</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {materials.map((mat, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-semibold font-mono">{mat.name}</TableCell>
                        <TableCell className="font-mono">{mat.allowableStress}</TableCell>
                        <TableCell className="font-mono">{mat.youngModulus.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'docs' && (
          <div className="space-y-6 animate-fade-in">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="FileText" size={24} className="text-blue-600" />
                  Документация и руководства
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { title: 'Руководство по расчету', icon: 'Book', desc: 'Пошаговая инструкция по использованию калькулятора' },
                    { title: 'Методика расчета', icon: 'BookOpen', desc: 'Теоретические основы и формулы расчета' },
                    { title: 'Примеры расчетов', icon: 'FileCheck', desc: 'Типовые примеры с решениями' },
                    { title: 'Справочные данные', icon: 'Database', desc: 'Таблицы свойств материалов' },
                  ].map((doc, i) => (
                    <div key={i} className="p-4 border rounded-lg hover:border-blue-300 transition-colors cursor-pointer">
                      <div className="flex items-start gap-3">
                        <Icon name={doc.icon as any} size={24} className="text-blue-600" />
                        <div>
                          <h3 className="font-semibold mb-1">{doc.title}</h3>
                          <p className="text-sm text-slate-600">{doc.desc}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="my-6" />

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Icon name="Info" size={18} className="text-blue-600" />
                    Формула расчета толщины стенки
                  </h3>
                  <div className="bg-white p-4 rounded border font-mono text-sm mt-3">
                    <div className="mb-2">s = (P × D) / (2 × σ × φ - P)</div>
                    <div className="text-xs text-slate-600 space-y-1 mt-3">
                      <div>где: s — расчетная толщина стенки, мм</div>
                      <div>P — расчетное давление, МПа</div>
                      <div>D — внутренний диаметр, мм</div>
                      <div>σ — допускаемое напряжение материала, МПа</div>
                      <div>φ — коэффициент прочности сварного шва</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      <footer className="bg-slate-900 text-slate-300 mt-16 py-8 border-t border-slate-700">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                <Icon name="Gauge" size={20} />
                О калькуляторе
              </h3>
              <p className="text-sm">
                Профессиональный инструмент для инженерных расчетов сосудов, работающих под давлением
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-3">Возможности</h3>
              <ul className="text-sm space-y-1">
                <li>• Расчет по ГОСТ</li>
                <li>• База материалов</li>
                <li>• Техническая документация</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-3">Контакты</h3>
              <p className="text-sm font-mono">engineering@example.com</p>
            </div>
          </div>
          <Separator className="my-6 bg-slate-700" />
          <div className="text-center text-sm text-slate-400">
            © 2024 Калькулятор Сосудов Под Давлением. Расчеты носят справочный характер.
          </div>
        </div>
      </footer>
    </div>
  );
}