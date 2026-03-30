<div align="center">
  <img src="public/carrerBanglalogo.png" alt="CareerBangla Logo" width="220" />
  <h1>CAREERBANGLA FRONTEND</h1>
  <p><strong>Modern job platform frontend for job seekers, recruiters, and admins, built with Next.js 16 App Router.</strong></p>

  <p>
    <img src="https://img.shields.io/badge/Next.js-16.1.6-000000?style=for-the-badge&logo=next.js" alt="Next.js" />
    <img src="https://img.shields.io/badge/React-19.2.3-20232A?style=for-the-badge&logo=react" alt="React" />
    <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-4.x-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/TanStack_Query-5.x-FF4154?style=for-the-badge&logo=reactquery" alt="TanStack Query" />
    <img src="https://img.shields.io/badge/shadcn/ui-Radix%20UI-111111?style=for-the-badge" alt="shadcn ui" />
  </p>
</div>

---

## Introduction

CareerBangla Frontend is the client application for the CareerBangla hiring platform. It delivers the public marketing pages, job discovery experience, secure authentication flows, and role-based dashboards for users, recruiters, admins, and super admins.

This frontend is built around:

- Next.js 16 App Router with server and client component composition
- protected route handling through `src/proxy.ts`
- API integration through typed service modules in `src/services`
- role-aware dashboard layouts for job seekers, recruiters, and admins
- rich UI built with Tailwind CSS, Radix primitives, and shadcn/ui components

---

## Technical Core

### Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| Framework | `Next.js 16.1.6` | App Router, layouts, server rendering, route groups |
| UI | `React 19` | Interactive frontend and dashboard experience |
| Language | `TypeScript` | Type-safe components, services, and state |
| Styling | `Tailwind CSS 4` | Utility-first styling and theme tokens |
| UI Primitives | `Radix UI` + `shadcn/ui` | Accessible low-level and composed UI components |
| Data Fetching | `TanStack React Query` | Server state, caching, and mutation management |
| Forms | `TanStack React Form` + `React Hook Form` | Form state, validation, and controlled workflows |
| Validation | `Zod` | Frontend-safe schema validation |
| Charts | `Recharts` | Dashboard visualizations |
| Notifications | `Sonner` | Toasts and action feedback |
| Theming | `next-themes` | Theme management |
| Export Utilities | `html2canvas` + `jsPDF` | Resume/profile PDF generation |

### Architecture

```text
src/
├── app/                         # App Router, route groups, layouts, error/loading states
│   ├── (authLayout)/            # login, register, verify-email, forgot/reset password
│   ├── (commonLayout)/          # home, jobs, pricing, about-us, hired-candidates
│   ├── (dashboardLayout)/       # protected role-based dashboard areas
│   └── api/                     # route handlers if needed
├── components/
│   ├── modules/                 # feature-rich sections by domain
│   ├── shared/                  # navbar, footer, reusable app components
│   └── ui/                      # shadcn/ui primitives
├── constants/                   # shared static config
├── hooks/                       # reusable hooks
├── lib/                         # auth utils, env config, axios clients, helpers
├── providers/                   # Query provider and app-wide providers
├── services/                    # server/client API service wrappers
├── types/                       # TypeScript model definitions
├── zod/                         # form and payload validation schemas
└── proxy.ts                     # middleware-style route protection and redirects
```

---

## Product Areas

### Public experience

- marketing-driven landing page
- public job listing with search and filtering
- job details page
- pricing page
- about page
- hired candidates showcase

### Authentication

- login and registration flows
- recruiter registration flow
- Google login support
- email verification
- forgot password and reset password
- device/session management flows

### User dashboard

- profile management
- resume builder
- ATS score experience
- application tracking
- notifications
- referrals
- subscriptions

### Recruiter dashboard

- recruiter dashboard statistics
- post and manage jobs
- review applicants
- search candidates
- hired candidates access
- subscription management

### Admin dashboard

- platform dashboard overview
- user management
- recruiter review and moderation
- job moderation and pending job review
- applications management
- coupons and subscriptions management
- payment subscription tracking
- analytics and tracking dashboards

---

## Frontend Capabilities

### Route protection and auth flow

The frontend uses [proxy.ts](./src/proxy.ts) to:

- redirect authenticated users away from auth pages when appropriate
- protect dashboard routes based on session cookies
- enforce email verification flow
- guide users to the correct dashboard by role

### Backend integration

The service layer lives in `src/services` and includes:

- `auth.services.ts`
- `job.services.ts`
- `application.services.ts`
- `resume.services.ts`
- `subscription.services.ts`
- `notification.services.ts`
- `recruiter.services.ts`
- `admin.services.ts`
- `coupon.services.ts`
- `referral.services.ts`
- `tracking.services.ts`
- `stats.services.ts`

### Interactive modules

- dashboard charts with Recharts
- advanced forms with TanStack Form and validation
- PDF export for resume and profile-related flows
- live feedback with Sonner toasts
- responsive layouts across public and dashboard pages

---

## Local Setup

### 1. Prerequisites

- Node.js 22+ recommended
- `pnpm`
- Bun available on your machine because project scripts use `bun --bun`
- CareerBangla backend running locally or deployed

### 2. Install dependencies

```bash
pnpm install
```

### 3. Configure environment variables

```bash
cp .env.example .env.local
```

Minimum local variables:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api/v1
JWT_ACCESS_SECRET=your_access_token_secret_min_32_chars_long
```

Optional payment variable:

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_publishable_key
```

### 4. Start development server

```bash
pnpm dev
```

### 5. Build for production

```bash
pnpm build
pnpm start
```

Open `http://localhost:3000` in your browser.

---

## Deployment

### Vercel

This project includes [vercel.json](./vercel.json) with:

- install command: `pnpm install --frozen-lockfile`
- build command: `pnpm build`
- dev command: `pnpm dev`
- framework: `nextjs`
- region: `iad1`
- security and cache headers

### Production checklist

1. Set `NEXT_PUBLIC_API_BASE_URL` to your production backend API.
2. Set `JWT_ACCESS_SECRET` to match the backend JWT secret.
3. Add any payment-related public keys required by your production flow.
4. Ensure the backend CORS configuration allows the deployed frontend domain.
5. Verify auth cookies, redirect URLs, and callback URLs in production.

---

## Environment Reference

The frontend currently uses environment values like:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api/v1
JWT_ACCESS_SECRET=your_access_token_secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_publishable_key
```

See [`.env.example`](./.env.example) for the template used by this project.

---

## Project Highlights

- built on Next.js 16 App Router
- role-based dashboards for `USER`, `RECRUITER`, `ADMIN`, and `SUPER_ADMIN`
- middleware-style redirect control through `src/proxy.ts`
- typed service-based communication with the backend
- dashboard analytics, resume workflows, referrals, subscriptions, and notifications
- polished component system using Tailwind CSS, Radix UI, and shadcn/ui

---

## Author

Developed by **[Habibur Rahman Zihad](https://habibur-rahman-zihad.vercel.app/)**.

Licensed under the **ISC License**.
