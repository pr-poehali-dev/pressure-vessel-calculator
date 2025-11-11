export const materials = [
  { 
    name: '16К', 
    youngModulus: 200000,
    stressByTemp: [
      { temp: 20, stress: 140 },
      { temp: 100, stress: 135 },
      { temp: 150, stress: 132 },
      { temp: 200, stress: 128 },
      { temp: 250, stress: 124 },
      { temp: 300, stress: 120 },
      { temp: 350, stress: 115 },
      { temp: 400, stress: 108 },
    ],
    allowableStress: 140
  },
  { 
    name: 'Сталь 20', 
    youngModulus: 200000,
    stressByTemp: [
      { temp: 20, stress: 147 },
      { temp: 100, stress: 142 },
      { temp: 150, stress: 139 },
      { temp: 200, stress: 135 },
      { temp: 250, stress: 131 },
      { temp: 300, stress: 127 },
      { temp: 350, stress: 121 },
      { temp: 400, stress: 114 },
      { temp: 450, stress: 103 },
    ],
    allowableStress: 147
  },
  { 
    name: '09Г2С', 
    youngModulus: 200000,
    stressByTemp: [
      { temp: 20, stress: 176 },
      { temp: 100, stress: 171 },
      { temp: 150, stress: 167 },
      { temp: 200, stress: 162 },
      { temp: 250, stress: 157 },
      { temp: 300, stress: 152 },
      { temp: 350, stress: 145 },
      { temp: 400, stress: 137 },
    ],
    allowableStress: 176
  },
  { 
    name: '12Х18Н10Т', 
    youngModulus: 200000,
    stressByTemp: [
      { temp: 20, stress: 137 },
      { temp: 100, stress: 131 },
      { temp: 150, stress: 127 },
      { temp: 200, stress: 123 },
      { temp: 250, stress: 120 },
      { temp: 300, stress: 117 },
      { temp: 350, stress: 113 },
      { temp: 400, stress: 110 },
      { temp: 450, stress: 107 },
      { temp: 500, stress: 103 },
      { temp: 550, stress: 100 },
    ],
    allowableStress: 137
  },
  { 
    name: '16ГС', 
    youngModulus: 200000,
    stressByTemp: [
      { temp: 20, stress: 167 },
      { temp: 100, stress: 162 },
      { temp: 150, stress: 158 },
      { temp: 200, stress: 154 },
      { temp: 250, stress: 149 },
      { temp: 300, stress: 144 },
      { temp: 350, stress: 137 },
      { temp: 400, stress: 129 },
    ],
    allowableStress: 167
  },
  { 
    name: '10Г2С1', 
    youngModulus: 200000,
    stressByTemp: [
      { temp: 20, stress: 186 },
      { temp: 100, stress: 180 },
      { temp: 150, stress: 176 },
      { temp: 200, stress: 171 },
      { temp: 250, stress: 166 },
      { temp: 300, stress: 161 },
      { temp: 350, stress: 153 },
      { temp: 400, stress: 145 },
    ],
    allowableStress: 186
  },
  { 
    name: '15Х5М', 
    youngModulus: 200000,
    stressByTemp: [
      { temp: 20, stress: 157 },
      { temp: 100, stress: 152 },
      { temp: 150, stress: 149 },
      { temp: 200, stress: 145 },
      { temp: 250, stress: 142 },
      { temp: 300, stress: 138 },
      { temp: 350, stress: 135 },
      { temp: 400, stress: 131 },
      { temp: 450, stress: 128 },
      { temp: 500, stress: 124 },
    ],
    allowableStress: 157
  },
  { 
    name: '08Х18Н10Т', 
    youngModulus: 200000,
    stressByTemp: [
      { temp: 20, stress: 130 },
      { temp: 100, stress: 124 },
      { temp: 150, stress: 121 },
      { temp: 200, stress: 117 },
      { temp: 250, stress: 114 },
      { temp: 300, stress: 111 },
      { temp: 350, stress: 108 },
      { temp: 400, stress: 105 },
      { temp: 450, stress: 102 },
      { temp: 500, stress: 98 },
      { temp: 550, stress: 95 },
      { temp: 600, stress: 92 },
    ],
    allowableStress: 130
  },
  { 
    name: '10Х17Н13М2Т', 
    youngModulus: 200000,
    stressByTemp: [
      { temp: 20, stress: 147 },
      { temp: 100, stress: 141 },
      { temp: 150, stress: 137 },
      { temp: 200, stress: 133 },
      { temp: 250, stress: 130 },
      { temp: 300, stress: 127 },
      { temp: 350, stress: 123 },
      { temp: 400, stress: 120 },
      { temp: 450, stress: 117 },
      { temp: 500, stress: 113 },
      { temp: 550, stress: 110 },
    ],
    allowableStress: 147
  },
  { 
    name: '12Х18Н12Т', 
    youngModulus: 200000,
    stressByTemp: [
      { temp: 20, stress: 137 },
      { temp: 100, stress: 131 },
      { temp: 150, stress: 128 },
      { temp: 200, stress: 124 },
      { temp: 250, stress: 121 },
      { temp: 300, stress: 118 },
      { temp: 350, stress: 114 },
      { temp: 400, stress: 111 },
      { temp: 450, stress: 108 },
      { temp: 500, stress: 104 },
      { temp: 550, stress: 101 },
      { temp: 600, stress: 98 },
    ],
    allowableStress: 137
  },
  { 
    name: '15ХМ', 
    youngModulus: 200000,
    stressByTemp: [
      { temp: 20, stress: 157 },
      { temp: 100, stress: 152 },
      { temp: 150, stress: 148 },
      { temp: 200, stress: 145 },
      { temp: 250, stress: 141 },
      { temp: 300, stress: 137 },
      { temp: 350, stress: 133 },
      { temp: 400, stress: 129 },
      { temp: 450, stress: 125 },
      { temp: 500, stress: 119 },
    ],
    allowableStress: 157
  },
  { 
    name: '12ХМ', 
    youngModulus: 200000,
    stressByTemp: [
      { temp: 20, stress: 147 },
      { temp: 100, stress: 142 },
      { temp: 150, stress: 139 },
      { temp: 200, stress: 135 },
      { temp: 250, stress: 132 },
      { temp: 300, stress: 128 },
      { temp: 350, stress: 124 },
      { temp: 400, stress: 120 },
      { temp: 450, stress: 116 },
      { temp: 500, stress: 110 },
    ],
    allowableStress: 147
  },
];

