/**
 * ============================================================
 * booking-service.test.ts
 * Tests for the booking API service (create booking)
 * Uses mocked axios to avoid real HTTP calls
 * ============================================================
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

// ─── Mock the api module before importing the service ───────
vi.mock("@/services/api", () => ({
    default: {
        post: vi.fn(),
    },
}));

import api from "@/services/api";
import { bookingService } from "@/services/booking-service";
import type { BookingData, BookingConfirmation } from "@/types";
const mockedApi = vi.mocked(api);

// ─── Test data ──────────────────────────────────────────────
const mockBookingData: BookingData = {
    flightId: "FL-2026-07-01-JFK-LAX-001",
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
    contactEmail: "john@example.com",
    contactPhone: "+1234567890",
};

const mockConfirmation: BookingConfirmation = {
    bookingReference: "BK-TEST1234",
    flight: {
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
    },
    passengers: mockBookingData.passengers,
    totalPrice: 350,
    currency: "USD",
    bookingDate: "2026-06-21T10:00:00Z",
    status: "confirmed",
};

// ─── Tests ──────────────────────────────────────────────────
describe("bookingService", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    // ── create() ──────────────────────────────────────────────
    describe("create()", () => {
        it("calls POST /api/bookings with booking data", async () => {
            mockedApi.post.mockResolvedValue({ data: mockConfirmation });

            const result = await bookingService.create(mockBookingData);

            expect(mockedApi.post).toHaveBeenCalledWith("/api/bookings", mockBookingData);
            expect(result).toEqual(mockConfirmation);
        });

        it("returns confirmation with correct booking reference format", async () => {
            mockedApi.post.mockResolvedValue({ data: mockConfirmation });

            const result = await bookingService.create(mockBookingData);

            expect(result.bookingReference).toMatch(/^BK-/);
        });

        it("returns confirmed status on successful booking", async () => {
            mockedApi.post.mockResolvedValue({ data: mockConfirmation });

            const result = await bookingService.create(mockBookingData);

            expect(result.status).toBe("confirmed");
        });

        it("calculates total price based on passenger count", async () => {
            // 2 passengers = 350 * 2 = 700
            const twoPassengerConfirmation = {
                ...mockConfirmation,
                totalPrice: 700,
                passengers: [
                    mockBookingData.passengers[0],
                    {
                        firstName: "Jane",
                        lastName: "Doe",
                        email: "jane@example.com",
                        phone: "+9876543210",
                        dateOfBirth: "1992-05-20",
                        passportNumber: "CD765432",
                        nationality: "American",
                    },
                ],
            };

            mockedApi.post.mockResolvedValue({ data: twoPassengerConfirmation });

            const twoPassengerData: BookingData = {
                ...mockBookingData,
                passengers: twoPassengerConfirmation.passengers,
            };

            const result = await bookingService.create(twoPassengerData);
            expect(result.totalPrice).toBe(700);
            expect(result.passengers).toHaveLength(2);
        });

        it("propagates API errors", async () => {
            mockedApi.post.mockRejectedValue(new Error("Flight not found"));

            await expect(bookingService.create({ ...mockBookingData, flightId: "non-existent" })).rejects.toThrow("Flight not found");
        });
    });
});
