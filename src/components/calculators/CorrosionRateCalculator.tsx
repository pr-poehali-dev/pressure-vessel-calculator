import { useState, useRef, useMemo } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import SimpleCorrosionCalculator from './corrosion/SimpleCorrosionCalculator';
import AdvancedCorrosionCalculator, { Measurement } from './corrosion/AdvancedCorrosionCalculator';
import CorrosionResultsDisplay, { CorrosionResult } from './corrosion/CorrosionResultsDisplay';

export default function CorrosionRateCalculator() {
  const [initialThickness, setInitialThickness] = useState('');
  const [currentThickness, setCurrentThickness] = useState('');
  const [operatingYears, setOperatingYears] = useState('');
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [newMeasurementDate, setNewMeasurementDate] = useState('');
  const [newMeasurementThickness, setNewMeasurementThickness] = useState('');
  const [newMeasurementYears, setNewMeasurementYears] = useState('');
  const [result, setResult] = useState<CorrosionResult | null>(null);
  const chartRef = useRef<HTMLDivElement>(null);

  const calculateSimpleRate = () => {
    const s0 = parseFloat(initialThickness);
    const s1 = parseFloat(currentThickness);
    const t = parseFloat(operatingYears);

    if (!s0 || !s1 || !t || s1 >= s0) {
      return;
    }

    const totalLoss = s0 - s1;
    const corrosionRate = totalLoss / t;
    
    const prediction = {
      oneYear: s1 - corrosionRate * 1,
      fiveYears: s1 - corrosionRate * 5,
      tenYears: s1 - corrosionRate * 10,
    };

    let recommendation = '';
    if (corrosionRate < 0.1) {
      recommendation = 'Низкая скорость коррозии. Продолжайте регулярный контроль каждые 4-5 лет.';
    } else if (corrosionRate < 0.2) {
      recommendation = 'Умеренная скорость коррозии. Рекомендуется контроль каждые 2-3 года.';
    } else if (corrosionRate < 0.5) {
      recommendation = 'Повышенная скорость коррозии. Необходим ежегодный контроль толщины стенки.';
    } else {
      recommendation = 'ВНИМАНИЕ! Высокая скорость коррозии. Требуется немедленная оценка состояния и возможная замена элемента.';
    }

    setResult({
      corrosionRate: Math.round(corrosionRate * 1000) / 1000,
      totalLoss: Math.round(totalLoss * 100) / 100,
      averageRate: Math.round(corrosionRate * 1000) / 1000,
      trend: 'stable',
      prediction: {
        oneYear: Math.round(prediction.oneYear * 100) / 100,
        fiveYears: Math.round(prediction.fiveYears * 100) / 100,
        tenYears: Math.round(prediction.tenYears * 100) / 100,
      },
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
    
    const totalLoss = sortedMeasurements[0].thickness - sortedMeasurements[sortedMeasurements.length - 1].thickness;
    const totalTime = sortedMeasurements[sortedMeasurements.length - 1].years - sortedMeasurements[0].years;
    const averageRate = totalLoss / totalTime;

    const rates: number[] = [];
    for (let i = 1; i < sortedMeasurements.length; i++) {
      const deltaThickness = sortedMeasurements[i - 1].thickness - sortedMeasurements[i].thickness;
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
      fiveYears: lastThickness - currentRate * 5,
      tenYears: lastThickness - currentRate * 10,
    };

    let recommendation = '';
    if (trend === 'increasing') {
      recommendation = 'ВНИМАНИЕ! Скорость коррозии увеличивается. Необходимо выявить причину ускорения процесса и принять меры защиты.';
    } else if (trend === 'decreasing') {
      recommendation = 'Скорость коррозии снижается. Возможно, защитные меры эффективны. Продолжайте мониторинг.';
    } else {
      if (currentRate < 0.1) {
        recommendation = 'Низкая стабильная скорость коррозии. Продолжайте регулярный контроль каждые 4-5 лет.';
      } else if (currentRate < 0.2) {
        recommendation = 'Умеренная стабильная скорость коррозии. Рекомендуется контроль каждые 2-3 года.';
      } else {
        recommendation = 'Повышенная стабильная скорость коррозии. Необходим ежегодный контроль и оценка необходимости защитных мер.';
      }
    }

    setResult({
      corrosionRate: Math.round(currentRate * 1000) / 1000,
      totalLoss: Math.round(totalLoss * 100) / 100,
      averageRate: Math.round(averageRate * 1000) / 1000,
      trend,
      prediction: {
        oneYear: Math.round(prediction.oneYear * 100) / 100,
        fiveYears: Math.round(prediction.fiveYears * 100) / 100,
        tenYears: Math.round(prediction.tenYears * 100) / 100,
      },
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

    if (measurements.length >= 2) {
      const sortedMeasurements = [...measurements].sort((a, b) => a.years - b.years);
      
      for (const m of sortedMeasurements) {
        data.push({
          year: m.years,
          actual: m.thickness,
          predicted: null
        });
      }

      const lastMeasurement = sortedMeasurements[sortedMeasurements.length - 1];
      const futureYears = [1, 5, 10];
      
      for (const deltaYear of futureYears) {
        const futureYear = lastMeasurement.years + deltaYear;
        const predictedThickness = lastMeasurement.thickness - result.corrosionRate * deltaYear;
        
        data.push({
          year: futureYear,
          actual: null,
          predicted: Math.max(0, predictedThickness)
        });
      }
    } else if (initialThickness && currentThickness && operatingYears) {
      const s0 = parseFloat(initialThickness);
      const years = parseFloat(operatingYears);
      
      data.push({
        year: 0,
        actual: s0,
        predicted: null
      });
      
      data.push({
        year: years,
        actual: parseFloat(currentThickness),
        predicted: null
      });

      const futureYears = [years + 1, years + 5, years + 10];
      for (const futureYear of futureYears) {
        const deltaYear = futureYear - years;
        const predictedThickness = parseFloat(currentThickness) - result.corrosionRate * deltaYear;
        
        data.push({
          year: futureYear,
          actual: null,
          predicted: Math.max(0, predictedThickness)
        });
      }
    }

    return data;
  }, [result, measurements, initialThickness, currentThickness, operatingYears]);

  const exportToPDF = async () => {
    if (!result || !chartRef.current) return;

    try {
      const element = chartRef.current.parentElement;
      if (!element) return;

      const canvas = await html2canvas(element, {
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
          onAddMeasurement={addMeasurement}
          onRemoveMeasurement={removeMeasurement}
          onCalculate={calculateAdvancedRate}
        />
      </div>

      {result && (
        <CorrosionResultsDisplay
          result={result}
          chartData={chartData}
          chartRef={chartRef}
          onExportPDF={exportToPDF}
          getTrendIcon={getTrendIcon}
          getTrendColor={getTrendColor}
          getTrendText={getTrendText}
        />
      )}
    </div>
  );
}