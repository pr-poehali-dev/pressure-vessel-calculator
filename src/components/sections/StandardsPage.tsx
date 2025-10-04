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
  );
}