export function getAllowableStress(materialName: string, temperature: number): number {
  const material = materials.find(m => m.name === materialName);
  if (!material) return 0;

  const stressData = material.stressByTemp;
  
  if (temperature <= stressData[0].temp) {
    return stressData[0].stress;
  }
  
  if (temperature >= stressData[stressData.length - 1].temp) {
    return stressData[stressData.length - 1].stress;
  }

  for (let i = 0; i < stressData.length - 1; i++) {
    if (temperature >= stressData[i].temp && temperature <= stressData[i + 1].temp) {
      const t1 = stressData[i].temp;
      const t2 = stressData[i + 1].temp;
      const s1 = stressData[i].stress;
      const s2 = stressData[i + 1].stress;
      
      const interpolated = s1 + ((s2 - s1) * (temperature - t1)) / (t2 - t1);
      
      return Math.floor(interpolated * 2) / 2;
    }
  }
  
  return stressData[0].stress;
}

export const standards = [
  { code: 'РД 03-421-01', title: 'Правила безопасной эксплуатации сосудов, работающих под давлением' },
  { code: 'ГОСТ 14249-89', title: 'Сосуды и аппараты. Нормы и методы расчета на прочность' },
  { code: 'ГОСТ 34233.1-2017', title: 'Сосуды и аппараты. Нормы и методы расчета на прочность. Общие требования' },
  { code: 'ГОСТ 34233.2-2017', title: 'Сосуды и аппараты. Нормы и методы расчета на прочность. Расчет цилиндрических и конических обечаек' },
  { code: 'ГОСТ 34233.3-2017', title: 'Сосуды и аппараты. Нормы и методы расчета на прочность. Укрепление отверстий в обечайках и днищах' },
  { code: 'ГОСТ 34233.4-2017', title: 'Сосуды и аппараты. Нормы и методы расчета на прочность. Расчет на прочность и герметичность фланцевых соединений' },
  { code: 'ГОСТ 34233.6-2017', title: 'Сосуды и аппараты. Нормы и методы расчета на прочность. Расчет на прочность при малоцикловых нагрузках' },
  { code: 'ГОСТ 34233.8-2017', title: 'Сосуды и аппараты. Нормы и методы расчета на прочность. Сосуды и аппараты с рубашками' },
  { code: 'ГОСТ 34283-2017', title: 'Сосуды и аппараты. Нормы и методы расчета на прочность при ветровых, сейсмических и других внешних нагрузках' },
];

export const standardFlanges = [
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

export const navigationTabs = [
  { id: 'home', label: 'Главная', icon: 'Home' },
  { id: 'input-data', label: 'Исходные данные', icon: 'ClipboardList' },
  { id: 'calculator', label: 'Расчет обечаек', icon: 'Calculator' },
  { id: 'head-calculator', label: 'Расчет днищ', icon: 'Circle' },
  { id: 'corrosion', label: 'Скорость коррозии', icon: 'Activity' },
  { id: 'lifetime', label: 'Остаточный ресурс', icon: 'Clock' },
  { id: 'flange-db', label: 'База фланцев', icon: 'Database' },
  { id: 'standards', label: 'Нормативы', icon: 'BookOpen' },
  { id: 'docs', label: 'Документация', icon: 'FileText' },
];