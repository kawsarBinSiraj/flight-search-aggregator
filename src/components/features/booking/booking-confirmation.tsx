"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, Plane, Download, Mail, Home, Copy } from "lucide-react";
import { formatCurrency, formatTime, formatDate, formatFlightDuration, getStopsLabel } from "@/lib/format";
import type { BookingConfirmation } from "@/types";
import { toast } from "sonner";

interface BookingConfirmationViewProps {
    confirmation: BookingConfirmation;
    onNewSearch: () => void;
}

export function BookingConfirmationView({ confirmation, onNewSearch }: BookingConfirmationViewProps) {
    const { flight, passengers, bookingReference, totalPrice, currency, status } = confirmation;
    const segment = flight.segments[0];

    const copyRef = () => {
        navigator.clipboard.writeText(bookingReference);
        toast.success("Booking reference copied to clipboard!");
    };

    return (
        <div className="mx-auto max-w-2xl space-y-6">
            {/* Success header */}
            <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                    <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold">Booking Confirmed!</h2>
                <p className="mt-1 text-muted-foreground">Your flight has been booked successfully. A confirmation email will be sent shortly.</p>
            </div>

            {/* Booking reference */}
            <Card className="border-primary/20 bg-primary/5">
                <CardContent className="flex items-center justify-between py-4">
                    <div>
                        <p className="text-sm text-muted-foreground">Booking Reference</p>
                        <p className="text-2xl font-bold tracking-wider text-primary">{bookingReference}</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={copyRef}>
                        <Copy className="mr-1 h-4 w-4" />
                        Copy
                    </Button>
                </CardContent>
            </Card>

            {/* Flight details */}
            <Card className="border-border">
                <CardHeader className="pb-3">
                    <CardTitle className="flex items-center justify-between text-base">
                        <div className="flex items-center gap-2">
                            <Plane className="h-4 w-4 text-primary" />
                            Flight Details
                        </div>
                        <Badge
                            variant="secondary"
                            className={status === "confirmed" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : ""}
                        >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                        </Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-lg">{segment.airline.logo}</div>
                        <div>
                            <p className="font-semibold">{segment.airline.name}</p>
                            <p className="text-xs text-muted-foreground">
                                {segment.flightNumber} • {segment.aircraft}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="text-center">
                            <p className="text-xl font-bold">{formatTime(segment.departureTime)}</p>
                            <p className="text-sm font-medium">{segment.origin.code}</p>
                            <p className="text-xs text-muted-foreground">{segment.origin.city}</p>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                            <p className="text-xs text-muted-foreground">{formatFlightDuration(flight.totalDuration)}</p>
                            <div className="relative w-24">
                                <div className="h-0.5 w-full bg-border" />
                                <div className="absolute -left-1 -top-0.75 h-2 w-2 rounded-full bg-primary" />
                                <div className="absolute -right-1 -top-0.75 h-2 w-2 rounded-full bg-primary" />
                            </div>
                            <p className="text-xs text-muted-foreground">{getStopsLabel(flight.stops)}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-xl font-bold">{formatTime(segment.arrivalTime)}</p>
                            <p className="text-sm font-medium">{segment.destination.code}</p>
                            <p className="text-xs text-muted-foreground">{segment.destination.city}</p>
                        </div>
                    </div>

                    <Separator />

                    <div className="text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Date</span>
                            <span className="font-medium">{formatDate(segment.departureTime)}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Passengers */}
            <Card className="border-border">
                <CardHeader className="pb-3">
                    <CardTitle className="text-base">Passengers</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {passengers.map((p, i) => (
                            <div key={i} className="flex items-center justify-between text-sm">
                                <div>
                                    <p className="font-medium">
                                        {i + 1}. {p.firstName} {p.lastName}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {p.passportNumber} • {p.nationality}
                                    </p>
                                </div>
                                <p className="text-muted-foreground">{p.email}</p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Total */}
            <Card className="border-border bg-muted/30">
                <CardContent className="flex items-center justify-between py-4">
                    <span className="text-lg font-medium">Total Paid</span>
                    <span className="text-2xl font-bold text-primary">{formatCurrency(totalPrice, currency)}</span>
                </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex flex-col gap-3 sm:flex-row">
                <Button onClick={onNewSearch} className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
                    <Home className="mr-2 h-4 w-4" />
                    New Search
                </Button>
                <Button variant="outline" className="flex-1" disabled>
                    <Download className="mr-2 h-4 w-4" />
                    Download E-Ticket
                </Button>
                <Button variant="outline" className="flex-1" disabled>
                    <Mail className="mr-2 h-4 w-4" />
                    Email Itinerary
                </Button>
            </div>
        </div>
    );
}
