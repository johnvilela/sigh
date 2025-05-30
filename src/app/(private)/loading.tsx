import { Skeleton } from '@/components/ui/skeleton';

export default function AppLoading () {
  return (
    <div>
      <Skeleton className="w-full h-28 mb-2" />
      <Skeleton className="w-full h-28 mb-2" />
      <Skeleton className="w-full h-28 mb-2" />
      <Skeleton className="w-full h-28 mb-2" />
      <Skeleton className="w-full h-28 mb-2" />
      <Skeleton className="w-full h-28" />
    </div>
  );
}
