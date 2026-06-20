import api from "./api";
import type { BookingData, BookingConfirmation } from "@/types";

export const bookingService = {
    create: async (data: BookingData): Promise<BookingConfirmation> => {
        const { data: confirmation } = await api.post<BookingConfirmation>("/api/bookings", data);
        return confirmation;
    },
};
