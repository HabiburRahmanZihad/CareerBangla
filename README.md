# CareerBangla - Frontend

A modern job portal platform built with Next.js 16, connecting job seekers with recruiters through a coin-based credit economy.

## Tech Stack

- **Framework:** Next.js 16 (App Router, Server Components, Server Actions)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **State Management:** TanStack React Query v5 (server state), TanStack React Form (forms)
- **Validation:** Zod v4
- **HTTP Client:** Axios (custom wrapper with auto token refresh)
- **Auth:** JWT (cookie-based) with middleware route protection
- **Icons:** Lucide React
- **Notifications:** Sonner (toast)

## Features

### Public
- Home page with hero, stats, and features
- Job listing with filters (search, type, experience, location, category) and pagination
- Job detail pages with company info

### Authentication
- Login / Register with Google OAuth
- Email verification (6-digit OTP)
- Forgot password / Reset password flow
- Auto token refresh middleware

### User (Job Seeker) Dashboard
- Profile overview with coin balance and completion progress
- Resume builder with ATS score checker
- Job applications tracker with status badges
- Wallet with transaction history
- Subscription plans (Stripe integration)
- Notifications center

### Recruiter Dashboard
- Dashboard with job/application stats
- Post jobs (requires verification + 100% profile + 20 coins)
- Manage posted jobs (edit/delete)
- Review applications and change status
- Search candidates (10 coins per view)
- Wallet and subscriptions

### Admin Dashboard
- Platform stats (users, jobs, applications, revenue)
- User management (status/role changes)
- Recruiter management (approve/reject verification)
- Jobs management (view all platform jobs)
- Applications management (view all applications)
- Categories management (create/delete job categories)
- Coupons management (create/delete discount coupons)
- Subscriptions management (view plans)

### Coin System
| Action | Cost |
|--------|------|
| Apply to job | 5 coins |
| View candidate profile | 10 coins |
| Update resume (after first completion) | 15 coins |
| Post a job | 20 coins |

### Guards & Validations
- **User:** Cannot apply unless profileCompletion === 100 and has sufficient coins
- **Recruiter:** Cannot post jobs unless isVerified === true, profileCompletion === 100, and has sufficient coins
- **Routes:** Role-based middleware protection with automatic redirects
- **Forms:** Zod validation on all inputs with inline error display

## Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── (commonLayout)/           # Public pages (home, jobs, auth)
│   ├── (dashboardLayout)/        # Protected dashboard pages
│   │   ├── (commonProtectedLayout)/  # Shared (profile, password)
│   │   ├── (userRouteGroup)/     # User dashboard
│   │   ├── recruiter/            # Recruiter dashboard
│   │   └── admin/                # Admin dashboard
│   ├── layout.tsx                # Root layout
│   ├── error.tsx                 # Error boundary
│   └── not-found.tsx             # 404 page
├── components/
│   ├── modules/                  # Feature components
│   │   ├── Admin/                # Admin management components
│   │   ├── Auth/                 # Auth forms
│   │   ├── Dashboard/            # User dashboard components
│   │   ├── Dashboord/            # Layout components (sidebar, navbar)
│   │   ├── Jobs/                 # Job listing/details
│   │   └── Recruiter/            # Recruiter components
│   ├── shared/                   # Reusable components
│   └── ui/                       # shadcn/ui primitives
├── hooks/                        # Custom React hooks
├── lib/                          # Utilities (auth, http, tokens, nav)
├── providers/                    # React Query provider
├── services/                     # API service layer (server actions)
├── types/                        # TypeScript type definitions
├── zod/                          # Zod validation schemas
└── proxy.ts                      # Middleware (auth, routing, token refresh)
```

## Getting Started

### Prerequisites
- Node.js 18+ or Bun
- CareerBangla backend running on `http://localhost:5000`

### Setup

```bash
# Install dependencies
bun install

# Configure environment
cp .env.example .env.local
```

### Environment Variables

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api/v1
JWT_ACCESS_SECRET=your_access_token_secret
```

### Run

```bash
# Development
bun dev

# Build
bun run build

# Production
bun start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Integration

All API calls go through `src/lib/axios/httpClient.ts` which provides:
- Automatic cookie-based token injection
- Proactive token refresh (5-minute threshold)
- Consistent error handling

Services are server actions (`"use server"`) in `src/services/`:
- `auth.services.ts` - Authentication
- `job.services.ts` - Jobs CRUD + categories
- `application.services.ts` - Job applications
- `resume.services.ts` - Resume + ATS score
- `wallet.services.ts` - Wallet + transactions
- `subscription.services.ts` - Plans + purchases
- `notification.services.ts` - Notifications
- `recruiter.services.ts` - Recruiter profiles
- `admin.services.ts` - Admin operations
- `coupon.services.ts` - Coupon management
- `stats.services.ts` - Dashboard statistics

## Role-Based Access

| Role | Dashboard Route | Key Permissions |
|------|----------------|-----------------|
| USER | `/dashboard` | Apply to jobs, manage resume, view ATS score |
| RECRUITER | `/recruiter/dashboard` | Post jobs, manage applications, search candidates |
| ADMIN | `/admin/dashboard` | Manage users, recruiters, jobs, categories, coupons |
| SUPER_ADMIN | `/admin/dashboard` | All admin permissions |
