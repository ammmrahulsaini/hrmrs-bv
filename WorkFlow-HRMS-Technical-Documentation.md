# WorkFlow HRMS — Technical Documentation

**Version:** 1.0
**Live URL:** http://35.202.189.169/hrms
**GraphQL API + Playground:** http://35.202.189.169/graphql
**Status:** Deployed and running on a Google Cloud VM, full stack (Frontend + .NET GraphQL Backend + PostgreSQL).

---

## Table of Contents

1. Product Overview
2. High-Level Architecture
3. Server & Infrastructure
4. Technology Stack
5. Request / Data Flow
6. Backend — Detailed Design
7. Database Design
8. Frontend — Detailed Design
9. Modules (all 15 + AI Copilot)
10. Role-Based Access Control (RBAC)
11. GraphQL API Reference
12. Function / Action Reference
13. Build, Run & Deploy
14. Security & Auth Notes
15. Repository / File Map

---

## 1. Product Overview

**WorkFlow** is a mobile-first, role-aware **HRMS (Human Resource Management System)** that covers the full employee lifecycle: onboarding, attendance, leave, payroll, documents, expenses, performance, contributions, training, recruitment, recognition, announcements, team management, analytics, and an embedded AI HR Copilot.

- **4 roles:** Employee, Manager, HR, Admin — each sees a tailored dashboard, bottom navigation, and module set.
- **15 functional modules** + an AI Copilot available on every screen.
- **Multi-country payroll** (US `$` and India `₹`).
- Built strictly on the mandated stack: **.NET backend, PostgreSQL database, Next.js (React) frontend, Tailwind CSS.**

---

## 2. High-Level Architecture

```
                          Internet (browser)
                                 |
                                 v
                   ┌──────────────────────────────┐
                   │  GCP VM  35.202.189.169 :80   │
                   │           nginx               │
                   │  /hrms     ->  127.0.0.1:3000 │  (Next.js frontend)
                   │  /graphql  ->  127.0.0.1:5080 │  (.NET GraphQL API)
                   └──────────────────────────────┘
                        |                     |
            ┌───────────v─────────┐   ┌───────v──────────────┐
            │ hrms-frontend       │   │ hrms-backend         │
            │ Next.js 16 (Node)   │   │ .NET 10 / HotChocolate│
            │ systemd service     │   │ systemd service      │
            └─────────────────────┘   └──────────┬───────────┘
                                                  │ EF Core (Npgsql)
                                                  v
                                       ┌──────────────────────┐
                                       │ PostgreSQL 16         │
                                       │ database: HRMS        │
                                       └──────────────────────┘
```

- **Pattern:** Modular monolith backend exposing a single GraphQL endpoint; SPA-style mobile frontend; reverse proxy fronting both on port 80.
- **Single origin:** Frontend and API share host `35.202.189.169`, so browser→API calls are same-origin (no CORS needed).

---

## 3. Server & Infrastructure

| Item | Value |
|---|---|
| Cloud | Google Cloud Platform (Compute Engine) |
| Instance name | `bhaveshsir-project` |
| Zone / Project | `us-central1-b` / `gen-lang-client-0910402848` |
| External IP | `35.202.189.169` |
| Machine type | `e2-small` (2 vCPU, ~2 GB RAM) |
| Swap | 4 GB swapfile (`/swapfile`) added for build memory headroom |
| OS | Ubuntu 24.04.4 LTS |
| Firewall | Port 80 open to `0.0.0.0/0` (existing tagless allow-all rules in the `default` network) |
| SSH | `gcloud compute ssh bhaveshsir-project --zone us-central1-b` |

### Installed runtimes
- **.NET SDK 10.0.301** (installed to `/usr/share/dotnet`, symlinked at `/usr/local/bin/dotnet`)
- **Node.js 20.20.2 / npm 10.8.2** (NodeSource)
- **PostgreSQL 16.14**
- **nginx 1.24.0**

