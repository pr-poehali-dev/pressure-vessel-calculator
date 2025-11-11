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
  const [rejectionThickness, setRejectionThickness] = useState('');
  const [commissioningDate, setCommissioningDate] = useState('');
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
    const sRej = parseFloat(rejectionThickness);

    if (!s0 || !s1 || !t || s1 >= s0) {
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
    if (sRej && corrosionRate > 0) {
      const remainingThickness = s1 - sRej;
      yearsToRejection = remainingThickness / corrosionRate;
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
      fourYears: lastThickness - currentRate * 4,
      eightYears: lastThickness - currentRate * 8,
      tenYears: lastThickness - currentRate * 10,
    };

    let yearsToRejection: number | undefined = undefined;
    if (sRej && currentRate > 0) {
      const remainingThickness = lastThickness - sRej;
      yearsToRejection = remainingThickness / currentRate;
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
  }, [result, measurements, initialThickness, currentThickness, operatingYears, rejectionThickness]);

  const exportToPDF = async () => {
    if (!result || !chartRef.current) return;

    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 15;
      let yPosition = margin;

      // Заголовок
      pdf.setFontSize(18);
      pdf.setFont('helvetica', 'bold');
      pdf.text('ОТЧЕТ ПО АНАЛИЗУ КОРРОЗИИ', pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 10;

      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Дата: ${new Date().toLocaleDateString('ru-RU')}`, pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 15;

      // Основные показатели коррозии
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('ПОКАЗАТЕЛИ КОРРОЗИИ', margin, yPosition);
      yPosition += 8;

      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      
      // Текущая скорость коррозии
      pdf.setTextColor(255, 112, 0);
      pdf.text(`Текущая скорость коррозии: ${result.corrosionRate} мм/год`, margin, yPosition);
      yPosition += 7;
      
      // Средняя скорость коррозии
      pdf.setTextColor(0, 0, 0);
      pdf.text(`Средняя скорость коррозии: ${result.averageRate} мм/год`, margin, yPosition);
      yPosition += 7;
      
      // Общая потеря толщины
      pdf.setTextColor(220, 38, 38);
      pdf.text(`Общая потеря толщины: ${result.totalLoss} мм`, margin, yPosition);
      yPosition += 7;
      
      // Тренд
      pdf.setTextColor(0, 0, 0);
      let trendText = '';
      if (result.trend === 'increasing') {
        trendText = 'Тренд: Ускоряется ↗';
        pdf.setTextColor(220, 38, 38);
      } else if (result.trend === 'decreasing') {
        trendText = 'Тренд: Замедляется ↘';
        pdf.setTextColor(22, 163, 74);
      } else {
        trendText = 'Тренд: Стабильная →';
        pdf.setTextColor(37, 99, 235);
      }
      pdf.text(trendText, margin, yPosition);
      yPosition += 12;

      // Прогноз толщины
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('ПРОГНОЗ ТОЛЩИНЫ СТЕНКИ', margin, yPosition);
      yPosition += 8;

      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Через 1 год: ${result.prediction.oneYear} мм`, margin, yPosition);
      yPosition += 6;
      pdf.text(`Через 4 года: ${result.prediction.fourYears} мм`, margin, yPosition);
      yPosition += 6;
      pdf.text(`Через 8 лет: ${result.prediction.eightYears} мм`, margin, yPosition);
      yPosition += 6;
      pdf.text(`Через 10 лет: ${result.prediction.tenYears} мм`, margin, yPosition);
      yPosition += 12;

      // Отбраковочная толщина (если указана)
      if (result.rejectionThickness !== undefined) {
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(220, 38, 38);
        pdf.text('ПРОГНОЗ ДОСТИЖЕНИЯ ОТБРАКОВКИ', margin, yPosition);
        yPosition += 8;

        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(0, 0, 0);
        pdf.text(`Отбраковочная толщина: ${result.rejectionThickness.toFixed(2)} мм`, margin, yPosition);
        yPosition += 6;
        
        if (result.yearsToRejection !== undefined && result.yearsToRejection > 0) {
          pdf.text(`Достижение отбраковки через: ${result.yearsToRejection.toFixed(1)} лет`, margin, yPosition);
        } else {
          pdf.setTextColor(220, 38, 38);
          pdf.setFont('helvetica', 'bold');
          pdf.text('ОТБРАКОВОЧНАЯ ТОЛЩИНА УЖЕ ДОСТИГНУТА!', margin, yPosition);
          pdf.setFont('helvetica', 'normal');
        }
        yPosition += 12;
      }

      // График
      const element = chartRef.current.parentElement;
      if (element) {
        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text('ГРАФИК ИЗМЕНЕНИЯ ТОЛЩИНЫ', margin, yPosition);
        yPosition += 8;

        const canvas = await html2canvas(element, {
          scale: 2,
          backgroundColor: '#ffffff',
          logging: false,
          useCORS: true,
          allowTaint: true
        });

        const imgData = canvas.toDataURL('image/png');
        const imgWidth = pageWidth - (margin * 2);
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        if (yPosition + imgHeight > 280) {
          pdf.addPage();
          yPosition = margin;
        }

        pdf.addImage(imgData, 'PNG', margin, yPosition, imgWidth, imgHeight);
        yPosition += imgHeight + 10;
      }

      // Рекомендации
      if (yPosition > 240) {
        pdf.addPage();
        yPosition = margin;
      }

      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(245, 158, 11);
      pdf.text('РЕКОМЕНДАЦИИ', margin, yPosition);
      yPosition += 8;

      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(0, 0, 0);
      
      const splitRecommendation = pdf.splitTextToSize(result.recommendation, pageWidth - margin * 2);
      pdf.text(splitRecommendation, margin, yPosition);
      yPosition += splitRecommendation.length * 5 + 10;

      // Футер
      pdf.setFontSize(8);
      pdf.setTextColor(128, 128, 128);
      const footer = [
        'ℹ️ Скорость коррозии определена по методике ГОСТ 9.908-85',
        'ℹ️ Прогноз основан на линейной экстраполяции текущей скорости',
        'ℹ️ Сроки технического освидетельствования установлены Приказом Ростехнадзора №536 от 15.12.2020',
        'ℹ️ Для точной оценки проводите УЗК-контроль в соответствии с графиком'
      ];
      
      if (yPosition > 260) {
        pdf.addPage();
        yPosition = margin;
      }
      
      footer.forEach(line => {
        pdf.text(line, margin, yPosition);
        yPosition += 4;
      });

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