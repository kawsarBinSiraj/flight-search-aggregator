# ✈️ AeroFly — Flight Search Aggregator

A modern, full-featured flight search and booking aggregator built with **Next.js 16**, **React 19**, and **TypeScript**. AeroFly lets users search for flights across airlines, apply real-time filters and sorting, and complete a multi-step booking flow — all with JWT-based authentication and Google OAuth support.

> **Demo credentials:** `admin@example.com` / `password123`

---

## 📑 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Available Scripts](#-available-scripts)
- [Key Pages & Routes](#-key-pages--routes)
- [API Endpoints](#-api-endpoints)
- [Authentication](#-authentication)
- [State Management](#-state-management)
- [Form Validation](#-form-validation)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🚀 Features

### Flight Search
- **Smart search** with origin, destination, departure date, and passenger count
- **URL-based search params** — shareable and bookmarkable flight searches
- **Real-time filtering** by price, stops, airlines, departure time, and duration
- **Multi-sort** — sort by price, duration, departure time, or arrival time (asc/desc)
- **Flight tags** — "Best Value", "Popular", "Premium", "Cheapest", "Budget Friendly", etc.

### Booking System
- **Multi-step booking flow** — Review → Passenger Details → Confirmation
- **Dynamic passenger forms** — add details for each traveler
- **Booking confirmation** with reference number and copy-to-clipboard
- **Seat availability** checks before booking

### Authentication & Security
- **JWT-based authentication** with HS256 signing (24-hour token expiry)
- **Google OAuth** integration via `@react-oauth/google`
- **Cookie-based token storage** with `js-cookie`
- **Middleware route guards** — protected routes redirect to login with callback URL
- **Auth-only route protection** — logged-in users redirected away from login/signup
- **Password reset flow** with email-based mock OTP verification

### User Experience
- **Dark/Light theme** toggle via `next-themes`
- **Responsive design** with mobile-first Tailwind CSS
- **Loading skeletons** for smooth perceived performance
- **Toast notifications** via Sonner
- **Top loading bar** via `nextjs-toploader`
- **Accessible UI** components from shadcn/ui (Radix-based)

---

## 🛠 Tech Stack

| Category | Technology | Version |
|----------|-----------|---------|
| **Framework** | Next.js (App Router) | 16.1.6 |
| **UI Library** | React | 19.2.3 |
| **Language** | TypeScript | ^5 |
| **Styling** | Tailwind CSS | 4 |
| **Components** | shadcn/ui (Radix UI) | 1.6.0 |
| **State Management** | Zustand | ^5.0.11 |
| **Data Fetching** | TanStack React Query | ^5.90.21 |
| **HTTP Client** | Axios | ^1.13.6 |
| **Forms** | React Hook Form | ^7.71.2 |
| **Validation** | Yup | ^1.7.1 |
| **Authentication** | jose (JWT), js-cookie | ^6.1.3 |
| **OAuth** | @react-oauth/google | ^0.13.4 |
| **Date Utils** | date-fns | ^4.4.0 |
| **Icons** | Lucide React | ^0.576.0 |
| **Theming** | next-themes | ^0.4.6 |
| **Toasts** | Sonner | ^2.0.7 |

---

## 🏁 Getting Started

### Prerequisites

- **Node.js** ≥ 18.x (LTS recommended)
- **npm**, **yarn**, **pnpm**, or **bun** package manager

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd flight-search-aggregator

# Install dependencies
npm install
```

### Environment Variables

Create a `.env.local` file in the project root:

```bash
# API base URL (leave empty for same-origin / mock backend)
NEXT_PUBLIC_API_BASE_URL=

# JWT secret for token signing (fallback: dev secret built-in)
NEXT_PUBLIC_JWT_SECRET=your-secret-key-here

# Google OAuth Client ID
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Allow search engine crawling ("true" to enable)
NEXT_PUBLIC_ALLOW_CRAWL=
```

> **Note:** The app works out of the box with mock data. Environment variables are optional for local development.

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

The build produces a **standalone** output (configured in `next.config.ts`) suitable for Docker deployments.

---

## 📂 Project Structure

```
flight-search-aggregator/
├── components.json              # shadcn/ui configuration
├── eslint.config.mjs            # ESLint configuration
├── next.config.ts               # Next.js config (standalone output)
├── package.json                 # Dependencies and scripts
├── postcss.config.mjs           # PostCSS configuration
├── tsconfig.json                # TypeScript configuration
│
├── public/                      # Static assets
│
└── src/
    ├── global.d.ts              # Global TypeScript declarations
    ├── proxy.ts                 # Middleware: route guards & auth
    │
    ├── app/                     # Next.js App Router
    │   ├── globals.css          # Tailwind + shadcn theme tokens
    │   ├── layout.tsx           # Root layout (providers, fonts)
    │   ├── robots.ts            # SEO: crawl rules
    │   ├── sitemap.ts           # SEO: public route sitemap
    │   │
    │   ├── (public)/            # Public route group
    │   │   ├── layout.tsx       # Public layout (header + footer)
    │   │   ├── page.tsx         # Home page (search hero)
    │   │   └── flight-search/
    │   │       └── page.tsx     # Flight search results
    │   │
    │   ├── (auth)/              # Auth route group
    │   │   ├── layout.tsx       # Auth layout (centered card)
    │   │   ├── login/page.tsx
    │   │   ├── signup/page.tsx
    │   │   ├── forgot/page.tsx
    │   │   ├── reset/page.tsx
    │   │   └── verify/page.tsx
    │   │
    │   ├── (protected)/         # Protected route group
    │   │   ├── layout.tsx       # Protected layout (auth required)
    │   │   ├── dashboard/
    │   │   │   └── page.tsx     # User dashboard
    │   │   └── booking/
    │   │       └── [id]/
    │   │           └── page.tsx # Booking flow
    │   │
    │   └── api/                 # API Routes (mock backend)
    │       ├── flights/
    │       │   ├── route.ts           # GET: search flights
    │       │   ├── [id]/route.ts      # GET: single flight
    │       │   └── filter/route.ts    # POST: filter & sort
    │       └── bookings/
    │           └── route.ts           # POST: create booking
    │
    ├── components/
    │   ├── features/            # Feature-specific components
    │   │   ├── flight/          # Flight search & display
    │   │   ├── booking/         # Booking flow
    │   │   └── auth/            # Auth forms
    │   ├── page-layouts/        # Header & footer
    │   ├── section-layouts/     # Page section wrappers
    │   ├── shared/              # Reusable (empty state, skeletons)
    │   └── ui/                  # shadcn/ui primitives
    │
    ├── hooks/                   # Custom React hooks
    │   ├── use-mobile.ts
    │   ├── use-toast.ts
    │   └── auth/                # Auth hooks (login, signup, etc.)
    │
    ├── lib/                     # Utility libraries
    │   ├── cookies.ts           # Cookie management
    │   ├── format.ts            # Date/currency/duration formatters
    │   ├── jwt.ts               # JWT sign & verify
    │   ├── mock-data.ts         # 30 mock flights, airports, airlines
    │   ├── utils.ts             # cn() utility
    │   └── validators.ts        # Yup validation schemas
    │
    ├── providers/               # React context providers
    │   ├── query-provider.tsx   # TanStack Query
    │   └── theme-provider.tsx   # next-themes
    │
    ├── services/                # API service layer
    │   ├── api.ts               # Axios instance + interceptors
    │   ├── auth-service.ts
    │   ├── booking-service.ts
    │   └── flight-service.ts
    │
    ├── store/                   # Zustand state stores
    │   ├── auth-store.ts
    │   ├── flight-store.ts
    │   └── ui-store.ts
    │
    ├── types/                   # TypeScript type definitions
    │   └── index.ts
    │
    └── utils/
        └── constants.ts         # Route constants
```

---

## 📜 Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `next dev` | Start development server with hot reload |
| `build` | `next build` | Create optimized production build |
| `start` | `next start` | Start production server |
| `lint` | `eslint` | Run ESLint for code quality checks |
| `format` | `prettier --write .` | Format all files with Prettier |

---

## 🗺 Key Pages & Routes

### Public Routes

| Route | Page | Description |
|-------|------|-------------|
| `/` | Home | Landing page with flight search hero form |
| `/flight-search` | Search Results | Flight cards with filters & sorting sidebar |

### Auth Routes

| Route | Page | Description |
|-------|------|-------------|
| `/login` | Login | Email/password form with Google OAuth |
| `/signup` | Sign Up | Registration form with password confirmation |
| `/forgot` | Forgot Password | Email entry for password reset |
| `/reset` | Reset Password | New password entry with confirmation |
| `/verify` | Email Verification | 6-digit OTP input |

### Protected Routes (require authentication)

| Route | Page | Description |
|-------|------|-------------|
| `/dashboard` | Dashboard | User profile display with logout |
| `/booking/[id]` | Booking | Multi-step booking flow for a flight |

---

## 🔌 API Endpoints

All endpoints are **mock implementations** returning simulated data with artificial delays.

### `GET /api/flights`

Search for flights.

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `origin` | `string` | ✅ | Airport IATA code (e.g., `JFK`) |
| `destination` | `string` | ✅ | Airport IATA code (e.g., `LAX`) |
| `date` | `string` | ✅ | Departure date (`YYYY-MM-DD`) |
| `passengers` | `number` | ❌ | Number of passengers (default: `1`) |

**Response:** `Flight[]` — prices multiplied by passenger count.

### `GET /api/flights/[id]`

Get a single flight by ID. Returns `Flight` or `404`.

### `POST /api/flights/filter`

Apply filters and sorting to a flight list.

```json
{
  "flights": [...],
  "filters": {
    "maxPrice": 500,
    "stops": ["nonstop", "1-stop"],
    "airlines": ["AA", "DL"],
    "departureTimeRange": [6, 18],
    "maxDuration": 360
  },
  "sortField": "price",
  "sortDirection": "asc"
}
```

### `POST /api/bookings`

Create a flight booking. Returns `BookingConfirmation` with reference number.

---

## 🔐 Authentication

### Flow

1. **Login** → Credentials validated against mock user store
2. **JWT Created** → Signed with HS256 via `jose`, 24-hour expiry
3. **Token Stored** → `access_token` cookie via `js-cookie`
4. **API Requests** → Axios adds `Authorization: Bearer <token>` header
5. **Route Protection** → Middleware checks cookie; missing/invalid → redirect to `/login`
6. **401 Handling** → Axios interceptor clears state and redirects

### Demo Credentials

```
Email:    admin@example.com
Password: password123
```

### Google OAuth

Set `NEXT_PUBLIC_GOOGLE_CLIENT_ID` in `.env.local` to enable Google Sign-In.

---

## 📦 State Management

### Zustand Stores

| Store | File | Purpose | Persisted |
|-------|------|---------|-----------|
| `authStore` | `store/auth-store.ts` | User & auth state | ✅ localStorage |
| `flightStore` | `store/flight-store.ts` | Selected flight & booking state | ✅ sessionStorage |
| `uiStore` | `store/ui-store.ts` | Sidebar & modal state | ❌ |

### React Query

- **Stale time:** 60s | **Retries:** 1 | **Refetch on focus:** disabled
- **Mutations:** 0 retries (fail fast)
- **Auto-logout on 401** via Axios response interceptor

---

## ✅ Form Validation

All forms use **React Hook Form** + **Yup** schemas.

| Schema | Fields |
|--------|--------|
| **Search** | `origin` (required) · `destination` (required, ≠ origin) · `departureDate` (required) · `passengers` (1–9) |
| **Passenger** | `firstName`/`lastName` (≥2 chars) · `email` (valid) · `phone` (7–15 digits) · `dateOfBirth` (required) · `passportNumber` (≥6 chars) · `nationality` (≥2 chars) |
| **Booking** | Array of passengers (≥1) · `contactEmail` · `contactPhone` · `specialRequests` (optional) |

---