### systemd services
| Service | Process | Bind | Environment |
|---|---|---|---|
| `hrms-backend` | `dotnet /opt/hrms/backend-publish/HRMS.API.dll` | `127.0.0.1:5080` | `ASPNETCORE_ENVIRONMENT=Production`, `ASPNETCORE_URLS=http://127.0.0.1:5080` |
| `hrms-frontend` | `node server.js` (Next.js standalone) | `127.0.0.1:3000` | `NODE_ENV=production`, `PORT=3000`, `HOSTNAME=127.0.0.1` |

Both are `enabled` (auto-start on boot) and `Restart=always`.

### nginx (`/etc/nginx/sites-available/hrms`)
- `location = /` → 302 redirect to `/hrms`
- `location /hrms` → `proxy_pass http://127.0.0.1:3000` (Next.js, `basePath=/hrms`)
- `location /graphql` → `proxy_pass http://127.0.0.1:5080/graphql` (HotChocolate + Nitro tool)

### On-VM directory layout
```
/opt/hrms/
├── backend/           # .NET source (the "HRMS_Modular_Monolithic_BolierPlate" tree)
├── backend-publish/   # dotnet publish output (what the service runs)
├── frontend/          # Next.js source; built standalone server at .next/standalone
└── deploy/            # systemd unit files + nginx config + deploy scripts
```

### PostgreSQL
- Database: `HRMS`
- User: `postgres` / password `postgress`
- Connection string (backend): `Host=localhost;Port=5432;Database=HRMS;Username=postgres;Password=postgress`
- Schema created automatically by EF Core `EnsureCreated()`; seeded on startup by `HrmsSeeder`.

---

## 4. Technology Stack

### Backend (.NET 10, modular monolith)
| Concern | Technology |
|---|---|
| Runtime / Language | .NET 10, C# |
| API style | **GraphQL** via **HotChocolate 16.1.2** |
| ORM | **Entity Framework Core 10** + **Npgsql** (PostgreSQL provider) |
| Database | PostgreSQL 16 |
| Mediation/CQRS (shared) | MediatR 14 (used by sample TodoFeature) |
| Mapping (shared) | AutoMapper 16 |
| Validation (shared) | FluentValidation 12 |
| Telemetry | Application Insights / OpenTelemetry (configured, non-fatal) |
| Hosting | Kestrel behind nginx |

### Frontend (Next.js 16)
| Concern | Technology |
|---|---|
| Framework | **Next.js 16** (App Router) + **React 19** + TypeScript |
| Styling | **Tailwind CSS v4** (teal/orange theme) |
| State | **Zustand** store (`useHrms`) |
| Data fetching | GraphQL over `fetch` (`lib/hrms/api.ts`); Apollo Client also present in boilerplate |
| Icons | `lucide-react` |
| Build output | `standalone` (Node server), `basePath: /hrms` |

---

## 5. Request / Data Flow

**Page load (read):**
1. Browser opens `http://35.202.189.169/hrms` → nginx → Next.js frontend serves the app shell.
2. On mount, `AppShell` calls `useHrms.hydrate()`.
3. `hydrate()` → `loadAll()` (`lib/hrms/api.ts`) fires **~24 parallel GraphQL queries** (one per collection) to `/graphql`.
4. nginx proxies to the .NET backend → HotChocolate resolvers → EF Core → PostgreSQL → data returned.
5. Store is populated; pages render real DB data.

**User action (write):**
1. User triggers an action (e.g. submit leave) → store action (e.g. `submitLeave`).
2. Store calls a **GraphQL mutation** (`lib/hrms/api.ts` → `mutations.submitLeave`).
3. HotChocolate mutation resolver writes via EF Core → PostgreSQL `SaveChangesAsync()`.
4. Store **refreshes** the affected collection(s) by re-querying, and the UI updates.

> Note: each collection is fetched in its **own** GraphQL request (not one giant query). This deliberately avoids HotChocolate executing sibling root fields in parallel over a single scoped `DbContext` (EF `DbContext` is not thread-safe). One request = one DB operation = safe.

---

## 6. Backend — Detailed Design

