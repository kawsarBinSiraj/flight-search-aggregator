import api from "./api";
import type { Flight, SearchParams, FilterState, SortField } from "@/types";

interface FlightSearchResponse {
    flights: Flight[];
    total: number;
    searchParams: SearchParams;
}

interface FlightFilterResponse {
    flights: Flight[];
    total: number;
}

export const flightService = {
    search: async (params: SearchParams): Promise<FlightSearchResponse> => {
        const { data } = await api.get<FlightSearchResponse>("/api/flights", {
            params: {
                origin: params.origin,
                destination: params.destination,
                date: params.departureDate,
                passengers: params.passengers,
            },
        });
        return data;
    },

    getById: async (id: string): Promise<Flight> => {
        const { data } = await api.get<{ flight: Flight }>(`/api/flights/${id}`);
        return data.flight;
    },

    filterAndSort: async (flights: Flight[], filters: FilterState, sortField: SortField, sortDirection: "asc" | "desc"): Promise<FlightFilterResponse> => {
        const { data } = await api.post<FlightFilterResponse>("/api/flights/filter", {
            flights,
            filters,
            sortField,
            sortDirection,
        });
        return data;
    },
};
