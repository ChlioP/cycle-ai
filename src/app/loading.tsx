import { DashboardSkeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return <main className="main"><div className="page-head"><div><span className="skeleton h-3 w-24" /><span className="skeleton mt-3 h-10 w-64" /></div></div><DashboardSkeleton /></main>;
}