### 6.1 Solution structure (modular monolith)
```
HRMS_Modular_Monolithic_BolierPlate/
├── API/HRMS.API/                         # Composition root (Program, Startup, GraphQL endpoint)
├── Shared/
│   ├── HRMS.Shared.Core/
│   │   ├── HRMS.Core.Postgres/           # PostgresDbContext, BaseEntity, generic repository, EnsureCreated
│   │   ├── HRMS.Core.Telemetry/          # ITelemetryService
│   │   ├── HRMS.Core.KeyVault/           # Azure Key Vault config (optional, blanked in Prod)
│   │   └── HRMS.Core.HttpHelper/
│   ├── HRMS.Shared.Application/          # Query/Mutation base types, BaseResponse, MediatR behaviours
│   ├── HRMS.Shared.Domain/               # Shared entities (UserBase, Media, Address)
│   └── HRMS.Shared.Infrastructure/       # DI wiring, AutoMapper/MediatR/Validation registration
├── Modules/
│   ├── TodoFeature/                      # Sample reference feature (Domain/Application/Infra/GraphQL)
│   └── HrmsFeature/                      # ★ The HRMS feature (built for this project)
│       ├── HrmsFeature.Domain/           # All HRMS entities
│       ├── HrmsFeature.Infrastructure/   # EF configurator, DI, Postgres seeder
│       └── HrmsFeature.GraphQL/          # Query + Mutation resolvers + inputs
```

### 6.2 How the database schema is built
- `PostgresDbContext.OnModelCreating` iterates every registered `IPostgresEntityConfigurator` and calls `Configure(modelBuilder)`.
- `HrmsEntityConfigurator` (registered via `AddHrmsDependency`) maps all HRMS entities: table name = entity name, key = `Id`, required `DocumentType`, and nested collections via EF Core `OwnsMany(...).ToJson()` (stored as PostgreSQL `jsonb`).
- On startup (`Startup.Configure`), `app.EnsurePostgresDbIsCreated()` (EF `EnsureCreated()`) builds all tables, then `app.SeedHrmsData()` inserts seed data if the `Employee` table is empty.

> Deployment note: `EnsureCreated()` does **not** add tables to a database that already exists. The deploy script therefore drops & recreates the `HRMS` database **once** so the full schema (including the new HRMS tables) is created cleanly. After that, data persists across restarts.

### 6.3 GraphQL composition
- `HRMS.API/RegisterDependencies/GraphQLModuleRegistration.cs` registers feature schemas:
  `builder.AddTodosGraphQL().AddHrmsGraphQL();`
- `HrmsGraphQLExtensions.AddHrmsGraphQL` adds two type extensions:
  `AddTypeExtension<HrmsQuery>()` and `AddTypeExtension<HrmsMutation>()`.
- `HrmsQuery` (`[ExtendObjectType(typeof(Query))]`) exposes one read field per collection.
- `HrmsMutation` (`[ExtendObjectType(typeof(Mutation))]`) exposes the action mutations.
- Resolvers inject the database with `[Service] PostgresDbContext db` and use EF Core directly (`db.Set<T>()`, `SaveChangesAsync()`).

### 6.4 Data access pattern
- Reads: `db.Set<T>().AsNoTracking().ToListAsync()`.
- Writes: load tracked entity → mutate (including owned `jsonb` collections, reassigned to new lists to ensure change detection) → `SaveChangesAsync()`.

---

## 7. Database Design

- **Engine:** PostgreSQL 16, database `HRMS`.
- **One table per aggregate entity** (~24 tables), each keyed on a string `Id` and carrying audit columns from `BaseEntity` (`DocumentType`, `CreatedOn`, `CreatedByUserId`, `ModifiedOn`, …).
- **Nested/complex data:**
  - Object arrays (e.g. `Approvals`, `Earnings`, `Deductions`, `KeyResults`, `CategoryRatings`, `Contents`, `Tickets`) → stored as **`jsonb`** columns via EF `OwnsMany(...).ToJson()`.
  - Primitive arrays (e.g. `Skills`, `Tags`, `Requirements`, `AcknowledgedBy`) → PostgreSQL `text[]`.
  - `Mileage` (single nested object) → `jsonb` via `OwnsOne(...).ToJson()`.

