import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface PDFExportProps {
  diameter: string;
  pressure: string;
  temperature: string;
  material: string;
  wallThickness: number | null;
  headType: string;
  headDiameter: string;
  headPressure: string;
  headTemperature: string;
  headMaterial: string;
  headThickness: number | null;
}

export default function PDFExport(props: PDFExportProps) {
  const generatePDF = async () => {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 15;
    let yPos = margin;

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(18);
    pdf.text('Расчет сосуда под давлением', pageWidth / 2, yPos, { align: 'center' });
    yPos += 12;

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Дата расчета: ${new Date().toLocaleDateString('ru-RU')}`, pageWidth / 2, yPos, { align: 'center' });
    yPos += 15;

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(14);
    pdf.text('1. Расчет цилиндрической обечайки', margin, yPos);
    yPos += 8;

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(11);
    
    const wallData = [
      ['Параметр', 'Значение'],
      ['Внутренний диаметр D, мм', props.diameter],
      ['Расчетное давление P, МПа', props.pressure],
      ['Расчетная температура T, °C', props.temperature],
      ['Материал', props.material],
      ['Расчетная толщина стенки s, мм', props.wallThickness?.toFixed(2) || 'Не рассчитано'],
    ];

    drawTable(pdf, wallData, margin, yPos, pageWidth - 2 * margin);
    yPos += (wallData.length * 8) + 10;

    if (props.headThickness) {
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.text('2. Расчет днища', margin, yPos);
      yPos += 8;

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(11);

      const headTypeNames: Record<string, string> = {
        'elliptical': 'Эллиптическое',
        'hemispherical': 'Полусферическое',
        'flat': 'Плоское'
      };

      const headData = [
        ['Параметр', 'Значение'],
        ['Тип днища', headTypeNames[props.headType] || props.headType],
        ['Диаметр D, мм', props.headDiameter],
        ['Давление P, МПа', props.headPressure],
        ['Температура T, °C', props.headTemperature],
        ['Материал', props.headMaterial],
        ['Расчетная толщина s, мм', props.headThickness?.toFixed(2) || 'Не рассчитано'],
      ];

      drawTable(pdf, headData, margin, yPos, pageWidth - 2 * margin);
      yPos += (headData.length * 8) + 10;
    }

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(14);
    pdf.text('3. Нормативные документы', margin, yPos);
    yPos += 8;

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.text('• ГОСТ 14249-89: Сосуды и аппараты. Нормы и методы расчета на прочность', margin + 5, yPos);
    yPos += 6;
    pdf.text('• ГОСТ 34233.1-2017: Сосуды и аппараты. Общие требования', margin + 5, yPos);
    yPos += 15;

    const visualElement = document.querySelector('[data-pdf-visual]');
    if (visualElement) {
      try {
        const canvas = await html2canvas(visualElement as HTMLElement, {
          scale: 2,
          backgroundColor: '#1e293b',
        });
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = pageWidth - 2 * margin;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        if (yPos + imgHeight > pageHeight - margin) {
          pdf.addPage();
          yPos = margin;
        }

        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(14);
        pdf.text('4. Визуализация сосуда', margin, yPos);
        yPos += 8;

        pdf.addImage(imgData, 'PNG', margin, yPos, imgWidth, imgHeight);
      } catch (error) {
        console.error('Ошибка добавления визуализации:', error);
      }
    }

    pdf.save(`Расчет_сосуда_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  function drawTable(pdf: jsPDF, data: string[][], x: number, y: number, width: number) {
    const colWidths = [width * 0.6, width * 0.4];
    const rowHeight = 8;

    data.forEach((row, i) => {
      if (i === 0) {
        pdf.setFillColor(59, 130, 246);
        pdf.setTextColor(255, 255, 255);
        pdf.setFont('helvetica', 'bold');
      } else {
        pdf.setFillColor(i % 2 === 0 ? 248 : 255);
        pdf.setTextColor(0, 0, 0);
        pdf.setFont('helvetica', 'normal');
      }

      pdf.rect(x, y + i * rowHeight, colWidths[0], rowHeight, 'FD');
      pdf.rect(x + colWidths[0], y + i * rowHeight, colWidths[1], rowHeight, 'FD');

      pdf.text(row[0], x + 3, y + i * rowHeight + 5.5);
      pdf.text(row[1], x + colWidths[0] + 3, y + i * rowHeight + 5.5);
    });

    pdf.setTextColor(0, 0, 0);
  }

  return (
    <Button onClick={generatePDF} variant="default" className="w-full">
      <Icon name="FileDown" size={18} className="mr-2" />
      Экспорт в PDF
    </Button>
  );
}
