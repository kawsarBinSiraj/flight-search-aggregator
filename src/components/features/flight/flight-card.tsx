"use client";

import { Clock, ArrowRight, Plane, Tag, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatTime, formatFlightDuration, getStopsLabel } from "@/lib/format";
import type { Flight } from "@/types";

interface FlightCardProps {
    flight: Flight;
    onSelect: (flight: Flight) => void;
}

export function FlightCard({ flight, onSelect }: FlightCardProps) {
    const segment = flight.segments[0];
    const depTime = formatTime(segment.departureTime);
    const arrTime = formatTime(segment.arrivalTime);
    const duration = formatFlightDuration(flight.totalDuration);
    const stopsLabel = getStopsLabel(flight.stops);
    const price = formatCurrency(flight.totalPrice, flight.currency);

    return (
        <div className="group relative rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 sm:p-6">
            {/* Tags */}
            {flight.tags && flight.tags.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-2">
                    {flight.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="bg-primary/10 text-primary text-xs font-medium">
                            <Tag className="mr-1 h-3 w-3" />
                            {tag}
                        </Badge>
                    ))}
                </div>
            )}

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                {/* Airline info */}
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-lg">{segment.airline.logo}</div>
                    <div>
                        <p className="font-semibold text-foreground">{segment.airline.name}</p>
                        <p className="text-xs text-muted-foreground">{segment.flightNumber}</p>
                    </div>
                </div>

                {/* Flight route */}
                <div className="flex flex-1 items-center justify-center gap-4 px-4">
                    {/* Departure */}
                    <div className="text-center">
                        <p className="text-xl font-bold tracking-tight">{depTime}</p>
                        <p className="text-sm font-medium text-muted-foreground">{segment.origin.code}</p>
                    </div>

                    {/* Duration line */}
                    <div className="flex flex-1 flex-col items-center gap-1">
                        <p className="text-xs font-medium text-muted-foreground">{duration}</p>
                        <div className="relative w-full">
                            <div className="h-0.5 w-full bg-border" />
                            <div className="absolute -left-1 -top-0.75 h-2 w-2 rounded-full bg-primary" />
                            <div className="absolute -right-1 -top-0.75 h-2 w-2 rounded-full bg-primary" />
                            {flight.stops !== "nonstop" && (
                                <div
                                    className="absolute -top-0.75 h-2 w-2 rounded-full bg-muted-foreground"
                                    style={{ left: flight.stops === "1-stop" ? "50%" : "33%" }}
                                />
                            )}
                        </div>
                        <p className="text-xs text-muted-foreground">{stopsLabel}</p>
                    </div>

                    {/* Arrival */}
                    <div className="text-center">
                        <p className="text-xl font-bold tracking-tight">{arrTime}</p>
                        <p className="text-sm font-medium text-muted-foreground">{segment.destination.code}</p>
                    </div>
                </div>

                {/* Price & action */}
                <div className="flex items-center justify-between gap-4 border-t pt-4 sm:flex-col sm:items-end sm:border-t-0 sm:pt-0">
                    <div className="text-left sm:text-right">
                        <p className="text-2xl font-bold text-primary">{price}</p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <span>
                                {flight.seatsAvailable <= 5 ? (
                                    <span className="text-orange-500">Only {flight.seatsAvailable} left</span>
                                ) : (
                                    `${flight.seatsAvailable} seats`
                                )}
                            </span>
                            {flight.isRefundable && (
                                <>
                                    <span>•</span>
                                    <Shield className="h-3 w-3 text-green-600" />
                                    <span className="text-green-600">Refundable</span>
                                </>
                            )}
                        </div>
                    </div>
                    <Button onClick={() => onSelect(flight)} className="bg-primary text-primary-foreground hover:bg-primary/90">
                        Select
                        <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
