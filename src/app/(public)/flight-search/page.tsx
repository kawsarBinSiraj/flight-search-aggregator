import { Suspense } from "react";
import type { Metadata } from "next";
import FlightSearchPanel from "@/components/features/flight/flight-search-panel";

export const metadata: Metadata = {
    title: "Search Flights — AeroFly",
    description: "Find and compare the best flight deals for your next trip.",
};

export default function FlightSearchPage() {
    return (
        <div className="py-0">
            <Suspense>
                <FlightSearchPanel />
            </Suspense>
        </div>
    );
}
