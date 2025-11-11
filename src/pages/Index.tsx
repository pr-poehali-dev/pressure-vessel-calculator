import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Separator } from '@/components/ui/separator';
import { materials, standardFlanges, navigationTabs, getAllowableStress } from '@/lib/constants';
import FlangeDatabase from '@/components/calculators/FlangeDatabase';
import HomePage from '@/components/sections/HomePage';
import StandardsPage from '@/components/sections/StandardsPage';
import DocsPage from '@/components/sections/DocsPage';
import InputDataPage from '@/components/sections/InputDataPage';
import WallCalculator from '@/components/calculators/WallCalculator';
import HeadCalculator from '@/components/calculators/HeadCalculator';
import CorrosionRateCalculator from '@/components/calculators/CorrosionRateCalculator';
import LifetimeCalculator from '@/components/calculators/LifetimeCalculator';

export default function Index() {
  const [activeTab, setActiveTab] = useState('home');
  
  const [vesselType, setVesselType] = useState('vertical');
  const [vesselLength, setVesselLength] = useState('');
  const [medium, setMedium] = useState('');
  const [corrosionAllowance, setCorrosionAllowance] = useState('1.0');
  
  const [vesselName, setVesselName] = useState('');
  const [diameter, setDiameter] = useState('');
  const [pressure, setPressure] = useState('');
  const [calcPressureShell, setCalcPressureShell] = useState('');
  const [temperature, setTemperature] = useState('20');
  const [material, setMaterial] = useState('');
  const [weldCoeff, setWeldCoeff] = useState('1.0');
  const [shellCorrosion, setShellCorrosion] = useState('2.0');
  const [shellExecutive, setShellExecutive] = useState('');
  const [shellActual, setShellActual] = useState('');
  const [result, setResult] = useState<number | null>(null);
  const [allowableStress20, setAllowableStress20] = useState<number | null>(null);
  const [allowablePressureShell, setAllowablePressureShell] = useState<number | null>(null);
  
  const [flangeDiameter, setFlangeDiameter] = useState('');
  const [flangeThickness, setFlangeThickness] = useState('');
  const [boltDiameter, setBoltDiameter] = useState('');
  const [numBolts, setNumBolts] = useState('');
  const [flangeResult, setFlangeResult] = useState<{gasketLoad: number; boltStress: number} | null>(null);
  
  const [headVesselName, setHeadVesselName] = useState('');
  const [headDiameter, setHeadDiameter] = useState('');
  const [headPressure, setHeadPressure] = useState('');
  const [headCalcPressure, setHeadCalcPressure] = useState('');
  const [headTemperature, setHeadTemperature] = useState('20');
  const [headMaterial, setHeadMaterial] = useState('');
  const [headType, setHeadType] = useState('elliptical');
  const [headRadius, setHeadRadius] = useState('');
  const [headCorrosion, setHeadCorrosion] = useState('2.0');
  const [headExecutive, setHeadExecutive] = useState('');
  const [headActual, setHeadActual] = useState('');
  const [headResult, setHeadResult] = useState<number | null>(null);
  const [allowablePressureHead, setAllowablePressureHead] = useState<number | null>(null);
  
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
    const Pc = parseFloat(calcPressureShell);
    const T = parseFloat(temperature);
    const phi = parseFloat(weldCoeff);
    const s_exec = parseFloat(shellExecutive);
    const c = parseFloat(shellCorrosion);

    if (!D || !Pc || !material || !phi || isNaN(T)) return;

    const sigma = getAllowableStress(material, T);
    const sigma20 = getAllowableStress(material, 20);
    setAllowableStress20(sigma20);

    // Расчетная толщина стенки
    const s = (Pc * D) / (2 * sigma * phi - Pc);
    setResult(Math.ceil(s * 10) / 10);

    // Допускаемое внутреннее избыточное давление (если заданы исполнительная толщина и прибавка)
    if (s_exec && c) {
      const s_eff = s_exec - c;
      const P_allow = (2 * sigma * phi * s_eff) / (D + s_eff);
      setAllowablePressureShell(P_allow);
    } else {
      setAllowablePressureShell(null);
    }
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
    const Pc = parseFloat(headCalcPressure);
    const T = parseFloat(headTemperature);
    const R = parseFloat(headRadius);
    const s_exec = parseFloat(headExecutive);
    const c = parseFloat(headCorrosion);

    if (!D || !Pc || !headMaterial || isNaN(T)) return;

    const sigma = getAllowableStress(headMaterial, T);
    const phi = 1.0;
    let s = 0;

    if (headType === 'elliptical') {
      s = (Pc * D) / (4 * sigma * phi - 0.4 * Pc);
    } else if (headType === 'hemispherical') {
      s = (Pc * D) / (4 * sigma * phi - Pc);
    } else if (headType === 'torispherical') {
      const Rc = R || D;
      s = (Pc * Rc) / (2 * sigma * phi - 0.5 * Pc);
    } else {
      const K = 0.42;
      s = D * Math.sqrt((K * Pc) / sigma);
    }

    setHeadResult(Math.ceil(s * 10) / 10);

    // Допускаемое внутреннее избыточное давление (если заданы исполнительная толщина и прибавка)
    if (s_exec && c) {
      const s_eff = s_exec - c;
      let P_allow = 0;
      
      if (headType === 'elliptical') {
        P_allow = (4 * sigma * phi * s_eff) / (D + 0.4 * s_eff);
      } else if (headType === 'hemispherical') {
        P_allow = (4 * sigma * phi * s_eff) / (D + s_eff);
      } else if (headType === 'torispherical') {
        const Rc = R || D;
        P_allow = (2 * sigma * phi * s_eff) / (Rc + 0.5 * s_eff);
      } else {
        const K = 0.42;
        P_allow = (sigma * Math.pow(s_eff / D, 2)) / K;
      }
      
      setAllowablePressureHead(P_allow);
    } else {
      setAllowablePressureHead(null);
    }
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
        
        {activeTab === 'calculator' && (
          <WallCalculator
            vesselName={vesselName}
            setVesselName={setVesselName}
            diameter={diameter}
            setDiameter={setDiameter}
            pressure={pressure}
            setPressure={setPressure}
            calcPressure={calcPressureShell}
            setCalcPressure={setCalcPressureShell}
            temperature={temperature}
            setTemperature={setTemperature}
            material={material}
            setMaterial={setMaterial}
            weldCoeff={weldCoeff}
            setWeldCoeff={setWeldCoeff}
            corrosionAllowance={shellCorrosion}
            setCorrosionAllowance={setShellCorrosion}
            executiveThickness={shellExecutive}
            setExecutiveThickness={setShellExecutive}
            actualThickness={shellActual}
            setActualThickness={setShellActual}
            result={result}
            allowableStress20={allowableStress20}
            allowablePressure={allowablePressureShell}
            calculateThickness={calculateThickness}
          />
        )}

        {activeTab === 'head-calculator' && (
          <HeadCalculator
            vesselName={headVesselName}
            setVesselName={setHeadVesselName}
            headDiameter={headDiameter}
            setHeadDiameter={setHeadDiameter}
            headPressure={headPressure}
            setHeadPressure={setHeadPressure}
            calcPressure={headCalcPressure}
            setCalcPressure={setHeadCalcPressure}
            headTemperature={headTemperature}
            setHeadTemperature={setHeadTemperature}
            headRadius={headRadius}
            setHeadRadius={setHeadRadius}
            corrosionAllowance={headCorrosion}
            setCorrosionAllowance={setHeadCorrosion}
            executiveThickness={headExecutive}
            setExecutiveThickness={setHeadExecutive}
            actualThickness={headActual}
            setActualThickness={setHeadActual}
            headMaterial={headMaterial}
            setHeadMaterial={setHeadMaterial}
            headType={headType}
            setHeadType={setHeadType}
            headResult={headResult}
            allowablePressure={allowablePressureHead}
            calculateHead={calculateHead}
          />
        )}

        {activeTab === 'corrosion' && <CorrosionRateCalculator />}

        {activeTab === 'lifetime' && <LifetimeCalculator />}

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