### Tables (entities)
`Employee`, `Shift`, `AttendanceRecord`, `LeaveBalance`, `LeaveRequest`, `PayrollRecord`, `EmployeeDocument`, `Reimbursement`, `Goal`, `PerformanceReview`, `ValueContribution`, `ContributionItem`, `LeaderboardEntry`, `TrainingModule`, `JobPosting`, `Candidate`, `Recognition`, `Announcement`, `OnboardingTask`, `WelcomeMessage`, `RelocationSupport`, `TeamIntroduction`, `OnboardingMilestone`, `NewJoinerProfile` (+ the sample `Todo`).

### Seed personas (stable IDs)
| Id | Name | Role | Dept |
|----|------|------|------|
| e1 | Sarah Chen | employee | Engineering |
| e2 | Raj Patel | employee | Engineering |
| e3 | Emily Davis | employee | Engineering |
| e4 | Carlos Mendez | employee | Engineering |
| m1 | Michael Torres | manager | Engineering |
| h1 | Priya Sharma | hr | People Operations |
| a1 | Aisha Khan | admin | IT |

`currentUserByRole`: employee→e1, manager→m1, hr→h1, admin→a1.

---

## 8. Frontend — Detailed Design

### 8.1 Structure
```
nextjs-boiler-plate-v16.0.3/
├── app/
│   ├── layout.tsx              # Root layout; wraps everything in <AppShell>
│   ├── page.tsx                # Home dashboard (role-aware)
│   ├── attendance/page.tsx     # + 13 more module routes
│   ├── leave/ payroll/ documents/ expenses/ performance/ contributions/
│   ├── training/ recruitment/ recognition/ announcements/ team/ analytics/ onboarding/
│   └── globals.css
├── components/hrms/
│   ├── AppShell.tsx            # Mobile frame, top bar + role switcher, bottom nav, hydrate gate
│   ├── ui.tsx                  # Card, Badge, Button, Avatar, Progress, Modal, Field, Input, etc.
│   ├── icons.tsx               # lucide icon map
│   └── Copilot.tsx             # Floating AI HR Copilot (context-aware)
├── lib/hrms/
│   ├── types.ts                # All TypeScript interfaces
│   ├── rbac.ts                 # Modules, nav-per-role, access helpers
│   ├── api.ts                  # GraphQL queries + mutations (the data layer)
│   ├── util.ts                 # getEmployee, initials, labelize, money, status color (tone)
│   └── seed.ts                 # (legacy mock data — superseded by the backend)
├── stores/hrmsStore.ts         # Zustand store: state + hydrate() + all action methods
├── next.config.ts              # basePath: /hrms, output: standalone
└── .env.production             # NEXT_PUBLIC_API_BASE_URL, NEXT_PUBLIC_GRAPHQL_URL, NEXT_PUBLIC_DISABLE_AUTH
```

### 8.2 State management (`stores/hrmsStore.ts`)
- A single Zustand store `useHrms` holds: the active `role`, all data collections, a `hydrated` flag, `hydrate()`, and every action.
- `hydrate()` calls `loadAll()` to populate from GraphQL.
- Each action calls a mutation then `refresh()`-es the affected collection(s).
- `currentUserId()` derives the active user from `role`.

### 8.3 App shell & navigation (`components/hrms/AppShell.tsx`)
- Renders a centered max-width mobile frame.
- **Top bar:** current user avatar/name + a **role switcher** `<select>` (Employee/Manager/HR/Admin). Switching role re-scopes the whole app and redirects home if the current module isn't allowed for the new role.
- **Bottom navigation:** 5 tabs that change per role (`bottomNavForRole`).
- **Loading gate:** shows a spinner until `hydrated` (prevents rendering before data arrives).
- Renders the floating **Copilot**.

