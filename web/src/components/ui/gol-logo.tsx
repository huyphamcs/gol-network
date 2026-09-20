import { cn } from '@/lib/utils';
import { appPath } from '@/lib/app-path';

export function GolLogo({ className }: { className?: string | undefined }) {
  return (
    <img src={appPath('/gol-mark-blue.svg')} alt="" className={cn('object-contain', className)} />
  );
}
