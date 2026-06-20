import { format, formatDuration, intervalToDuration } from "date-fns";
import type { Flight } from "@/types";

export function formatCurrency(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatTime(dateString: string): string {
  return format(new Date(dateString), "h:mm a");
}

export function formatDate(dateString: string): string {
  return format(new Date(dateString), "MMM d, yyyy");
}

export function formatFlightDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

export function formatDurationRange(minutes: number): string {
  const duration = intervalToDuration({ start: 0, end: minutes * 60 * 1000 });
  const parts: string[] = [];
  if (duration.hours) parts.push(`${duration.hours}h`);
  if (duration.minutes) parts.push(`${duration.minutes}m`);
  return parts.join(" ");
}

export function getStopsLabel(stops: string): string {
  switch (stops) {
    case "nonstop":
      return "Non-stop";
    case "1-stop":
      return "1 Stop";
    case "2-stop":
      return "2+ Stops";
    default:
      return stops;
  }
}

export function getDepartureTimeCategory(hour: number): string {
  if (hour < 6) return "Early Morning";
  if (hour < 12) return "Morning";
  if (hour < 18) return "Afternoon";
  return "Evening";
}

export function generateBookingRef(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "BK-";
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
