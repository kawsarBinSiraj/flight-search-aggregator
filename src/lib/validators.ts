import * as yup from "yup";

export const searchSchema = yup.object({
  origin: yup.string().required("Origin is required"),
  destination: yup
    .string()
    .required("Destination is required")
    .notOneOf([yup.ref("origin")], "Destination must differ from origin"),
  departureDate: yup.string().required("Departure date is required"),
  passengers: yup
    .number()
    .min(1, "At least 1 passenger")
    .max(9, "Maximum 9 passengers")
    .required("Passenger count is required"),
});

export type SearchFormData = yup.InferType<typeof searchSchema>;

export const passengerSchema = yup.object({
  firstName: yup
    .string()
    .min(2, "First name must be at least 2 characters")
    .required("First name is required"),
  lastName: yup
    .string()
    .min(2, "Last name must be at least 2 characters")
    .required("Last name is required"),
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  phone: yup
    .string()
    .matches(/^\+?[\d\s-()]{7,15}$/, "Invalid phone number")
    .required("Phone number is required"),
  dateOfBirth: yup.string().required("Date of birth is required"),
  passportNumber: yup
    .string()
    .min(6, "Passport number must be at least 6 characters")
    .required("Passport number is required"),
  nationality: yup
    .string()
    .min(2, "Nationality is required")
    .required("Nationality is required"),
});

export const bookingSchema = yup.object({
  passengers: yup
    .array()
    .of(passengerSchema)
    .min(1, "At least one passenger is required")
    .required(),
  contactEmail: yup
    .string()
    .email("Invalid email address")
    .required("Contact email is required"),
  contactPhone: yup
    .string()
    .matches(/^\+?[\d\s-()]{7,15}$/, "Invalid phone number")
    .required("Contact phone is required"),
  specialRequests: yup.string().optional(),
});

export type BookingFormData = yup.InferType<typeof bookingSchema> & {
  specialRequests?: string;
};
