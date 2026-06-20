import { NextResponse } from "next/server";
import { mockFlights } from "@/lib/mock-data";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const origin = searchParams.get("origin")?.toUpperCase();
    const destination = searchParams.get("destination")?.toUpperCase();
    const date = searchParams.get("date");
    const passengers = parseInt(searchParams.get("passengers") || "1", 10);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (!origin || !destination || !date) {
        return NextResponse.json({ error: "Origin, destination, and date are required." }, { status: 400 });
    }

    if (passengers < 1 || passengers > 9) {
        return NextResponse.json({ error: "Passengers must be between 1 and 9." }, { status: 400 });
    }

    // Filter flights matching origin/destination
    const flights = mockFlights.filter((flight) => {
        const segment = flight.segments[0];
        return segment.origin.code === origin && segment.destination.code === destination && flight.seatsAvailable >= passengers;
    });

    // Update prices based on passenger count
    const result = flights.map((flight) => ({
        ...flight,
        totalPrice: flight.totalPrice * passengers,
    }));

    return NextResponse.json({
        flights: result,
        total: result.length,
        searchParams: { origin, destination, date, passengers },
    });
}
