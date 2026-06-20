"use client";

import { useMemo, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useFlightStore } from "@/store/flight-store";
import { FlightSummary } from "@/components/features/booking/flight-summary";
import { BookingForm } from "@/components/features/booking/booking-form";
import { BookingConfirmationView } from "@/components/features/booking/booking-confirmation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { flightService } from "@/services/flight-service";
import { bookingService } from "@/services/booking-service";
import type { BookingFormData } from "@/lib/validators";
import type { Flight, BookingData, BookingConfirmation } from "@/types";
import { toast } from "sonner";
import { Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BookingPage() {
    const params = useParams();
    const router = useRouter();
    const flightId = params.id as string;

    // Flight store state & actions
    const { selectedFlight, passengerCount, bookingStep, setBookingStep, bookingConfirmation, setBookingConfirmation, setSelectedFlight, setPassengerCount } =
        useFlightStore();

    // Booking mutation
    const createBooking = useMutation<BookingConfirmation, Error, BookingData>({
        mutationFn: bookingService.create,
    });

    // Fetch flight from API only if store doesn't have the matching flight
    const shouldFetch = selectedFlight?.id !== flightId;
    const {
        data: fetchedFlight,
        isLoading: isFetchingFlight,
        isError: isFetchError,
    } = useQuery<Flight>({
        queryKey: ["flight", flightId],
        queryFn: () => flightService.getById(flightId!),
        enabled: shouldFetch && !!flightId,
        staleTime: 5 * 60 * 1000,
        retry: 2,
    });

    // Derive the resolved flight directly
    const resolvedFlight: Flight | null = useMemo(() => {
        if (selectedFlight?.id === flightId) return selectedFlight;
        if (fetchedFlight) return fetchedFlight;
        return null;
    }, [selectedFlight, flightId, fetchedFlight]);

    // Sync fetched flight into store (only when it actually changes)
    const syncedRef = useRef<string | null>(null);
    useEffect(() => {
        if (fetchedFlight && syncedRef.current !== fetchedFlight.id) {
            syncedRef.current = fetchedFlight.id;
            setSelectedFlight(fetchedFlight);
            if (!passengerCount || passengerCount < 1) {
                setPassengerCount(1);
            }
        }
    }, [fetchedFlight, setSelectedFlight, setPassengerCount, passengerCount]);

    // Derived state
    const isLoading = shouldFetch && isFetchingFlight;
    const isNotFound = !isLoading && !resolvedFlight && (isFetchError || !shouldFetch);

    // Submit booking — auth is handled by proxy middleware
    const handleBookingSubmit = async (data: BookingFormData) => {
        if (!resolvedFlight) return;

        try {
            const confirmation = await createBooking.mutateAsync({
                flightId: resolvedFlight.id,
                passengers: data.passengers,
                contactEmail: data.contactEmail,
                contactPhone: data.contactPhone,
                specialRequests: data.specialRequests,
            });

            setBookingConfirmation(confirmation);
            setBookingStep("confirmation");
            toast.success("Booking confirmed successfully!");
        } catch {
            toast.error("Failed to create booking. Please try again.");
        }
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="mx-auto flex min-h-[50vh] max-w-7xl flex-col items-center justify-center gap-4 px-4 py-16 sm:px-6 lg:px-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground">Loading flight details...</p>
            </div>
        );
    }

    // Flight not found
    if (isNotFound) {
        return (
            <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
                <p className="text-muted-foreground">Flight not found. Please search and select a flight first.</p>
            </div>
        );
    }

    // Confirmation step
    if (bookingStep === "confirmation" && bookingConfirmation) {
        return (
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <BookingConfirmationView
                    confirmation={bookingConfirmation}
                    onNewSearch={() => {
                        router.push("/");
                        setTimeout(() => {
                            setSelectedFlight(null);
                            setBookingStep("review");
                            setBookingConfirmation(null);
                        }, 600);
                    }}
                />
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            {/* Progress indicator */}
            <div className="mb-8 flex items-center justify-center">
                <div className="flex items-center justify-center gap-2">
                    {["review", "passengers", "confirmation"].map((step, i) => (
                        <div key={step} className="flex items-center gap-2">
                            <div
                                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                                    bookingStep === step || (step === "review" && bookingStep === "passengers")
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-muted text-muted-foreground"
                                }`}
                            >
                                {i + 1}
                            </div>
                            <span className={`text-sm font-medium capitalize ${bookingStep === step ? "text-foreground" : "text-muted-foreground"}`}>
                                {step === "passengers" ? "Details" : step}
                            </span>
                            {i < 2 && <div className="mx-2 h-px w-8 bg-border" />}
                        </div>
                    ))}
                </div>
                <div className="w-22" />
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                {/* Main content */}
                <div className="lg:col-span-2">
                    <div className="title mb-4 flex items-center gap-2">
                        <Button
                            type="button"
                            variant="default"
                            className="gap-2 bg-black text-white hover:bg-black/80"
                            onClick={() => {
                                setSelectedFlight(null);
                                setBookingStep("review");
                                router.push("/");
                            }}
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back
                        </Button>
                        <h2 className=" text-2xl font-bold">{bookingStep === "review" ? "Review Your Flight" : "Passenger Details"}</h2>
                    </div>
                    <BookingForm
                        flight={resolvedFlight!}
                        passengerCount={passengerCount}
                        onSubmit={handleBookingSubmit}
                        isSubmitting={createBooking.isPending}
                    />
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <FlightSummary flight={resolvedFlight!} passengerCount={passengerCount} />
                </div>
            </div>
        </div>
    );
}
