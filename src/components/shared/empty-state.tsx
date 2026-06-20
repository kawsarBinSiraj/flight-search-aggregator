"use client";

import { Search, AlertCircle, PlaneTakeoff } from "lucide-react";

interface EmptyStateProps {
    type: "initial" | "no-results" | "error";
    message?: string;
}

export function EmptyState({ type, message }: EmptyStateProps) {
    const config = {
        initial: {
            icon: <Search className="h-12 w-12 text-muted-foreground/50" />,
            title: "Search for flights",
            description: "Enter your origin, destination, and travel dates to find available flights.",
        },
        "no-results": {
            icon: <PlaneTakeoff className="h-12 w-12 text-muted-foreground/50" />,
            title: "No flights found",
            description: "We couldn't find any flights matching your search criteria. Try adjusting your dates or filters.",
        },
        error: {
            icon: <AlertCircle className="h-12 w-12 text-destructive/60" />,
            title: "Something went wrong",
            description: message || "An error occurred while searching for flights. Please try again.",
        },
    };

    const { icon, title, description } = config[type];

    return (
        <div className="flex flex-col items-center justify-center py-5 text-center">
            <div className="mb-4">{icon}</div>
            <h3 className="mb-2 text-lg font-semibold">{title}</h3>
            <p className="max-w-md text-sm text-muted-foreground">{description}</p>
        </div>
    );
}
