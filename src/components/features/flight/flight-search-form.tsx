"use client";

import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter, useSearchParams } from "next/navigation";
import { popularAirports } from "@/lib/mock-data";
import { searchSchema, type SearchFormData } from "@/lib/validators";
import { ROUTES } from "@/utils/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeftRight, Search } from "lucide-react";

interface FlightSearchFormProps {
    isSearching: boolean;
    redirectPath?: string;
}

export function FlightSearchForm({ isSearching, redirectPath }: FlightSearchFormProps) {
    const router = useRouter();

    // Pre-fill form from URL params or sensible defaults
    const searchParams = useSearchParams();

    // Form setup with validation
    const {
        register,
        handleSubmit,
        control,
        getValues,
        setValue,
        formState: { errors },
    } = useForm<SearchFormData>({
        resolver: yupResolver(searchSchema),
        defaultValues: {
            origin: searchParams.get("origin") || "JFK",
            destination: searchParams.get("destination") || "LAX",
            departureDate: searchParams.get("departureDate") || new Date().toISOString().split("T")[0],
            passengers: parseInt(searchParams.get("passengers") || "1", 10),
        },
    });

    // Build query string and navigate to results page
    const onSubmit = (data: SearchFormData) => {
        const query = new URLSearchParams({
            origin: data.origin,
            destination: data.destination,
            departureDate: data.departureDate,
            passengers: data.passengers.toString(),
        });
        router.push(`${redirectPath || ROUTES.HOME}?${query.toString()}`);
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="relative bg-card rounded-xl border border-border p-4 lg:p-6 max-w-225 m-auto shadow-lg shadow-black/5 dark:shadow-black/20"
        >
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1.25fr_1fr] mb-4">
                {/* Origin & destination selects with swap button */}
                <div className="destination relative grid grid-cols-2 gap-3">
                    <div className="form-group space-y-1">
                        <Label htmlFor="origin" className="text-md text-muted-foreground">
                            Origin
                        </Label>
                        <Controller
                            name="origin"
                            control={control}
                            render={({ field }) => (
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger className="h-15! w-full! border rounded-sm bg-background p-4 m-0! text-lg shadow-none">
                                        <SelectValue placeholder="Origin" />
                                    </SelectTrigger>
                                    <SelectContent className={"p-3"}>
                                        {popularAirports.map((airport) => (
                                            <SelectItem key={airport.code} value={airport.code}>
                                                <span className="font-medium">{airport.code}</span>
                                                <span className="ml-2 text-muted-foreground">{airport.city}</span>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.origin && <p className="mt-2 text-xs text-destructive">{errors.origin.message}</p>}
                    </div>

                    {/* Swap origin ↔ destination */}
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                            const origin = getValues("origin");
                            const destination = getValues("destination");
                            setValue("origin", destination);
                            setValue("destination", origin);
                        }}
                        className="size-9! cursor-pointer absolute top-[calc(50%-4px)] mb-3 left-1/2 z-10 h-10 w-10 -translate-x-1/2 rounded-full bg-background border-border transition-colors hover:bg-accent"
                    >
                        <ArrowLeftRight className="h-4 w-4 text-muted-foreground" />
                    </Button>

                    <div className="form-group space-y-1">
                        <Label htmlFor="origin" className="text-md text-muted-foreground">
                            Destination
                        </Label>
                        <Controller
                            name="destination"
                            control={control}
                            render={({ field }) => (
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger className="h-15! w-full! border rounded-sm bg-background p-4 m-0! text-lg shadow-none">
                                        <SelectValue placeholder="Origin" />
                                    </SelectTrigger>
                                    <SelectContent className={"p-3"}>
                                        {popularAirports.map((airport) => (
                                            <SelectItem key={airport.code} value={airport.code}>
                                                <span className="font-medium">{airport.code}</span>
                                                <span className="ml-2 text-muted-foreground">{airport.city}</span>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.destination && <p className="mt-2 text-xs text-destructive">{errors.destination.message}</p>}
                    </div>
                </div>
                {/* Departure date & passenger count */}
                <div className="departure-and-date relative grid grid-cols-2 gap-3">
                    <div className="form-group space-y-1">
                        <Label htmlFor="departureDate" className="text-md text-muted-foreground">
                            Departure Date
                        </Label>
                        <div className="flex h-15! w-full! items-center border rounded-sm bg-background p-4 m-0! text-lg shadow-none">
                            <Input
                                id="departureDate"
                                type="date"
                                min={new Date().toISOString().split("T")[0]}
                                className="h-full border-0 bg-transparent px-0 text-lg shadow-none focus-visible:ring-0"
                                {...register("departureDate")}
                            />
                        </div>
                        {errors.departureDate && <p className="mt-2 text-xs text-destructive">{errors.departureDate.message}</p>}
                    </div>
                    <div className="form-group space-y-1">
                        <Label htmlFor="passengers" className="text-md text-muted-foreground">
                            Passengers
                        </Label>
                        <Input
                            id="passengers"
                            type="number"
                            min={1}
                            max={9}
                            className="h-15 w-full p-4! rounded-sm text-lg! border bg-background px-1 shadow-none focus-visible:ring-0"
                            {...register("passengers", { valueAsNumber: true })}
                        />
                    </div>
                    {errors.passengers && <p className="mt-2 text-xs text-destructive">{errors.passengers.message}</p>}
                </div>
            </div>

            {/* Submit button — floats below the form card */}
            <Button
                type="submit"
                size="lg"
                className="absolute cursor-pointer opacity-100! -bottom-6 left-1/2 h-12 w-40 -translate-x-1/2 rounded-full bg-primary px-6 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/30 hover:bg-primary/90 sm:px-7"
                disabled={isSearching}
            >
                <Search className="mr-0 size-5" />
                {isSearching ? "Searching..." : "Explore"}
            </Button>
        </form>
    );
}
