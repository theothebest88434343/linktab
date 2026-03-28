# Linktab

A full-stack link-in-bio platform where users can create a personalized page at `linktab.app/username`, add links, and track clicks with a built-in analytics dashboard.

**Live:** [linktab.vercel.app](https://linktab.vercel.app)

---

## Features

- **Custom profile page** at `/username` — shareable public link page
- **Link editor** — add, toggle, and delete links from a dashboard
- **Click analytics** — track clicks per link and view a 7-day activity chart
- **Auth** — email/password signup and login via Supabase Auth
- **Row Level Security** — per-user data access enforced at the database level
- **Real-time ready** — built on Supabase for easy real-time extension

## Tech Stack

- **Framework:** Next.js 15 (App Router, TypeScript)
- **Database & Auth:** Supabase (PostgreSQL + RLS)
- **Styling:** TailwindCSS
- **Deployment:** Vercel

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/theothebest88434343/linktab.git
cd linktab
npm install
```

### 2. Set up Supabase

Create a project at [supabase.com](https://supabase.com) and run the schema:

```bash
# Copy the SQL from schema.sql and run it in the Supabase SQL editor
```

### 3. Add environment variables

Create a `.env.local` file in the root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
  app/
    (auth)/         # Login and signup pages
    dashboard/      # Protected editor and analytics pages
    [username]/     # Public profile page
  components/
    LinkEditor      # Dashboard link management
    LinkEditorWrapper  # Client-side auth wrapper
    ProfileLinks    # Public profile link buttons with click tracking
    AnalyticsDashboard # Click stats and charts
  lib/
    supabase/       # Client and server Supabase instances
```

## Database Schema

| Table | Description |
|-------|-------------|
| `profiles` | One per user — stores username, bio, avatar |
| `links` | Ordered list of links per profile |
| `link_clicks` | Every click on a public link is logged here |
| `themes` | Theme settings per profile |
| `analytics` | Daily page view rollups |

## How Click Tracking Works

When a visitor clicks a link on a public profile page, a row is inserted into `link_clicks` with the `link_id` and `profile_id`. The analytics dashboard aggregates these rows to show total clicks, clicks per day, and clicks per link — all scoped to the logged-in user via RLS policies.