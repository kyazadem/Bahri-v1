# 🦐 Bahri — Multi-Tenant QR Restaurant Ordering

A white-label, full-stack web application for QR-code-based restaurant ordering. Diners scan a QR code at their table, browse the menu, order directly from their phones, and call waiters with one tap. Kitchen staff see incoming orders in real time.

## Architecture

| Layer | Tech |
|-------|------|
| Frontend | React 18 + TypeScript + Tailwind CSS + Vite |
| Backend / DB / Auth | Supabase (Postgres + Auth + Realtime + RLS) |
| Deployment | Self-hosted (static build) |

## Multi-Tenancy

Every table is scoped to `restaurant_id`. Staff accounts are tied to a specific restaurant via `profiles.restaurant_id`. Diners are unscoped (can visit any restaurant). The URL parameter `?restaurant=SLUG&table=N` determines the active venue.

## Quick Start

### 1. Supabase Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor → New query**
3. Paste the contents of `supabase/migrations/001_initial_schema.sql`
4. Run the migration

### 2. Enable Realtime

In the Supabase Dashboard:
- **Database → Replication → supabase_realtime**
- Add tables: `orders`, `waiter_calls`

### 3. Configure OAuth Providers

- **Authentication → Providers**
- Enable **Google** and **Apple**
- Set Site URL and Redirect URL to your domain (e.g., `https://yourdomain.com`)
- Add `/auth/callback` to the allowed redirect URLs

### 4. Environment Variables

```bash
cp .env.example .env
```

Fill in your Supabase project credentials:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 5. Install & Run

```bash
npm install
npm run dev
```

### 6. Seed Sample Data

```bash
# In Supabase SQL Editor, run:
-- supabase/seed/001_sample_data.sql
```

Then visit: `http://localhost:5173/?restaurant=bahri-seafood&table=12`

## Staff Access

1. Create a staff account via Supabase Auth (email/password)
2. In the SQL Editor, run:
   ```sql
   UPDATE profiles 
   SET role = 'staff', restaurant_id = 'YOUR_RESTAURANT_UUID'
   WHERE email = 'staff@example.com';
   ```
3. Visit `/staff-login` and sign in

## QR Code Generation

Each table QR code should link to:
```
https://yourdomain.com/?restaurant=RESTAURANT_SLUG&table=TABLE_NUMBER
```

Generate QR codes in bulk from the Owner Dashboard (`/owner/qr-codes`).

## Project Structure

```
src/
├── components/        # Reusable UI components
├── components/ui/     # Primitive UI components (toast, modal, etc.)
├── pages/             # Route-level pages
├── pages/owner/       # Owner-only management pages
├── hooks/             # Custom React hooks
├── lib/               # Utilities & Supabase client
├── types/             # TypeScript definitions
```

## Authentication Flows

| User Type | Method | Entry | Redirect |
|-----------|--------|-------|----------|
| Diner | Google / Apple OAuth | `/login` | Back to menu |
| Staff | Email + password / Magic link | `/staff-login` | `/kitchen` |
| Owner | Same as staff | `/staff-login` | `/kitchen` + owner features |

## Security

- **Row Level Security (RLS)** enforces restaurant scoping on every table
- **Server-side price validation** via `validate_and_create_order()` RPC prevents client price tampering
- **Separate auth flows** prevent diners from accessing staff dashboards
- **Guest orders** work without auth but are still scoped by `restaurant_id`

## Customization Checklist

When onboarding a new restaurant:

- [ ] Insert restaurant row into `restaurants` table
- [ ] Upload logo to Supabase Storage, save URL in `restaurants.logo_url`
- [ ] Add menu categories and items to `menu_items`
- [ ] Add extras/add-ons to `menu_item_extras`
- [ ] Set `restaurants.primary_color` and `secondary_color` for branding
- [ ] Create staff accounts and assign `role` + `restaurant_id` in `profiles`
- [ ] Generate QR codes for each table
- [ ] Configure payment provider (Stripe/Square) if needed

## License

MIT — built for resale and white-label distribution.
