'use client';

import { useId } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

export type NetworkLayerKind = 'owner' | 'account' | 'policy' | 'adapters' | 'rails';

interface NetworkLayerDiagramProps {
  layers: readonly { title: string; kind: NetworkLayerKind }[];
  active: number;
  onSelect: (index: number) => void;
  className?: string;
}

function IsometricBlock({
  x,
  y,
  size = 26,
  height = 24,
}: {
  x: number;
  y: number;
  size?: number;
  height?: number;
}) {
  const rise = size * 0.44;

  return (
    <g transform={`translate(${x} ${y})`} strokeLinejoin="round">
      <polygon
        points={`0,${-rise - height} ${size},${-height} 0,${rise - height} ${-size},${-height}`}
        className="fill-card stroke-current"
      />
      <polygon
        points={`${-size},${-height} 0,${rise - height} 0,${rise} ${-size},0`}
        className="fill-primary/10 stroke-current"
      />
      <polygon
        points={`0,${rise - height} ${size},${-height} ${size},0 0,${rise}`}
        className="fill-primary/20 stroke-current"
      />
    </g>
  );
}

function LayerSculpture({ kind, hatchId }: { kind: NetworkLayerKind; hatchId: string }) {
  switch (kind) {
    case 'owner':
      return (
        <g>
          <ellipse cx="240" cy="0" rx="96" ry="36" fill="none" strokeDasharray="5 5" />
          <ellipse cx="240" cy="0" rx="65" ry="24" fill="none" />
          <IsometricBlock x={240} y={0} size={22} height={42} />
          <path d="M174 0H205 M275 0H306" fill="none" />
          <IsometricBlock x={174} y={0} size={10} height={12} />
          <IsometricBlock x={306} y={0} size={10} height={12} />
        </g>
      );
    case 'account':
      return (
        <g strokeLinejoin="round">
          <polygon points="240,-64 316,-32 240,0 164,-32" className="fill-card" />
          <polygon points="164,-32 240,0 240,58 164,26" fill={`url(#${hatchId})`} />
          <polygon points="240,0 316,-32 316,26 240,58" className="fill-primary/10" />
          <path d="M164 26L240 -6L316 26 M240 -6V58" fill="none" strokeDasharray="4 4" />
          <image
            href="/gol-mark-blue.svg"
            x="-22"
            y="-22"
            width="44"
            height="44"
            transform="matrix(1 .42 -1 .42 240 -31)"
          />
          <IsometricBlock x={298} y={-26} size={13} height={15} />
        </g>
      );
    case 'policy':
      return (
        <g strokeLinejoin="round">
          {[-18, 0, 18].map((offset) => (
            <polygon
              key={offset}
              points={`240,${offset - 36} 324,${offset} 240,${offset + 36} 156,${offset}`}
              className="fill-card stroke-current"
            />
          ))}
          <path d="M198 -18V18 M282 -18V18" fill="none" strokeDasharray="3 4" />
          <IsometricBlock x={240} y={10} size={20} height={45} />
        </g>
      );
    case 'adapters':
      return (
        <g>
          {[
            [-1, -1],
            [0, -1],
            [1, -1],
            [-1, 0],
            [0, 0],
            [1, 0],
            [-1, 1],
            [0, 1],
            [1, 1],
          ].map(([column = 0, row = 0], index) => (
            <IsometricBlock
              key={index}
              x={240 + (column - row) * 32}
              y={(column + row) * 14}
              size={23}
              height={index === 4 ? 44 : 20 + (index % 3) * 6}
            />
          ))}
        </g>
      );
    case 'rails':
      return (
        <g strokeLinejoin="round">
          {Array.from({ length: 16 }, (_, index) => {
            const column = index % 4;
            const row = Math.floor(index / 4);
            const x = 240 + (column - row) * 32;
            const y = (column + row - 3) * 14;

            return (
              <polygon
                key={index}
                points={`${x},${y - 10} ${x + 23},${y} ${x},${y + 10} ${x - 23},${y}`}
                className={index % 5 === 0 ? 'fill-primary/25' : 'fill-card'}
              />
            );
          })}
        </g>
      );
  }
}

export function NetworkLayerDiagram({
  layers,
  active,
  onSelect,
  className,
}: NetworkLayerDiagramProps) {
  const hatchId = `network-hatch-${useId().replace(/:/g, '')}`;
  const reduceMotion = Boolean(useReducedMotion());

  return (
    <svg
      viewBox="0 0 480 720"
      role="group"
      aria-label="Five connected layers of the GOL ecosystem. Select a layer to explore it."
      className={cn('h-auto w-full text-primary', className)}
    >
      <defs>
        <pattern id={hatchId} width="5" height="5" patternUnits="userSpaceOnUse">
          <rect width="5" height="5" className="fill-card" />
          <path d="M0 5L5 0" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
        </pattern>
      </defs>

      <g aria-hidden="true" className="stroke-primary/25" strokeWidth="1" strokeDasharray="4 7">
        <path d="M90 85V625 M240 25V685 M390 85V625" fill="none" />
      </g>

      {layers.map((layer, index) => (
        <g key={layer.kind} transform={`translate(0 ${85 + index * 135})`}>
          <motion.g
            role="button"
            tabIndex={0}
            aria-label={layer.title}
            aria-pressed={active === index}
            onClick={() => onSelect(index)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                onSelect(index);
              }
            }}
            initial={false}
            animate={{
              y: active === index ? -12 : 0,
              opacity: active === index ? 1 : index < active ? 0.55 : 0.25,
            }}
            transition={
              reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 170, damping: 24 }
            }
            className="cursor-pointer outline-none focus-visible:stroke-ring"
          >
            <title>{layer.title}</title>
            <g stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round">
              <polygon
                points="90,0 240,64 390,0 390,9 240,73 90,9"
                className={active === index ? 'fill-primary/20' : 'fill-primary/5'}
              />
              <polygon
                points="240,-64 390,0 240,64 90,0"
                className={active === index ? 'fill-accent' : 'fill-card'}
              />
              <LayerSculpture kind={layer.kind} hatchId={hatchId} />
            </g>
            <text x="55" y="5" className="fill-current font-mono text-xs">
              {String(index + 1).padStart(2, '0')}
            </text>
            <path d="M400 0H424" stroke="currentColor" strokeWidth="1" />
            <rect x="424" y="-3" width="6" height="6" className="fill-current" />
          </motion.g>
        </g>
      ))}
    </svg>
  );
}
