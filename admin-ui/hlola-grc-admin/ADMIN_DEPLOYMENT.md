# Admin UI Deployment Guide for HLOLA GRC Platform

## Current Status
✅ Backend API deployed on server: `https://api.hlola.io`
✅ Admin UI ready for Vercel deployment

## Environment Variables for Vercel

Set these in your Vercel dashboard under Project Settings > Environment Variables:

```
NEXT_PUBLIC_API_URL=https://api.hlola.io
NEXTAUTH_URL=https://admin.hlola.io
NEXTAUTH_SECRET=your-admin-production-secret-key-change-this
NODE_ENV=production
```

## DNS Configuration

**Current (Correct):**
- `api.hlola.io` → `5.189.176.239` (your server) ✅
- `hlola.io` → **Vercel CNAME** (main frontend)
- `admin.hlola.io` → **Vercel CNAME** (admin UI) - to be set after deployment

**After Vercel deployment:**
1. Deploy admin UI to Vercel
2. Get the Vercel domain (e.g., `hlola-grc-admin.vercel.app`)
3. Add custom domain `admin.hlola.io` in Vercel
4. Vercel will provide CNAME target
5. Update DNS: `admin.hlola.io` → Vercel's CNAME

## Deployment Steps

1. **Push admin UI code to GitHub** (if not already done)
2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository (`hlola-grc-admin`)
   - Set environment variables (see above)
3. **Deploy**
4. **Add custom domain:**
   - In Vercel dashboard: Settings > Domains
   - Add `admin.hlola.io`
   - Follow Vercel's DNS instructions
5. **Update DNS** with Vercel's CNAME target

## Testing

After deployment:
- Admin UI: `https://admin.hlola.io` (via Vercel)
- API: `https://api.hlola.io` (your server)
- Admin login should work seamlessly with the API

## Files Created

- `vercel.json` - Vercel configuration for admin UI
- `ADMIN_DEPLOYMENT.md` - This guide

## Complete Domain Structure

- `hlola.io` → Main frontend (Vercel)
- `admin.hlola.io` → Admin UI (Vercel)
- `api.hlola.io` → Backend API (your server)