### 8.4 Data layer (`lib/hrms/api.ts`)
- `gql(query, variables)` — minimal GraphQL POST helper to `NEXT_PUBLIC_GRAPHQL_URL`.
- `loadAll()` — `Promise.all` of 24 single-field queries; maps a few field aliases (`createdOnDate`→`createdOn`, `fromName`→`from`) and reduces single-row collections (relocation, newJoiner).
- `refreshers` — per-collection re-fetchers used after mutations.
- `mutations` — typed wrappers for all 17 backend mutations.

---

## 9. Modules (15 + AI Copilot)

Each module = a backend entity set + GraphQL query/mutation + a frontend route/screen.

| # | Module | Route | Primary entities | Key actions (mutations) | Roles |
|---|--------|-------|------------------|--------------------------|-------|
| 1 | **Onboarding** | `/onboarding` | OnboardingTask, WelcomeMessage, RelocationSupport, TeamIntroduction, OnboardingMilestone, NewJoinerProfile | `completeTask` | Employee/HR/Mgr/Admin |
| 2 | **Attendance** | `/attendance` | AttendanceRecord, Shift | `clockIn`, `clockOut` | All |
| 3 | **Leave** | `/leave` | LeaveRequest, LeaveBalance | `submitLeave`, `actOnLeave` | Self + approvers |
| 4 | **Payroll** | `/payroll` | PayrollRecord | (view + download; compliance dash for HR/Admin) | All |
| 5 | **Documents** | `/documents` | EmployeeDocument | `uploadDocument`, `reviewDocument` | Employee + HR |
| 6 | **Expenses** | `/expenses` | Reimbursement | `submitExpense`, `actOnExpense` | Self + approvers |
| 7 | **Performance & Goals** | `/performance` | Goal, PerformanceReview | (view; OKRs, reviews) | Employee/Manager |
| 8 | **Contributions** | `/contributions` | ValueContribution, ContributionItem, LeaderboardEntry | `claimItem`, `approveContribution` | All |
| 9 | **Training** | `/training` | TrainingModule | `completeContent` | All |
| 10 | **Recruitment** | `/recruitment` | JobPosting, Candidate | `updateCandidate` | HR/Admin |
| 11 | **Recognition** | `/recognition` | Recognition | `sendRecognition`, `toggleLike` | All |
| 12 | **Announcements** | `/announcements` | Announcement | `createAnnouncement`, `acknowledgeAnnouncement` | View all; create HR/Admin |
| 13 | **Team Management** | `/team` | Employee | (roster / direct reports) | Manager/HR/Admin |
| 14 | **Analytics** | `/analytics` | AttendanceRecord + aggregates | (self vs org-wide dashboards) | All (scoped) |
| 15 | **HR Copilot** | (overlay) | client-side, context-aware | conversational guidance | All |

---

## 10. Role-Based Access Control (RBAC)

Defined in `lib/hrms/rbac.ts` (mirrors the product spec §3).

**Module visibility:** all modules are visible to all roles **except** Recruitment (HR/Admin) and Team (Manager/HR/Admin). Announcement creation is HR/Admin only.

**Role-specific bottom navigation:**
| Role | Bottom nav (5 tabs) |
|------|---------------------|
| Employee | Home, Attendance, Performance, Training, Contributions |
| Manager | Home, Team, Leave, Performance, Training |
| HR | Home, Recruitment, Analytics, Training, Announcements |
| Admin | Home, Analytics, Team, Training, Announcements |

Helpers: `canAccess(role, moduleKey)`, `canApprove(role)`, `canManageContent(role)`, `bottomNavForRole(role)`, `modulesForRole(role)`.

---

## 11. GraphQL API Reference

Endpoint: `POST /graphql` (interactive Nitro tool available in the browser at `/graphql`).

### Queries (24)
`employees`, `shifts`, `attendanceRecords`, `leaveBalances`, `leaveRequests`, `payrollRecords`, `documents`, `reimbursements`, `goals`, `performanceReviews`, `contributions`, `contributionItems`, `leaderboard`, `trainingModules`, `jobPostings`, `candidates`, `recognitions`, `announcements`, `onboardingTasks`, `welcomeMessages`, `relocationSupport`, `teamIntroductions`, `onboardingMilestones`, `newJoinerProfiles`.

