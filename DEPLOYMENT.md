# Vercel Deployment Guide

## Environment Variables

Make sure to configure these environment variables in your Vercel project settings:

### Required Variables
```
DATABASE_URL=postgresql://username:password@host:5432/database
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
JWT_SECRET=your-secure-random-string
PAYMENT_PROVIDER=stripe
```

### Optional Variables
```
REDIS_URL=redis://...
NEXTAUTH_SECRET=another-secure-random-string
NEXTAUTH_URL=https://your-domain.com
```

## Pre-deployment Checklist

1. **Database Setup**
   - Ensure your PostgreSQL database is accessible from Vercel
   - Run migrations: `npx prisma migrate deploy`
   - Seed data if needed: `npm run db:seed`

2. **Environment Variables**
   - Copy all variables from `.env.example`
   - Set production values in Vercel dashboard
   - Test database connection

3. **Build Test**
   ```bash
   npm run build
   ```

## Deployment Steps

1. **Connect Repository**
   - Link your GitHub repository to Vercel
   - Import the project

2. **Configure Build Settings**
   - Build Command: `npm run build`
   - Install Command: `npm install`
   - Output Directory: `.next`

3. **Set Environment Variables**
   - Go to Project Settings → Environment Variables
   - Add all required variables

4. **Deploy**
   - Push to main branch or trigger manual deployment

## Troubleshooting

### Prisma Issues
- Make sure `postinstall` script runs `prisma generate`
- Verify DATABASE_URL is correctly set
- Check that migrations are applied

### Build Failures
- Check environment variables are set
- Verify all dependencies are in package.json
- Review build logs for specific errors

### Runtime Errors
- Check function logs in Vercel dashboard
- Verify database connectivity
- Test API endpoints individually