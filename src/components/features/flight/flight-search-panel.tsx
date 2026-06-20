"use client";

import { useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { FlightSearchForm } from "@/components/features/flight/flight-search-form";
import { FlightResults } from "@/components/features/flight/flight-results";
import { flightService } from "@/services/flight-service";
import { useFlightStore } from "@/store/flight-store";
import { useAuthStore } from "@/store/auth-store";
import { ROUTES } from "@/utils/constants";
import { ArrowRight } from "lucide-react";
import { popularAirports } from "@/lib/mock-data";

export default function FlightSearchPanel() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { setSelectedFlight, setBookingStep, setPassengerCount } = useFlightStore();
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    // Read search criteria from URL query params
    const origin = searchParams.get("origin");
    const destination = searchParams.get("destination");
    const departureDate = searchParams.get("departureDate");
    const passengers = Number(searchParams.get("passengers") ?? 1);

    // Determine if user has performed a search
    const hasSearched = !!(origin && destination && departureDate);
    const searchQuery = hasSearched ? { origin, destination, departureDate, passengers } : null;

    // Fetch matching flights when search query is present
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["flights", searchQuery],
        queryFn: () => flightService.search(searchQuery!),
        enabled: !!searchQuery,
        staleTime: 5 * 60 * 1000,
        retry: 2,
    });

    // Handle flight selection — redirect to login if unauthenticated
    const handleSelectFlight = useCallback(
        (flight: any) => {
            if (!isAuthenticated) {
                router.push(`${ROUTES.LOGIN}?callbackUrl=/booking/${flight.id}`);
                return;
            }
            // Store selected flight and navigate to booking
            setSelectedFlight(flight);
            setPassengerCount(passengers);
            setBookingStep("passengers");
            router.push(`/booking/${flight.id}`);
        },
        [isAuthenticated, setSelectedFlight, setPassengerCount, setBookingStep, passengers, router],
    );

    // Resolve airport metadata for the route banner
    const originAirport = popularAirports.find((a) => a.code === origin);
    const destAirport = popularAirports.find((a) => a.code === destination);

    return (
        <div id="search-panel">
            <div className="container">
                {/* Search form */}
                <div id="flight-search-form" className="mb-14">
                    <FlightSearchForm isSearching={isLoading} redirectPath={ROUTES.FLIGHT_SEARCH} />
                </div>

                {/* Route summary banner */}
                {hasSearched && !isLoading && data && (
                    <div className="mb-6 flex items-center justify-center gap-3 text-sm text-muted-foreground">
                        <span className="font-medium">{originAirport?.city || origin}</span>
                        <ArrowRight className="h-4 w-4" />
                        <span className="font-medium">{destAirport?.city || destination}</span>
                        <span>•</span>
                        <span>{data.total} flights available</span>
                    </div>
                )}

                {/* Flight results with filters and sorting */}
                <FlightResults
                    flights={data?.flights}
                    isLoading={isLoading}
                    isError={isError}
                    error={error}
                    hasSearched={hasSearched}
                    totalResults={data?.total || 0}
                    onSelectFlight={handleSelectFlight}
                />
            </div>
        </div>
    );
}