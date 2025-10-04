import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';
import { standards, materials } from '@/lib/constants';

export default function StandardsPage() {
  return (
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
          <CardDescription>Допускаемые напряжения при различных температурах</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {materials.map((mat, i) => (
            <div key={i} className="border rounded-lg p-4">
              <h3 className="font-semibold font-mono text-lg mb-3">{mat.name}</h3>
              <div className="mb-3 text-sm text-slate-600">
                Модуль упругости: <span className="font-mono font-semibold">{mat.youngModulus.toLocaleString()} МПа</span>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-mono">Температура, °C</TableHead>
                    <TableHead className="font-mono">Допускаемое напряжение, МПа</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mat.stressByTemp.map((data, j) => (
                    <TableRow key={j}>
                      <TableCell className="font-mono">{data.temp}</TableCell>
                      <TableCell className="font-mono font-semibold">{data.stress}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}