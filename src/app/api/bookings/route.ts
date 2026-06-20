import { NextResponse } from "next/server";
import { mockFlights } from "@/lib/mock-data";
import type { BookingData } from "@/types";

export async function POST(request: Request) {
    await new Promise((resolve) => setTimeout(resolve, 1200));

    const body: BookingData = await request.json();

    if (!body.flightId || !body.passengers || body.passengers.length === 0) {
        return NextResponse.json({ error: "Flight ID and at least one passenger are required." }, { status: 400 });
    }

    const flight = mockFlights.find((f) => f.id === body.flightId);
    if (!flight) {
        return NextResponse.json({ error: "Flight not found." }, { status: 404 });
    }

    if (flight.seatsAvailable < body.passengers.length) {
        return NextResponse.json({ error: "Not enough seats available." }, { status: 409 });
    }

    const bookingRef = `BK-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    return NextResponse.json({
        bookingReference: bookingRef,
        flight,
        passengers: body.passengers,
        totalPrice: flight.totalPrice * body.passengers.length,
        currency: flight.currency,
        bookingDate: new Date().toISOString(),
        status: "confirmed",
    });
}
