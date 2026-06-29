export function Skeleton({ className = "" }: { className?: string }) {
  return <span className={`skeleton ${className}`.trim()} aria-hidden="true" />;
}

export function DashboardSkeleton() {
  return <div className="grid grid-2" aria-busy="true" aria-label="Loading health data">
    {[0, 1, 2, 3].map((item) => <div className="card skeleton-card" key={item}><Skeleton className="h-4 w-24" /><Skeleton className="mt-4 h-10 w-2/3" /><Skeleton className="mt-3 h-4 w-full" /></div>)}
  </div>;
}
