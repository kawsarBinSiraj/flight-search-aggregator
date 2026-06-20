import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Flight, BookingConfirmation } from "@/types";

interface FlightStore {
    // Selected flight
    selectedFlight: Flight | null;
    setSelectedFlight: (flight: Flight | null) => void;

    // Booking
    bookingConfirmation: BookingConfirmation | null;
    setBookingConfirmation: (confirmation: BookingConfirmation | null) => void;
    bookingStep: "review" | "passengers" | "payment" | "confirmation";
    setBookingStep: (step: "review" | "passengers" | "payment" | "confirmation") => void;
    passengerCount: number;
    setPassengerCount: (count: number) => void;
}

export const useFlightStore = create<FlightStore>()(
    persist(
        (set) => ({
            selectedFlight: null,
            setSelectedFlight: (flight) => set({ selectedFlight: flight }),

            bookingConfirmation: null,
            setBookingConfirmation: (confirmation) => set({ bookingConfirmation: confirmation }),
            bookingStep: "review",
            setBookingStep: (step) => set({ bookingStep: step }),
            passengerCount: 1,
            setPassengerCount: (count) => set({ passengerCount: count }),
        }),
        {
            name: "flight-store",
            partialize: (state) => ({
                selectedFlight: state.selectedFlight,
                passengerCount: state.passengerCount,
            }),
        }
    )
);
