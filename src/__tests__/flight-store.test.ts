/**
 * ============================================================
 * flight-store.test.ts
 * Tests for the Zustand flight store (selected flight, booking state)
 * ============================================================
 */

import { describe, it, expect, beforeEach } from "vitest";
import { useFlightStore } from "@/store/flight-store";
import type { Flight, BookingConfirmation } from "@/types";

// ─── Test fixtures ──────────────────────────────────────────
const mockFlight: Flight = {
    id: "FL-2026-07-01-JFK-LAX-001",
    segments: [
        {
            airline: { code: "AA", name: "American Airlines", logo: "🇺🇸" },
            flightNumber: "AA 100",
            origin: { code: "JFK", city: "New York", name: "JFK", country: "USA" },
            destination: { code: "LAX", city: "Los Angeles", name: "LAX", country: "USA" },
            departureTime: "2026-07-01T08:00:00",
            arrivalTime: "2026-07-01T11:00:00",
            duration: 360,
            aircraft: "Boeing 737",
        },
    ],
    totalPrice: 350,
    currency: "USD",
    stops: "nonstop",
    totalDuration: 360,
    isRefundable: true,
    seatsAvailable: 20,
};

const mockConfirmation: BookingConfirmation = {
    bookingReference: "BK-ABC12345",
    flight: mockFlight,
    passengers: [
        {
            firstName: "John",
            lastName: "Doe",
            email: "john@example.com",
            phone: "+1234567890",
            dateOfBirth: "1990-01-15",
            passportNumber: "AB123456",
            nationality: "American",
        },
    ],
    totalPrice: 350,
    currency: "USD",
    bookingDate: "2026-06-21T10:00:00Z",
    status: "confirmed",
};

// ─── Tests ──────────────────────────────────────────────────

describe("useFlightStore", () => {
    // Reset store before each test
    beforeEach(() => {
        useFlightStore.setState({
            selectedFlight: null,
            bookingConfirmation: null,
            bookingStep: "review",
            passengerCount: 1,
        });
    });

    // ── selectedFlight ────────────────────────────────────────
    describe("selectedFlight", () => {
        it("starts with null selectedFlight", () => {
            const { selectedFlight } = useFlightStore.getState();
            expect(selectedFlight).toBeNull();
        });

        it("sets a flight correctly", () => {
            useFlightStore.getState().setSelectedFlight(mockFlight);
            expect(useFlightStore.getState().selectedFlight).toEqual(mockFlight);
        });

        it("clears selectedFlight when set to null", () => {
            useFlightStore.getState().setSelectedFlight(mockFlight);
            useFlightStore.getState().setSelectedFlight(null);
            expect(useFlightStore.getState().selectedFlight).toBeNull();
        });
    });

    // ── bookingConfirmation ───────────────────────────────────
    describe("bookingConfirmation", () => {
        it("starts with null bookingConfirmation", () => {
            const { bookingConfirmation } = useFlightStore.getState();
            expect(bookingConfirmation).toBeNull();
        });

        it("sets booking confirmation correctly", () => {
            useFlightStore.getState().setBookingConfirmation(mockConfirmation);
            expect(useFlightStore.getState().bookingConfirmation).toEqual(mockConfirmation);
        });

        it("clears booking confirmation when set to null", () => {
            useFlightStore.getState().setBookingConfirmation(mockConfirmation);
            useFlightStore.getState().setBookingConfirmation(null);
            expect(useFlightStore.getState().bookingConfirmation).toBeNull();
        });
    });

    // ── bookingStep ───────────────────────────────────────────
    describe("bookingStep", () => {
        it("starts at review step", () => {
            expect(useFlightStore.getState().bookingStep).toBe("review");
        });

        it.each(["review", "passengers", "payment", "confirmation"] as const)("sets booking step to %s", (step) => {
            useFlightStore.getState().setBookingStep(step);
            expect(useFlightStore.getState().bookingStep).toBe(step);
        });
    });

    // ── passengerCount ────────────────────────────────────────
    describe("passengerCount", () => {
        it("starts at 1 passenger", () => {
            expect(useFlightStore.getState().passengerCount).toBe(1);
        });

        it("updates passenger count", () => {
            useFlightStore.getState().setPassengerCount(3);
            expect(useFlightStore.getState().passengerCount).toBe(3);
        });

        it("can set passenger count to 9 (max)", () => {
            useFlightStore.getState().setPassengerCount(9);
            expect(useFlightStore.getState().passengerCount).toBe(9);
        });
    });
});
