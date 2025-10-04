import { useEffect, useRef } from 'react';

interface VesselVisualization2DProps {
  diameter: number;
  thickness: number;
  pressure: number;
  length?: number;
}

export default function VesselVisualization2D({ 
  diameter, 
  thickness, 
  pressure,
  length = 2000 
}: VesselVisualization2DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    const scale = Math.min(width, height) * 0.3;
    const centerX = width / 2;
    const centerY = height / 2;

    const outerRadius = (diameter / 2000) * scale;
    const innerRadius = ((diameter - 2 * thickness) / 2000) * scale;
    const vesselLength = (length / 2000) * scale * 1.5;

    ctx.strokeStyle = '#475569';
    ctx.fillStyle = '#cbd5e1';
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(centerX - outerRadius, centerY - vesselLength / 2);
    ctx.lineTo(centerX - outerRadius, centerY + vesselLength / 2);
    ctx.arc(centerX, centerY + vesselLength / 2, outerRadius, Math.PI, 0, false);
    ctx.lineTo(centerX + outerRadius, centerY - vesselLength / 2);
    ctx.arc(centerX, centerY - vesselLength / 2, outerRadius, 0, Math.PI, false);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(centerX - innerRadius, centerY - vesselLength / 2);
    ctx.lineTo(centerX - innerRadius, centerY + vesselLength / 2);
    ctx.arc(centerX, centerY + vesselLength / 2, innerRadius, Math.PI, 0, false);
    ctx.lineTo(centerX + innerRadius, centerY - vesselLength / 2);
    ctx.arc(centerX, centerY - vesselLength / 2, innerRadius, 0, Math.PI, false);
    ctx.closePath();
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    ctx.fillStyle = '#1e293b';
    ctx.font = '12px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';

    const diameterArrowY = centerY + vesselLength / 2 + 40;
    ctx.beginPath();
    ctx.moveTo(centerX - outerRadius, diameterArrowY);
    ctx.lineTo(centerX + outerRadius, diameterArrowY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(centerX - outerRadius, diameterArrowY);
    ctx.lineTo(centerX - outerRadius + 6, diameterArrowY - 4);
    ctx.lineTo(centerX - outerRadius + 6, diameterArrowY + 4);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(centerX + outerRadius, diameterArrowY);
    ctx.lineTo(centerX + outerRadius - 6, diameterArrowY - 4);
    ctx.lineTo(centerX + outerRadius - 6, diameterArrowY + 4);
    ctx.closePath();
    ctx.fill();

    ctx.fillText(`D = ${diameter} мм`, centerX, diameterArrowY + 20);

    const thicknessArrowX = centerX + outerRadius + 50;
    const thicknessTopY = centerY - vesselLength / 2 - outerRadius;
    const thicknessBottomY = centerY - vesselLength / 2 - innerRadius;

    ctx.beginPath();
    ctx.moveTo(centerX, thicknessTopY);
    ctx.lineTo(thicknessArrowX - 10, thicknessTopY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(centerX, thicknessBottomY);
    ctx.lineTo(thicknessArrowX - 10, thicknessBottomY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(thicknessArrowX - 10, thicknessTopY);
    ctx.lineTo(thicknessArrowX - 10, thicknessBottomY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(thicknessArrowX - 10, thicknessTopY);
    ctx.lineTo(thicknessArrowX - 14, thicknessTopY + 5);
    ctx.lineTo(thicknessArrowX - 6, thicknessTopY + 5);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(thicknessArrowX - 10, thicknessBottomY);
    ctx.lineTo(thicknessArrowX - 14, thicknessBottomY - 5);
    ctx.lineTo(thicknessArrowX - 6, thicknessBottomY - 5);
    ctx.closePath();
    ctx.fill();

    ctx.textAlign = 'left';
    ctx.fillText(`s = ${thickness.toFixed(1)} мм`, thicknessArrowX + 5, (thicknessTopY + thicknessBottomY) / 2 + 4);

    const lengthArrowX = centerX - outerRadius - 40;
    ctx.beginPath();
    ctx.moveTo(lengthArrowX, centerY - vesselLength / 2);
    ctx.lineTo(lengthArrowX, centerY + vesselLength / 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(lengthArrowX, centerY - vesselLength / 2);
    ctx.lineTo(lengthArrowX - 4, centerY - vesselLength / 2 + 6);
    ctx.lineTo(lengthArrowX + 4, centerY - vesselLength / 2 + 6);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(lengthArrowX, centerY + vesselLength / 2);
    ctx.lineTo(lengthArrowX - 4, centerY + vesselLength / 2 - 6);
    ctx.lineTo(lengthArrowX + 4, centerY + vesselLength / 2 - 6);
    ctx.closePath();
    ctx.fill();

    ctx.save();
    ctx.translate(lengthArrowX - 25, centerY);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = 'center';
    ctx.fillText(`L = ${length} мм`, 0, 0);
    ctx.restore();

    ctx.strokeStyle = '#dc2626';
    ctx.fillStyle = '#dc2626';
    ctx.lineWidth = 2;
    ctx.font = 'bold 13px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`P = ${pressure} МПа`, centerX, centerY - vesselLength / 2 - 50);

    const arrowLength = 30;
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

      const arrowSize = 7;
      ctx.beginPath();
      ctx.moveTo(endX, endY);
      ctx.lineTo(
        endX + arrowSize * Math.cos(angle + Math.PI / 2 + Math.PI / 6),
        endY + arrowSize * Math.sin(angle + Math.PI / 2 + Math.PI / 6)
      );
      ctx.lineTo(
        endX + arrowSize * Math.cos(angle - Math.PI / 2 - Math.PI / 6),
        endY + arrowSize * Math.sin(angle - Math.PI / 2 - Math.PI / 6)
      );
      ctx.closePath();
      ctx.fill();
    }

    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1.5;
    const wallThicknessLeft = centerX - outerRadius;
    const wallThicknessRight = centerX - innerRadius;
    ctx.beginPath();
    ctx.moveTo(wallThicknessLeft, centerY);
    ctx.lineTo(wallThicknessRight, centerY);
    ctx.stroke();

    ctx.fillStyle = '#1e293b';
    ctx.fillRect(wallThicknessLeft, centerY - 2, wallThicknessRight - wallThicknessLeft, 4);

  }, [diameter, thickness, pressure, length]);

  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-4 border border-slate-300">
      <canvas
        ref={canvasRef}
        width={600}
        height={500}
        className="w-full h-auto"
      />
    </div>
  );
}
