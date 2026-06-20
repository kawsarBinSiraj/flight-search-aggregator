"use client";

import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { flightService } from "@/services/flight-service";
import { FlightCard } from "./flight-card";
import { FlightSort } from "./flight-sort";
import { FlightFilters } from "./flight-filters";
import { FlightResultsSkeleton } from "@/components/shared/loading-skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import type { Flight, FilterState, SortField } from "@/types";

const defaultFilters: FilterState = {
    maxPrice: 1000,
    stops: [],
    airlines: [],
    departureTimeRange: [0, 24],
    maxDuration: 800,
};

interface FlightResultsProps {
    flights: Flight[] | undefined;
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
    hasSearched: boolean;
    totalResults: number;
    onSelectFlight: (flight: Flight) => void;
}

export function FlightResults({ flights, isLoading, isError, error, hasSearched, totalResults, onSelectFlight }: FlightResultsProps) {
    const [filters, setFilters] = useState<FilterState>(defaultFilters);
    const [sortField, setSortField] = useState<SortField>("price");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

    const handleFiltersChange = useCallback((newFilters: Partial<FilterState>) => {
        setFilters((prev) => ({ ...prev, ...newFilters }));
    }, []);

    const handleResetFilters = useCallback(() => {
        setFilters(defaultFilters);
    }, []);

    const handleSortChange = useCallback((field: SortField) => {
        setSortField((prevField) => {
            if (prevField === field) {
                setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
                return prevField;
            }
            setSortDirection("asc");
            return field;
        });
    }, []);

    // Fetch filtered and sorted flights from API
    const { data: filteredData, isLoading: isFiltering } = useQuery({
        queryKey: ["flight-filter", flights, filters, sortField, sortDirection],
        queryFn: () => flightService.filterAndSort(flights!, filters, sortField, sortDirection),
        enabled: !!flights && flights.length > 0,
        staleTime: 30 * 1000,
    });

    const filteredAndSortedFlights = filteredData?.flights ?? [];

    const handleSelect = (flight: Flight) => {
        onSelectFlight(flight);
    };

    if (!hasSearched) {
        return <EmptyState type="initial" />;
    }

    if (isLoading) {
        return <FlightResultsSkeleton />;
    }

    if (isError) {
        return <EmptyState type="error" message={error?.message} />;
    }

    if (!flights || flights.length === 0) {
        return <EmptyState type="no-results" />;
    }

    return (
        <div className="flex flex-col gap-6 lg:flex-row">
            {/* Sidebar filters */}
            <aside className="w-full shrink-0 lg:w-64">
                <div className="rounded-xl border border-border bg-card p-5 lg:sticky lg:top-4 lg:max-h-[calc(100vh-2rem)] lg:overflow-y-auto lg:overflow-x-hidden">
                    <FlightFilters
                        filters={filters}
                        onFiltersChange={handleFiltersChange}
                        onResetFilters={handleResetFilters}
                    />
                </div>
            </aside>

            {/* Results */}
            <div className="flex-1 space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <h2 className="text-md font-semibold">
                            {isFiltering ? "Updating..." : `${filteredAndSortedFlights.length} ${filteredAndSortedFlights.length === 1 ? "flight" : "flights"} found`}
                        </h2>
                        {filteredAndSortedFlights.length !== totalResults && (
                            <Badge variant="outline" className="text-xs">
                                Filtered from {totalResults}
                            </Badge>
                        )}
                    </div>
                    <FlightSort
                        sortField={sortField}
                        sortDirection={sortDirection}
                        onSortChange={handleSortChange}
                    />
                </div>

                {isFiltering ? (
                    <FlightResultsSkeleton />
                ) : filteredAndSortedFlights.length === 0 ? (
                    <EmptyState type="no-results" />
                ) : (
                    <div className="space-y-3">
                        {filteredAndSortedFlights.map((flight) => (
                            <FlightCard key={flight.id} flight={flight} onSelect={handleSelect} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
