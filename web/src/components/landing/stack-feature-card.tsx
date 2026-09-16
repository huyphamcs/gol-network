import Image from 'next/image';
import { AsciiImage } from '@/components/ui/ascii-image';
import { Card, CardContent } from '@/components/ui/card';
import { DotPattern } from '@/components/ui/dot-pattern';
import { cn } from '@/lib/utils';

export function StackFeatureCard({
  title,
  detail,
  image,
  label,
  layout = 'compact',
}: {
  title: string;
  detail: string;
  image: string;
  label: string;
  layout?: 'tall' | 'compact' | 'wide';
}) {
  return (
    <Card
      tabIndex={0}
      data-stack-feature
      className={cn(
        'group flex h-full min-w-0 flex-col overflow-hidden rounded-lg shadow-none outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/20',
        layout === 'tall' ? 'min-h-128' : 'min-h-80',
        layout === 'wide' && 'sm:flex-row',
      )}
    >
      <div
        className={cn(
          'relative flex min-w-0 items-center justify-center overflow-hidden bg-muted p-5',
          layout === 'tall' ? 'min-h-80 flex-1 p-8' : 'h-44 shrink-0',
          layout === 'compact' && 'h-56',
          layout === 'wide' && 'sm:h-auto sm:w-2/5',
        )}
      >
        <DotPattern width={20} height={20} fade className="text-primary/20" />
        <div
          className={cn(
            'absolute inset-5',
            layout === 'tall' && 'inset-8',
            layout === 'compact' && 'inset-2',
          )}
        >
          <Image
            src={image}
            alt=""
            fill
            sizes={
              layout === 'wide'
                ? '(min-width: 768px) 25vw, 100vw'
                : '(min-width: 768px) 33vw, 100vw'
            }
            data-stack-feature-art="detail"
            className={cn(
              'object-contain transition duration-300 ease-out group-hover:opacity-0 group-focus-visible:opacity-0 motion-reduce:transition-none',
              layout === 'compact'
                ? 'scale-110 group-hover:scale-115 group-focus-visible:scale-115'
                : 'group-hover:scale-105 group-focus-visible:scale-105',
            )}
          />
          <AsciiImage
            src={image}
            data-stack-feature-art="ascii"
            className={cn(
              'absolute inset-0 size-full opacity-0 transition duration-300 ease-out group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none',
              layout === 'compact'
                ? 'scale-105 group-hover:scale-110 group-focus-visible:scale-110'
                : 'scale-95 group-hover:scale-100 group-focus-visible:scale-100',
            )}
          />
        </div>
      </div>
      <CardContent
        className={cn(
          'flex min-w-0 flex-col justify-center p-6',
          layout === 'tall' && 'md:p-8',
          layout === 'wide' && 'flex-1',
        )}
      >
        <p className="font-mono text-xs text-primary">{label}</p>
        <h3
          className={cn(
            'mt-2 font-semibold tracking-tight transition-colors duration-300 group-hover:text-primary group-focus-visible:text-primary motion-reduce:transition-none',
            layout === 'tall' ? 'text-2xl sm:text-3xl' : 'text-xl',
          )}
        >
          {title}
        </h3>
        <p className="mt-3 text-sm leading-copy text-muted-foreground">{detail}</p>
      </CardContent>
    </Card>
  );
}
