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

const jfk = airports[0];
const lax = airports[1];

function generateFlights(): Flight[] {
  const flights: Flight[] = [];
  const baseDate = "2026-07-15";

  const flightTemplates = [
    // Non-stop flights
    { airline: airlines[0], flightNum: "AA 101", depHour: 6, depMin: 30, duration: 355, price: 389, stops: "nonstop" as const, seats: 42, refundable: true, tags: ["Best Value"] },
    { airline: airlines[1], flightNum: "DL 205", depHour: 8, depMin: 15, duration: 360, price: 412, stops: "nonstop" as const, seats: 28, refundable: true, tags: ["Popular"] },
    { airline: airlines[2], flightNum: "UA 310", depHour: 10, depMin: 0, duration: 365, price: 375, stops: "nonstop" as const, seats: 55, refundable: false },
    { airline: airlines[3], flightNum: "BA 178", depHour: 11, depMin: 45, duration: 350, price: 520, stops: "nonstop" as const, seats: 12, refundable: true, tags: ["Premium"] },
    { airline: airlines[5], flightNum: "EK 201", depHour: 14, depMin: 30, duration: 380, price: 495, stops: "nonstop" as const, seats: 8, refundable: true },
    { airline: airlines[6], flightNum: "SQ 25", depHour: 16, depMin: 0, duration: 370, price: 550, stops: "nonstop" as const, seats: 3, refundable: true, tags: ["Premium"] },
    { airline: airlines[4], flightNum: "LH 401", depHour: 18, depMin: 20, duration: 375, price: 445, stops: "nonstop" as const, seats: 34, refundable: false },
    { airline: airlines[7], flightNum: "AF 007", depHour: 20, depMin: 10, duration: 365, price: 430, stops: "nonstop" as const, seats: 19, refundable: true },
    { airline: airlines[0], flightNum: "AA 109", depHour: 22, depMin: 0, duration: 355, price: 349, stops: "nonstop" as const, seats: 61, refundable: false, tags: ["Late Night Deal"] },

    // 1-stop flights
    { airline: airlines[2], flightNum: "UA 550", depHour: 5, depMin: 45, duration: 510, price: 285, stops: "1-stop" as const, seats: 44, refundable: false, tags: ["Cheapest"] },
    { airline: airlines[1], flightNum: "DL 422", depHour: 7, depMin: 30, duration: 485, price: 310, stops: "1-stop" as const, seats: 37, refundable: false },
    { airline: airlines[0], flightNum: "AA 335", depHour: 9, depMin: 15, duration: 495, price: 298, stops: "1-stop" as const, seats: 52, refundable: false, tags: ["Budget Friendly"] },
    { airline: airlines[4], flightNum: "LH 450", depHour: 12, depMin: 0, duration: 520, price: 365, stops: "1-stop" as const, seats: 25, refundable: true },
    { airline: airlines[7], flightNum: "AF 120", depHour: 13, depMin: 45, duration: 500, price: 340, stops: "1-stop" as const, seats: 30, refundable: false },
    { airline: airlines[5], flightNum: "EK 215", depHour: 15, depMin: 20, duration: 530, price: 385, stops: "1-stop" as const, seats: 18, refundable: true },
    { airline: airlines[6], flightNum: "SQ 77", depHour: 17, depMin: 10, duration: 505, price: 410, stops: "1-stop" as const, seats: 22, refundable: false },
    { airline: airlines[3], flightNum: "BA 285", depHour: 19, depMin: 0, duration: 490, price: 378, stops: "1-stop" as const, seats: 31, refundable: true },
    { airline: airlines[8], flightNum: "JL 60", depHour: 21, depMin: 30, duration: 540, price: 325, stops: "1-stop" as const, seats: 15, refundable: false },
    { airline: airlines[9], flightNum: "QF 12", depHour: 23, depMin: 15, duration: 515, price: 355, stops: "1-stop" as const, seats: 40, refundable: true },

    // 2-stop flights
    { airline: airlines[2], flightNum: "UA 880", depHour: 4, depMin: 0, duration: 720, price: 215, stops: "2-stop" as const, seats: 60, refundable: false, tags: ["Budget"] },
    { airline: airlines[1], flightNum: "DL 660", depHour: 6, depMin: 0, duration: 690, price: 245, stops: "2-stop" as const, seats: 48, refundable: false },
    { airline: airlines[0], flightNum: "AA 550", depHour: 9, depMin: 30, duration: 710, price: 230, stops: "2-stop" as const, seats: 55, refundable: false, tags: ["Budget"] },
    { airline: airlines[4], flightNum: "LH 700", depHour: 11, depMin: 15, duration: 750, price: 275, stops: "2-stop" as const, seats: 20, refundable: false },
    { airline: airlines[8], flightNum: "JL 85", depHour: 14, depMin: 0, duration: 735, price: 260, stops: "2-stop" as const, seats: 35, refundable: false },
    { airline: airlines[9], flightNum: "QF 40", depHour: 16, depMin: 45, duration: 700, price: 250, stops: "2-stop" as const, seats: 42, refundable: false },
    { airline: airlines[7], flightNum: "AF 300", depHour: 19, depMin: 30, duration: 680, price: 240, stops: "2-stop" as const, seats: 38, refundable: false },
    { airline: airlines[5], flightNum: "EK 405", depHour: 22, depMin: 30, duration: 760, price: 290, stops: "2-stop" as const, seats: 14, refundable: false },
    { airline: airlines[3], flightNum: "BA 410", depHour: 1, depMin: 30, duration: 740, price: 220, stops: "2-stop" as const, seats: 50, refundable: false, tags: ["Red Eye Budget"] },
    { airline: airlines[6], flightNum: "SQ 90", depHour: 3, depMin: 0, duration: 770, price: 270, stops: "2-stop" as const, seats: 26, refundable: false },
    { airline: airlines[1], flightNum: "DL 890", depHour: 8, depMin: 0, duration: 705, price: 238, stops: "2-stop" as const, seats: 33, refundable: false },
    { airline: airlines[2], flightNum: "UA 999", depHour: 13, depMin: 0, duration: 695, price: 225, stops: "2-stop" as const, seats: 45, refundable: false },
    { airline: airlines[0], flightNum: "AA 777", depHour: 15, depMin: 30, duration: 715, price: 255, stops: "2-stop" as const, seats: 29, refundable: false },
  ];

  flightTemplates.forEach((template, index) => {
    const depHourStr = template.depHour.toString().padStart(2, "0");
    const depMinStr = template.depMin.toString().padStart(2, "0");
    const arrivalMinutes = template.depHour * 60 + template.depMin + template.duration;
    const arrHour = Math.floor(arrivalMinutes / 60) % 24;
    const arrMin = arrivalMinutes % 60;
    const arrHourStr = arrHour.toString().padStart(2, "0");
    const arrMinStr = arrMin.toString().padStart(2, "0");

    const arrivalDateOffset = arrHour < template.depHour ? 1 : 0;
    const arrivalDate = new Date(baseDate);
    arrivalDate.setDate(arrivalDate.getDate() + arrivalDateOffset);

    flights.push({
      id: `FL-${(index + 1).toString().padStart(3, "0")}`,
      segments: [
        {
          airline: template.airline,
          flightNumber: template.flightNum,
          origin: jfk,
          destination: lax,
          departureTime: `${baseDate}T${depHourStr}:${depMinStr}:00`,
          arrivalTime: `${arrivalDate.toISOString().split("T")[0]}T${arrHourStr}:${arrMinStr}:00`,
          duration: template.duration,
          aircraft: ["Boeing 737", "Airbus A320", "Boeing 787", "Airbus A350", "Boeing 777"][index % 5],
        },
      ],
      totalPrice: template.price,
      currency: "USD",
      stops: template.stops,
      totalDuration: template.duration,
      isRefundable: template.refundable,
      seatsAvailable: template.seats,
      tags: template.tags,
    });
  });

  return flights;
}

export const mockFlights = generateFlights();

export const popularAirports: Airport[] = airports;

export const allAirlines: Airline[] = airlines;
