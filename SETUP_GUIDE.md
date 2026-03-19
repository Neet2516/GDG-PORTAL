# 🚀 Quick Setup Guide - Backend Integration

## For Backend Developers & DevOps Teams

This guide shows how to integrate and configure the GDG Event Portal frontend with your backend API.

---

## ⚡ 5-Minute Setup

### Step 1: Get reCAPTCHA Keys
1. Go to [Google reCAPTCHA Admin](https://www.google.com/recaptcha/admin)
2. Click **Create** or **+** button
3. Choose **reCAPTCHA v3**
4. Add your domain (e.g., `yourdomain.com`)
5. Copy the **Site Key**

### Step 2: Create `.env` File
```bash
# Copy from .env.example
cp .env.example .env

# Edit .env and fill in:
# - REACT_APP_API_BASE_URL = your backend URL
# - REACT_APP_RECAPTCHA_SITE_KEY = from Google Console
```

### Step 3: Install & Run
```bash
npm install
npm run dev
```

Visit `http://localhost:5173`

---

## 🔧 Environment Variables

### Required for Production

| Variable | Example | Purpose |
|----------|---------|---------|
| `REACT_APP_API_BASE_URL` | `https://api.yourdomain.com` | Backend API endpoint |
| `REACT_APP_RECAPTCHA_SITE_KEY` | `6Lc...` | Google reCAPTCHA key |

### Optional

| Variable | Default | Purpose |
|----------|---------|---------|
| `REACT_APP_USE_REAL_API` | `false` | Use real or mock API |
| `REACT_APP_RECAPTCHA_ENABLED` | `true` | Enable reCAPTCHA |
| `REACT_APP_API_TIMEOUT` | `15000` | Request timeout (ms) |
| `REACT_APP_DEBUG` | `false` | Enable debug logging |

---

## 📐 Backend Integration Checklist

### Implement These Endpoints

```
POST /send-otp
POST /verify-otp
POST /register
```

Detailed specs in [BACKEND_INTEGRATION.md](./BACKEND_INTEGRATION.md)

### Database Schema (Example)

```sql
-- Students table
CREATE TABLE students (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  phone VARCHAR(10) UNIQUE NOT NULL,
  studentNumber VARCHAR(20) UNIQUE NOT NULL,
  branch VARCHAR(50),
  gender VARCHAR(20),
  residence VARCHAR(20),
  registrationDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- OTP Sessions table
CREATE TABLE otp_sessions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(100),
  otp VARCHAR(6),
  attempts INT DEFAULT 0,
  expiresAt TIMESTAMP,
  verified BOOLEAN DEFAULT FALSE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Registrations table
CREATE TABLE registrations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  registrationId VARCHAR(50) UNIQUE,
  studentId INT,
  transactionId VARCHAR(100) UNIQUE NOT NULL,
  captchaVerified BOOLEAN DEFAULT FALSE,
  status VARCHAR(20),
  registrationDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (studentId) REFERENCES students(id)
);
```

---

## 🔍 Testing the Integration

### 1. Test with Mock API (No Backend Needed)
```bash
# .env
REACT_APP_USE_REAL_API=false

npm run dev
```

### 2. Test with Real Backend
```bash
# .env
REACT_APP_USE_REAL_API=true
REACT_APP_API_BASE_URL=http://localhost:5000

npm run dev
```

### 3. Test Endpoints Manually

```bash
# Test Send OTP
curl -X POST http://localhost:5000/send-otp \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john25xxxx@akgec.ac.in",
    "studentNumber": "25XXXXX"
  }'

# Test Verify OTP
curl -X POST http://localhost:5000/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john25xxxx@akgec.ac.in",
    "otp": "123456"
  }'

# Test Register
curl -X POST http://localhost:5000/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john25xxxx@akgec.ac.in",
    "studentNumber": "25XXXXX",
    "phone": "9876543210",
    "branch": "CSE",
    "gender": "MALE",
    "residence": "hosteller",
    "transactionId": "TXN123456",
    "captchaToken": "token_from_frontend"
  }'
```

---

## 🔐 CORS Configuration

If frontend and backend are on different domains, configure CORS:

### Node.js/Express Example
```javascript
const cors = require('cors');

app.use(cors({
  origin: 'https://yourdomain.com',
  methods: ['GET', 'POST'],
  credentials: true,
  maxAge: 3600
}));
```

### Python/Flask Example
```python
from flask_cors import CORS

CORS(app, origins=['https://yourdomain.com'])
```

---

## 📊 Monitoring & Logging

### Frontend Error Tracking
Logs appear in browser console:
```
[API Service] Using REAL API
Error sending OTP: Email already registered
```

### Backend Error Response Format
```json
{
  "success": false,
  "message": "Email already registered",
  "statusCode": 409,
  "errors": {
    "email": ["Email must be unique"]
  }
}
```

---

## 🚨 Common Backend Mistakes

❌ **Not verifying OTP before registration**
```javascript
// WRONG
POST /register → {email, phone, ...}  // Skip OTP check

// RIGHT
POST /send-otp → {email, name, studentNumber}
POST /verify-otp → {email, otp}
POST /register → {...} // Only succeeds if OTP verified
```

❌ **Not validating captcha token**
```javascript
// WRONG - Backend accepts any captchaToken
app.post('/register', (req, res) => {
  // Just save it without verifying
});

// RIGHT - Backend verifies with Google
app.post('/register', async (req, res) => {
  const isValid = await verifyCaptchaToken(req.body.captchaToken);
  if (!isValid) return res.status(401).send('Invalid captcha');
});
```

❌ **Not checking OTP expiry**
```javascript
// WRONG - OTP never expires
// RIGHT - Check: if (Date.now() > otpSession.expiresAt) reject();
```

---

## 🧪 Production Deployment

### Pre-Deployment Checklist

- [ ] Backend deployed and tested
- [ ] CORS configured correctly
- [ ] Database backups set up
- [ ] Email service configured (for OTP)
- [ ] reCAPTCHA keys obtained
- [ ] SSL/HTTPS enabled
- [ ] Rate limiting implemented
- [ ] Logging & monitoring set up
- [ ] Error handling tested
- [ ] Load testing completed

### Build for Production
```bash
npm run build

# This creates dist/ folder
# Deploy to Vercel, Netlify, or your server
```

### Environment Variables for Production
```bash
REACT_APP_API_BASE_URL=https://api.yourdomain.com
REACT_APP_RECAPTCHA_SITE_KEY=your_production_key
REACT_APP_USE_REAL_API=true
NODE_ENV=production
```

---

## 📞 Support Resources

### Frontend Issues
- Check browser console for errors
- Enable `REACT_APP_DEBUG=true` in .env
- See [BACKEND_INTEGRATION.md](./BACKEND_INTEGRATION.md) for troubleshooting

### Backend Issues
- Verify endpoints match exact specification
- Check CORS headers
- Log all incoming requests
- Validate request body structure

### reCAPTCHA Issues
- Verify site key is correct
- Check domain is added in Google Console
- Ensure script loads before form submission
- Test in browser console: `console.log(window.grecaptcha)`

---

## 🎯 What's Provided

✅ React frontend with beautiful UI  
✅ Form validation & state management  
✅ OTP flow with timer  
✅ reCAPTCHA integration ready  
✅ Error handling & loading states  
✅ Responsive design  
✅ Mock API for testing  
✅ Real API service ready  

You just need to:
1. ✏️ Set environment variables
2. 🔌 Connect your backend
3. 🚀 Deploy!

---

## 🎓 Learning Resources

- [Vite Env Variables](https://vitejs.dev/guide/env-and-mode.html)
- [React Environment Setup](https://create-react-app.dev/docs/adding-custom-environment-variables/)
- [Axios Documentation](https://axios-http.com/docs/intro)
- [Google reCAPTCHA v3](https://developers.google.com/recaptcha/docs/v3)
- [CORS Explained](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

---

**Questions?** Check [BACKEND_INTEGRATION.md](./BACKEND_INTEGRATION.md) for detailed API specs.

**Last Updated:** March 19, 2026
