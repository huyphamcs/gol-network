'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

const ASCII_RAMP = ' .,:;i1tfLCG08@';
const CELL_WIDTH = 7;
const CELL_HEIGHT = 11;

export function AsciiImage({
  className,
  src,
  ...canvasProps
}: Omit<React.ComponentPropsWithoutRef<'canvas'>, 'children'> & { src: string }) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const image = new window.Image();
    let disposed = false;

    const render = () => {
      if (disposed || !image.complete || image.naturalWidth === 0) return;

      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (width === 0 || height === 0) return;

      const columns = Math.max(24, Math.floor(width / CELL_WIDTH));
      const rows = Math.max(18, Math.floor(height / CELL_HEIGHT));
      const sample = document.createElement('canvas');
      sample.width = columns;
      sample.height = rows;
      const sampleContext = sample.getContext('2d', { willReadFrequently: true });
      const context = canvas.getContext('2d');
      if (!sampleContext || !context) return;

      const scale = Math.min(columns / image.naturalWidth, rows / image.naturalHeight);
      const imageWidth = image.naturalWidth * scale;
      const imageHeight = image.naturalHeight * scale;
      const imageX = (columns - imageWidth) / 2;
      const imageY = (rows - imageHeight) / 2;

      sampleContext.clearRect(0, 0, columns, rows);
      sampleContext.drawImage(image, imageX, imageY, imageWidth, imageHeight);
      const pixels = sampleContext.getImageData(0, 0, columns, rows).data;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.clearRect(0, 0, width, height);
      context.fillStyle = getComputedStyle(canvas).color;
      context.font = `${Math.max(7, Math.floor(height / rows))}px ui-monospace, SFMono-Regular, Menlo, monospace`;
      context.textAlign = 'center';
      context.textBaseline = 'middle';

      const outputCellWidth = width / columns;
      const outputCellHeight = height / rows;
      for (let row = 0; row < rows; row += 1) {
        for (let column = 0; column < columns; column += 1) {
          const offset = (row * columns + column) * 4;
          const alpha = (pixels[offset + 3] ?? 0) / 255;
          if (alpha < 0.08) continue;

          const red = pixels[offset] ?? 0;
          const green = pixels[offset + 1] ?? 0;
          const blue = pixels[offset + 2] ?? 0;
          const luminance = (red * 0.2126 + green * 0.7152 + blue * 0.0722) / 255;
          const density = Math.min(1, alpha * (0.45 + (1 - luminance) * 0.75));
          const glyphIndex = Math.max(
            1,
            Math.min(ASCII_RAMP.length - 1, Math.floor(density * ASCII_RAMP.length)),
          );

          context.globalAlpha = Math.min(1, 0.45 + density * 0.75);
          context.fillText(
            ASCII_RAMP[glyphIndex] ?? '@',
            column * outputCellWidth + outputCellWidth / 2,
            row * outputCellHeight + outputCellHeight / 2,
          );
        }
      }

      context.globalAlpha = 1;
      canvas.dataset.asciiReady = 'true';
    };

    image.addEventListener('load', render);
    image.src = src;
    const resizeObserver = new ResizeObserver(render);
    resizeObserver.observe(canvas);
    if (image.complete) render();

    return () => {
      disposed = true;
      image.removeEventListener('load', render);
      resizeObserver.disconnect();
    };
  }, [src]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      data-ascii-image
      className={cn('text-primary', className)}
      {...canvasProps}
    />
  );
}
