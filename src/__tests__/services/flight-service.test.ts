/**
 * ============================================================
 * flight-service.test.ts
 * Tests for the flight API service (search, getById, filterAndSort)
 * Uses mocked axios to avoid real HTTP calls
 * ============================================================
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

// ─── Mock the api module before importing the service ───────
vi.mock("@/services/api", () => ({
    default: {
        get: vi.fn(),
        post: vi.fn(),
    },
}));

import api from "@/services/api";
import { flightService } from "@/services/flight-service";
import type { Flight, FilterState, SortField } from "@/types";

// Get the mocked functions with proper typing
const mockedApi = vi.mocked(api);

// ─── Test data ──────────────────────────────────────────────

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

// ─── Tests ──────────────────────────────────────────────────

describe("flightService", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    // ── search() ──────────────────────────────────────────────
    describe("search()", () => {
        it("calls GET /api/flights with correct params", async () => {
            const mockResponse = {
                flights: [mockFlight],
                total: 1,
                searchParams: { origin: "JFK", destination: "LAX", date: "2026-07-01", passengers: 2 },
            };

            mockedApi.get.mockResolvedValue({ data: mockResponse });
            const result = await flightService.search({
                origin: "JFK",
                destination: "LAX",
                departureDate: "2026-07-01",
                passengers: 2,
            });

            expect(mockedApi.get).toHaveBeenCalledWith("/api/flights", {
                params: {
                    origin: "JFK",
                    destination: "LAX",
                    date: "2026-07-01",
                    passengers: 2,
                },
            });

            expect(result).toEqual(mockResponse);
            expect(result.flights).toHaveLength(1);
            expect(result.total).toBe(1);
        });

        it("returns empty results when no flights match", async () => {
            mockedApi.get.mockResolvedValue({
                data: { flights: [], total: 0, searchParams: {} },
            });

            const result = await flightService.search({
                origin: "XYZ",
                destination: "ABC",
                departureDate: "2026-07-01",
                passengers: 1,
            });

            expect(result.flights).toHaveLength(0);
            expect(result.total).toBe(0);
        });
    });

    // ── getById() ─────────────────────────────────────────────
    describe("getById()", () => {
        it("calls GET /api/flights/:id and returns the flight", async () => {
            mockedApi.get.mockResolvedValue({ data: { flight: mockFlight } });
            const result = await flightService.getById("FL-2026-07-01-JFK-LAX-001");
            expect(mockedApi.get).toHaveBeenCalledWith("/api/flights/FL-2026-07-01-JFK-LAX-001");
            expect(result).toEqual(mockFlight);
            expect(result.id).toBe("FL-2026-07-01-JFK-LAX-001");
        });

        it("throws when flight is not found", async () => {
            mockedApi.get.mockRejectedValue(new Error("Request failed with status code 404"));
            await expect(flightService.getById("non-existent-id")).rejects.toThrow("Request failed with status code 404");
        });
    });

    // ── filterAndSort() ───────────────────────────────────────
    describe("filterAndSort()", () => {
        const filters: FilterState = {
            maxPrice: 500,
            stops: ["nonstop"],
            airlines: [],
            departureTimeRange: [0, 24],
            maxDuration: 600,
        };

        it("calls POST /api/flights/filter with correct payload", async () => {
            const mockResponse = {
                flights: [mockFlight],
                total: 1,
            };

            mockedApi.post.mockResolvedValue({ data: mockResponse });
            const result = await flightService.filterAndSort([mockFlight], filters, "price" as SortField, "asc");
            expect(mockedApi.post).toHaveBeenCalledWith("/api/flights/filter", {
                flights: [mockFlight],
                filters,
                sortField: "price",
                sortDirection: "asc",
            });

            expect(result.flights).toHaveLength(1);
        });

        it("handles empty flight list", async () => {
            mockedApi.post.mockResolvedValue({
                data: { flights: [], total: 0 },
            });

            const result = await flightService.filterAndSort([], filters, "price", "asc");
            expect(result.flights).toHaveLength(0);
            expect(result.total).toBe(0);
        });
    });
});
