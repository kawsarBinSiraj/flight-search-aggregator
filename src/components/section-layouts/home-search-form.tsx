"use client";

import { Suspense } from "react";
import { FlightSearchForm } from "@/components/features/flight/flight-search-form";
import { ROUTES } from "@/utils/constants";

export function HomeSearchForm() {
    return (
        <Suspense>
            <FlightSearchForm isSearching={false} redirectPath={ROUTES.FLIGHT_SEARCH} />
        </Suspense>
    );
}
