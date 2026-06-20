"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function FlightCardSkeleton() {
    return (
        <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-3 w-16" />
                    </div>
                </div>
                <Skeleton className="h-6 w-20" />
            </div>
            <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-8">
                    <div className="space-y-1">
                        <Skeleton className="h-5 w-16" />
                        <Skeleton className="h-3 w-12" />
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <Skeleton className="h-3 w-24" />
                        <Skeleton className="h-1 w-24" />
                        <Skeleton className="h-3 w-16" />
                    </div>
                    <div className="space-y-1">
                        <Skeleton className="h-5 w-16" />
                        <Skeleton className="h-3 w-12" />
                    </div>
                </div>
                <div className="text-right space-y-1">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-3 w-24" />
                </div>
            </div>
        </div>
    );
}

export function FlightResultsSkeleton() {
    return (
        <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
                <FlightCardSkeleton key={i} />
            ))}
        </div>
    );
}
