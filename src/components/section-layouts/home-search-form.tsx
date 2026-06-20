"use client";

import { FlightSearchForm } from "@/components/features/flight/flight-search-form";
import { ROUTES } from "@/utils/constants";

export function HomeSearchForm() {
    return <FlightSearchForm onSearch={() => {}} isSearching={false} redirectPath={ROUTES.FLIGHT_SEARCH} />;
}
