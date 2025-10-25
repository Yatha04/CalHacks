# Deployment Guide

This guide covers deploying the Phone Banker Training Platform to production.

## 🚀 Deployment Options

### Option 1: Vercel (Recommended)

Vercel is the easiest deployment option for Next.js applications.

#### Steps:

1. **Install Vercel CLI** (optional, can also deploy via web)
   ```bash
   npm install -g vercel
   ```

2. **Connect to Git**
   - Push your code to GitHub, GitLab, or Bitbucket
   - Go to https://vercel.com/new
   - Import your repository

3. **Configure Environment Variables**
   - In Vercel dashboard, go to Project Settings > Environment Variables
   - Add these variables:
     ```
     NEXT_PUBLIC_VAPI_PUBLIC_KEY=your_vapi_key
     NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
     ```

4. **Deploy**
   ```bash
   vercel --prod
   ```
   Or click "Deploy" in the Vercel dashboard

5. **Custom Domain** (optional)
   - In Project Settings > Domains
   - Add your custom domain and follow DNS instructions

**Pros:**
- Automatic deployments on git push
- Global CDN
- Free for personal/small team use
- Built-in analytics
- Zero configuration needed

**Cons:**
- None for this use case

---

### Option 2: Netlify

Similar to Vercel with a slightly different interface.

#### Steps:

1. **Connect Repository**
   - Go to https://app.netlify.com/start
   - Connect your Git repository

2. **Configure Build Settings**
   - Build command: `npm run build`
   - Publish directory: `.next`

3. **Add Environment Variables**
   - Site Settings > Environment Variables
   - Add the same variables as Vercel

4. **Deploy**
   - Click "Deploy Site"

---

### Option 3: Railway

Good for full-stack applications with database.

#### Steps:

1. **Create Account**
   - Go to https://railway.app
   - Sign up with GitHub

2. **Deploy from GitHub**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Add Environment Variables**
   - Go to Variables tab
   - Add all required environment variables

4. **Railway will auto-detect Next.js and deploy**

**Pros:**
- Can host both app and database
- Simple pricing
- Good for growing projects

---

### Option 4: Self-Hosted with Docker

For complete control and on-premise deployment.

#### Create Dockerfile:

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set environment variables for build
ARG NEXT_PUBLIC_VAPI_PUBLIC_KEY
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY

ENV NEXT_PUBLIC_VAPI_PUBLIC_KEY=$NEXT_PUBLIC_VAPI_PUBLIC_KEY
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY

RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

#### Create docker-compose.yml:

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_VAPI_PUBLIC_KEY=${NEXT_PUBLIC_VAPI_PUBLIC_KEY}
      - NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
      - NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}
    restart: unless-stopped
```

#### Deploy:

```bash
# Build and run
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

---

## 🔒 Production Checklist

Before deploying to production:

### Security
- [ ] Environment variables are set correctly
- [ ] `.env.local` is NOT committed to git
- [ ] Supabase Row Level Security (RLS) policies are enabled
- [ ] API keys have appropriate restrictions
- [ ] HTTPS is enabled (automatic with Vercel/Netlify)

### Performance
- [ ] Images are optimized
- [ ] Build runs without errors: `npm run build`
- [ ] No console errors in production mode
- [ ] Analytics/monitoring is configured

### Functionality
- [ ] All voter profiles load correctly
- [ ] Vapi voice calls work
- [ ] Database connections work
- [ ] Performance reports generate correctly
- [ ] Mobile experience is tested

### User Experience
- [ ] Loading states are present
- [ ] Error messages are user-friendly
- [ ] Microphone permissions are requested properly
- [ ] Call quality is acceptable

---

## 🔧 Post-Deployment Configuration

### 1. Set Up Authentication (Optional)

If you want user accounts:

```bash
# In Supabase dashboard
1. Go to Authentication > Providers
2. Enable Email provider (or Google, GitHub, etc.)
3. Configure email templates
```

