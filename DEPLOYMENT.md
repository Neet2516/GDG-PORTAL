# Deployment Guide - GDG Event Portal

## Pre-Deployment Checklist

- [ ] All features tested locally
- [ ] No console errors
- [ ] Environment variables configured
- [ ] API endpoints verified
- [ ] Mobile responsiveness tested
- [ ] Performance optimized
- [ ] Security review completed
- [ ] Analytics integrated
- [ ] Error tracking setup (Sentry/similar)
- [ ] Backup strategy planned

---

## Build Optimization

### 1. Production Build
```bash
npm run build
```

Outputs optimized files to `dist/` folder:
- All CSS minified
- JavaScript bundled and minified
- Assets optimized
- Tree-shaking applied

### 2. Verify Build
```bash
npm run preview
```
Test production build locally at `http://localhost:4173`

### 3. Build Analysis
```bash
# Install analyzer (optional)
npm install --save-dev vite-plugin-visualizer

# Add to vite.config.js and run build
```

---

## Environment Variables

Create `.env.production`:
```
VITE_BASE_URL=https://api.gdg-event.com
VITE_API_KEY=your-production-api-key
VITE_APP_ENV=production
```

Don't commit `.env` files to git!

---

## Deployment Platforms

### 1. Vercel (Recommended)

**Easiest deployment option**

#### Setup
```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel
```

#### Configuration (`vercel.json`)
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "env": {
    "VITE_BASE_URL": "@base-url",
    "VITE_API_KEY": "@api-key"
  }
}
```

#### Features
- Automatic deployments on push
- SSL certificates included
- CDN globally distributed
- Serverless functions (if needed)
- Real-time logs

---

### 2. Netlify

#### Setup
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod
```

#### Configuration (`netlify.toml`)
```toml
[build]
  command = "npm run build"
  publish = "dist"

[env]
  VITE_BASE_URL = "https://api.gdg-event.com"
  VITE_API_KEY = "your-api-key"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### Features
- Drag and drop deployment
- Automatic HTTPS
- Form handling
- Serverless functions
- Analytics included

---

### 3. GitHub Pages

#### Setup
```bash
# Add to package.json
"homepage": "https://your-username.github.io/gdg-event-portal"

# Build
npm run build

# Install deployment tool
npm install --save-dev gh-pages

# Add to package.json scripts
"predeploy": "npm run build",
"deploy": "gh-pages -d dist"
```

#### Deploy
```bash
npm run deploy
```

#### Limitations
- Static hosting only
- No backend API
- No environment variables

---

### 4. AWS S3 + CloudFront

#### Setup
```bash
# Install AWS CLI
npm install -g aws-cli

# Configure AWS
aws configure

# Create S3 bucket
aws s3 mb s3://gdg-event-portal-2025

# Upload files
aws s3 sync dist/ s3://gdg-event-portal-2025/ --delete

# Create CloudFront distribution (via AWS Console)
```

#### Features
- Highly scalable
- CDN distribution
- Custom domain
- Full control
- More complex setup

---

### 5. Docker (Any Server)

#### Dockerfile
```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### nginx.conf
```nginx
server {
  listen 80;
  location / {
    root /usr/share/nginx/html;
    index index.html;
    try_files $uri $uri/ /index.html;
  }
}
```

#### Deploy
```bash
# Build image
docker build -t gdg-event-portal .

# Run container
docker run -p 80:80 gdg-event-portal

# Push to registry
docker tag gdg-event-portal your-registry/gdg-event-portal:latest
docker push your-registry/gdg-event-portal:latest
```

---

## Performance Optimization

### 1. Enable Caching
```nginx
# .htaccess or nginx config
<FilesMatch "\.(jpg|jpeg|png|gif|ico|css|js|svg)$">
  Header set Cache-Control "max-age=31536000, public"
</FilesMatch>
```

### 2. Gzip Compression
```nginx
gzip on;
gzip_types text/plain text/css text/javascript application/json;
gzip_min_length 1000;
```

### 3. Image Optimization
```bash
# Optimize images before deploying
npm install -g imagemin-cli

imagemin src/assets/*.{jpg,png} --out-dir=src/assets/optimized
```

### 4. Lazy Load Components
Already implemented with React lazy + Suspense

---

## SSL/TLS Certificates

### Automatic (Vercel/Netlify)
- Included and auto-renewed
- No action needed

### Manual (AWS/Self-hosted)
```bash
# Using Let's Encrypt & Certbot
sudo apt-get install certbot python3-certbot-nginx
sudo certbot certonly -a standalone -d yourdomain.com
```

---

## Monitoring & Analytics

### 1. Error Tracking (Sentry)
```javascript
// src/main.jsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "https://your-key@sentry.io/your-project",
  environment: import.meta.env.VITE_APP_ENV,
});
```

