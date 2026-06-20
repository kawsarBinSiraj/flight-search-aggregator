"use client";

import { Button } from "@/components/ui/button";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import type { SortField } from "@/types";

const sortOptions: { label: string; value: SortField }[] = [
  { label: "Price", value: "price" },
  { label: "Duration", value: "duration" },
  { label: "Departure", value: "departure" },
  { label: "Arrival", value: "arrival" },
];

interface FlightSortProps {
  sortField: SortField;
  sortDirection: "asc" | "desc";
  onSortChange: (field: SortField) => void;
}

export function FlightSort({ sortField, sortDirection, onSortChange }: FlightSortProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-muted-foreground">Sort:</span>
      <div className="flex gap-1">
        {sortOptions.map((option) => {
          const isActive = sortField === option.value;
          return (
            <Button
              key={option.value}
              variant={isActive ? "default" : "ghost"}
              size="sm"
              className={`h-8 text-xs ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => onSortChange(option.value)}
            >
              {option.label}
              {isActive && (
                sortDirection === "asc" ? (
                  <ArrowUp className="ml-1 h-3 w-3" />
                ) : (
                  <ArrowDown className="ml-1 h-3 w-3" />
                )
              )}
              {!isActive && <ArrowUpDown className="ml-1 h-3 w-3 opacity-40" />}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
