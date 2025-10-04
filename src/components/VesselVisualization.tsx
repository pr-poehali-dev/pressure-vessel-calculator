import { useEffect, useRef } from 'react';

interface VesselVisualizationProps {
  diameter: number;
  thickness: number;
  pressure: number;
}

export default function VesselVisualization({ diameter, thickness, pressure }: VesselVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    const scale = Math.min(width, height) * 0.35;
    const centerX = width / 2;
    const centerY = height / 2;

    const outerRadius = scale;
    const innerRadius = outerRadius * (diameter / (diameter + 2 * thickness));
    const vesselHeight = scale * 2.2;

    ctx.strokeStyle = '#2563EB';
    ctx.fillStyle = '#EFF6FF';
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(centerX - outerRadius, centerY - vesselHeight / 2);
    ctx.lineTo(centerX - outerRadius, centerY + vesselHeight / 2);
    ctx.arc(centerX, centerY + vesselHeight / 2, outerRadius, Math.PI, 0, false);
    ctx.lineTo(centerX + outerRadius, centerY - vesselHeight / 2);
    ctx.arc(centerX, centerY - vesselHeight / 2, outerRadius, 0, Math.PI, false);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = '#3B82F6';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(centerX - innerRadius, centerY - vesselHeight / 2);
    ctx.lineTo(centerX - innerRadius, centerY + vesselHeight / 2);
    ctx.arc(centerX, centerY + vesselHeight / 2, innerRadius, Math.PI, 0, false);
    ctx.lineTo(centerX + innerRadius, centerY - vesselHeight / 2);
    ctx.arc(centerX, centerY - vesselHeight / 2, innerRadius, 0, Math.PI, false);
    ctx.closePath();
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.strokeStyle = '#64748B';
    ctx.lineWidth = 1;
    ctx.fillStyle = '#64748B';
    ctx.font = '11px "Roboto Mono", monospace';
    ctx.textAlign = 'center';

    const arrowY = centerY;
    ctx.beginPath();
    ctx.moveTo(centerX - outerRadius - 30, arrowY);
    ctx.lineTo(centerX + outerRadius + 30, arrowY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(centerX - outerRadius - 30, arrowY);
    ctx.lineTo(centerX - outerRadius - 25, arrowY - 4);
    ctx.lineTo(centerX - outerRadius - 25, arrowY + 4);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(centerX + outerRadius + 30, arrowY);
    ctx.lineTo(centerX + outerRadius + 25, arrowY - 4);
    ctx.lineTo(centerX + outerRadius + 25, arrowY + 4);
    ctx.closePath();
    ctx.fill();

    ctx.fillText(`D = ${diameter} мм`, centerX, arrowY - 10);

    const thicknessArrowX = centerX + outerRadius + 60;
    ctx.beginPath();
    ctx.moveTo(thicknessArrowX, centerY - outerRadius);
    ctx.lineTo(thicknessArrowX, centerY - innerRadius);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(thicknessArrowX, centerY - outerRadius);
    ctx.lineTo(thicknessArrowX - 4, centerY - outerRadius + 5);
    ctx.lineTo(thicknessArrowX + 4, centerY - outerRadius + 5);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(thicknessArrowX, centerY - innerRadius);
    ctx.lineTo(thicknessArrowX - 4, centerY - innerRadius - 5);
    ctx.lineTo(thicknessArrowX + 4, centerY - innerRadius - 5);
    ctx.closePath();
    ctx.fill();

    ctx.textAlign = 'left';
    ctx.fillText(`s = ${thickness.toFixed(1)} мм`, thicknessArrowX + 10, centerY - (outerRadius + innerRadius) / 2);

    const pressureY = centerY + vesselHeight / 2 + 40;
    ctx.textAlign = 'center';
    ctx.fillStyle = '#DC2626';
    ctx.font = 'bold 12px "Roboto Mono", monospace';
    ctx.fillText(`P = ${pressure} МПа`, centerX, pressureY);

    ctx.strokeStyle = '#DC2626';
    ctx.lineWidth = 1.5;
    const arrowLength = 25;
    const numArrows = 8;
    for (let i = 0; i < numArrows; i++) {
      const angle = (i / numArrows) * Math.PI * 2;
      const startX = centerX + Math.cos(angle) * innerRadius;
      const startY = centerY + Math.sin(angle) * innerRadius;
      const endX = centerX + Math.cos(angle) * (innerRadius - arrowLength);
      const endY = centerY + Math.sin(angle) * (innerRadius - arrowLength);

      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();

      const arrowHeadSize = 6;
      ctx.beginPath();
      ctx.moveTo(endX, endY);
      ctx.lineTo(
        endX + arrowHeadSize * Math.cos(angle + Math.PI / 2 + Math.PI / 6),
        endY + arrowHeadSize * Math.sin(angle + Math.PI / 2 + Math.PI / 6)
      );
      ctx.lineTo(
        endX + arrowHeadSize * Math.cos(angle - Math.PI / 2 - Math.PI / 6),
        endY + arrowHeadSize * Math.sin(angle - Math.PI / 2 - Math.PI / 6)
      );
      ctx.closePath();
      ctx.fillStyle = '#DC2626';
      ctx.fill();
    }
  }, [diameter, thickness, pressure]);

  return (
    <canvas
      ref={canvasRef}
      width={400}
      height={500}
      className="w-full h-auto border rounded-lg bg-white"
    />
  );
}
