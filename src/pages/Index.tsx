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

const standardFlanges = [
  { type: 'ГОСТ 12815', dn: 50, pn: 1.6, outerDiameter: 165, boltCircle: 125, numBolts: 4, boltSize: 18, thickness: 14 },
  { type: 'ГОСТ 12815', dn: 80, pn: 1.6, outerDiameter: 200, boltCircle: 160, numBolts: 8, boltSize: 18, thickness: 16 },
  { type: 'ГОСТ 12815', dn: 100, pn: 1.6, outerDiameter: 220, boltCircle: 180, numBolts: 8, boltSize: 18, thickness: 18 },
  { type: 'ГОСТ 12815', dn: 150, pn: 1.6, outerDiameter: 285, boltCircle: 240, numBolts: 8, boltSize: 23, thickness: 20 },
  { type: 'ГОСТ 12815', dn: 200, pn: 1.6, outerDiameter: 340, boltCircle: 295, numBolts: 12, boltSize: 23, thickness: 22 },
  { type: 'ГОСТ 12815', dn: 250, pn: 1.6, outerDiameter: 405, boltCircle: 355, numBolts: 12, boltSize: 27, thickness: 24 },
  { type: 'ГОСТ 12815', dn: 300, pn: 1.6, outerDiameter: 460, boltCircle: 410, numBolts: 16, boltSize: 27, thickness: 26 },
  { type: 'ГОСТ 12821', dn: 50, pn: 2.5, outerDiameter: 165, boltCircle: 125, numBolts: 4, boltSize: 18, thickness: 16 },
  { type: 'ГОСТ 12821', dn: 80, pn: 2.5, outerDiameter: 200, boltCircle: 160, numBolts: 8, boltSize: 18, thickness: 18 },
  { type: 'ГОСТ 12821', dn: 100, pn: 2.5, outerDiameter: 235, boltCircle: 190, numBolts: 8, boltSize: 23, thickness: 20 },
  { type: 'ГОСТ 12821', dn: 150, pn: 2.5, outerDiameter: 300, boltCircle: 250, numBolts: 8, boltSize: 27, thickness: 24 },
  { type: 'ГОСТ 12821', dn: 200, pn: 2.5, outerDiameter: 360, boltCircle: 310, numBolts: 12, boltSize: 27, thickness: 26 },
];

