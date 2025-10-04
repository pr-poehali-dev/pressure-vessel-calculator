import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import WallCalculator from '@/components/calculators/WallCalculator';
import PressureCalculator from '@/components/calculators/PressureCalculator';
import FlangeCalculator from '@/components/calculators/FlangeCalculator';
import HeadCalculator from '@/components/calculators/HeadCalculator';
import SupportCalculator from '@/components/calculators/SupportCalculator';

interface CalculationsPageProps {
  diameter: string;
  setDiameter: (value: string) => void;
  pressure: string;
  setPressure: (value: string) => void;
  temperature: string;
  setTemperature: (value: string) => void;
  material: string;
  setMaterial: (value: string) => void;
  weldCoeff: string;
  setWeldCoeff: (value: string) => void;
  result: number | null;
  calculateThickness: () => void;
  
  pressureDiameter: string;
  setPressureDiameter: (value: string) => void;
  pressureWallThickness: string;
  setPressureWallThickness: (value: string) => void;
  pressureTemperature: string;
  setPressureTemperature: (value: string) => void;
  pressureMaterial: string;
  setPressureMaterial: (value: string) => void;
  pressureWeldCoeff: string;
  setPressureWeldCoeff: (value: string) => void;
  allowablePressure: number | null;
  calculateAllowablePressure: () => void;
  
  flangeDiameter: string;
  setFlangeDiameter: (value: string) => void;
  flangeThickness: string;
  setFlangeThickness: (value: string) => void;
  boltDiameter: string;
  setBoltDiameter: (value: string) => void;
  numBolts: string;
  setNumBolts: (value: string) => void;
  flangeResult: {gasketLoad: number; boltStress: number} | null;
  calculateFlange: () => void;
  
  headDiameter: string;
  setHeadDiameter: (value: string) => void;
  headPressure: string;
  setHeadPressure: (value: string) => void;
  headTemperature: string;
  setHeadTemperature: (value: string) => void;
  headMaterial: string;
  setHeadMaterial: (value: string) => void;
  headType: string;
  setHeadType: (value: string) => void;
  headResult: number | null;
  calculateHead: () => void;
  
  supportType: string;
  setSupportType: (value: string) => void;
  vesselDiameter: string;
  setVesselDiameter: (value: string) => void;
  vesselLength: string;
  setVesselLength: (value: string) => void;
  vesselWeight: string;
  setVesselWeight: (value: string) => void;
  supportMaterial: string;
  setSupportMaterial: (value: string) => void;
  supportResult: {stress: number; deflection: number; recommendation: string} | null;
  calculateSupport: () => void;
}

export default function CalculationsPage(props: CalculationsPageProps) {
  const [activeCalc, setActiveCalc] = useState('wall');

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Icon name="Calculator" size={32} className="text-blue-600" />
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Расчеты элементов сосуда</h2>
          <p className="text-slate-600">Выполните необходимые проверочные и проектные расчеты</p>
        </div>
      </div>

      <Tabs value={activeCalc} onValueChange={setActiveCalc} className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-6">
          <TabsTrigger value="wall" className="flex items-center gap-2">
            <Icon name="Layers" size={16} />
            Стенка
          </TabsTrigger>
          <TabsTrigger value="pressure" className="flex items-center gap-2">
            <Icon name="Gauge" size={16} />
            Давление
          </TabsTrigger>
          <TabsTrigger value="flange" className="flex items-center gap-2">
            <Icon name="Disc" size={16} />
            Фланцы
          </TabsTrigger>
          <TabsTrigger value="head" className="flex items-center gap-2">
            <Icon name="Circle" size={16} />
            Днища
          </TabsTrigger>
          <TabsTrigger value="support" className="flex items-center gap-2">
            <Icon name="Columns3" size={16} />
            Опоры
          </TabsTrigger>
        </TabsList>

        <TabsContent value="wall">
          <WallCalculator
            diameter={props.diameter}
            setDiameter={props.setDiameter}
            pressure={props.pressure}
            setPressure={props.setPressure}
            temperature={props.temperature}
            setTemperature={props.setTemperature}
            material={props.material}
            setMaterial={props.setMaterial}
            weldCoeff={props.weldCoeff}
            setWeldCoeff={props.setWeldCoeff}
            result={props.result}
            calculateThickness={props.calculateThickness}
          />
        </TabsContent>

        <TabsContent value="pressure">
          <PressureCalculator
            diameter={props.pressureDiameter}
            setDiameter={props.setPressureDiameter}
            wallThickness={props.pressureWallThickness}
            setWallThickness={props.setPressureWallThickness}
            temperature={props.pressureTemperature}
            setTemperature={props.setPressureTemperature}
            material={props.pressureMaterial}
            setMaterial={props.setPressureMaterial}
            weldCoeff={props.pressureWeldCoeff}
            setWeldCoeff={props.setPressureWeldCoeff}
            result={props.allowablePressure}
            calculatePressure={props.calculateAllowablePressure}
          />
        </TabsContent>

        <TabsContent value="flange">
          <FlangeCalculator
            flangeDiameter={props.flangeDiameter}
            setFlangeDiameter={props.setFlangeDiameter}
            flangeThickness={props.flangeThickness}
            setFlangeThickness={props.setFlangeThickness}
            boltDiameter={props.boltDiameter}
            setBoltDiameter={props.setBoltDiameter}
            numBolts={props.numBolts}
            setNumBolts={props.setNumBolts}
            flangeResult={props.flangeResult}
            calculateFlange={props.calculateFlange}
          />
        </TabsContent>

        <TabsContent value="head">
          <HeadCalculator
            headDiameter={props.headDiameter}
            setHeadDiameter={props.setHeadDiameter}
            headPressure={props.headPressure}
            setHeadPressure={props.setHeadPressure}
            headTemperature={props.headTemperature}
            setHeadTemperature={props.setHeadTemperature}
            headMaterial={props.headMaterial}
            setHeadMaterial={props.setHeadMaterial}
            headType={props.headType}
            setHeadType={props.setHeadType}
            headResult={props.headResult}
            calculateHead={props.calculateHead}
          />
        </TabsContent>

        <TabsContent value="support">
          <SupportCalculator
            supportType={props.supportType}
            setSupportType={props.setSupportType}
            vesselDiameter={props.vesselDiameter}
            setVesselDiameter={props.setVesselDiameter}
            vesselLength={props.vesselLength}
            setVesselLength={props.setVesselLength}
            vesselWeight={props.vesselWeight}
            setVesselWeight={props.setVesselWeight}
            supportMaterial={props.supportMaterial}
            setSupportMaterial={props.setSupportMaterial}
            supportResult={props.supportResult}
            calculateSupport={props.calculateSupport}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
