import type { Flight, Airport, Airline } from "@/types";

const airports: Airport[] = [
    { code: "JFK", city: "New York", name: "John F. Kennedy International", country: "USA" },
    { code: "LAX", city: "Los Angeles", name: "Los Angeles International", country: "USA" },
    { code: "ORD", city: "Chicago", name: "O'Hare International", country: "USA" },
    { code: "LHR", city: "London", name: "Heathrow", country: "UK" },
    { code: "CDG", city: "Paris", name: "Charles de Gaulle", country: "France" },
    { code: "DXB", city: "Dubai", name: "Dubai International", country: "UAE" },
    { code: "SIN", city: "Singapore", name: "Changi", country: "Singapore" },
    { code: "NRT", city: "Tokyo", name: "Narita International", country: "Japan" },
    { code: "SFO", city: "San Francisco", name: "San Francisco International", country: "USA" },
    { code: "MIA", city: "Miami", name: "Miami International", country: "USA" },
    { code: "FRA", city: "Frankfurt", name: "Frankfurt Airport", country: "Germany" },
    { code: "HND", city: "Tokyo", name: "Haneda", country: "Japan" },
    { code: "BKK", city: "Bangkok", name: "Suvarnabhumi", country: "Thailand" },
    { code: "SYD", city: "Sydney", name: "Sydney Airport", country: "Australia" },
];

const airlines: Airline[] = [
    { code: "AA", name: "American Airlines", logo: "🇺🇸" },
    { code: "DL", name: "Delta Air Lines", logo: "🔺" },
    { code: "UA", name: "United Airlines", logo: "🌍" },
    { code: "BA", name: "British Airways", logo: "🇬🇧" },
    { code: "LH", name: "Lufthansa", logo: "🇩🇪" },
    { code: "EK", name: "Emirates", logo: "🇦🇪" },
    { code: "SQ", name: "Singapore Airlines", logo: "🇸🇬" },
    { code: "AF", name: "Air France", logo: "🇫🇷" },
    { code: "JL", name: "Japan Airlines", logo: "🇯🇵" },
    { code: "QF", name: "Qantas", logo: "🇦🇺" },
];

const aircraftPool = ["Boeing 737", "Airbus A320", "Boeing 787", "Airbus A350", "Boeing 777", "Airbus A380", "Boeing 767", "Airbus A330"];

// Route definitions: origin, destination, base nonstop duration (min), base price
const routeDefinitions: Array<{
    origin: Airport;
    destination: Airport;
    baseDuration: number;
    basePrice: number;
}> = [
    // Domestic USA
    { origin: airports[0], destination: airports[1], baseDuration: 355, basePrice: 349 }, // JFK → LAX
    { origin: airports[1], destination: airports[0], baseDuration: 320, basePrice: 359 }, // LAX → JFK
    { origin: airports[0], destination: airports[8], baseDuration: 370, basePrice: 379 }, // JFK → SFO
    { origin: airports[8], destination: airports[0], baseDuration: 330, basePrice: 369 }, // SFO → JFK
    { origin: airports[2], destination: airports[1], baseDuration: 255, basePrice: 279 }, // ORD → LAX
    { origin: airports[0], destination: airports[2], baseDuration: 150, basePrice: 189 }, // JFK → ORD
    { origin: airports[0], destination: airports[9], baseDuration: 195, basePrice: 219 }, // JFK → MIA
    { origin: airports[9], destination: airports[1], baseDuration: 310, basePrice: 309 }, // MIA → LAX

    // Transatlantic
    { origin: airports[0], destination: airports[3], baseDuration: 420, basePrice: 520 }, // JFK → LHR
    { origin: airports[3], destination: airports[0], baseDuration: 480, basePrice: 540 }, // LHR → JFK
    { origin: airports[0], destination: airports[4], baseDuration: 450, basePrice: 495 }, // JFK → CDG
    { origin: airports[4], destination: airports[0], baseDuration: 510, basePrice: 505 }, // CDG → JFK
    { origin: airports[2], destination: airports[3], baseDuration: 510, basePrice: 560 }, // ORD → LHR
    { origin: airports[1], destination: airports[3], baseDuration: 645, basePrice: 680 }, // LAX → LHR
    { origin: airports[3], destination: airports[5], baseDuration: 420, basePrice: 480 }, // LHR → DXB

    // Middle East
    { origin: airports[0], destination: airports[5], baseDuration: 720, basePrice: 695 }, // JFK → DXB
    { origin: airports[5], destination: airports[0], baseDuration: 780, basePrice: 720 }, // DXB → JFK
    { origin: airports[3], destination: airports[5], baseDuration: 420, basePrice: 480 }, // LHR → DXB

    // Asia
    { origin: airports[1], destination: airports[6], baseDuration: 1020, basePrice: 850 }, // LAX → SIN
    { origin: airports[6], destination: airports[1], baseDuration: 1080, basePrice: 870 }, // SIN → LAX
    { origin: airports[1], destination: airports[7], baseDuration: 690, basePrice: 720 }, // LAX → NRT
    { origin: airports[7], destination: airports[1], baseDuration: 630, basePrice: 700 }, // NRT → LAX
    { origin: airports[0], destination: airports[7], baseDuration: 840, basePrice: 890 }, // JFK → NRT
    { origin: airports[5], destination: airports[6], baseDuration: 435, basePrice: 410 }, // DXB → SIN
    { origin: airports[6], destination: airports[12], baseDuration: 150, basePrice: 185 }, // SIN → BKK
    { origin: airports[3], destination: airports[7], baseDuration: 735, basePrice: 780 }, // LHR → NRT

    // Europe internal
    { origin: airports[3], destination: airports[4], baseDuration: 80, basePrice: 145 }, // LHR → CDG
    { origin: airports[4], destination: airports[10], baseDuration: 85, basePrice: 155 }, // CDG → FRA

    // Oceania
    { origin: airports[6], destination: airports[13], baseDuration: 480, basePrice: 520 }, // SIN → SYD
    { origin: airports[1], destination: airports[13], baseDuration: 960, basePrice: 1100 }, // LAX → SYD
];