Then update the app to use Supabase Auth:

```typescript
// lib/auth.ts
import { supabase } from './supabase';

export async function signUp(email: string, password: string) {
  return await supabase.auth.signUp({ email, password });
}

export async function signIn(email: string, password: string) {
  return await supabase.auth.signInWithPassword({ email, password });
}
```

### 2. Configure Monitoring

Add error tracking with Sentry:

```bash
npm install @sentry/nextjs
npx @sentry/wizard -i nextjs
```

Add analytics with Vercel Analytics:

```bash
npm install @vercel/analytics
```

### 3. Set Up CI/CD

GitHub Actions example (`.github/workflows/deploy.yml`):

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npm test # if you have tests
```

---

## 📊 Monitoring

### Key Metrics to Track

1. **User Engagement**
   - Number of calls started
   - Call completion rate
   - Average call duration
   - Return user rate

2. **Performance**
   - Page load times
   - API response times
   - Error rates
   - Voice call quality

3. **Technical**
   - Vapi API usage (check dashboard)
   - Supabase database size
   - Bandwidth usage

### Set Up Alerts

In Vercel/Netlify:
- Enable deployment notifications
- Set up error alerts
- Monitor function execution times

---

## 💰 Cost Considerations

### Estimated Monthly Costs:

| Service | Free Tier | Paid Tier Start |
|---------|-----------|-----------------|
| Vercel | Unlimited for personal | $20/mo for team |
| Supabase | 500MB DB, 2GB bandwidth | $25/mo for Pro |
| Vapi | Pay per minute | ~$0.05-0.15/min |

**Example Usage:**
- 100 volunteers
- Each does 10 practice calls/month
- Average 5 minutes per call
- = 5,000 minutes = $250-750/month for Vapi

**Tips to Reduce Costs:**
- Set call duration limits
- Use cheaper voice providers in Vapi
- Cache static data
- Optimize database queries

---

## 🆘 Troubleshooting Production Issues

### Voice Calls Not Working

1. Check browser console for errors
2. Verify VAPI_PUBLIC_KEY is set correctly
3. Check Vapi dashboard for API errors
4. Ensure microphone permissions are granted
5. Test in Chrome/Edge (best WebRTC support)

### Database Connection Errors

1. Verify Supabase credentials
2. Check if IP is whitelisted (if using connection pooling)
3. Review Supabase logs
4. Ensure RLS policies aren't blocking requests

### Build Failures

1. Check environment variables are set
2. Run `npm run build` locally
3. Check for TypeScript errors
4. Verify all dependencies are installed

### Slow Performance

1. Enable Next.js caching
2. Use Vercel Edge Functions
3. Optimize images with next/image
4. Enable Supabase connection pooling
5. Add CDN for static assets

---

## 🎓 Scaling Considerations

As your platform grows:

### 1-100 Users
- Free tiers are sufficient
- Basic monitoring
- Manual support

### 100-1000 Users
- Upgrade to paid Supabase
- Implement caching
- Add error tracking
- Set up automated backups

### 1000+ Users
- Consider dedicated Vapi pricing
- Implement rate limiting
- Add load balancing
- Set up staging environment
- Implement A/B testing

---

## 📝 Maintenance Checklist

### Weekly
- [ ] Check error logs
- [ ] Review Vapi usage
- [ ] Monitor database size

### Monthly
- [ ] Review and optimize costs
- [ ] Update dependencies
- [ ] Backup database
- [ ] Review user feedback

### Quarterly
- [ ] Security audit
- [ ] Performance optimization
- [ ] Update voter profiles
- [ ] Review analytics

---

## ✅ Go Live!

Once everything is configured:

1. Test thoroughly in production
2. Monitor for the first few hours
3. Share the URL with your team
4. Gather feedback
5. Iterate and improve

Good luck with your deployment! 🚀