Example:
```graphql
query {
  leaveRequests {
    id userId type status totalDays
    approvals { level approver status }
  }
}
```

### Mutations (17)
| Mutation | Args | Effect |
|---|---|---|
| `clockIn` | userId, method | Create attendance record (clocked in) |
| `clockOut` | userId | Close open record, compute hours |
| `submitLeave` | input: SubmitLeaveInput | Create leave request, decrement balance |
| `actOnLeave` | id, level, decision, comment | Approve/reject a level; recompute status |
| `submitExpense` | input: SubmitExpenseInput | Create reimbursement claim |
| `actOnExpense` | id, decision, comment | Approve/reject claim |
| `uploadDocument` | id | Mark a document uploaded |
| `reviewDocument` | id, decision, reason | Verify/reject a document |
| `claimItem` | id, userId | Claim a contribution item |
| `approveContribution` | id, points, comment | Approve a contribution + assign points |
| `completeContent` | moduleId, index | Complete a training content item; recompute progress |
| `updateCandidate` | id, status, interviewDate | Move candidate through pipeline |
| `sendRecognition` | input: SendRecognitionInput | Post a recognition |
| `toggleLike` | id, liked | Like/unlike a recognition |
| `createAnnouncement` | input: CreateAnnouncementInput | Publish an announcement |
| `acknowledgeAnnouncement` | id, userId | Record an acknowledgment |
| `completeTask` | id | Mark an onboarding task complete |

Example:
```graphql
mutation($i: SubmitLeaveInput!) {
  submitLeave(input: $i) { id status }
}
```

---

## 12. Function / Action Reference

### Backend (C#) — `HrmsMutation.cs`
`ClockInAsync`, `ClockOutAsync`, `SubmitLeaveAsync`, `ActOnLeaveAsync`, `SubmitExpenseAsync`, `ActOnExpenseAsync`, `UploadDocumentAsync`, `ReviewDocumentAsync`, `ClaimItemAsync`, `ApproveContributionAsync`, `CompleteContentAsync`, `UpdateCandidateAsync`, `SendRecognitionAsync`, `ToggleLikeAsync`, `CreateAnnouncementAsync`, `AcknowledgeAnnouncementAsync`, `CompleteTaskAsync`. Read resolvers in `HrmsQuery.cs` (one `Get<Collection>Async` per entity).

### Backend infrastructure
- `HrmsEntityConfigurator.Configure` — EF model mapping for all entities.
- `HrmsSeeder.Seed` — idempotent Postgres seeding.
- `ConfigureServiceExtension.AddHrmsDependency` / `SeedHrmsData` — DI + startup seeding.

### Frontend store (`stores/hrmsStore.ts`)
`hydrate`, `setRole`, `currentUserId`, `clockIn`, `clockOut`, `submitLeave`, `actOnLeave`, `submitExpense`, `actOnExpense`, `uploadDocument`, `reviewDocument`, `claimItem`, `approveContribution`, `completeContent`, `updateCandidate`, `sendRecognition`, `toggleLike`, `createAnnouncement`, `acknowledgeAnnouncement`, `completeTask`.

### Frontend data layer (`lib/hrms/api.ts`)
`gql`, `loadAll`, `refreshers`, `mutations`.

### Frontend UI primitives (`components/hrms/ui.tsx`)
`Card`, `PageHeader`, `SectionTitle`, `Badge`, `Button`, `Avatar`, `Progress`, `Stat`, `EmptyState`, `Field`, `Input`, `Select`, `Textarea`, `Modal`, `Row`.

---

## 13. Build, Run & Deploy

