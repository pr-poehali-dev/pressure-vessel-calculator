import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Separator } from '@/components/ui/separator';
import { materials, standardFlanges, navigationTabs, getAllowableStress } from '@/lib/constants';
import FlangeDatabase from '@/components/calculators/FlangeDatabase';
import HomePage from '@/components/sections/HomePage';
import StandardsPage from '@/components/sections/StandardsPage';
import DocsPage from '@/components/sections/DocsPage';
import InputDataPage from '@/components/sections/InputDataPage';
import CalculationsPage from '@/components/sections/CalculationsPage';

export default function Index() {
  const [activeTab, setActiveTab] = useState('home');
  
  const [vesselType, setVesselType] = useState('vertical');
  const [vesselLength, setVesselLength] = useState('');
  const [medium, setMedium] = useState('');
  const [corrosionAllowance, setCorrosionAllowance] = useState('1.0');
  
  const [diameter, setDiameter] = useState('');
  const [pressure, setPressure] = useState('');
  const [temperature, setTemperature] = useState('20');
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
  const [headTemperature, setHeadTemperature] = useState('20');
  const [headMaterial, setHeadMaterial] = useState('');
  const [headType, setHeadType] = useState('elliptical');
  const [headResult, setHeadResult] = useState<number | null>(null);
  
  const [supportType, setSupportType] = useState('saddle');
  const [vesselDiameter, setVesselDiameter] = useState('');
  const [vesselWeight, setVesselWeight] = useState('');
  const [supportMaterial, setSupportMaterial] = useState('');
  const [supportResult, setSupportResult] = useState<{stress: number; deflection: number; recommendation: string} | null>(null);
  
  const [selectedFlangeType, setSelectedFlangeType] = useState('ГОСТ 12815');
  const [selectedFlangeDN, setSelectedFlangeDN] = useState('');
  const [selectedFlangePN, setSelectedFlangePN] = useState('1.6');

  const [pressureDiameter, setPressureDiameter] = useState('');
  const [pressureWallThickness, setPressureWallThickness] = useState('');
  const [pressureTemperature, setPressureTemperature] = useState('20');
  const [pressureMaterial, setPressureMaterial] = useState('');
  const [pressureWeldCoeff, setPressureWeldCoeff] = useState('1.0');
  const [allowablePressure, setAllowablePressure] = useState<number | null>(null);

  const calculateThickness = () => {
    const D = parseFloat(diameter);
    const P = parseFloat(pressure);
    const T = parseFloat(temperature);
    const phi = parseFloat(weldCoeff);

    if (!D || !P || !material || !phi || isNaN(T)) return;

    const sigma = getAllowableStress(material, T);
    const s = (P * D) / (2 * sigma * phi - P);
    
    setResult(Math.ceil(s * 10) / 10);
  };

  const calculateAllowablePressure = () => {
    const D = parseFloat(pressureDiameter);
    const s = parseFloat(pressureWallThickness);
    const T = parseFloat(pressureTemperature);
    const phi = parseFloat(pressureWeldCoeff);

    if (!D || !s || !pressureMaterial || !phi || isNaN(T)) return;

    const sigma = getAllowableStress(pressureMaterial, T);
    const P = (2 * sigma * phi * s) / (D + s);
    
    setAllowablePressure(P);
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
    const T = parseFloat(headTemperature);

    if (!D || !P || !headMaterial || isNaN(T)) return;

    const sigma = getAllowableStress(headMaterial, T);
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
            {navigationTabs.map((tab) => (
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
        {activeTab === 'home' && <HomePage />}
        
        {activeTab === 'input-data' && (
          <InputDataPage
            vesselType={vesselType}
            setVesselType={setVesselType}
            diameter={diameter}
            setDiameter={setDiameter}
            length={vesselLength}
            setLength={setVesselLength}
            pressure={pressure}
            setPressure={setPressure}
            temperature={temperature}
            setTemperature={setTemperature}
            material={material}
            setMaterial={setMaterial}
            weldCoeff={weldCoeff}
            setWeldCoeff={setWeldCoeff}
            medium={medium}
            setMedium={setMedium}
            corrosionAllowance={corrosionAllowance}
            setCorrosionAllowance={setCorrosionAllowance}
          />
        )}
        
        {activeTab === 'calculations' && (
          <CalculationsPage
            diameter={diameter}
            setDiameter={setDiameter}
            pressure={pressure}
            setPressure={setPressure}
            temperature={temperature}
            setTemperature={setTemperature}
            material={material}
            setMaterial={setMaterial}
            weldCoeff={weldCoeff}
            setWeldCoeff={setWeldCoeff}
            result={result}
            calculateThickness={calculateThickness}
            pressureDiameter={pressureDiameter}
            setPressureDiameter={setPressureDiameter}
            pressureWallThickness={pressureWallThickness}
            setPressureWallThickness={setPressureWallThickness}
            pressureTemperature={pressureTemperature}
            setPressureTemperature={setPressureTemperature}
            pressureMaterial={pressureMaterial}
            setPressureMaterial={setPressureMaterial}
            pressureWeldCoeff={pressureWeldCoeff}
            setPressureWeldCoeff={setPressureWeldCoeff}
            allowablePressure={allowablePressure}
            calculateAllowablePressure={calculateAllowablePressure}
            flangeDiameter={flangeDiameter}
            setFlangeDiameter={setFlangeDiameter}
            flangeThickness={flangeThickness}
            setFlangeThickness={setFlangeThickness}
            boltDiameter={boltDiameter}
            setBoltDiameter={setBoltDiameter}
            numBolts={numBolts}
            setNumBolts={setNumBolts}
            flangeResult={flangeResult}
            calculateFlange={calculateFlange}
            headDiameter={headDiameter}
            setHeadDiameter={setHeadDiameter}
            headPressure={headPressure}
            setHeadPressure={setHeadPressure}
            headTemperature={headTemperature}
            setHeadTemperature={setHeadTemperature}
            headMaterial={headMaterial}
            setHeadMaterial={setHeadMaterial}
            headType={headType}
            setHeadType={setHeadType}
            headResult={headResult}
            calculateHead={calculateHead}
            supportType={supportType}
            setSupportType={setSupportType}
            vesselDiameter={vesselDiameter}
            setVesselDiameter={setVesselDiameter}
            vesselLength={vesselLength}
            setVesselLength={setVesselLength}
            vesselWeight={vesselWeight}
            setVesselWeight={setVesselWeight}
            supportMaterial={supportMaterial}
            setSupportMaterial={setSupportMaterial}
            supportResult={supportResult}
            calculateSupport={calculateSupport}
          />
        )}

        {activeTab === 'flange-db' && (
          <FlangeDatabase
            selectedFlangeType={selectedFlangeType}
            setSelectedFlangeType={setSelectedFlangeType}
            selectedFlangeDN={selectedFlangeDN}
            setSelectedFlangeDN={setSelectedFlangeDN}
            selectedFlangePN={selectedFlangePN}
            setSelectedFlangePN={setSelectedFlangePN}
            applyStandardFlange={applyStandardFlange}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'standards' && <StandardsPage />}
        
        {activeTab === 'docs' && <DocsPage />}
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