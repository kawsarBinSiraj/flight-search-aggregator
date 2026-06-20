import { NextResponse } from "next/server";
import type { Flight, FilterState, SortField } from "@/types";

interface FilterRequest {
    flights: Flight[];
    filters: FilterState;
    sortField: SortField;
    sortDirection: "asc" | "desc";
}

export async function POST(request: Request) {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    try {
        const body: FilterRequest = await request.json();
        const { flights, filters, sortField, sortDirection } = body;

        if (!flights || !Array.isArray(flights)) {
            return NextResponse.json({ error: "flights array is required." }, { status: 400 });
        }

        let result = [...flights];

        // Apply filters
        if (filters.stops.length > 0) {
            result = result.filter((f) => filters.stops.includes(f.stops));
        }
        if (filters.airlines.length > 0) {
            result = result.filter((f) => filters.airlines.includes(f.segments[0].airline.code));
        }
        result = result.filter((f) => f.totalPrice <= filters.maxPrice);
        result = result.filter((f) => f.totalDuration <= filters.maxDuration);

        // Filter by departure time
        result = result.filter((f) => {
            const depHour = new Date(f.segments[0].departureTime).getHours();
            return depHour >= filters.departureTimeRange[0] && depHour < filters.departureTimeRange[1];
        });

        // Apply sorting
        result.sort((a, b) => {
            let comparison = 0;
            switch (sortField) {
                case "price":
                    comparison = a.totalPrice - b.totalPrice;
                    break;
                case "duration":
                    comparison = a.totalDuration - b.totalDuration;
                    break;
                case "departure":
                    comparison = new Date(a.segments[0].departureTime).getTime() - new Date(b.segments[0].departureTime).getTime();
                    break;
                case "arrival":
                    comparison = new Date(a.segments[0].arrivalTime).getTime() - new Date(b.segments[0].arrivalTime).getTime();
                    break;
            }
            return sortDirection === "asc" ? comparison : -comparison;
        });

        return NextResponse.json({
            flights: result,
            total: result.length,
        });
    } catch {
        return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
    }
}
