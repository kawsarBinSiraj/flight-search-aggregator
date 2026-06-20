"use client";

import { useSearchParams } from "next/navigation";
import { mockFlights, allAirlines } from "@/lib/mock-data";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Filter, X } from "lucide-react";
import { formatCurrency, formatFlightDuration } from "@/lib/format";
import type { FilterState, StopType } from "@/types";

interface FlightFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: Partial<FilterState>) => void;
  onResetFilters: () => void;
}

export function FlightFilters({ filters, onFiltersChange, onResetFilters }: FlightFiltersProps) {
  const searchParams = useSearchParams();
  const origin = searchParams.get("origin") || "JFK";
  const destination = searchParams.get("destination") || "LAX";

  // Get available airlines from current search results
  const availableAirlines = allAirlines.filter((airline) =>
    mockFlights.some((f) => {
      const seg = f.segments[0];
      return (
        seg.airline.code === airline.code &&
        seg.origin.code === origin &&
        seg.destination.code === destination
      );
    })
  );

  const stopOptions: { label: string; value: StopType }[] = [
    { label: "Non-stop", value: "nonstop" },
    { label: "1 Stop", value: "1-stop" },
    { label: "2+ Stops", value: "2-stop" },
  ];

  const hasActiveFilters =
    filters.stops.length > 0 ||
    filters.airlines.length > 0 ||
    filters.maxPrice < 1000 ||
    filters.maxDuration < 800 ||
    filters.departureTimeRange[0] > 0 ||
    filters.departureTimeRange[1] < 24;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-sm font-semibold">
          <Filter className="h-4 w-4 text-primary" />
          Filters
        </h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onResetFilters}
            className="h-7 text-xs text-muted-foreground hover:text-foreground"
          >
            <X className="mr-1 h-3 w-3" />
            Clear
          </Button>
        )}
      </div>

      {/* Stops filter */}
      <div className="space-y-3">
        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Stops
        </Label>
        <div className="space-y-2">
          {stopOptions.map((option) => {
            const isChecked = filters.stops.includes(option.value);
            return (
              <label
                key={option.value}
                className="flex cursor-pointer items-center gap-2 text-sm"
              >
                <Checkbox
                  checked={isChecked}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      onFiltersChange({ stops: [...filters.stops, option.value] });
                    } else {
                      onFiltersChange({
                        stops: filters.stops.filter((s) => s !== option.value),
                      });
                    }
                  }}
                />
                {option.label}
              </label>
            );
          })}
        </div>
      </div>

      {/* Price range */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Max Price
          </Label>
          <span className="text-sm font-medium text-primary">
            {formatCurrency(filters.maxPrice)}
          </span>
        </div>
        <Slider
          value={[filters.maxPrice]}
          onValueChange={(val) => onFiltersChange({ maxPrice: Array.isArray(val) ? val[0] : val })}
          min={100}
          max={1000}
          step={10}
          className="w-full"
        />
      </div>

      {/* Duration */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Max Duration
          </Label>
          <span className="text-sm font-medium text-primary">
            {formatFlightDuration(filters.maxDuration)}
          </span>
        </div>
        <Slider
          value={[filters.maxDuration]}
          onValueChange={(val) => onFiltersChange({ maxDuration: Array.isArray(val) ? val[0] : val })}
          min={200}
          max={800}
          step={30}
          className="w-full"
        />
      </div>

      {/* Departure time */}
      <div className="space-y-3">
        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Departure Time
        </Label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: "Early AM", range: [0, 6] as [number, number], icon: "🌙" },
            { label: "Morning", range: [6, 12] as [number, number], icon: "🌅" },
            { label: "Afternoon", range: [12, 18] as [number, number], icon: "☀️" },
            { label: "Evening", range: [18, 24] as [number, number], icon: "🌆" },
          ].map((slot) => {
            const isActive =
              filters.departureTimeRange[0] === slot.range[0] &&
              filters.departureTimeRange[1] === slot.range[1];
            return (
              <button
                key={slot.label}
                onClick={() => onFiltersChange({ departureTimeRange: slot.range })}
                className={`rounded-lg border px-3 py-2 text-xs font-medium transition-all ${
                  isActive
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:border-primary/30"
                }`}
              >
                <span className="mr-1">{slot.icon}</span>
                {slot.label}
              </button>
            );
          })}
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="w-full text-xs text-muted-foreground"
          onClick={() => onFiltersChange({ departureTimeRange: [0, 24] })}
        >
          Any time
        </Button>
      </div>

      {/* Airlines */}
      <div className="space-y-3">
        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Airlines
        </Label>
        <div className="space-y-2">
          {availableAirlines.map((airline) => {
            const isChecked = filters.airlines.includes(airline.code);
            return (
              <label
                key={airline.code}
                className="flex cursor-pointer items-center gap-2 text-sm"
              >
                <Checkbox
                  checked={isChecked}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      onFiltersChange({ airlines: [...filters.airlines, airline.code] });
                    } else {
                      onFiltersChange({
                        airlines: filters.airlines.filter((a) => a !== airline.code),
                      });
                    }
                  }}
                />
                <span className="mr-1">{airline.logo}</span>
                {airline.name}
              </label>
            );
          })}
        </div>
      </div>

      {/* Active filters summary */}
      {hasActiveFilters && (
        <div className="space-y-2 border-t pt-4">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Active Filters
          </Label>
          <div className="flex flex-wrap gap-1">
            {filters.stops.map((stop) => (
              <Badge key={stop} variant="secondary" className="text-xs">
                {stop}
                <button
                  onClick={() =>
                    onFiltersChange({ stops: filters.stops.filter((s) => s !== stop) })
                  }
                  className="ml-1"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            {filters.airlines.map((airline) => (
              <Badge key={airline} variant="secondary" className="text-xs">
                {airline}
                <button
                  onClick={() =>
                    onFiltersChange({
                      airlines: filters.airlines.filter((a) => a !== airline),
                    })
                  }
                  className="ml-1"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
