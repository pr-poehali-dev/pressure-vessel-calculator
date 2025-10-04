export const materials = [
  { name: 'Сталь 20', allowableStress: 142, youngModulus: 200000 },
  { name: '09Г2С', allowableStress: 165, youngModulus: 200000 },
  { name: '12Х18Н10Т', allowableStress: 133, youngModulus: 200000 },
  { name: '16ГС', allowableStress: 157, youngModulus: 200000 },
];

export const standards = [
  { code: 'ГОСТ 14249-89', title: 'Сосуды и аппараты. Нормы и методы расчета на прочность' },
  { code: 'ГОСТ 34233.1-2017', title: 'Сосуды и аппараты. Нормы и методы расчета на прочность. Общие требования' },
  { code: 'ГОСТ 52857.1-2007', title: 'Сосуды и аппараты. Нормы и методы расчета на прочность. Расчет цилиндрических и конических обечаек' },
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
  { id: 'calculator', label: 'Стенка', icon: 'Calculator' },
  { id: 'flange', label: 'Фланцы', icon: 'Disc' },
  { id: 'head', label: 'Днища', icon: 'Circle' },
  { id: 'support', label: 'Опоры', icon: 'Columns3' },
  { id: 'flange-db', label: 'База фланцев', icon: 'Database' },
  { id: 'standards', label: 'Нормативы', icon: 'BookOpen' },
  { id: 'docs', label: 'Документация', icon: 'FileText' },
];
