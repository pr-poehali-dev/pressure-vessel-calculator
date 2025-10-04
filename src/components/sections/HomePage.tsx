import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { materials } from '@/lib/constants';

export default function HomePage() {
  return (
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
  );
}