### Local development
**Backend:**
```bash
cd "HRMS_Modular_Monolithic_BolierPlate Without Git"
dotnet run --project API/HRMS.API
# requires a local PostgreSQL with database HRMS (postgres/postgress)
```
**Frontend:**
```bash
cd nextjs-boiler-plate-v16.0.3
npm install
npm run dev   # http://localhost:3000/hrms
```
`.env.local` / `.env.production`:
```
NEXT_PUBLIC_API_BASE_URL=http://35.202.189.169
NEXT_PUBLIC_GRAPHQL_URL=http://35.202.189.169/graphql
NEXT_PUBLIC_DISABLE_AUTH=true
```

### Production deploy (VM)
- **Backend:** tar source → `scp` to VM → drop/recreate `HRMS` db (one-time schema rebuild) → `dotnet publish API/HRMS.API -c Release -o /opt/hrms/backend-publish` → `systemctl restart hrms-backend`.
- **Frontend:** tar source → `scp` → `npm install && npm run build` → assemble `.next/standalone` → `systemctl restart hrms-frontend`.
- nginx + firewall already configured (one-time).

### Health checks
```bash
curl http://35.202.189.169/hrms                 # 200 (frontend)
curl -X POST http://35.202.189.169/graphql \
  -H 'content-type: application/json' \
  -d '{"query":"{ employees { id name role } }"}'   # real DB data
```

---

## 14. Security & Auth Notes

- Per the product spec (§7.1), **authentication is delegated to an external identity provider in production**, and a **role switcher** is provided for demonstrating all four roles. The deployment follows this: the role switcher is the demo auth mechanism (`NEXT_PUBLIC_DISABLE_AUTH=true`). A real JWT/login can be layered on later.
- The boilerplate's Azure Key Vault integration is disabled in Production (blank config) and Application Insights is configured but non-fatal.
- nginx sets `no-store` cache headers; request body limit 105 MB.
- The GraphQL introspection/tool is enabled to aid demonstration; it can be disabled via `GraphQL:Tool:Enable=false` for a locked-down deployment.

### Pragmatic simplification (for technical interview transparency)
The HRMS GraphQL resolvers talk to EF Core (`PostgresDbContext`) directly rather than routing every call through the boilerplate's MediatR + AutoMapper + per-entity repository CQRS layers (which the sample `TodoFeature` demonstrates). This was a deliberate choice to keep ~24 entities tractable and reliable while staying within the same stack (HotChocolate + EF Core + PostgreSQL, modular monolith, `[ExtendObjectType]` Query/Mutation pattern). It can be expanded to the full per-module CQRS pattern where deeper separation is required.

---

## 15. Repository / File Map

### Backend (key new files — `Modules/HrmsFeature/`)
| File | Purpose |
|---|---|
| `HrmsFeature.Domain/Entities.cs` | All ~24 HRMS entities + nested value types |
| `HrmsFeature.Infrastructure/HrmsEntityConfigurator.cs` | EF model mapping (tables, jsonb) |
| `HrmsFeature.Infrastructure/HrmsSeeder.cs` | Postgres seed data |
| `HrmsFeature.Infrastructure/ConfigureServiceExtension.cs` | DI registration + `SeedHrmsData` |
| `HrmsFeature.GraphQL/HrmsQuery.cs` | Read resolvers (24 queries) |
| `HrmsFeature.GraphQL/HrmsMutation.cs` | Action resolvers (17 mutations) |
| `HrmsFeature.GraphQL/Inputs.cs` | GraphQL input types |
| `HrmsFeature.GraphQL/HrmsGraphQLExtensions.cs` | `AddHrmsGraphQL` schema registration |

### Backend (edited wiring)
`API/HRMS.API/HRMS.API.csproj` (project refs), `RegisterDependencies/GraphQLModuleRegistration.cs`, `RegisterDependencies/RepositoryRegistration.cs`, `Startup.cs` (seeding), `appsettings.Production.json` (Prod config).

### Frontend (key files)
`app/layout.tsx`, `app/page.tsx`, `app/<module>/page.tsx` (×14), `components/hrms/*`, `lib/hrms/*`, `stores/hrmsStore.ts`, `next.config.ts`, `.env.production`.

---

*End of document.*