export default function Index() {
  const [activeTab, setActiveTab] = useState('home');
  const [diameter, setDiameter] = useState('');
  const [pressure, setPressure] = useState('');
  const [material, setMaterial] = useState('');
  const [weldCoeff, setWeldCoeff] = useState('1.0');
  const [result, setResult] = useState<number | null>(null);
  
  const [flangeDiameter, setFlangeDiameter] = useState('');
  const [flangeThickness, setFlangeThickness] = useState('');
  const [boltDiameter, setBoltDiameter] = useState('');
  const [numBolts, setNumBolts] = useState('');
  const [flangeResult, setFlangeResult] = useState<{gasketLoad: number; boltStress: number} | null>(null);
  
  const [headDiameter, setHeadDiameter] = useState('');
  const [headPressure, setHeadPressure] = useState('');
  const [headMaterial, setHeadMaterial] = useState('');
  const [headType, setHeadType] = useState('elliptical');
  const [headResult, setHeadResult] = useState<number | null>(null);
  
  const [supportType, setSupportType] = useState('saddle');
  const [vesselDiameter, setVesselDiameter] = useState('');
  const [vesselLength, setVesselLength] = useState('');
  const [vesselWeight, setVesselWeight] = useState('');
  const [supportMaterial, setSupportMaterial] = useState('');
  const [supportResult, setSupportResult] = useState<{stress: number; deflection: number; recommendation: string} | null>(null);
  
  const [selectedFlangeType, setSelectedFlangeType] = useState('ГОСТ 12815');
  const [selectedFlangeDN, setSelectedFlangeDN] = useState('');
  const [selectedFlangePN, setSelectedFlangePN] = useState('1.6');

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

  const calculateFlange = () => {
    const Df = parseFloat(flangeDiameter);
    const tf = parseFloat(flangeThickness);
    const db = parseFloat(boltDiameter);
    const n = parseFloat(numBolts);
    const P = parseFloat(pressure) || 1;

    if (!Df || !tf || !db || !n) return;

    const gasketArea = Math.PI * Math.pow(Df / 2, 2);
    const gasketLoad = P * gasketArea;
    
    const boltArea = n * Math.PI * Math.pow(db / 2, 2);
    const boltStress = (gasketLoad * 1.5) / boltArea;

    setFlangeResult({ gasketLoad: Math.round(gasketLoad), boltStress: Math.round(boltStress) });
  };

  const calculateHead = () => {
    const D = parseFloat(headDiameter);
    const P = parseFloat(headPressure);
    const materialData = materials.find(m => m.name === headMaterial);

    if (!D || !P || !materialData) return;

    const sigma = materialData.allowableStress;
    let s = 0;

    if (headType === 'elliptical') {
      s = (P * D) / (4 * sigma - 0.4 * P);
    } else if (headType === 'hemispherical') {
      s = (P * D) / (4 * sigma - P);
    } else {
      s = (0.44 * P * D) / sigma;
    }

    setHeadResult(Math.ceil(s * 10) / 10);
  };

  const calculateSupport = () => {
    const D = parseFloat(vesselDiameter);
    const L = parseFloat(vesselLength);
    const W = parseFloat(vesselWeight);
    const materialData = materials.find(m => m.name === supportMaterial);

    if (!D || !L || !W || !materialData) return;

    let stress = 0;
    let deflection = 0;
    let recommendation = '';

    if (supportType === 'saddle') {
      const reactionForce = W / 2;
      const contactArea = (D * 200) / 1000;
      stress = reactionForce / contactArea;
      deflection = (W * Math.pow(L, 3)) / (48 * materialData.youngModulus * Math.PI * Math.pow(D / 2, 4));
      
      if (stress > materialData.allowableStress * 0.8) {
        recommendation = 'Увеличьте ширину седловой опоры или используйте более прочный материал';
      } else if (deflection > L / 500) {
        recommendation = 'Прогиб превышает допустимый. Добавьте дополнительную опору';
      } else {
        recommendation = 'Опора подобрана корректно';
      }
    } else if (supportType === 'legs') {
      const numLegs = 4;
      const legArea = 5000;
      stress = (W / numLegs) / legArea;
      deflection = 0;
      
      if (stress > materialData.allowableStress) {
        recommendation = 'Увеличьте сечение опорных лап или их количество';
      } else {
        recommendation = 'Опорные лапы подобраны корректно';
      }
    } else {
      const skirtArea = Math.PI * D * 20;
      stress = W / skirtArea;
      deflection = 0;
      
      if (stress > materialData.allowableStress * 0.6) {
        recommendation = 'Увеличьте толщину юбки или диаметр';
      } else {
        recommendation = 'Юбочная опора подобрана корректно';
      }
    }

    setSupportResult({ 
      stress: Math.round(stress * 10) / 10, 
      deflection: Math.round(deflection * 100) / 100,
      recommendation 
    });
  };

  const applyStandardFlange = () => {
    const flange = standardFlanges.find(
      f => f.type === selectedFlangeType && 
           f.dn.toString() === selectedFlangeDN && 
           f.pn.toString() === selectedFlangePN
    );
    
    if (flange) {
      setFlangeDiameter(flange.dn.toString());
      setFlangeThickness(flange.thickness.toString());
      setBoltDiameter(flange.boltSize.toString());
      setNumBolts(flange.numBolts.toString());
    }
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
              { id: 'calculator', label: 'Стенка', icon: 'Calculator' },
              { id: 'flange', label: 'Фланцы', icon: 'Disc' },
              { id: 'head', label: 'Днища', icon: 'Circle' },
              { id: 'support', label: 'Опоры', icon: 'Columns3' },
              { id: 'flange-db', label: 'База фланцев', icon: 'Database' },
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

        {activeTab === 'flange' && (
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
        )}

        {activeTab === 'head' && (
          <div className="space-y-6 animate-fade-in">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Circle" size={24} className="text-blue-600" />
                  Расчет толщины днища
                </CardTitle>
                <CardDescription>Расчет эллиптических, сферических и плоских днищ</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="headType" className="font-mono text-xs text-slate-600">Тип днища</Label>
                      <Select value={headType} onValueChange={setHeadType}>
                        <SelectTrigger className="mt-1.5 font-mono">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="elliptical" className="font-mono">Эллиптическое (2:1)</SelectItem>
                          <SelectItem value="hemispherical" className="font-mono">Полусферическое</SelectItem>
                          <SelectItem value="flat" className="font-mono">Плоское</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="headDiameter" className="font-mono text-xs text-slate-600">Внутренний диаметр, мм</Label>
                      <Input
                        id="headDiameter"
                        type="number"
                        placeholder="Введите диаметр"
                        value={headDiameter}
                        onChange={(e) => setHeadDiameter(e.target.value)}
                        className="mt-1.5 font-mono"
                      />
                    </div>

                    <div>
                      <Label htmlFor="headPressure" className="font-mono text-xs text-slate-600">Рабочее давление, МПа</Label>
                      <Input
                        id="headPressure"
                        type="number"
                        step="0.1"
                        placeholder="Введите давление"
                        value={headPressure}
                        onChange={(e) => setHeadPressure(e.target.value)}
                        className="mt-1.5 font-mono"
                      />
                    </div>

                    <div>
                      <Label htmlFor="headMaterial" className="font-mono text-xs text-slate-600">Материал днища</Label>
                      <Select value={headMaterial} onValueChange={setHeadMaterial}>
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

                    <Button onClick={calculateHead} className="w-full bg-blue-600 hover:bg-blue-700" size="lg">
                      <Icon name="Play" size={18} className="mr-2" />
                      Рассчитать
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {headResult !== null && (
                      <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-white animate-scale-in">
                        <CardHeader>
                          <CardTitle className="text-lg">Результаты расчета</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="p-6 bg-white rounded-lg border-2 border-blue-500">
                            <div className="text-xs font-mono text-slate-500 mb-2">Расчетная толщина днища</div>
                            <div className="text-4xl font-bold text-blue-600 font-mono">
                              {headResult.toFixed(1)} <span className="text-2xl text-slate-600">мм</span>
                            </div>
                          </div>

                          <Separator />

                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between font-mono">
                              <span className="text-slate-600">Тип днища:</span>
                              <span className="font-semibold">
                                {headType === 'elliptical' && 'Эллиптическое'}
                                {headType === 'hemispherical' && 'Полусферическое'}
                                {headType === 'flat' && 'Плоское'}
                              </span>
                            </div>
                            <div className="flex justify-between font-mono">
                              <span className="text-slate-600">Диаметр:</span>
                              <span className="font-semibold">{headDiameter} мм</span>
                            </div>
                            <div className="flex justify-between font-mono">
                              <span className="text-slate-600">Давление:</span>
                              <span className="font-semibold">{headPressure} МПа</span>
                            </div>
                            <div className="flex justify-between font-mono">
                              <span className="text-slate-600">Материал:</span>
                              <span className="font-semibold">{headMaterial}</span>
                            </div>
                          </div>

                          <Separator />

                          <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                            <div className="text-xs text-blue-800 space-y-1">
                              <div><strong>Формула:</strong></div>
                              {headType === 'elliptical' && <div className="font-mono">s = (P × D) / (4 × σ - 0.4 × P)</div>}
                              {headType === 'hemispherical' && <div className="font-mono">s = (P × D) / (4 × σ - P)</div>}
                              {headType === 'flat' && <div className="font-mono">s = (0.44 × P × D) / σ</div>}
                            </div>
                          </div>

                          <div className="p-3 bg-amber-50 border border-amber-200 rounded">
                            <div className="flex items-start gap-2">
                              <Icon name="Info" size={18} className="text-amber-600 mt-0.5" />
                              <div className="text-xs text-amber-800">
                                <strong>Примечание:</strong> Для плоских днищ рекомендуется использовать ребра жесткости при больших диаметрах
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
        )}

        {activeTab === 'support' && (
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
        )}

        {activeTab === 'flange-db' && (
          <div className="space-y-6 animate-fade-in">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Database" size={24} className="text-blue-600" />
                  База данных стандартных фланцев
                </CardTitle>
                <CardDescription>Быстрый выбор параметров фланцев по ГОСТ</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-3 gap-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div>
                    <Label htmlFor="flangeTypeSelect" className="font-mono text-xs text-slate-600">Тип фланца</Label>
                    <Select value={selectedFlangeType} onValueChange={setSelectedFlangeType}>
                      <SelectTrigger className="mt-1.5 font-mono bg-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ГОСТ 12815" className="font-mono">ГОСТ 12815 (PN 1.6)</SelectItem>
                        <SelectItem value="ГОСТ 12821" className="font-mono">ГОСТ 12821 (PN 2.5)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="flangeDNSelect" className="font-mono text-xs text-slate-600">Условный проход DN</Label>
                    <Select value={selectedFlangeDN} onValueChange={setSelectedFlangeDN}>
                      <SelectTrigger className="mt-1.5 font-mono bg-white">
                        <SelectValue placeholder="Выберите DN" />
                      </SelectTrigger>
                      <SelectContent>
                        {[...new Set(standardFlanges.filter(f => f.type === selectedFlangeType).map(f => f.dn))].map(dn => (
                          <SelectItem key={dn} value={dn.toString()} className="font-mono">DN {dn}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="flangePNSelect" className="font-mono text-xs text-slate-600">Номинальное давление PN</Label>
                    <Select value={selectedFlangePN} onValueChange={setSelectedFlangePN}>
                      <SelectTrigger className="mt-1.5 font-mono bg-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1.6" className="font-mono">PN 1.6</SelectItem>
                        <SelectItem value="2.5" className="font-mono">PN 2.5</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button 
                    onClick={applyStandardFlange} 
                    className="bg-blue-600 hover:bg-blue-700"
                    disabled={!selectedFlangeDN}
                  >
                    <Icon name="Download" size={18} className="mr-2" />
                    Применить к калькулятору фланцев
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setActiveTab('flange')}
                  >
                    Перейти к расчету
                  </Button>
                </div>

                <Separator />

                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="font-mono">Тип</TableHead>
                        <TableHead className="font-mono">DN</TableHead>
                        <TableHead className="font-mono">PN</TableHead>
                        <TableHead className="font-mono">D наружный, мм</TableHead>
                        <TableHead className="font-mono">D болт. окр., мм</TableHead>
                        <TableHead className="font-mono">Кол-во болтов</TableHead>
                        <TableHead className="font-mono">d болта, мм</TableHead>
                        <TableHead className="font-mono">Толщина, мм</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {standardFlanges.map((flange, i) => (
                        <TableRow 
                          key={i}
                          className={`cursor-pointer hover:bg-blue-50 ${
                            selectedFlangeType === flange.type && 
                            selectedFlangeDN === flange.dn.toString() && 
                            selectedFlangePN === flange.pn.toString()
                              ? 'bg-blue-100' 
                              : ''
                          }`}
                          onClick={() => {
                            setSelectedFlangeType(flange.type);
                            setSelectedFlangeDN(flange.dn.toString());
                            setSelectedFlangePN(flange.pn.toString());
                          }}
                        >
                          <TableCell className="font-mono text-xs">{flange.type}</TableCell>
                          <TableCell className="font-mono font-semibold">{flange.dn}</TableCell>
                          <TableCell className="font-mono">{flange.pn}</TableCell>
                          <TableCell className="font-mono">{flange.outerDiameter}</TableCell>
                          <TableCell className="font-mono">{flange.boltCircle}</TableCell>
                          <TableCell className="font-mono">{flange.numBolts}</TableCell>
                          <TableCell className="font-mono">{flange.boltSize}</TableCell>
                          <TableCell className="font-mono">{flange.thickness}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
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