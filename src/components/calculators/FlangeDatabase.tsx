import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Icon from '@/components/ui/icon';
import { Separator } from '@/components/ui/separator';
import { standardFlanges } from '@/lib/constants';

interface FlangeDatabaseProps {
  selectedFlangeType: string;
  setSelectedFlangeType: (val: string) => void;
  selectedFlangeDN: string;
  setSelectedFlangeDN: (val: string) => void;
  selectedFlangePN: string;
  setSelectedFlangePN: (val: string) => void;
  applyStandardFlange: () => void;
  setActiveTab: (tab: string) => void;
}

export default function FlangeDatabase({
  selectedFlangeType,
  setSelectedFlangeType,
  selectedFlangeDN,
  setSelectedFlangeDN,
  selectedFlangePN,
  setSelectedFlangePN,
  applyStandardFlange,
  setActiveTab
}: FlangeDatabaseProps) {
  return (
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
  );
}
