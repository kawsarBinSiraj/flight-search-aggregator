# 🏗 AeroFly — Architecture Document

This document provides a deep technical overview of the AeroFly flight search aggregator's architecture, data flow, design patterns, and key implementation decisions.

---

## 📑 Table of Contents

- [High-Level Architecture](#-high-level-architecture)
- [Architectural Patterns](#-architectural-patterns)
- [Data Flow](#-data-flow)
  - [Flight Search Flow](#flight-search-flow)
  - [Booking Flow](#booking-flow)
  - [Authentication Flow](#authentication-flow)
- [Layer Breakdown](#-layer-breakdown)
  - [Presentation Layer](#1-presentation-layer)
  - [State Layer](#2-state-layer)
  - [Service Layer](#3-service-layer)
  - [API Layer](#4-api-layer)
  - [Utility Layer](#5-utility-layer)
- [Routing Architecture](#-routing-architecture)
  - [Route Groups](#route-groups)
  - [Middleware & Route Guards](#middleware--route-guards)
- [Authentication Architecture](#-authentication-architecture)
  - [JWT Strategy](#jwt-strategy)
  - [Cookie Management](#cookie-management)
  - [Auth Hooks](#auth-hooks)
  - [Middleware Auth Flow](#middleware-auth-flow)
- [State Management Architecture](#-state-management-architecture)
  - [Zustand Stores](#zustand-stores)
  - [React Query Integration](#react-query-integration)
- [Component Architecture](#-component-architecture)
  - [Component Hierarchy](#component-hierarchy)
  - [Feature Components](#feature-components)
  - [Shared Components](#shared-components)
  - [UI Primitives](#ui-primitives)
- [API Architecture](#-api-architecture)
  - [Mock Backend Design](#mock-backend-design)
  - [Request/Response Pipeline](#requestresponse-pipeline)
- [Validation Architecture](#-validation-architecture)
- [Styling Architecture](#-styling-architecture)
- [Data Models](#-data-models)
- [Error Handling](#-error-handling)
- [Performance Considerations](#-performance-considerations)
- [Security Considerations](#-security-considerations)
- [File Dependency Map](#-file-dependency-map)
- [Future Architecture Considerations](#-future-architecture-considerations)

---

## 🔭 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                         │
│                                                                 │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌─────────────┐  │
│  │  Public    │  │   Auth    │  │ Protected │  │   Shared    │  │
│  │  Pages    │  │  Pages    │  │  Pages    │  │ Components  │  │
│  └─────┬─────┘  └─────┬─────┘  └─────┬─────┘  └─────────────┘  │
│        │              │              │                           │
│  ┌─────┴──────────────┴──────────────┴──────────────────────┐   │
│  │              React Component Tree                         │   │
│  │    (Providers → Layouts → Feature Components → UI)       │   │
│  └──────────────────────┬────────────────────────────────────┘   │
│                         │                                        │
│  ┌──────────────────────┴────────────────────────────────────┐   │
│  │                   STATE LAYER                             │   │
│  │   ┌──────────┐  ┌──────────┐  ┌──────────┐              │   │
│  │   │  Zustand │  │  React   │  │  React   │              │   │
│  │   │  Stores  │  │  Query   │  │  Hook    │              │   │
│  │   │(Auth/Flt │  │  Cache   │  │  Form    │              │   │
│  │   │  /UI)    │  │          │  │          │              │   │
│  │   └────┬─────┘  └────┬─────┘  └────┬─────┘              │   │
│  │        │              │              │                    │   │
│  └────────┼──────────────┼──────────────┼────────────────────┘   │
│           │              │              │                         │
│  ┌────────┴──────────────┴──────────────┴────────────────────┐   │
│  │                  SERVICE LAYER                            │   │
│  │   ┌──────────┐  ┌──────────┐  ┌──────────┐              │   │
│  │   │  Flight  │  │ Booking  │  │   Auth   │              │   │
│  │   │ Service  │  │ Service  │  │ Service  │              │   │
│  │   └────┬─────┘  └────┬─────┘  └────┬─────┘              │   │
│  │        │              │              │                    │   │
│  │   ┌────┴──────────────┴──────────────┴────┐              │   │
│  │   │       Axios HTTP Client (api.ts)      │              │   │
│  │   │   (JWT Interceptor + 401 Handler)     │              │   │
│  │   └────────────────┬──────────────────────┘              │   │
│  └────────────────────┼─────────────────────────────────────┘   │
└───────────────────────┼─────────────────────────────────────────┘
                        │ HTTP
┌───────────────────────┼─────────────────────────────────────────┐
│                  SERVER (Next.js)                                │
│   ┌───────────────────┴─────────────────────────────────────┐   │
│   │                    MIDDLEWARE                            │   │
│   │            (proxy.ts — Route Guards)                    │   │
│   └───────────────────┬─────────────────────────────────────┘   │
│                       │                                         │
│   ┌───────────────────┴─────────────────────────────────────┐   │
│   │                   API ROUTES                            │   │
│   │   ┌──────────┐  ┌──────────┐  ┌──────────┐            │   │
│   │   │ /flights │  │/flights/ │  │/bookings │            │   │
│   │   │  (GET)   │  │ [id]/    │  │  (POST)  │            │   │
│   │   │          │  │filter/   │  │          │            │   │
│   │   └──────────┘  └──────────┘  └──────────┘            │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │                  MOCK DATA LAYER                        │   │
│   │         (lib/mock-data.ts — 30 flights)                │   │
│   └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🧩 Architectural Patterns

| Pattern | Where Applied | Purpose |
|---------|--------------|---------|
| **Route Groups** | `(public)`, `(auth)`, `(protected)` | Shared layouts without affecting URL structure |
| **Middleware Guard** | `proxy.ts` | Centralized auth checks before page renders |
| **Service Layer** | `services/*.ts` | Abstracted API calls away from components |
| **Repository Pattern** | `lib/mock-data.ts` | Mock data as stand-in for database |
| **Store Pattern** | `store/*.ts` | Zustand global state with selective persistence |
| **Custom Hooks** | `hooks/**/*.ts` | Encapsulated business logic (auth, queries) |
| **Provider Pattern** | `providers/*.tsx` | Context-based dependency injection |
| **Compound Components** | Booking form, flight results | Multi-step flows with shared state |
| **Schema Validation** | `lib/validators.ts` | Declarative Yup schemas for all forms |
| **Interceptors** | `services/api.ts` | Centralized JWT injection & error handling |
| **URL State** | Flight search page | Search params as source of truth for queries |

---

## 🔄 Data Flow

### Flight Search Flow

```
┌──────────┐     ┌───────────┐     ┌──────────┐     ┌──────────┐
│  User    │────▶│  Search   │────▶│  URL     │────▶│  Page    │
│  Input   │     │  Form     │     │  Params  │     │  Mount   │
└──────────┘     └───────────┘     └──────────┘     └────┬─────┘
                                                         │
                                                         ▼
┌──────────┐     ┌───────────┐     ┌──────────┐     ┌──────────┐
│  Flight  │◀────│  React    │◀────│  Flight  │◀────│  useQuery│
│  Results │     │  Query    │     │  Service │     │  Hook    │
│  Render  │     │  Cache    │     │          │     │          │
└────┬─────┘     └───────────┘     └────┬─────┘     └──────────┘
     │                                   │
     ▼                                   ▼
┌──────────┐                       ┌──────────┐
│  User    │                       │  Axios   │
│  Selects │                       │  GET     │
│  Flight  │                       │/api/flights
└────┬─────┘                       └──────────┘
     │
     ▼
┌──────────┐     ┌───────────┐
│  Zustand │────▶│  Navigate │
│  flight  │     │ to booking│
│  store   │     │  /[id]    │
└──────────┘     └───────────┘
```

**Detailed Steps:**

1. User fills in search form (origin, destination, date, passengers)
2. Form submits → navigates to `/flight-search?origin=JFK&destination=LAX&date=2026-06-25&passengers=2`
3. `FlightSearchPage` reads URL params via `useSearchParams()`
4. `useQuery()` calls `flightService.searchFlights(params)`
5. Flight service → Axios `GET /api/flights?origin=JFK&...`
6. API route filters `mockFlights`, multiplies price × passengers, returns `Flight[]`
7. Results cached by React Query (60s stale time)
8. `FlightResults` renders `FlightCard` for each result
9. User applies filters → `flightService.filterFlights()` via `POST /api/flights/filter`
10. User selects flight → stored in `flightStore` → navigate to `/booking/[id]`

### Booking Flow

```
┌──────────┐     ┌───────────┐     ┌──────────┐     ┌──────────┐
│  Flight  │────▶│  Check    │────▶│  Load    │────▶│  Step 1: │
│  Selected│     │  Auth     │     │  Flight  │     │  Review  │
└──────────┘     │  Status   │     │  Details │     └────┬─────┘
                 └───────────┘     └──────────┘          │
                                                          ▼
┌──────────┐     ┌───────────┐     ┌──────────┐     ┌──────────┐
│  Step 3: │◀────│  POST     │◀────│  Step 2: │◀────│  Fill    │
│  Confir- │     │  /api/    │     │  Passen- │     │  Details │
│  mation  │     │  bookings │     │  gers    │     │          │
└──────────┘     └───────────┘     └──────────┘     └──────────┘
```

**Detailed Steps:**

1. User arrives at `/booking/[id]` with flight ID in URL
2. Protected layout checks JWT cookie → redirect to `/login` if missing
3. `BookingPage` loads flight from Zustand store or fetches via `GET /api/flights/[id]`
4. **Step 1 — Review:** Flight summary displayed with price breakdown
5. **Step 2 — Passenger Details:** Dynamic form for each passenger (React Hook Form + Yup)
6. **Step 3 — Confirmation:** `bookingService.createBooking()` → `POST /api/bookings`
7. API validates seat availability, generates booking reference (`BK-xxxxx-xxxx`)
8. Confirmation screen with booking reference, copy-to-clipboard, print option

### Authentication Flow

```
┌──────────┐     ┌───────────┐     ┌──────────┐     ┌──────────┐
│  Login   │────▶│  useLogin │────▶│  Auth    │────▶│  signToken│
│  Form    │     │  Hook     │     │  Service │     │  (JWT)   │
└──────────┘     └───────────┘     └──────────┘     └────┬─────┘
                                                         │
     ┌───────────────────────────────────────────────────┘
     ▼
┌──────────┐     ┌───────────┐     ┌──────────┐     ┌──────────┐
│  Cookie  │────▶│  Zustand  │────▶│  React   │────▶│  Redirect│
│  Set     │     │  Auth     │     │  Query   │     │  to Dash │
│          │     │  Store    │     │  Reset   │     │  board   │
└──────────┘     └───────────┘     └──────────┘     └──────────┘
```

---

## 📦 Layer Breakdown

### 1. Presentation Layer

**Location:** `src/components/`, `src/app/`

Responsible for rendering UI and capturing user input. Organized by concern:

```
components/
├── features/           # Domain-specific, stateful components
│   ├── flight/         # Flight search, results, cards, filters
│   ├── booking/        # Multi-step booking form, confirmation
│   └── auth/           # Login, signup, password reset forms
├── page-layouts/       # Page-level chrome (header, footer)
├── section-layouts/    # Section wrappers (hero search, dashboard)
├── shared/             # Cross-cutting (empty states, skeletons)
└── ui/                 # Design system primitives (shadcn/ui)
```

**Key Design Decisions:**
- Feature components are **stateful** — they manage their own React Query calls and form state
- UI primitives are **stateless** — pure presentation via shadcn/ui
- Layouts compose features with page chrome (header/footer)

### 2. State Layer

**Location:** `src/store/`, `src/hooks/`, `src/providers/`

Three complementary state management strategies:

| Strategy | Tool | Use Case |
|----------|------|----------|
| **Global Client State** | Zustand | Auth user, selected flight, UI flags |
| **Server State** | React Query | Flight search results, API data |
| **Form State** | React Hook Form | Input values, validation, submission |
| **URL State** | `useSearchParams` | Search query params (shareable) |

### 3. Service Layer

**Location:** `src/services/`

Encapsulates all HTTP communication. Components never call Axios directly.

```typescript
// services/flight-service.ts
export const flightService = {
    searchFlights: (params)  => api.get('/api/flights', { params }),
    getFlightById: (id)      => api.get(`/api/flights/${id}`),
    filterFlights: (payload) => api.post('/api/flights/filter', payload),
};
```

**Benefits:**
- Single source of truth for API contracts
- Easy to swap mock → real API
- Centralized error handling via Axios interceptors

### 4. API Layer

**Location:** `src/app/api/`

Next.js Route Handlers serving as a mock backend:

| Route | Method | Handler | Delay |
|-------|--------|---------|-------|
| `/api/flights` | GET | Search & filter by params | 800ms |
| `/api/flights/[id]` | GET | Single flight lookup | 300ms |
| `/api/flights/filter` | POST | Multi-criteria filter + sort | 300ms |
| `/api/bookings` | POST | Create booking | 1200ms |

### 5. Utility Layer

**Location:** `src/lib/`, `src/utils/`

Pure functions and configuration:

| Module | Purpose |
|--------|---------|
| `jwt.ts` | Token signing (HS256) and verification via `jose` |
| `cookies.ts` | Cookie read/write abstraction over `js-cookie` |
| `format.ts` | Date, currency, duration, and stop-label formatters |
| `validators.ts` | Yup schemas for search, passenger, and booking forms |
| `mock-data.ts` | 30 flights across 10 airlines, 8 airports |
| `utils.ts` | `cn()` — Tailwind class name merger |
| `constants.ts` | Route paths and protected/auth-only route lists |

---

## 🛣 Routing Architecture

### Route Groups

Next.js route groups (parenthesized folders) share layouts without affecting URLs:

```
src/app/
├── (public)/           → /, /flight-search
│   └── layout.tsx          Header + Footer
├── (auth)/             → /login, /signup, /forgot, /reset, /verify
│   └── layout.tsx          Centered card layout
└── (protected)/        → /dashboard, /booking/[id]
    └── layout.tsx          Auth guard + header
```

### Middleware & Route Guards

**File:** `src/proxy.ts`

The middleware runs on every request (excluding `/api`, `/_next`, static files):

```
Request → Middleware
    │
    ├── Is Protected Route? (/dashboard, /booking)
    │   ├── No token → Redirect to /login?callbackUrl=<path>
    │   ├── Invalid token → Clear cookie → Redirect to /login
    │   └── Valid token → Allow ✓
    │
    ├── Is Auth Route? (/login, /signup, /forgot, /reset, /verify)
    │   ├── Has valid token → Redirect to /dashboard
    │   └── No/invalid token → Allow ✓
    │
    └── Public Route → Allow ✓
```

**Key Design Decisions:**
- `callbackUrl` query param preserves the user's intended destination
- Auth routes redirect authenticated users away (prevents seeing login when already logged in)
- Token verification happens server-side in middleware (not just client-side)

---

## 🔐 Authentication Architecture

### JWT Strategy

**File:** `src/lib/jwt.ts`

```
┌──────────────┐
│   Payload    │     ┌──────────────┐     ┌──────────────┐
│  { userId,   │────▶│  signToken   │────▶│  JWT String  │
│   email,     │     │  (HS256)     │     │  (24h exp)   │
│   name }     │     │  jose lib    │     │              │
└──────────────┘     └──────────────┘     └──────┬───────┘
                                                  │
     ┌────────────────────────────────────────────┘
     ▼
┌──────────────┐     ┌──────────────┐
│  verifyToken │────▶│  Valid?      │
│  (HS256)     │     │  - Signature │
│              │     │  - Expiry    │
└──────────────┘     └──────────────┘
```

- **Algorithm:** HS256 (HMAC-SHA256)
- **Expiry:** 24 hours
- **Secret:** `NEXT_PUBLIC_JWT_SECRET` env var or hardcoded dev fallback
- **Library:** `jose` (standards-compliant, Web Crypto API)

### Cookie Management

**File:** `src/lib/cookies.ts`

| Function | Action | Cookie Name |
|----------|--------|-------------|
| `setTokenCookie(token)` | Set cookie | `access_token` |
| `getTokenCookie()` | Read cookie | `access_token` |
| `removeTokenCookie()` | Delete cookie | `access_token` |

**Cookie Options:**
- `path: "/"` — available across all routes
- `sameSite: "lax"` — CSRF protection
- `secure: true` (production only) — HTTPS-only

### Auth Hooks

**Directory:** `src/hooks/auth/`

```
useLogin()          → Validate credentials → signToken → setCookie → updateStore → redirect
useSignup()         → Register user → auto-login → redirect
useLogout()         → clearCookie → clearStore → clearQueryCache → redirect to /
useProfile()        → GET /api/profile → sync to Zustand (enabled when authenticated)
useResetPassword()  → POST /api/forgot-password (mock: always succeeds)
useNewPassword()    → POST /api/reset-password (mock flow)
useVerifyEmail()    → POST /api/verify-email (mock OTP flow)
```

### Middleware Auth Flow

```
┌──────────┐     ┌───────────┐     ┌──────────┐     ┌──────────┐
│  Request │────▶│  Read     │────▶│  Verify  │────▶│  Allow / │
│  to /x   │     │  Cookie   │     │  JWT     │     │  Redirect│
└──────────┘     └───────────┘     └──────────┘     └──────────┘
```

---

## 📊 State Management Architecture

### Zustand Stores

#### `authStore` (Persisted → localStorage)

```typescript
interface AuthStore {
    user: User | null;
    isAuthenticated: boolean;
    setUser: (user: User) => void;
    clearAuth: () => void;
}
```

**Persistence:** localStorage — survives page refreshes and browser restarts.

#### `flightStore` (Persisted → sessionStorage)

```typescript
interface FlightStore {
    selectedFlight: Flight | null;
    passengerCount: number;
    bookingStep: number;
    bookingConfirmation: BookingConfirmation | null;
    // ... setters
}
```

**Persistence:** sessionStorage — survives page refreshes within a tab, cleared when tab closes.

#### `uiStore` (No persistence)

```typescript
interface UIStore {
    isSidebarOpen: boolean;
    isModalOpen: boolean;
    modalContent: React.ReactNode | null;
    // ... setters
}
```

**No persistence:** Transient UI state, reset on page load.

### React Query Integration

**File:** `src/providers/query-provider.tsx`

```typescript
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 60_000,      // Data fresh for 60 seconds
            retry: 1,               // Retry failed queries once
            refetchOnWindowFocus: false, // Don't refetch on tab focus
        },
        mutations: {
            retry: 0,               // Fail mutations immediately
        },
    },
});
```

**Axios Integration:**
- **Request interceptor:** Reads JWT from cookie → attaches `Authorization` header
- **Response interceptor:** On `401` → clears auth store, removes cookie, redirects to `/login`

---

## 🧱 Component Architecture

### Component Hierarchy

```
RootLayout
├── QueryProvider (React Query)
├── ThemeProvider (next-themes)
├── NextTopLoader (loading bar)
│
├── PublicLayout (header + footer)
│   ├── PageHeader
│   │   ├── Logo
│   │   ├── AuthButtons (login/signup) OR DashboardLink
│   │   └── ThemeToggle
│   ├── HomePage
│   │   └── HomeSearchForm
│   │       └── FlightSearchForm (React Hook Form + Yup)
│   ├── FlightSearchPage
│   │   └── FlightSearchPanel
│   │       ├── FlightSearchForm
│   │       ├── FlightSort
│   │       ├── FlightFilters
│   │       └── FlightResults
│   │           └── FlightCard[]
│   └── PageFooter
│
├── AuthLayout (centered card)
│   ├── LoginForm (email + password + Google OAuth)
│   ├── SignupForm
│   ├── ForgotForm
│   ├── ResetForm
│   └── VerifyForm (6-digit OTP)
│
└── ProtectedLayout (auth guard)
    ├── DashboardPage
    │   └── DashboardContent (profile + logout)
    └── BookingPage
        └── BookingForm
            ├── FlightSummary (sidebar)
            ├── Step 1: Review
            ├── Step 2: PassengerDetails
            └── Step 3: BookingConfirmation
```

### Feature Components

Feature components are **stateful** and **domain-specific**:

| Component | Responsibility | Data Source |
|-----------|---------------|-------------|
| `FlightSearchForm` | Search input with validation | React Hook Form |
| `FlightResults` | Renders flight list + empty/error states | React Query |
| `FlightCard` | Single flight display with "Book" CTA | Props |
| `FlightFilters` | Sidebar filter panel (price, stops, airlines) | React Query mutation |
| `FlightSort` | Sort controls (price, duration, time) | React Query mutation |
| `FlightSearchPanel` | Orchestrates search form + results + filters | URL params |
| `BookingForm` | Multi-step form with progress indicator | Zustand + RHF |
| `BookingConfirmation` | Success screen with booking ref | Zustand |
| `FlightSummary` | Flight details sidebar in booking | Zustand |

### Shared Components

| Component | Purpose |
|-----------|---------|
| `EmptyState` | Configurable empty/error/initial state display |
| `LoadingSkeleton` | Animated skeleton loaders for flight cards |

### UI Primitives

Built on **shadcn/ui** (Radix UI + Tailwind):

`Button` · `Card` · `Input` · `Label` · `Select` · `Checkbox` · `Slider` · `Badge` · `Separator` · `Textarea` · `AlertDialog` · `Sonner` (toast) · `Skeleton`

---

## 🔌 API Architecture

### Mock Backend Design

All API routes live in `src/app/api/` and use **Next.js Route Handlers** (`GET`, `POST`).

```
src/app/api/
├── flights/
│   ├── route.ts          # GET: search flights by params
│   ├── [id]/
│   │   └── route.ts      # GET: single flight by ID
│   └── filter/
│       └── route.ts      # POST: filter + sort flight array
└── bookings/
    └── route.ts          # POST: create booking
```

**Mock Data Source:** `src/lib/mock-data.ts`
- **30 flights** with realistic data (airlines, airports, times, prices)
- **10 airlines:** AA, DL, UA, BA, LH, EK, SQ, AF, JL, QF
- **8 airports:** JFK, LAX, ORD, LHR, CDG, DXB, SIN, NRT
- **Price range:** $215–$550
- **Tags:** Best Value, Popular, Premium, Cheapest, Budget Friendly, etc.

### Request/Response Pipeline

```
Component
    │
    ▼
React Query (useQuery / useMutation)
    │
    ▼
Service Layer (flight-service.ts)
    │
    ▼
Axios Instance (api.ts)
    ├── Request Interceptor: Attach JWT from cookie
    │
    ▼
Next.js API Route Handler
    ├── Validate params/body
    ├── Process request (filter/sort/transform mock data)
    ├── Simulate delay (300-1200ms)
    └── Return JSON response
    │
    ▼
Axios Response Interceptor
    ├── 200: Return data to React Query
    └── 401: Clear auth → Redirect to /login
    │
    ▼
React Query Cache
    │
    ▼
Component Re-render
```

---

## ✅ Validation Architecture

**File:** `src/lib/validators.ts`

All form validation uses **Yup** schemas resolved by **React Hook Form** via `@hookform/resolvers`.

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Form Input  │────▶│  RHF + Yup   │────▶│  Valid?      │
│  (user type) │     │  Resolver    │     │  - Yes → submit
└──────────────┘     └──────────────┘     │  - No → errors
                                           └──────────────┘
```

### Schema Definitions

| Schema | Fields | Key Rules |
|--------|--------|-----------|
| `searchSchema` | origin, destination, date, passengers | origin ≠ destination, passengers 1–9 |
| `passengerSchema` | firstName, lastName, email, phone, DOB, passport, nationality | Cross-field: names ≥2 chars, passport ≥6 |
| `bookingSchema` | passengers[], contactEmail, contactPhone, specialRequests | At least 1 passenger |

---

## 🎨 Styling Architecture

### Stack

```
Tailwind CSS 4 → PostCSS → CSS Variables (design tokens)
    │
    ▼
shadcn/ui (Radix primitives + Tailwind classes)
    │
    ▼
class-variance-authority (CVA) → Variant-based component styles
    │
    ▼
tailwind-merge + clsx → cn() utility for class deduplication
```

### Theme System

**File:** `src/app/globals.css`

- Uses CSS custom properties (oklch color space) for light/dark themes
- `next-themes` toggles `.dark` class on `<html>`
- `@custom-variant dark (&:is(.dark *))` — Tailwind dark mode via class strategy
- Design tokens: `--background`, `--foreground`, `--primary`, `--muted`, `--destructive`, etc.
- Border radius system: `--radius: 0.625rem` with `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`, `4xl` variants

---

## 📐 Data Models

### Flight

```typescript
interface Flight {
    id: string;
    segments: FlightSegment[];
    totalPrice: number;
    currency: "USD";
    stops: "nonstop" | "1-stop" | "2-stop";
    totalDuration: number;           // minutes
    isRefundable: boolean;
    seatsAvailable: number;
    tags?: string[];                 // "Best Value", "Premium", etc.
}

interface FlightSegment {
    airline: { code: string; name: string; logo: string };
    flightNumber: string;
    origin: Airport;
    destination: Airport;
    departureTime: string;           // ISO 8601
    arrivalTime: string;             // ISO 8601
    duration: number;                // minutes
    aircraft: string;
}

interface Airport {
    code: string;                    // "JFK"
    city: string;                    // "New York"
    name: string;                    // "John F. Kennedy International"
    country: string;                 // "US"
}
```

### User

```typescript
interface User {
    id: string;
    email: string;
    name: string;
    avatar?: string;
    provider?: "local" | "google";
}
```

### Booking

```typescript
interface BookingRequest {
    flightId: string;
    passengers: Passenger[];
    contactEmail: string;
    contactPhone: string;
    specialRequests?: string;
}

interface Passenger {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    passportNumber: string;
    nationality: string;
}

interface BookingConfirmation {
    bookingReference: string;        // "BK-xxxxx-xxxx"
    flight: Flight;
    passengers: Passenger[];
    totalPrice: number;
    currency: "USD";
    bookingDate: string;             // ISO 8601
    status: "confirmed";
}
```

### Filter State

```typescript
interface FlightFilters {
    maxPrice: number;
    stops: ("nonstop" | "1-stop" | "2-stop")[];
    airlines: string[];              // airline codes
    departureTimeRange: [number, number]; // 0-24 hours
    maxDuration: number;             // minutes
}
```

---

## ⚠️ Error Handling

### Client-Side

| Layer | Strategy |
|-------|----------|
| **Forms** | Yup validation errors displayed inline per field |
| **React Query** | `error` state → `EmptyState` component with retry |
| **Axios 401** | Response interceptor → auto-logout + redirect |
| **Axios Network** | Caught by React Query → retry once → show error |
| **Route Guards** | Middleware redirects to login (no error shown) |

### Server-Side (API Routes)

| Scenario | Response |
|----------|----------|
| Missing params | `400 Bad Request` with message |
| Flight not found | `404 Not Found` |
| No seats available | `400 Bad Request` |
| Success | `200`/`201` with data |

---

## ⚡ Performance Considerations

| Technique | Implementation |
|-----------|---------------|
| **React Query caching** | 60s stale time prevents redundant fetches |
| **Standalone build** | `output: "standalone"` for minimal Docker images |
| **Next.js code splitting** | Automatic per-route code splitting |
| **Zustand selective subscriptions** | Components only re-render on relevant state changes |
| **URL-based search state** | No unnecessary client state for search params |
| **Loading skeletons** | Perceived performance during data fetching |
| **No refetch on focus** | Prevents unnecessary network requests |

---

## 🔒 Security Considerations

| Concern | Current Implementation | Production Recommendation |
|---------|----------------------|--------------------------|
| **JWT Secret** | Fallback hardcoded dev secret | Use strong env-only secret |
| **Token Storage** | Cookie (not httpOnly) | httpOnly server-set cookie |
| **XSS** | React's default escaping | CSP headers |
| **CSRF** | `sameSite: "lax"` cookie | Add CSRF tokens |
| **Input Validation** | Yup schemas (client) | Add server-side validation |
| **Rate Limiting** | None | Add rate limiter middleware |
| **HTTPS** | `secure: true` in prod | Enforce HTTPS |

---

## 🗺 File Dependency Map

```
src/app/layout.tsx
├── providers/query-provider.tsx  →  @tanstack/react-query
├── providers/theme-provider.tsx  →  next-themes
└── app/globals.css               →  tailwindcss

src/proxy.ts (Middleware)
├── lib/jwt.ts                    →  jose
├── lib/cookies.ts                →  js-cookie
└── utils/constants.ts

src/services/api.ts (Axios Instance)
├── lib/cookies.ts                →  js-cookie
└── store/auth-store.ts           →  zustand

src/services/flight-service.ts
└── services/api.ts

src/services/booking-service.ts
└── services/api.ts

src/services/auth-service.ts
└── services/api.ts

src/hooks/auth/use-login.ts
├── services/auth-service.ts
├── lib/jwt.ts
├── lib/cookies.ts
├── store/auth-store.ts
└── @tanstack/react-query

src/components/features/flight/flight-search-panel.tsx
├── flight-search-form.tsx        →  react-hook-form, yup
├── flight-results.tsx            →  @tanstack/react-query
├── flight-filters.tsx
└── flight-sort.tsx

src/components/features/booking/booking-form.tsx
├── store/flight-store.ts
├── hooks/auth/ (auth check)
├── services/booking-service.ts
├── lib/validators.ts             →  yup
└── booking-confirmation.tsx
```

---

## 🔮 Future Architecture Considerations

| Area | Current | Potential Enhancement |
|------|---------|----------------------|
| **Backend** | Mock API routes | Real REST/GraphQL API with database |
| **Database** | In-memory mock data | PostgreSQL + Prisma/Drizzle ORM |
| **Flight Data** | Static mock flights | Amadeus / Sabre / Skyscanner API |
| **Payments** | None | Stripe / PayPal integration |
| **Email** | None | SendGrid / Resend for confirmations |
| **Real-time** | None | WebSocket for price updates |
| **Testing** | None | Jest + React Testing Library + Playwright |
| **CI/CD** | None | GitHub Actions → Vercel / Docker |
| **Monitoring** | None | Sentry for errors, analytics |
| **i18n** | English only | next-intl for multi-language |
| **Seat Selection** | None | Interactive seat map component |
| **Multi-leg** | One-way only | Round-trip + multi-city support |

---

<p align="center">
  This architecture is designed for <strong>modularity</strong>, <strong>type safety</strong>, and <strong>easy migration</strong> from mock to production APIs.
</p>
