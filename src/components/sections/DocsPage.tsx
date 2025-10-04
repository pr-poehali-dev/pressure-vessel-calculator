import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Separator } from '@/components/ui/separator';

export default function DocsPage() {
  return (
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
  );
}
