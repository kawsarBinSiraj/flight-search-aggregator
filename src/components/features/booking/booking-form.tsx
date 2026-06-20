"use client";

import { useForm, useFieldArray, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { bookingSchema, type BookingFormData } from "@/lib/validators";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Loader2 } from "lucide-react";
import type { Flight } from "@/types";

interface BookingFormProps {
    flight: Flight;
    passengerCount: number;
    onSubmit: (data: BookingFormData) => void;
    isSubmitting: boolean;
}

export function BookingForm({ passengerCount, onSubmit, isSubmitting }: BookingFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<BookingFormData>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: yupResolver(bookingSchema) as any,
        defaultValues: {
            passengers: Array.from({ length: passengerCount }, () => ({
                firstName: "",
                lastName: "",
                email: "",
                phone: "",
                dateOfBirth: "",
                passportNumber: "",
                nationality: "",
            })),
            contactEmail: "",
            contactPhone: "",
            specialRequests: "",
        },
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Passenger forms */}
            {Array.from({ length: passengerCount }).map((_, index) => (
                <Card key={index} className="border-border">
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-base">
                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                                {index + 1}
                            </div>
                            Passenger {index + 1}
                            {index === 0 && <span className="ml-2 text-xs font-normal text-muted-foreground">(Primary contact)</span>}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            {/* First Name */}
                            <div className="space-y-1.5">
                                <Label htmlFor={`passengers.${index}.firstName`} className="text-sm">
                                    First Name *
                                </Label>
                                <Input
                                    id={`passengers.${index}.firstName`}
                                    placeholder="John"
                                    {...register(`passengers.${index}.firstName`)}
                                    className={errors.passengers?.[index]?.firstName ? "border-destructive" : ""}
                                />
                                {errors.passengers?.[index]?.firstName && (
                                    <p className="text-xs text-destructive">{errors.passengers[index]?.firstName?.message}</p>
                                )}
                            </div>

                            {/* Last Name */}
                            <div className="space-y-1.5">
                                <Label htmlFor={`passengers.${index}.lastName`} className="text-sm">
                                    Last Name *
                                </Label>
                                <Input
                                    id={`passengers.${index}.lastName`}
                                    placeholder="Doe"
                                    {...register(`passengers.${index}.lastName`)}
                                    className={errors.passengers?.[index]?.lastName ? "border-destructive" : ""}
                                />
                                {errors.passengers?.[index]?.lastName && (
                                    <p className="text-xs text-destructive">{errors.passengers[index]?.lastName?.message}</p>
                                )}
                            </div>

                            {/* Email */}
                            <div className="space-y-1.5">
                                <Label htmlFor={`passengers.${index}.email`} className="text-sm">
                                    Email *
                                </Label>
                                <Input
                                    id={`passengers.${index}.email`}
                                    type="email"
                                    placeholder="john@example.com"
                                    {...register(`passengers.${index}.email`)}
                                    className={errors.passengers?.[index]?.email ? "border-destructive" : ""}
                                />
                                {errors.passengers?.[index]?.email && <p className="text-xs text-destructive">{errors.passengers[index]?.email?.message}</p>}
                            </div>

                            {/* Phone */}
                            <div className="space-y-1.5">
                                <Label htmlFor={`passengers.${index}.phone`} className="text-sm">
                                    Phone *
                                </Label>
                                <Input
                                    id={`passengers.${index}.phone`}
                                    type="tel"
                                    placeholder="+1 234 567 8900"
                                    {...register(`passengers.${index}.phone`)}
                                    className={errors.passengers?.[index]?.phone ? "border-destructive" : ""}
                                />
                                {errors.passengers?.[index]?.phone && <p className="text-xs text-destructive">{errors.passengers[index]?.phone?.message}</p>}
                            </div>

                            {/* Date of Birth */}
                            <div className="space-y-1.5">
                                <Label htmlFor={`passengers.${index}.dateOfBirth`} className="text-sm">
                                    Date of Birth *
                                </Label>
                                <Input
                                    id={`passengers.${index}.dateOfBirth`}
                                    type="date"
                                    {...register(`passengers.${index}.dateOfBirth`)}
                                    className={errors.passengers?.[index]?.dateOfBirth ? "border-destructive" : ""}
                                />
                                {errors.passengers?.[index]?.dateOfBirth && (
                                    <p className="text-xs text-destructive">{errors.passengers[index]?.dateOfBirth?.message}</p>
                                )}
                            </div>

                            {/* Nationality */}
                            <div className="space-y-1.5">
                                <Label htmlFor={`passengers.${index}.nationality`} className="text-sm">
                                    Nationality *
                                </Label>
                                <Input
                                    id={`passengers.${index}.nationality`}
                                    placeholder="United States"
                                    {...register(`passengers.${index}.nationality`)}
                                    className={errors.passengers?.[index]?.nationality ? "border-destructive" : ""}
                                />
                                {errors.passengers?.[index]?.nationality && (
                                    <p className="text-xs text-destructive">{errors.passengers[index]?.nationality?.message}</p>
                                )}
                            </div>

                            {/* Passport Number */}
                            <div className="space-y-1.5 sm:col-span-2">
                                <Label htmlFor={`passengers.${index}.passportNumber`} className="text-sm">
                                    Passport Number *
                                </Label>
                                <Input
                                    id={`passengers.${index}.passportNumber`}
                                    placeholder="AB1234567"
                                    {...register(`passengers.${index}.passportNumber`)}
                                    className={errors.passengers?.[index]?.passportNumber ? "border-destructive" : ""}
                                />
                                {errors.passengers?.[index]?.passportNumber && (
                                    <p className="text-xs text-destructive">{errors.passengers[index]?.passportNumber?.message}</p>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}

            {/* Contact Information */}
            <Card className="border-border">
                <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                        <Mail className="h-4 w-4 text-primary" />
                        Contact Information
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="contactEmail" className="text-sm">
                                Contact Email *
                            </Label>
                            <Input
                                id="contactEmail"
                                type="email"
                                placeholder="john@example.com"
                                {...register("contactEmail")}
                                className={errors.contactEmail ? "border-destructive" : ""}
                            />
                            {errors.contactEmail && <p className="text-xs text-destructive">{errors.contactEmail.message}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="contactPhone" className="text-sm">
                                Contact Phone *
                            </Label>
                            <Input
                                id="contactPhone"
                                type="tel"
                                placeholder="+1 234 567 8900"
                                {...register("contactPhone")}
                                className={errors.contactPhone ? "border-destructive" : ""}
                            />
                            {errors.contactPhone && <p className="text-xs text-destructive">{errors.contactPhone.message}</p>}
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="specialRequests" className="text-sm">
                            Special Requests (optional)
                        </Label>
                        <Textarea
                            id="specialRequests"
                            placeholder="Dietary requirements, wheelchair assistance, etc."
                            {...register("specialRequests")}
                            rows={3}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex items-center justify-end">
                <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90" disabled={isSubmitting}>
                    {isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Confirming...
                        </>
                    ) : (
                        "Confirm Booking"
                    )}
                </Button>
            </div>
        </form>
    );
}
