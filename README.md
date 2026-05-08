# Smart QR Profile Hub

A modern, mobile-first digital business card platform. Create a personalized profile page, generate a QR code, and share your entire digital presence with a single scan.

---

## Features

- **Profile Creation** — Name, company, tagline, bio, profile image
- **Social Links** — Instagram, YouTube, Facebook, Twitter/X, LinkedIn, WhatsApp, Telegram, Email, custom links
- **Theme Customization** — Primary/secondary/background/button/text colors, button style (rounded/sharp/pill), font style, 6 presets
- **Live Preview** — See your profile update in real-time while editing
- **QR Code Generator** — Download as PNG or SVG, high-quality printable
- **Public Profile Page** — Animated, mobile-optimized, SEO-ready at `/u/[slug]`
- **Dashboard** — Create, edit, delete, toggle public/private, view scan count
- **Analytics** — QR scan counter per profile
- **Copy & Share** — One-click URL copy and native share API
- **Dark Mode** — Full dark UI with glassmorphism and gradients
- **Mock Auth** — Ready to swap with Supabase auth

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| Next.js 16 (App Router) | Framework |
| React 19 | UI |
| TypeScript | Type safety |
| Tailwind CSS v4 | Styling |
| Framer Motion | Animations |
| qrcode | QR generation |
| lucide-react | Icons |
| react-hot-toast | Notifications |
| clsx + tailwind-merge | Class utilities |

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 3. Demo login

Use any email address on the login page. The demo account is pre-loaded with two example profiles.

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx                  # Landing page
│   ├── login/page.tsx            # Login
│   ├── dashboard/
│   │   ├── page.tsx              # Dashboard (list profiles)
│   │   ├── new/page.tsx          # Create profile
│   │   └── edit/[id]/page.tsx    # Edit profile
│   └── u/[slug]/page.tsx         # Public profile page
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   ├── Skeleton.tsx
│   │   └── SocialIcons.tsx       # SVG brand icons + config
│   ├── layout/
│   │   └── Navbar.tsx
│   ├── landing/
│   │   ├── HeroSection.tsx
│   │   ├── FeaturesSection.tsx
│   │   └── CTASection.tsx
│   ├── dashboard/
│   │   ├── ProfileForm.tsx       # Create/edit form with live preview
│   │   ├── ProfileCard.tsx       # Dashboard profile card
│   │   └── ProfilePreview.tsx    # Live preview panel
│   ├── profile/
│   │   └── ProfilePage.tsx       # Public profile page
│   └── qr/
│       ├── QRGenerator.tsx       # QR canvas + download
│       └── QRModal.tsx           # QR download modal
├── hooks/
│   └── useAuth.tsx               # Auth context (mock → Supabase-ready)
├── services/
│   └── profileService.ts         # CRUD (localStorage → Supabase-ready)
├── data/
│   └── mockData.ts               # Demo profiles + theme presets
├── types/
│   └── index.ts                  # TypeScript interfaces
└── utils/
    └── index.ts                  # Helpers (slug, URL, clipboard)
```

---

## URL Structure

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/login` | Login / sign up |
| `/dashboard` | Profile management |
| `/dashboard/new` | Create new profile |
| `/dashboard/edit/[id]` | Edit profile |
| `/u/[slug]` | Public profile page |

---

## Supabase Integration (Future)

The service layer is modular and ready for Supabase. To integrate:

1. Install: `npm install @supabase/supabase-js`
2. Replace `localStorage` calls in `src/services/profileService.ts` with Supabase queries
3. Replace mock auth in `src/hooks/useAuth.tsx` with `supabase.auth.signInWithPassword()`
4. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to `.env.local`

### Database schema (Supabase)

```sql
create table profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users,
  slug text unique not null,
  full_name text not null,
  company_name text,
  tagline text,
  bio text,
  profile_image text,
  social_links jsonb default '{}',
  theme jsonb not null,
  is_public boolean default true,
  scan_count integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

---

## Build

```bash
npm run build
npm start
```

---

## Environment Variables

```env
# Required for Supabase (future)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Optional: custom domain for QR URLs
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```
