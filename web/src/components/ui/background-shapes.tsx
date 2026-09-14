'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactElement,
  type ReactNode,
} from 'react';

const Cell1 = ({ colors }: { colors: string[]; strokeWidth: number }) => (
  <circle cx="50" cy="50" r="9.44" fill={colors[0]} fillRule="evenodd" />
);

const Cell2 = ({ colors, strokeWidth }: { colors: string[]; strokeWidth: number }) => (
  <>
    <line x1="25" x2="75" y1="25" y2="25" stroke={colors[0]} strokeWidth={strokeWidth} />
    <line x1="25" x2="75" y1="50" y2="50" stroke={colors[0]} strokeWidth={strokeWidth} />
    <line x1="25" x2="75" y1="75" y2="75" stroke={colors[0]} strokeWidth={strokeWidth} />
  </>
);

const Cell3 = ({ colors, strokeWidth }: { colors: string[]; strokeWidth: number }) => (
  <>
    <line x1="25" x2="75" y1="25" y2="75" stroke={colors[0]} strokeWidth={strokeWidth} />
    <line x1="25" x2="75" y1="75" y2="25" stroke={colors[0]} strokeWidth={strokeWidth} />
  </>
);

const Cell4 = ({ colors, strokeWidth }: { colors: string[]; strokeWidth: number }) => (
  <rect
    width="50"
    height="50"
    x="25"
    y="25"
    fill="none"
    stroke={colors[0]}
    strokeWidth={strokeWidth}
  />
);

const Cell5 = ({ colors, strokeWidth }: { colors: string[]; strokeWidth: number }) => (
  <line x1="25" x2="75" y1="75" y2="25" fill="none" stroke={colors[0]} strokeWidth={strokeWidth} />
);

const Cell6 = () => null;

const Cell7 = () => <rect width="75" height="75" x="12.5" y="12.5" fill="currentColor" />;

const seedPrng = (seed: number) => {
  let seedValue = seed;
  return () => {
    seedValue = (seedValue * 9301 + 49297) % 233280;
    return seedValue / 233280;
  };
};

const seedFromId = (value: string) =>
  Array.from(value).reduce((seed, character) => seed + character.charCodeAt(0), 1);

interface ShapeConfig {
  shape: ({
    colors,
    strokeWidth,
  }: {
    colors: string[];
    strokeWidth: number;
  }) => ReactElement | null;
  weight: number;
}

const shapesConfig: ShapeConfig[] = [
  { shape: Cell1, weight: 1 },
  { shape: Cell2, weight: 1 },
  { shape: Cell3, weight: 1 },
  { shape: Cell4, weight: 1 },
  { shape: Cell5, weight: 1 },
  { shape: Cell6, weight: 5 },
  { shape: Cell7, weight: 3 },
];

const createWeightedSelector = (items: ShapeConfig[], seededRandom: () => number) => {
  const weightedArray: ShapeConfig[] = [];

  for (const item of items) {
    for (let index = 0; index < item.weight; index += 1) weightedArray.push(item);
  }

  return (): ShapeConfig =>
    weightedArray[Math.floor(seededRandom() * weightedArray.length)] ?? items[0]!;
};

interface ShapeProps {
  x: number;
  y: number;
  colors: string[];
  strokeWidth: number;
  scale: number;
  shapeId: string;
  minInterval?: number;
  maxInterval?: number;
}

function Shape({
  x,
  y,
  colors,
  strokeWidth,
  scale,
  shapeId,
  minInterval = 0,
  maxInterval = 5000,
}: ShapeProps) {
  const [currentShape, setCurrentShape] = useState<ShapeConfig>(() => {
    const pickShape = createWeightedSelector(shapesConfig, seedPrng(seedFromId(shapeId)));
    return pickShape();
  });

  const updateShape = useCallback(() => {
    const pickShape = createWeightedSelector(shapesConfig, seedPrng(Math.random() * 1000));
    setCurrentShape(pickShape());
  }, []);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const getRandomInterval = () => Math.random() * (maxInterval - minInterval) + minInterval;

    let timeoutId = window.setTimeout(function setNextShape() {
      updateShape();
      timeoutId = window.setTimeout(setNextShape, getRandomInterval());
    }, getRandomInterval());

    return () => window.clearTimeout(timeoutId);
  }, [maxInterval, minInterval, updateShape]);

  const ShapeComponent = currentShape.shape;

  return (
    <g
      transform={`translate(${x} ${y})`}
      onPointerEnter={updateShape}
      onPointerDown={updateShape}
      className="cursor-crosshair opacity-70 transition-opacity hover:opacity-100"
    >
      <g transform={`scale(${scale})`}>
        <ShapeComponent colors={colors} strokeWidth={strokeWidth} />
      </g>
    </g>
  );
}

interface BackgroundShapesProps {
  width?: number;
  height?: number;
  cellSize?: number;
  strokeWidth?: number;
  colors?: string[];
  className?: string;
  minInterval?: number;
  maxInterval?: number;
}

export function BackgroundShapes({
  width = 500,
  height = 500,
  cellSize = 20,
  strokeWidth = 10,
  colors = ['white'],
  className = '',
  minInterval = 1000,
  maxInterval = 5000,
}: BackgroundShapesProps) {
  const borderSize = cellSize * 2;
  const scale = 0.2;
  const colorsKey = colors.join('|');

  const shapes = useMemo<ReactNode[]>(() => {
    const list: ReactNode[] = [];
    for (let x = borderSize; x < width / 2; x += cellSize) {
      for (let y = borderSize; y < height - borderSize; y += cellSize) {
        list.push(
          <Shape
            key={`left-${x}-${y}`}
            x={x}
            y={y}
            colors={colors}
            strokeWidth={strokeWidth}
            scale={scale}
            shapeId={`left-${x}-${y}`}
            minInterval={minInterval}
            maxInterval={maxInterval}
          />,
          <Shape
            key={`right-${x}-${y}`}
            x={width - cellSize - x}
            y={y}
            colors={colors}
            strokeWidth={strokeWidth}
            scale={scale}
            shapeId={`right-${x}-${y}`}
            minInterval={minInterval}
            maxInterval={maxInterval}
          />,
        );
      }
    }
    return list;
    // The joined value keeps the color dependency stable across renders.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width, height, cellSize, strokeWidth, colorsKey, borderSize, minInterval, maxInterval]);

  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
    >
      {shapes}
    </svg>
  );
}

export default BackgroundShapes;
