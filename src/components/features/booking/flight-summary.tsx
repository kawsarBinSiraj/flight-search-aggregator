"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Plane, Clock, MapPin, Shield, Users } from "lucide-react";
import { formatCurrency, formatTime, formatDate, formatFlightDuration, getStopsLabel } from "@/lib/format";
import type { Flight } from "@/types";

interface FlightSummaryProps {
  flight: Flight;
  passengerCount: number;
}

export function FlightSummary({ flight, passengerCount }: FlightSummaryProps) {
  const segment = flight.segments[0];

  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Plane className="h-4 w-4 text-primary" />
          Flight Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Airline */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-lg">
            {segment.airline.logo}
          </div>
          <div>
            <p className="font-semibold">{segment.airline.name}</p>
            <p className="text-xs text-muted-foreground">{segment.flightNumber} • {segment.aircraft}</p>
          </div>
        </div>

        <Separator />

        {/* Route */}
        <div className="flex items-center justify-between">
          <div className="text-center">
            <p className="text-xl font-bold">{formatTime(segment.departureTime)}</p>
            <p className="text-sm font-medium">{segment.origin.code}</p>
            <p className="text-xs text-muted-foreground">{segment.origin.city}</p>
          </div>
          <div className="flex flex-col items-center gap-1 px-4">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {formatFlightDuration(flight.totalDuration)}
            </div>
            <div className="relative w-24">
              <div className="h-0.5 w-full bg-border" />
              <div className="absolute -left-1 -top-0.75 h-2 w-2 rounded-full bg-primary" />
              <div className="absolute -right-1 -top-0.75 h-2 w-2 rounded-full bg-primary" />
            </div>
            <Badge variant="secondary" className="text-xs">
              {getStopsLabel(flight.stops)}
            </Badge>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold">{formatTime(segment.arrivalTime)}</p>
            <p className="text-sm font-medium">{segment.destination.code}</p>
            <p className="text-xs text-muted-foreground">{segment.destination.city}</p>
          </div>
        </div>

        <Separator />

        {/* Details */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Date</span>
            <span className="font-medium">{formatDate(segment.departureTime)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              Passengers
            </span>
            <span className="font-medium">{passengerCount}</span>
          </div>
          {flight.isRefundable && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground flex items-center gap-1">
                <Shield className="h-3.5 w-3.5" />
                Refund
              </span>
              <span className="text-green-600 font-medium">Refundable</span>
            </div>
          )}
        </div>

        <Separator />

        {/* Price breakdown */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {formatCurrency(flight.totalPrice / passengerCount, flight.currency)} × {passengerCount}
            </span>
            <span>{formatCurrency(flight.totalPrice, flight.currency)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Taxes & fees</span>
            <span>Included</span>
          </div>
          <Separator />
          <div className="flex items-center justify-between text-lg font-bold">
            <span>Total</span>
            <span className="text-primary">
              {formatCurrency(flight.totalPrice, flight.currency)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
