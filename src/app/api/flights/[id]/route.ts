import { NextResponse } from "next/server";
import { mockFlights } from "@/lib/mock-data";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  const flight = mockFlights.find((f) => f.id === id);

  if (!flight) {
    return NextResponse.json(
      { error: "Flight not found." },
      { status: 404 }
    );
  }

  return NextResponse.json({ flight });
}
