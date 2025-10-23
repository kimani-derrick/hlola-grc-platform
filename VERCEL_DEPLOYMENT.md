# Vercel Deployment Guide for HLOLA GRC Platform

## Current Status
✅ Backend API deployed on server: `https://api.hlola.io`
✅ Frontend ready for Vercel deployment

## Environment Variables for Vercel

Set these in your Vercel dashboard under Project Settings > Environment Variables:

```
NEXT_PUBLIC_API_URL=https://api.hlola.io/api
NEXTAUTH_URL=https://hlola.io
NEXTAUTH_SECRET=your-production-secret-key-change-this
NODE_ENV=production
```

## DNS Configuration

**Current (Correct):**
- `api.hlola.io` → `5.189.176.239` (your server) ✅
- `hlola.io` → **Vercel CNAME** (to be set after deployment)

**After Vercel deployment:**
1. Deploy to Vercel
2. Get the Vercel domain (e.g., `hlola-grc.vercel.app`)
3. Add custom domain `hlola.io` in Vercel
4. Vercel will provide CNAME target
5. Update DNS: `hlola.io` → Vercel's CNAME

## Deployment Steps

1. **Push code to GitHub** (if not already done)
2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Set environment variables (see above)
3. **Deploy**
4. **Add custom domain:**
   - In Vercel dashboard: Settings > Domains
   - Add `hlola.io`
   - Follow Vercel's DNS instructions
5. **Update DNS** with Vercel's CNAME target

## Testing

After deployment:
- Frontend: `https://hlola.io` (via Vercel)
- API: `https://api.hlola.io` (your server)
- Login should work seamlessly between frontend and API

## Files Created

- `vercel.json` - Vercel configuration
- `VERCEL_DEPLOYMENT.md` - This guide
