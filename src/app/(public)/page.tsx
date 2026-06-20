/**
 * app/(website)/page.tsx — Home / landing page.
 *
 * Server component.
 * Static content version (no next-intl).
 */

import { Plane } from "lucide-react";
import type { Metadata } from "next";
import { HomeSearchForm } from "@/components/section-layouts/home-search-form";

export const metadata: Metadata = {
    title: "AeroFly | Search & Book Flights Worldwide",
    description:
        "Search, compare, and book affordable flights worldwide. Find the best airfare deals, flexible travel options, and seamless online booking with AeroFly.",
    keywords: ["flight booking", "cheap flights", "airline tickets", "flight search", "travel", "airfare deals", "international flights", "domestic flights"],
};

export default function HomePage() {
    return (
        <div id="home">
            <section className="relative text-center mb-10">
                <div className="container">
                    <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700 dark:border-sky-800 dark:bg-sky-950 dark:text-sky-300">
                        <Plane className="size-3.5" />
                        Compare fares from leading airlines
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-balance text-4xl font-bold tracking-tight leading-16 sm:text-5xl md:text-6xl">
                            Find the Best Flight Deals for Your Next Journey
                        </h1>
                        <p className="mx-auto max-w-2xl text-base text-muted-foreground">Search, compare, and book flights with real-time prices.</p>
                    </div>
                </div>
            </section>
            <HomeSearchForm />
        </div>
    );
}