// ─── helpers ────────────────────────────────────────────────────

function formatDate(d: Date): string {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

/** Simple seeded PRNG (djb2) — deterministic per date so results are stable */
function seededRandom(seed: number): () => number {
    let s = seed % 2147483647;
    if (s <= 0) s += 2147483646;
    return () => {
        s = (s * 16807) % 2147483647;
        return (s - 1) / 2147483646;
    };
}

function dateToSeed(dateStr: string): number {
    let hash = 5381;
    for (let i = 0; i < dateStr.length; i++) {
        hash = ((hash << 5) + hash + dateStr.charCodeAt(i)) & 0xffffffff;
    }
    return Math.abs(hash);
}

// ─── pre-generate flights for today + next 10 days ──────────────

function preGenerateAllFlights(): Flight[] {
    const allFlights: Flight[] = [];
    const today = new Date();

    for (let dayOffset = 0; dayOffset <= 10; dayOffset++) {
        const date = new Date(today);
        date.setDate(date.getDate() + dayOffset);
        const dateStr = formatDate(date);
        const rand = seededRandom(dateToSeed(dateStr));

        // Pick which routes operate today (~70-85% of all routes)
        const todaysRoutes = routeDefinitions.filter(() => rand() < 0.78);

        let flightCounter = 0;

        for (const route of todaysRoutes) {
            const { origin, destination, baseDuration, basePrice } = route;

            // Pick 3-7 airlines for this route today
            const numAirlines = 3 + Math.floor(rand() * 5);
            const shuffledAirlines = [...airlines].sort(() => rand() - 0.5);
            const selectedAirlines = shuffledAirlines.slice(0, numAirlines);

            // Generate departure times spread across the day
            const startHour = 4 + Math.floor(rand() * 3);

            selectedAirlines.forEach((airline, idx) => {
                flightCounter++;

                // Vary departure time
                const depHour = (startHour + idx * 2 + Math.floor(rand() * 2)) % 24;
                const depMin = Math.floor(rand() * 4) * 15; // 0, 15, 30, 45

                // Pick stop type: weighted towards nonstop and 1-stop
                const stopRoll = rand();
                let stops: "nonstop" | "1-stop" | "2-stop";
                let duration: number;
                let priceMultiplier: number;
                if (stopRoll < 0.45) {
                    stops = "nonstop";
                    duration = baseDuration + Math.floor(rand() * 30) - 10;
                    priceMultiplier = 1 + (rand() * 0.3 - 0.1);
                } else if (stopRoll < 0.8) {
                    stops = "1-stop";
                    duration = Math.round(baseDuration * (1.45 + rand() * 0.2));
                    priceMultiplier = 0.7 + rand() * 0.2;
                } else {
                    stops = "2-stop";
                    duration = Math.round(baseDuration * (1.9 + rand() * 0.3));
                    priceMultiplier = 0.5 + rand() * 0.15;
                }

                const price = Math.round(basePrice * priceMultiplier);
                const seats = 3 + Math.floor(rand() * 60);
                const refundable = stops === "nonstop" ? rand() > 0.4 : rand() > 0.75;

                // Compute arrival
                const depTotalMin = depHour * 60 + depMin;
                const arrTotalMin = depTotalMin + duration;
                const arrHour = Math.floor(arrTotalMin / 60) % 24;
                const arrMin = arrTotalMin % 60;

                const arrivalDateOffset = arrHour < depHour ? 1 : 0;
                const arrivalDate = new Date(date);
                arrivalDate.setDate(arrivalDate.getDate() + arrivalDateOffset);

                const depHourStr = depHour.toString().padStart(2, "0");
                const depMinStr = depMin.toString().padStart(2, "0");
                const arrHourStr = arrHour.toString().padStart(2, "0");
                const arrMinStr = arrMin.toString().padStart(2, "0");

                const flightNum = `${airline.code} ${((flightCounter * 137 + dayOffset * 31) % 900) + 100}`;

                allFlights.push({
                    id: `FL-${dateStr}-${origin.code}-${destination.code}-${flightCounter.toString().padStart(3, "0")}`,
                    segments: [
                        {
                            airline,
                            flightNumber: flightNum,
                            origin,
                            destination,
                            departureTime: `${dateStr}T${depHourStr}:${depMinStr}:00`,
                            arrivalTime: `${formatDate(arrivalDate)}T${arrHourStr}:${arrMinStr}:00`,
                            duration,
                            aircraft: aircraftPool[(flightCounter + dayOffset) % aircraftPool.length],
                        },
                    ],
                    totalPrice: price,
                    currency: "USD",
                    stops,
                    totalDuration: duration,
                    isRefundable: refundable,
                    seatsAvailable: seats,
                });
            });
        }
    }

    return allFlights;
}

export const mockFlights: Flight[] = preGenerateAllFlights();

export const popularAirports: Airport[] = airports;

export const allAirlines: Airline[] = airlines;