### 2. Analytics (Google Analytics)
```html
<!-- index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_ID');
</script>
```

### 3. Performance Monitoring
```javascript
// src/utils/monitoring.js
export const trackWebVitals = () => {
  if (window.web && window.web.vitals) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(console.log);
      getFID(console.log);
      getFCP(console.log);
      getLCP(console.log);
      getTTFB(console.log);
    });
  }
};
```

---

## Domain & DNS

### Steps
1. Purchase domain (Namecheap, GoDaddy, etc.)
2. Update DNS records:
   - CNAME: www → your-deployment-url
   - A: @ → IP address (or use CNAME)
3. Update site URL in app constants
4. Test with custom domain

### DNS Configuration Examples

**Vercel:**
```
A → 76.76.19.165
AAAA → 2610:1f1:0:cd00::165
CNAME for www → cname.vercel-dns.com
```

**Netlify:**
```
Custom domain in settings
Nameservers provided by Netlify
Auto-configured HTTPS
```

---

## Continuous Deployment

### GitHub Actions (Free)

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

---

## Health Checks

### Implement Health Check Endpoint
```javascript
// Backend endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date(),
    uptime: process.uptime(),
  });
});
```

### Monitor Uptime
- Use UptimeRobot (free)
- Set alert threshold
- Monitor response times

---

## Backup Strategy

### Database Backups (Daily)
```bash
# Daily automated backups
0 2 * * * /backup.sh

# Backup script
#!/bin/bash
mongodump --uri="mongodb://..." --out="/backups/$(date +%Y%m%d)"
```

### Code Backups
- GitHub is your backup
- Enable branch protection
- Require code reviews

---

## Security Hardening

### 1. Security Headers
```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
add_header Content-Security-Policy "default-src 'self'" always;
```

### 2. HTTPS Redirect
```nginx
server {
  listen 80;
  server_name yourdomain.com;
  return 301 https://$server_name$request_uri;
}
```

### 3. API Rate Limiting
Already implemented in backend API

### 4. Input Validation
Already implemented in frontend validation

---

## Rollback Procedure

### Vercel
```bash
# View deployments
vercel ls

# Rollback to previous
vercel switch
```

### Netlify
```bash
# View deployments in UI
# Click ... → Rollback

# Via CLI
netlify deploy --prod --dir=dist
```

### Manual
```bash
# Keep previous build
aws s3 sync dist/ s3://bucket/ --delete
# Upload previous version if needed
```

---

## Performance Benchmarks

Target metrics:
- Lighthouse Score: 90+
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Cumulative Layout Shift: < 0.1
- Time to Interactive: < 3.5s

Check with:
```
https://pagespeed.web.dev/
```

---

## Post-Deployment

1. **Smoke Testing**
   - Test all registration flows
   - Check email notifications
   - Verify payment if applicable

2. **Monitor Logs**
   - Check error rates
   - Monitor API latency
   - Track user behavior

3. **User Communication**
   - Announce launch
   - Share registration link
   - Provide support channel

4. **Maintenance Window**
   - Schedule backups
   - Update dependencies
   - Monitor resources

---

## Common Deployment Issues

### Issue: Build Fails
```bash
# Clear cache and reinstall
rm -rf node_modules dist
npm install
npm run build
```

### Issue: Environment Variables Not Loading
```bash
# Verify .env file
# Check variable names (must start with VITE_)
# Rebuild after changing .env
```

### Issue: API Calls Fail in Production
```bash
# Check CORS configuration
# Verify API URL in .env.production
# Check API key permissions
```

### Issue: 404 on Refresh
```
# SPA routing issue
# Add redirect rule:
# /* → index.html (200)
```

---

## Support Resources

- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Guide](https://docs.netlify.com/)
- [AWS Deployment](https://aws.amazon.com/getting-started/hands-on/)

---

## Deployment Checklist

- [ ] Build completes without errors
- [ ] No console warnings/errors
- [ ] Environment variables configured
- [ ] API endpoints working
- [ ] Forms submit successfully
- [ ] Email notifications working
- [ ] Payment processing verified (if applicable)
- [ ] SSL certificate installed
- [ ] Domain configured
- [ ] DNS records set
- [ ] Monitoring setup
- [ ] Error tracking enabled
- [ ] Analytics integrated
- [ ] Backup strategy active
- [ ] Support email configured
- [ ] Legal pages updated
- [ ] Contact form tested

---

## Going Live Checklist

- [ ] Announce on social media
- [ ] Send registration link to users
- [ ] Setup support channel
- [ ] Monitor first 24 hours
- [ ] Quick response to issues
- [ ] Celebrate launch! 🎉

---

**Ready to deploy?** Choose your platform and follow the steps above. You're all set! 🚀
