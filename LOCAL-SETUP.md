# Running WorkFlow HRMS Locally (and switching Local ⇄ Production)

This guide gets the full stack running on your own machine, and explains the
one-file switch between your **local** backend and the **production** backend.

---

## 0. The Switch (TL;DR)

The only place you change to flip targets is the frontend file:

```
nextjs-boiler-plate-v16.0.3/.env.development.local
```

- **LOCAL block active**  → `npm run dev` talks to your local .NET backend (`http://localhost:5056`)
- **PRODUCTION block active** → `npm run dev` talks to the live VM (`http://35.202.189.169`)

Comment one block, uncomment the other, then **restart `npm run dev`**. That's it.

> This file only affects `npm run dev`. The production build/deploy always uses
> `.env.production`, so flipping it can never break the live site.

---

## 1. Prerequisites (install once)

| Tool | Version | Notes |
|------|---------|-------|
| **.NET SDK** | **10.0** | You currently have .NET 8 — install 10: https://dotnet.microsoft.com/download/dotnet/10.0 |
| **Node.js** | 20+ | Already installed |
| **PostgreSQL** | 16 | https://www.postgresql.org/download/windows/ |

Verify after installing:
```powershell
dotnet --version      # should print 10.x
node -v
psql --version
```

---

## 2. PostgreSQL (one-time)

During PostgreSQL install, set the `postgres` superuser password to **`postgress`**
(that matches the app's connection string). Then create the database:

```powershell
# opens the psql prompt (enter the postgres password when asked)
psql -U postgres -c "CREATE DATABASE \"HRMS\";"
```

> Prefer a different password/host? Edit the connection string in
> `HRMS_Modular_Monolithic_BolierPlate Without Git/API/HRMS.API/appsettings.json`
> under `ConnectionStrings:Postgres:ConnectionString`.

The backend auto-creates all tables and seeds demo data on first run.

---

## 3. Run the Backend (.NET GraphQL)

```powershell
cd "JECRC Assessment/HRMS_Modular_Monolithic_BolierPlate/HRMS_Modular_Monolithic_BolierPlate Without Git"
dotnet run --project API/HRMS.API --launch-profile http
```

- Runs in **Development** mode on **http://localhost:5056**
- GraphQL endpoint + playground: **http://localhost:5056/graphql**
- On startup it runs `EnsureCreated()` + seeds the local `HRMS` database.
- CORS is pre-configured to allow `http://localhost:3000`.

Quick check (new terminal):
```powershell
curl -X POST http://localhost:5056/graphql -H "content-type: application/json" -d "{\"query\":\"{ employees { id name } }\"}"
```

---

## 4. Run the Frontend (Next.js)

```powershell
cd "JECRC Assessment/nextjs-boiler-plate-v16.0.3"
npm install            # first time only
# make sure .env.development.local has the LOCAL block active (see section 0)
npm run dev
```

Open: **http://localhost:3000/hrms**

(If `.env.development.local` doesn't exist, copy it from `.env.development.local.example`.)

---

## 5. Switching targets

**Use production data while developing the UI locally:**
1. Open `nextjs-boiler-plate-v16.0.3/.env.development.local`
2. Comment the LOCAL two lines, uncomment the PRODUCTION two lines
3. Restart `npm run dev`

**Go back to fully local:** reverse the above. (Local backend must be running.)

---

## 6. Production (for reference)

- Frontend build uses `.env.production` (points at `http://35.202.189.169`).
- Deployed on the GCP VM behind nginx; see `WorkFlow-HRMS-Technical-Documentation.md`
  sections 3 and 13 for the full server/deploy details.

---

## Troubleshooting

| Symptom | Fix |
|---|---|
| `dotnet run` fails: framework/SDK error | Install **.NET 10 SDK** (you have 8) |
| Backend can't connect to DB | Ensure PostgreSQL is running and `HRMS` db exists with user `postgres`/`postgress` |
| Frontend shows endless "Loading..." | Backend not running, or `.env.development.local` points to the wrong target; check the GraphQL URL is reachable |
| CORS error in browser console | Confirm backend is in Development (it allows `localhost:3000`); restart backend |
| Port 5056 busy | Edit `API/HRMS.API/Properties/launchSettings.json` (http profile) and the URL in `.env.development.local` to match |
