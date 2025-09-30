# Bracelet Designer - La Nina Bracelets 📿

A Next.js 14 webapp that allows customers to design custom bracelets by choosing a base bracelet and positioning charms along an SVG path. Built with TypeScript, Tailwind CSS, Prisma, and Redis.

## 🚀 Features

- **Interactive SVG Designer**: Drag & drop charms along bracelet paths with real-time positioning
- **Smart Pricing**: Dynamic pricing with volume discounts (5% off 5+ charms, 10% off 10+ charms)
- **Real-time Validation**: Stock checking, quantity limits, and input validation
- **Stripe Integration**: Secure payment processing with Stripe Checkout
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Type-Safe**: Full TypeScript implementation with strict type checking
- **Modern Stack**: Next.js 14 App Router, React Server Components, Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM for robust data management
- **Caching**: Redis integration for design snapshots and rate limiting
- **Testing**: Comprehensive unit tests (Vitest) and E2E tests (Playwright)

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS 3.x
- **Database**: PostgreSQL + Prisma ORM
- **Caching**: Redis (Upstash)
- **Validation**: Zod schemas
- **Payments**: Stripe / Mollie
- **Testing**: Vitest + Playwright
- **Deployment**: Vercel ready

## 📂 Project Structure

```
├── app/
│   ├── (shop)/                 # Shop routes group
│   │   ├── bracelets/          # Bracelet listing
│   │   ├── designer/[slug]/    # Interactive designer
│   │   └── success/            # Order success page
│   ├── api/                    # API routes
│   │   ├── bracelets/[slug]/   # Bracelet details
│   │   ├── charms/             # Available charms
│   │   ├── designs/            # Design CRUD
│   │   └── checkout/           # Payment processing
│   ├── globals.css             # Global styles
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Homepage
├── components/
│   ├── designer/               # Designer components
│   │   └── Designer.tsx        # Main designer component
│   └── ui/                     # Reusable UI components
├── lib/
│   ├── db/                     # Database utilities
│   ├── redis/                  # Redis utilities
│   ├── env.ts                  # Environment validation
│   ├── pricing.ts              # Pricing logic
│   ├── validation.ts           # Zod schemas
│   └── svg.ts                  # SVG path utilities
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── seeds/                  # Database seeds
└── tests/
    ├── unit/                   # Unit tests
    └── e2e/                    # E2E tests
```

## 🏗 Setup & Installation

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Redis instance (or Upstash account)
- Stripe account (for payments)

### 1. Clone & Install

```bash
git clone <repository-url>
cd MyBracelets
npm install
```

### 2. Environment Setup

Copy the environment template:

```bash
cp .env.local.template .env.local
```

Edit `.env.local` with your configuration:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/bracelet_designer"

# Redis
REDIS_URL="redis://localhost:6379"

# Payment Provider
PAYMENT_PROVIDER="stripe"
STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key_here"
MOLLIE_API_KEY=""

# App Configuration  
APP_URL="http://localhost:3000"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

NODE_ENV="development"
```

### 3. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# Seed the database
npm run db:seed
```

### 4. Development

```bash
# Start development server
npm run dev

# Open http://localhost:3000
```

## 📝 Scripts

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm run start           # Start production server
npm run lint            # Run ESLint

# Database
npm run db:generate     # Generate Prisma client
npm run db:push         # Push schema to database
npm run db:migrate      # Run migrations
npm run db:seed         # Seed database

# Testing
npm run test            # Run unit tests
npm run test:ui         # Run tests with UI
npm run test:e2e        # Run E2E tests

# Database Management
npx prisma studio       # Open Prisma Studio
npx prisma db seed      # Manual seeding
```

## 🎨 Usage

### 1. Choose Base Bracelet
- Visit `/bracelets` to see available base bracelets
- Each bracelet has different SVG paths and pricing

### 2. Design Your Bracelet
- Click "Start Designing" to enter the interactive designer
- Drag charms from the sidebar onto the bracelet path
- Position charms exactly where you want them
- Adjust offset and rotation as needed

### 3. Pricing & Discounts
- Real-time price calculation as you add charms
- Volume discounts automatically applied:
  - 5% off for 5-9 charms
  - 10% off for 10+ charms

### 4. Save & Checkout
- Save your design to generate a unique design ID
- Proceed to Stripe Checkout for payment
- Receive confirmation and order details

## 🧪 Testing

### Unit Tests

```bash
npm run test            # Run all unit tests
npm run test:ui         # Run with interactive UI
```

Test coverage includes:
- Pricing calculations
- Validation logic
- SVG utilities
- API route handlers

### E2E Tests

```bash
npm run test:e2e
```

E2E tests cover:
- Full user journey from home to checkout
- Designer functionality
- Mobile responsiveness
- Error handling

## 🚀 Deployment

### Vercel (Recommended)

The project is optimized for Vercel deployment with automatic Prisma Client generation.

#### Quick Deploy Steps:

1. **Connect Repository**
   - Import project to Vercel from GitHub
   - Select the repository and branch

2. **Environment Variables**
   ```env
   DATABASE_URL="postgresql://user:pass@host:5432/db"
   STRIPE_SECRET_KEY="sk_live_..."
   STRIPE_PUBLISHABLE_KEY="pk_live_..."
   STRIPE_WEBHOOK_SECRET="whsec_..."
   JWT_SECRET="your-secure-jwt-secret"
   PAYMENT_PROVIDER="stripe"
   ```

3. **Build Configuration**
   - Build Command: `npm run build` (includes prisma generate)
   - Install Command: `npm install`
   - Output Directory: `.next`

4. **Deploy**
   - Push to main branch or trigger manual deployment
   - Vercel will automatically build and deploy

#### Database Setup

```bash
# Apply migrations to production database
npx prisma migrate deploy

# Seed production data (optional)
npm run db:seed
```

#### Troubleshooting

- **Prisma Issues**: The build script includes `prisma generate` and `postinstall` hook
- **Environment Variables**: Ensure all required vars are set in Vercel dashboard
- **Build Logs**: Check Vercel function logs for runtime errors

See `DEPLOYMENT.md` for detailed deployment guide.

## 🏛 Architecture

### Data Model

- **BaseBracelet**: Base bracelet designs with SVG paths
- **Charm**: Individual charms with pricing and stock
- **Design**: Customer designs linking bracelets and charm placements
- **DesignCharm**: Individual charm placements with position data

### Key Components

1. **Designer Component**: Main interactive SVG designer with drag & drop
2. **Pricing Engine**: Real-time pricing with discount calculation
3. **Validation System**: Zod schemas for type-safe data validation
4. **Payment Integration**: Stripe Checkout with webhook support
5. **Caching Layer**: Redis for design snapshots and rate limiting

### SVG Path System

- Bracelet designs defined as SVG paths
- Charms positioned using parametric `t` values (0-1)
- Offset support for positioning charms above/below the path
- Real-time collision detection and spacing

## 🔧 Customization

### Adding New Bracelets

1. Add to database via Prisma Studio or seed script
2. Define SVG path and physical measurements
3. Set base pricing

### Adding New Charms

1. Create SVG icons for charms
2. Add to database with pricing and stock
3. Set maximum quantities per bracelet

### Styling

- Modify `tailwind.config.ts` for design system changes
- Update global styles in `app/globals.css`
- Customize component styles in individual files

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Prisma team for the excellent ORM
- Tailwind CSS for the utility-first CSS framework
- Stripe for secure payment processing

---

**Happy Bracelet Designing! 📿✨**