# Lendly — Library of Things

A modern web application for managing community lending libraries. Share tools, kitchen gear, electronics, camping equipment, and more with your neighbors.

## Why Library of Things?

Community lending libraries are an underserved vertical with real market demand. Lendly makes running one so effortless that any community can do it. Three AI-powered features target the three biggest pain points: discovering what you need, listing items without friction, and handling returns fairly.

## Tech Stack

- **Next.js 16** with App Router
- **TypeScript** throughout
- **Prisma ORM** with SQLite (local) / Turso (production)
- **NextAuth.js v5** for authentication
- **Tailwind CSS v4** + **shadcn/ui** components
- **Lucide React** icons
- Deployed on **Vercel**

## AI Features (Mocked for MVP)

1. **Job-to-Be-Done Search** — Type what you need to *do* (e.g., "refinish hardwood floors") and get curated item bundles
2. **Photo-to-Listing** — Upload a photo and AI auto-fills the listing form with name, description, category, deposit, and care instructions
3. **AI Condition Report** — During return processing, AI compares before/after photos and generates a structured damage assessment with deposit recommendations

> These features use realistic mock data for the MVP. Production would integrate Claude API for real AI analysis.

## Getting Started

```bash
# Clone and install
git clone https://github.com/YOUR_USERNAME/lendly.git
cd lendly
npm install

# Set up environment
cp .env.example .env

# Run database migration and seed
npx prisma migrate dev
npx tsx prisma/seed.ts

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Demo Accounts

| Name | Email | Role |
|------|-------|------|
| Sophie Martin | sophie@lendly.demo | Admin |
| James Chen | james@lendly.demo | Member |
| Priya Sharma | priya@lendly.demo | Member |
| Marcus Johnson | marcus@lendly.demo | Member |
| Ava Tremblay | ava@lendly.demo | Member |

Click any demo account on the login page to sign in instantly.

## Environment Variables

```env
DATABASE_URL="file:./dev.db"
AUTH_SECRET="your-secret-here"
AUTH_TRUST_HOST=true

# Optional: Google OAuth
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# Optional: Turso for production
TURSO_DATABASE_URL=""
TURSO_AUTH_TOKEN=""
```

## Roadmap (v2)

- Stripe integration for deposit handling
- Email notifications (due date reminders, return confirmations)
- Waitlist/reservation system
- Image upload (S3/Cloudflare R2)
- Mobile app (React Native)
- Real AI integration via Claude API
