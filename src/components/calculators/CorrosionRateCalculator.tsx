import { useState, useRef, useMemo } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import SimpleCorrosionCalculator from './corrosion/SimpleCorrosionCalculator';
import AdvancedCorrosionCalculator, { Measurement } from './corrosion/AdvancedCorrosionCalculator';
import CorrosionResultsDisplay, { CorrosionResult } from './corrosion/CorrosionResultsDisplay';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function CorrosionRateCalculator() {
  const [initialThickness, setInitialThickness] = useState('');
  const [currentThickness, setCurrentThickness] = useState('');
  const [operatingYears, setOperatingYears] = useState('');
  const [rejectionThickness, setRejectionThickness] = useState('');
  const [commissioningDate, setCommissioningDate] = useState('');
  const [advancedInitialThickness, setAdvancedInitialThickness] = useState('');
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [newMeasurementDate, setNewMeasurementDate] = useState('');
  const [newMeasurementThickness, setNewMeasurementThickness] = useState('');
  const [newMeasurementYears, setNewMeasurementYears] = useState('');
  const [result, setResult] = useState<CorrosionResult | null>(null);
  const chartRef = useRef<HTMLDivElement>(null);
  const pdfContentRef = useRef<HTMLDivElement>(null);

  const calculateSimpleRate = () => {
    const s0 = parseFloat(initialThickness);
    const s1 = parseFloat(currentThickness);
    const t = parseFloat(operatingYears);
    const sRej = parseFloat(rejectionThickness);

    if (!s0 || !s1 || !t) {
      return;
    }

    if (s1 >= s0) {
      alert('Текущая толщина не может быть больше или равна начальной');
      return;
    }

    const totalLoss = s0 - s1;
    const corrosionRate = totalLoss / t;
    
    const prediction = {
      oneYear: s1 - corrosionRate * 1,
      fourYears: s1 - corrosionRate * 4,
      eightYears: s1 - corrosionRate * 8,
      tenYears: s1 - corrosionRate * 10,
    };

    let yearsToRejection: number | undefined = undefined;
    if (sRej) {
      if (s1 <= sRej) {
        yearsToRejection = -1;
      } else if (corrosionRate > 0) {
        const remainingThickness = s1 - sRej;
        yearsToRejection = remainingThickness / corrosionRate;
      }
    }

    let recommendation = '';
    if (corrosionRate < 0.1) {
      recommendation = 'Низкая скорость коррозии (< 0.1 мм/год). Срок следующего технического освидетельствования - 4 года (Приказ Ростехнадзора №536 от 15.12.2020).';
    } else if (corrosionRate < 0.2) {
      recommendation = 'Умеренная скорость коррозии (0.1-0.2 мм/год). Срок следующего технического освидетельствования - 2 года (Приказ Ростехнадзора №536 от 15.12.2020).';
    } else if (corrosionRate < 0.5) {
      recommendation = 'Повышенная скорость коррозии (0.2-0.5 мм/год). Необходим ежегодный контроль толщины стенки (Приказ Ростехнадзора №536 от 15.12.2020).';
    } else {
      recommendation = 'ВНИМАНИЕ! Высокая скорость коррозии (> 0.5 мм/год). Требуется немедленная оценка состояния и возможная замена элемента (Приказ Ростехнадзора №536 от 15.12.2020).';
    }

    setResult({
      corrosionRate: Math.round(corrosionRate * 1000) / 1000,
      totalLoss: Math.round(totalLoss * 100) / 100,
      averageRate: Math.round(corrosionRate * 1000) / 1000,
      trend: 'stable',
      prediction: {
        oneYear: Math.round(prediction.oneYear * 100) / 100,
        fourYears: Math.round(prediction.fourYears * 100) / 100,
        eightYears: Math.round(prediction.eightYears * 100) / 100,
        tenYears: Math.round(prediction.tenYears * 100) / 100,
      },
      rejectionThickness: sRej || undefined,
      yearsToRejection: yearsToRejection !== undefined ? Math.round(yearsToRejection * 10) / 10 : undefined,
      recommendation
    });
  };

  const addMeasurement = () => {
    const thickness = parseFloat(newMeasurementThickness);
    const years = parseFloat(newMeasurementYears);

    if (!newMeasurementDate || !thickness || !years) {
      return;
    }

    const newMeasurement: Measurement = {
      id: Date.now().toString(),
      date: newMeasurementDate,
      thickness,
      years
    };

    const updatedMeasurements = [...measurements, newMeasurement].sort((a, b) => a.years - b.years);
    setMeasurements(updatedMeasurements);
    
    setNewMeasurementDate('');
    setNewMeasurementThickness('');
    setNewMeasurementYears('');
  };

  const removeMeasurement = (id: string) => {
    setMeasurements(measurements.filter(m => m.id !== id));
  };

  const calculateAdvancedRate = () => {
    if (measurements.length < 2) {
      return;
    }

    const sortedMeasurements = [...measurements].sort((a, b) => a.years - b.years);
    const sRej = parseFloat(rejectionThickness);
    const s0 = parseFloat(advancedInitialThickness);
    
    const totalLoss = s0 
      ? s0 - sortedMeasurements[sortedMeasurements.length - 1].thickness
      : sortedMeasurements[0].thickness - sortedMeasurements[sortedMeasurements.length - 1].thickness;
    
    const totalTime = s0
      ? sortedMeasurements[sortedMeasurements.length - 1].years
      : sortedMeasurements[sortedMeasurements.length - 1].years - sortedMeasurements[0].years;
    
    const averageRate = totalLoss / totalTime;

    const rates: number[] = [];
    for (let i = 1; i < sortedMeasurements.length; i++) {
      const prevThickness = sortedMeasurements[i - 1].thickness;
      const currThickness = sortedMeasurements[i].thickness;
      
      const minThickness = Math.min(prevThickness, currThickness);
      const maxThickness = Math.max(prevThickness, currThickness);
      
      const deltaThickness = maxThickness - minThickness;
      const deltaTime = sortedMeasurements[i].years - sortedMeasurements[i - 1].years;
      rates.push(deltaThickness / deltaTime);
    }

    let trend: 'increasing' | 'stable' | 'decreasing' = 'stable';
    if (rates.length >= 2) {
      const firstHalf = rates.slice(0, Math.floor(rates.length / 2));
      const secondHalf = rates.slice(Math.floor(rates.length / 2));
      const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
      const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
      
      if (secondAvg > firstAvg * 1.2) {
        trend = 'increasing';
      } else if (secondAvg < firstAvg * 0.8) {
        trend = 'decreasing';
      }
    }

    const currentRate = rates[rates.length - 1];
    const lastThickness = sortedMeasurements[sortedMeasurements.length - 1].thickness;
    
    const prediction = {
      oneYear: lastThickness - currentRate * 1,
      fourYears: lastThickness - currentRate * 4,
      eightYears: lastThickness - currentRate * 8,
      tenYears: lastThickness - currentRate * 10,
    };

    let yearsToRejection: number | undefined = undefined;
    if (sRej) {
      if (lastThickness <= sRej) {
        yearsToRejection = -1;
      } else if (currentRate > 0) {
        const remainingThickness = lastThickness - sRej;
        yearsToRejection = remainingThickness / currentRate;
      }
    }

    let recommendation = '';
    if (trend === 'increasing') {
      recommendation = 'ВНИМАНИЕ! Скорость коррозии увеличивается. Необходимо выявить причину ускорения процесса и принять меры защиты (Приказ Ростехнадзора №536 от 15.12.2020).';
    } else if (trend === 'decreasing') {
      recommendation = 'Скорость коррозии снижается. Возможно, защитные меры эффективны. Продолжайте мониторинг согласно Приказу Ростехнадзора №536 от 15.12.2020.';
    } else {
      if (currentRate < 0.1) {
        recommendation = 'Низкая стабильная скорость коррозии (< 0.1 мм/год). Срок следующего технического освидетельствования - 4 года (Приказ Ростехнадзора №536 от 15.12.2020).';
      } else if (currentRate < 0.2) {
        recommendation = 'Умеренная стабильная скорость коррозии (0.1-0.2 мм/год). Срок следующего технического освидетельствования - 2 года (Приказ Ростехнадзора №536 от 15.12.2020).';
      } else {
        recommendation = 'Повышенная стабильная скорость коррозии (> 0.2 мм/год). Необходим ежегодный контроль и оценка необходимости защитных мер (Приказ Ростехнадзора №536 от 15.12.2020).';
      }
    }

    setResult({
      corrosionRate: Math.round(currentRate * 1000) / 1000,
      totalLoss: Math.round(totalLoss * 100) / 100,
      averageRate: Math.round(averageRate * 1000) / 1000,
      trend,
      prediction: {
        oneYear: Math.round(prediction.oneYear * 100) / 100,
        fourYears: Math.round(prediction.fourYears * 100) / 100,
        eightYears: Math.round(prediction.eightYears * 100) / 100,
        tenYears: Math.round(prediction.tenYears * 100) / 100,
      },
      rejectionThickness: sRej || undefined,
      yearsToRejection: yearsToRejection !== undefined ? Math.round(yearsToRejection * 10) / 10 : undefined,
      recommendation
    });
  };

  const getTrendIcon = (trend: 'increasing' | 'stable' | 'decreasing') => {
    switch (trend) {
      case 'increasing':
        return 'TrendingUp';
      case 'decreasing':
        return 'TrendingDown';
      case 'stable':
        return 'Minus';
    }
  };

  const getTrendColor = (trend: 'increasing' | 'stable' | 'decreasing') => {
    switch (trend) {
      case 'increasing':
        return 'text-red-600';
      case 'decreasing':
        return 'text-green-600';
      case 'stable':
        return 'text-blue-600';
    }
  };

  const getTrendText = (trend: 'increasing' | 'stable' | 'decreasing') => {
    switch (trend) {
      case 'increasing':
        return 'Ускоряется';
      case 'decreasing':
        return 'Замедляется';
      case 'stable':
        return 'Стабильная';
    }
  };

  const chartData = useMemo(() => {
    if (!result) return [];

    const data = [];
    const rejThickness = result.rejectionThickness;

    if (measurements.length >= 2) {
      const sortedMeasurements = [...measurements].sort((a, b) => a.years - b.years);
      const s0 = parseFloat(advancedInitialThickness);
      
      if (s0) {
        data.push({
          year: 0,
          actual: s0,
          predicted: null,
          rejection: rejThickness || null
        });
      }
      
      for (const m of sortedMeasurements) {
        data.push({
          year: m.years,
          actual: m.thickness,
          predicted: null,
          rejection: rejThickness || null
        });
      }

      const lastMeasurement = sortedMeasurements[sortedMeasurements.length - 1];
      const futureYears = [1, 4, 8, 10];
      
      for (const deltaYear of futureYears) {
        const futureYear = lastMeasurement.years + deltaYear;
        const predictedThickness = lastMeasurement.thickness - result.corrosionRate * deltaYear;
        
        data.push({
          year: futureYear,
          actual: null,
          predicted: Math.max(0, predictedThickness),
          rejection: rejThickness || null
        });
      }
    } else if (initialThickness && currentThickness && operatingYears) {
      const s0 = parseFloat(initialThickness);
      const years = parseFloat(operatingYears);
      
      data.push({
        year: 0,
        actual: s0,
        predicted: null,
        rejection: rejThickness || null
      });
      
      data.push({
        year: years,
        actual: parseFloat(currentThickness),
        predicted: null,
        rejection: rejThickness || null
      });

      const futureYears = [years + 1, years + 4, years + 8, years + 10];
      for (const futureYear of futureYears) {
        const deltaYear = futureYear - years;
        const predictedThickness = parseFloat(currentThickness) - result.corrosionRate * deltaYear;
        
        data.push({
          year: futureYear,
          actual: null,
          predicted: Math.max(0, predictedThickness),
          rejection: rejThickness || null
        });
      }
    }

    return data;
  }, [result, measurements, initialThickness, currentThickness, operatingYears, rejectionThickness, advancedInitialThickness]);

  const exportToPDF = async () => {
    if (!result || !pdfContentRef.current) return;

    try {
      const canvas = await html2canvas(pdfContentRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
        useCORS: true,
        allowTaint: true
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;
      
      const imgWidth = pageWidth - (margin * 2);
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = margin;

      pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
      heightLeft -= pageHeight - (margin * 2);

      while (heightLeft > 0) {
        position = heightLeft - imgHeight + margin;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
        heightLeft -= pageHeight - (margin * 2);
      }

      pdf.save(`corrosion-report-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-2 gap-6">
        <SimpleCorrosionCalculator
          initialThickness={initialThickness}
          setInitialThickness={setInitialThickness}
          currentThickness={currentThickness}
          setCurrentThickness={setCurrentThickness}
          operatingYears={operatingYears}
          setOperatingYears={setOperatingYears}
          rejectionThickness={rejectionThickness}
          setRejectionThickness={setRejectionThickness}
          commissioningDate={commissioningDate}
          setCommissioningDate={setCommissioningDate}
          onCalculate={calculateSimpleRate}
        />

        <AdvancedCorrosionCalculator
          measurements={measurements}
          newMeasurementDate={newMeasurementDate}
          setNewMeasurementDate={setNewMeasurementDate}
          newMeasurementThickness={newMeasurementThickness}
          setNewMeasurementThickness={setNewMeasurementThickness}
          newMeasurementYears={newMeasurementYears}
          setNewMeasurementYears={setNewMeasurementYears}
          initialThickness={advancedInitialThickness}
          setInitialThickness={setAdvancedInitialThickness}
          rejectionThickness={rejectionThickness}
          setRejectionThickness={setRejectionThickness}
          commissioningDate={commissioningDate}
          setCommissioningDate={setCommissioningDate}
          onAddMeasurement={addMeasurement}
          onRemoveMeasurement={removeMeasurement}
          onCalculate={calculateAdvancedRate}
        />
      </div>

      {result && (
        <>
          <CorrosionResultsDisplay
            result={result}
            chartData={chartData}
            chartRef={chartRef}
            onExportPDF={exportToPDF}
            getTrendIcon={getTrendIcon}
            getTrendColor={getTrendColor}
            getTrendText={getTrendText}
          />

          {/* Скрытый элемент для PDF экспорта */}
          <div style={{ position: 'absolute', left: '-9999px', width: '210mm' }}>
            <div ref={pdfContentRef} style={{ backgroundColor: 'white', padding: '20mm' }}>
              {/* Заголовок */}
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>
                  ОТЧЕТ ПО АНАЛИЗУ КОРРОЗИИ
                </h1>
                <p style={{ fontSize: '12px', color: '#666' }}>
                  Дата: {new Date().toLocaleDateString('ru-RU')}
                </p>
              </div>

              {/* Основные показатели */}
              <div style={{ marginBottom: '20px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px' }}>
                  ПОКАЗАТЕЛИ КОРРОЗИИ
                </h2>
                
                {(initialThickness || advancedInitialThickness) && (
                  <div style={{ padding: '12px', backgroundColor: '#f0fdf4', borderRadius: '8px', marginBottom: '12px' }}>
                    <div style={{ fontSize: '12px', color: '#16a34a', marginBottom: '4px' }}>
                      Начальная толщина при вводе в эксплуатацию
                    </div>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#15803d' }}>
                      {initialThickness || advancedInitialThickness} мм
                    </div>
                  </div>
                )}
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div style={{ padding: '12px', backgroundColor: '#fff7ed', borderRadius: '8px' }}>
                    <div style={{ fontSize: '12px', color: '#ea580c', marginBottom: '4px' }}>
                      Текущая скорость коррозии
                    </div>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#c2410c' }}>
                      {result.corrosionRate} мм/год
                    </div>
                  </div>
                  <div style={{ padding: '12px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                    <div style={{ fontSize: '12px', color: '#475569', marginBottom: '4px' }}>
                      Средняя скорость коррозии
                    </div>
                    <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
                      {result.averageRate} мм/год
                    </div>
                  </div>
                  <div style={{ padding: '12px', backgroundColor: '#fef2f2', borderRadius: '8px' }}>
                    <div style={{ fontSize: '12px', color: '#dc2626', marginBottom: '4px' }}>
                      Общая потеря толщины
                    </div>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#b91c1c' }}>
                      {result.totalLoss} мм
                    </div>
                  </div>
                  <div style={{ 
                    padding: '12px', 
                    backgroundColor: result.trend === 'increasing' ? '#fef2f2' : 
                                     result.trend === 'decreasing' ? '#f0fdf4' : '#eff6ff',
                    borderRadius: '8px' 
                  }}>
                    <div style={{ fontSize: '12px', color: '#475569', marginBottom: '4px' }}>
                      Тренд
                    </div>
                    <div style={{ 
                      fontSize: '18px', 
                      fontWeight: 'bold',
                      color: result.trend === 'increasing' ? '#dc2626' : 
                             result.trend === 'decreasing' ? '#16a34a' : '#2563eb'
                    }}>
                      {getTrendText(result.trend)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Прогноз толщины */}
              <div style={{ marginBottom: '20px', padding: '16px', backgroundColor: '#eff6ff', borderRadius: '8px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px', color: '#1e3a8a' }}>
                  ПРОГНОЗ ТОЛЩИНЫ СТЕНКИ
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '12px' }}>
                  <div>
                    <div style={{ fontSize: '11px', color: '#2563eb', marginBottom: '4px' }}>Через 1 год</div>
                    <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#1e3a8a' }}>
                      {result.prediction.oneYear} мм
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: '#2563eb', marginBottom: '4px' }}>Через 4 года</div>
                    <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#1e3a8a' }}>
                      {result.prediction.fourYears} мм
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: '#2563eb', marginBottom: '4px' }}>Через 8 лет</div>
                    <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#1e3a8a' }}>
                      {result.prediction.eightYears} мм
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: '#2563eb', marginBottom: '4px' }}>Через 10 лет</div>
                    <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#1e3a8a' }}>
                      {result.prediction.tenYears} мм
                    </div>
                  </div>
                </div>
              </div>

              {/* Отбраковочная толщина */}
              {result.rejectionThickness !== undefined && (
                <div style={{ marginBottom: '20px', padding: '16px', backgroundColor: '#fef2f2', borderRadius: '8px', border: '2px solid #fecaca' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px', color: '#991b1b' }}>
                    ПРОГНОЗ ДОСТИЖЕНИЯ ОТБРАКОВОЧНОЙ ТОЛЩИНЫ
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <div style={{ fontSize: '11px', color: '#dc2626', marginBottom: '4px' }}>
                        Отбраковочная толщина
                      </div>
                      <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#991b1b' }}>
                        {result.rejectionThickness.toFixed(2)} мм
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '11px', color: '#dc2626', marginBottom: '4px' }}>
                        Достижение отбраковки
                      </div>
                      <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#991b1b' }}>
                        {result.yearsToRejection !== undefined && result.yearsToRejection > 0 
                          ? `${result.yearsToRejection.toFixed(1)} лет`
                          : 'УЖЕ ДОСТИГНУТА'}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* График */}
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px' }}>
                  ГРАФИК ИЗМЕНЕНИЯ ТОЛЩИНЫ
                </h3>
                <div style={{ width: '100%', height: '300px', backgroundColor: '#f8fafc', padding: '12px', borderRadius: '8px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis 
                        dataKey="year" 
                        label={{ value: 'Срок эксплуатации (лет)', position: 'insideBottom', offset: -5 }}
                        stroke="#64748b"
                      />
                      <YAxis 
                        label={{ value: 'Толщина (мм)', angle: -90, position: 'insideLeft' }}
                        stroke="#64748b"
                      />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                        formatter={(value: number) => `${value.toFixed(2)} мм`}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="actual" 
                        stroke="#3b82f6" 
                        strokeWidth={2}
                        dot={{ fill: '#3b82f6', r: 5 }}
                        name="Фактические измерения"
                        connectNulls={false}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="predicted" 
                        stroke="#f97316" 
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        dot={{ fill: '#f97316', r: 4 }}
                        name="Прогноз"
                        connectNulls={false}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="rejection" 
                        stroke="#ef4444" 
                        strokeWidth={2}
                        strokeDasharray="3 3"
                        dot={false}
                        name="Отбраковочная толщина"
                        connectNulls={true}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Рекомендации */}
              <div style={{ padding: '16px', backgroundColor: '#fffbeb', borderRadius: '8px', border: '2px solid #fde68a' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '8px', color: '#92400e' }}>
                  РЕКОМЕНДАЦИИ
                </h3>
                <p style={{ fontSize: '12px', lineHeight: '1.6', color: '#1f2937' }}>
                  {result.recommendation}
                </p>
              </div>

              {/* Футер */}
              <div style={{ marginTop: '20px', paddingTop: '12px', borderTop: '1px solid #e5e7eb' }}>
                <div style={{ fontSize: '9px', color: '#6b7280', lineHeight: '1.5' }}>
                  <p>ℹ️ Скорость коррозии определена по методике ГОСТ 9.908-85</p>
                  <p>ℹ️ Прогноз основан на линейной экстраполяции текущей скорости</p>
                  <p>ℹ️ Сроки технического освидетельствования установлены Приказом Ростехнадзора №536 от 15.12.2020</p>
                  <p>ℹ️ Для точной оценки проводите УЗК-контроль в соответствии с графиком</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}