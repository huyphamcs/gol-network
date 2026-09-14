const pixelBand = Array.from({ length: 52 }, (_, index) => ({
  id: index,
  active: index % 7 !== 0 && index % 11 !== 0,
  tone: index % 5 === 0 ? 'strong' : index % 3 === 0 ? 'soft' : 'base',
}));

/** Decorative network signal band used as the handoff between insights and the FAQ. */
export function NetworkPixelBand() {
  return (
    <div
      aria-hidden="true"
      className="relative h-36 overflow-hidden border-y border-border bg-background lg:h-40"
    >
      <div className="grid h-full grid-cols-[repeat(13,minmax(0,1fr))] grid-rows-4 gap-2 opacity-90">
        {pixelBand.map((cell) => {
          const tone =
            cell.tone === 'strong'
              ? 'bg-primary/65'
              : cell.tone === 'soft'
                ? 'bg-primary/35'
                : 'bg-primary/50';
          return (
            <span
              key={cell.id}
              data-motion-network-cell
              className={cell.active ? `${tone} will-change-transform` : 'bg-foreground/10'}
            />
          );
        })}
      </div>
    </div>
  );
}
