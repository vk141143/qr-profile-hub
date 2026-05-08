import { cn } from '@/utils';

export default function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn('animate-pulse bg-white/10 rounded-xl', className)} />
  );
}

export function ProfileSkeleton() {
  return (
    <div className="flex flex-col items-center gap-4 p-6">
      <Skeleton className="w-24 h-24 rounded-full" />
      <Skeleton className="w-40 h-5" />
      <Skeleton className="w-28 h-4" />
      <div className="w-full space-y-3 mt-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="w-full h-14" />
        ))}
      </div>
    </div>
  );
}
