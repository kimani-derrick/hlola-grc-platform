# Deployment Guide

## Environment Configuration

This project uses a centralized environment configuration system located in `src/config/environment.ts`.

### Environment Files

1. **Development**: `env.development` (or `.env.local` for personal overrides)
2. **Staging**: `env.staging`
3. **Production**: `env.production`

### Environment Variables

#### Required Variables

| Variable | Description | Development | Production |
|----------|-------------|-------------|------------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:3001/api` | `https://your-api-domain.com/api` |
| `NEXTAUTH_URL` | Frontend URL | `http://localhost:3000` | `https://your-frontend-domain.com` |
| `NEXTAUTH_SECRET` | NextAuth secret key | `dev-secret-key` | `your-production-secret` |

#### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `NEXT_PUBLIC_DEBUG` | Debug mode | `false` |

## Deployment Strategies

### 1. Vercel Deployment

1. **Set Environment Variables in Vercel Dashboard:**
   ```
   NEXT_PUBLIC_API_URL=https://your-api-domain.com/api
   NEXTAUTH_URL=https://your-frontend-domain.vercel.app
   NEXTAUTH_SECRET=your-production-secret-key
   NODE_ENV=production
   ```

2. **Deploy:**
   ```bash
   npm run build
   vercel --prod
   ```

### 2. Netlify Deployment

1. **Set Environment Variables in Netlify Dashboard:**
   ```
   NEXT_PUBLIC_API_URL=https://your-api-domain.com/api
   NEXTAUTH_URL=https://your-frontend-domain.netlify.app
   NEXTAUTH_SECRET=your-production-secret-key
   NODE_ENV=production
   ```

2. **Deploy:**
   ```bash
   npm run build
   netlify deploy --prod
   ```

### 3. Docker Deployment

1. **Create production Dockerfile:**
   ```dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci --only=production
   COPY . .
   RUN npm run build
   EXPOSE 3000
   CMD ["npm", "start"]
   ```

2. **Create docker-compose.yml:**
   ```yaml
   version: '3.8'
   services:
     frontend:
       build: .
       ports:
         - "3000:3000"
       environment:
         - NODE_ENV=production
         - NEXT_PUBLIC_API_URL=https://your-api-domain.com/api
         - NEXTAUTH_URL=https://your-frontend-domain.com
         - NEXTAUTH_SECRET=your-production-secret-key
   ```

3. **Deploy:**
   ```bash
   docker-compose up -d
   ```

### 4. AWS/Cloud Deployment

1. **Set Environment Variables in your hosting platform**
2. **Use the centralized environment configuration**

## Environment Validation

The application includes environment validation. Check the console for any missing variables:

```typescript
import { validateEnvironment } from './src/config/environment';

const { isValid, missingVars } = validateEnvironment();
if (!isValid) {
  console.error('Missing environment variables:', missingVars);
}
```

## Security Considerations

### Production Checklist

- [ ] Change `NEXTAUTH_SECRET` to a strong, random value
- [ ] Use HTTPS URLs for production
- [ ] Set `NODE_ENV=production`
- [ ] Disable debug mode (`NEXT_PUBLIC_DEBUG=false`)
- [ ] Validate all environment variables are set
- [ ] Use environment-specific API endpoints

### Secret Management

**Never commit secrets to version control!**

- Use your hosting platform's environment variable system
- Use tools like AWS Secrets Manager, Azure Key Vault, or HashiCorp Vault
- Rotate secrets regularly
- Use different secrets for different environments

## Troubleshooting

### Common Issues

1. **API calls failing in production:**
   - Check `NEXT_PUBLIC_API_URL` is set correctly
   - Verify CORS settings on backend
   - Check network connectivity

2. **Authentication not working:**
   - Verify `NEXTAUTH_URL` matches your domain
   - Check `NEXTAUTH_SECRET` is set
   - Ensure backend auth endpoints are accessible

3. **Build failures:**
   - Check all required environment variables are set
   - Verify Node.js version compatibility
   - Check for TypeScript errors

### Debug Mode

Enable debug mode in development:
```bash
NEXT_PUBLIC_DEBUG=true npm run dev
```

This will log environment configuration and additional debugging information.
