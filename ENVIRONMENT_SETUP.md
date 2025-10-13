# Environment Setup Guide

## Overview

This project uses a centralized environment configuration system that works across development, staging, and production environments.

## Quick Start

### 1. **Development Setup**
```bash
# Set up development environment
npm run setup

# Or manually:
npm run env:dev
npm install
npm run dev
```

### 2. **Environment Validation**
```bash
# Check if all required environment variables are set
npm run env:validate
```

## Environment Files Structure

```
project-root/
├── env.example          # Template file (committed to git)
├── env.development      # Development defaults (committed to git)
├── env.staging          # Staging defaults (committed to git)
├── env.production       # Production defaults (committed to git)
├── .env.local           # Local overrides (gitignored)
└── src/config/
    └── environment.ts   # Centralized configuration
```

## Environment Variables

### Required Variables

| Variable | Description | Development | Production |
|----------|-------------|-------------|------------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:3001/api` | `https://your-api.com/api` |
| `NEXTAUTH_URL` | Frontend URL | `http://localhost:3000` | `https://your-frontend.com` |
| `NEXTAUTH_SECRET` | NextAuth secret | `dev-secret-key` | `your-production-secret` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `NEXT_PUBLIC_DEBUG` | Debug mode | `false` |

## Usage Examples

### Development
```bash
# Set up development environment
npm run env:dev

# Start development server
npm run dev
```

### Production
```bash
# Set up production environment
npm run env:prod

# Build for production
npm run build
npm run start
```

### Staging
```bash
# Set up staging environment
npm run env:staging

# Build for staging
npm run build
npm run start
```

## Environment Configuration

The centralized configuration is in `src/config/environment.ts`:

```typescript
import { env } from './src/config/environment';

// Use environment variables
const apiUrl = env.apiUrl;
const isDevelopment = env.isDevelopment;
```

## Deployment Strategies

### 1. **Vercel/Netlify**
Set environment variables in the hosting platform dashboard:
- `NEXT_PUBLIC_API_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`

### 2. **Docker**
```dockerfile
# In your Dockerfile
ENV NEXT_PUBLIC_API_URL=https://your-api.com/api
ENV NEXTAUTH_URL=https://your-frontend.com
ENV NEXTAUTH_SECRET=your-production-secret
```

### 3. **Kubernetes**
```yaml
# In your deployment.yaml
env:
  - name: NEXT_PUBLIC_API_URL
    value: "https://your-api.com/api"
  - name: NEXTAUTH_URL
    value: "https://your-frontend.com"
  - name: NEXTAUTH_SECRET
    valueFrom:
      secretKeyRef:
        name: app-secrets
        key: nextauth-secret
```

## Security Best Practices

### ✅ Do
- Use different secrets for different environments
- Use HTTPS URLs in production
- Store secrets in your hosting platform's secret management
- Rotate secrets regularly
- Use strong, random secret keys

### ❌ Don't
- Commit `.env.local` or actual secrets to git
- Use the same secret across environments
- Use HTTP URLs in production
- Hardcode secrets in your code

## Troubleshooting

### Common Issues

1. **"Missing environment variables" error**
   ```bash
   npm run env:validate
   ```

2. **API calls failing**
   - Check `NEXT_PUBLIC_API_URL` is correct
   - Verify CORS settings on backend
   - Check network connectivity

3. **Authentication not working**
   - Verify `NEXTAUTH_URL` matches your domain
   - Check `NEXTAUTH_SECRET` is set
   - Ensure backend auth endpoints are accessible

### Debug Mode

Enable debug mode to see environment configuration:
```bash
NEXT_PUBLIC_DEBUG=true npm run dev
```

## Scripts Reference

| Script | Description |
|--------|-------------|
| `npm run env:dev` | Set up development environment |
| `npm run env:prod` | Set up production environment |
| `npm run env:staging` | Set up staging environment |
| `npm run env:validate` | Validate environment variables |
| `npm run setup` | Complete setup (env + install) |

## Migration from Old System

If you're migrating from the old environment system:

1. **Remove old environment variables** from your code
2. **Update imports** to use the centralized config:
   ```typescript
   // Old
   const apiUrl = process.env.NEXT_PUBLIC_API_URL;
   
   // New
   import { env } from './src/config/environment';
   const apiUrl = env.apiUrl;
   ```
3. **Run environment setup**:
   ```bash
   npm run env:dev
   ```

## Support

For issues with environment setup:
1. Check this guide first
2. Run `npm run env:validate`
3. Check the console for environment configuration logs
4. Verify all required variables are set in your hosting platform
