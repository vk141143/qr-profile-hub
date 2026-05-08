import { HTMLAttributes } from 'react';
import { cn } from '@/utils';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  glass?: boolean;
}

export default function Card({ className, glass, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border',
        glass
          ? 'bg-white/5 backdrop-blur-xl border-white/10'
          : 'bg-white/[0.03] border-white/10',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
