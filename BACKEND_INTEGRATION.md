# 🔗 Backend API Integration Guide

## Overview
This guide covers integrating the GDG Event Portal frontend with your backend API. **The flow MUST be followed strictly** or registration will fail.

---

## ⚙️ Setup Instructions

### 1. Environment Variables

Create a `.env` file in the root directory:

```bash
# Backend API Configuration
REACT_APP_API_BASE_URL=http://localhost:5000
# OR for production:
# REACT_APP_API_BASE_URL=https://api.yourdomain.com

# Google reCAPTCHA v3
REACT_APP_RECAPTCHA_SITE_KEY=your_recaptcha_site_key_here
REACT_APP_RECAPTCHA_ENABLED=true
```

### 2. Get reCAPTCHA Keys

1. Go to [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
2. Create a new reCAPTCHA project
3. Choose **reCAPTCHA v3**
4. Add your domain(s)
5. Copy the **Site Key** and add to `.env` as `REACT_APP_RECAPTCHA_SITE_KEY`

### 3. Install Dependencies

```bash
npm install
```

Axios is already included in `package.json`

---

## 📋 Registration Flow (STRICT ORDER)

The backend enforces this flow. **Do not skip steps!**

```
┌─────────────────────────┐
│ Step 1: Fill Form       │
│ Enter name, email, etc  │
└────────────┬────────────┘
             ↓
┌─────────────────────────────────┐
│ Step 2: Send OTP                │
│ POST /send-otp                  │
│ (name, email, studentNumber)    │
└────────────┬────────────────────┘
             ↓
┌─────────────────────────────────┐
│ Step 3: Verify OTP              │
│ POST /verify-otp                │
│ (email, otp)                    │
│ Returns: verification token     │
└────────────┬────────────────────┘
             ↓
┌─────────────────────────────────┐
│ Step 4: Payment                 │
│ Complete payment integration    │
│ Get: transactionId              │
└────────────┬────────────────────┘
             ↓
┌─────────────────────────────────┐
│ Step 5: Get reCAPTCHA Token     │
│ grecaptcha.execute('register')  │
└────────────┬────────────────────┘
             ↓
┌──────────────────────────────────┐
│ Step 6: Register Student         │
│ POST /register                   │
│ (all form data + transactionId   │
│  + captchaToken)                 │
└──────────────────────────────────┘
```

---

## 🔌 API Endpoints Reference

### 1. Send OTP
```http
POST /send-otp
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john25xxxx@akgec.ac.in",
  "studentNumber": "25XXXXX"
}

Response (200):
{
  "message": "OTP sent successfully",
  "sessionId": "session_123"
}

Errors:
- Email already registered (409)
- Student number already registered (409)
- Invalid email format (400)
```

### 2. Verify OTP
```http
POST /verify-otp
Content-Type: application/json

{
  "email": "john25xxxx@akgec.ac.in",
  "otp": "123456"
}

Response (200):
{
  "message": "OTP verified successfully",
  "verificationToken": "token_abc123",
  "token": "token_abc123"
}

Errors:
- Invalid OTP (401)
- OTP expired (410)
- Email not found (404)
- Exceeded attempts (429)
```

### 3. Register Student
```http
POST /register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john25xxxx@akgec.ac.in",
  "studentNumber": "25XXXXX",
  "phone": "9876543210",
  "branch": "CSE",
  "gender": "MALE",
  "residence": "hosteller",
  "transactionId": "TAX123456789",
  "captchaToken": "token_from_grecaptcha"
}

Response (201):
{
  "message": "Registration successful",
  "registrationId": "REG123456",
  "data": { ... }
}

Errors:
- OTP not verified (403)
- Email already registered (409)
- Phone already registered (409)
- Student number already registered (409)
- Invalid transactionId (400)
- Missing captchaToken (400)
- Invalid captcha (401)
```

---

## 🎯 Frontend Implementation Details

### Current Architecture

The frontend uses a modular approach:

```
src/
├── services/
│   ├── realApi.js          ← Backend API calls (Real API)
│   ├── mockApi.js          ← Mock API for testing (Keep for fallback)
│   └── api.js              ← API wrapper (abstraction layer)
├── hooks/
│   ├── useFormState.js     ← Form validation and state
│   ├── useOTP.js           ← OTP flow management
│   ├── useRecaptcha.js     ← reCAPTCHA token generation
│   └── useRegistration.js  ← Registration workflow
├── pages/
│   ├── RegistrationForm.jsx    ← Main form
│   └── OTPVerification.jsx     ← OTP input
└── constants/
    └── index.js            ← Configuration (API_CONFIG, RECAPTCHA_CONFIG)
```

### Switching to Real API

The frontend currently uses `mockApi`. To switch to the **real backend**:

#### Option 1: Update API Service (Recommended)

In `src/services/api.js`, change:

```javascript
// OLD (mock)
import mockApi from './mockApi';
class ApiService {
  constructor(apiClient = mockApi) {
    // ...
  }
}

// NEW (real)
import realApi from './realApi';
class ApiService {
  constructor(apiClient = realApi) {
    // ...
  }
}
```

#### Option 2: Use Environment Variable

In `src/services/api.js`:

```javascript
const apiClient = process.env.REACT_APP_USE_REAL_API === 'true' 
  ? realApi 
  : mockApi;
```

Then in `.env`:

```bash
REACT_APP_USE_REAL_API=true
```

---

## 🔐 Security Checklist

✅ **Email Validation:**
- Format: `name25xxxx@akgec.ac.in`
- Must be unique
- Cannot change after OTP is sent

✅ **OTP Security:**
- 6-digit code
- Expires after 2 minutes
- Max 5 attempts
- Sent via email

✅ **Payment:**
- Generate unique `transactionId`
- Store transaction for verification
- Cannot use duplicate IDs

✅ **reCAPTCHA:**
- Prevents automated submissions
- Google validates token server-side
- No manual verification needed

✅ **Phone Validation:**
- 10-digit number
- Must be unique
- Format: `9876543210`

✅ **Student Number:**
- Format: `25XXXXX` (starts with 25)
- Must be unique
- 6-9 digits total

---

## 🧪 Testing the Integration

### With Mock API (Development)
```bash
npm run dev
```
Uses mock API by default. Perfect for testing UI/UX without backend.

### With Real API (Production Ready)
1. Set up backend server
2. Update `.env` with `REACT_APP_API_BASE_URL`
3. Get reCAPTCHA keys
4. Update `src/services/api.js` to use `realApi`
5. Test the complete flow

---

## 📊 Response Handling

All API calls return:

```javascript
{
  success: boolean,      // true if successful
  message: string,       // Human-readable message
  data: object,          // Response data
  statusCode: number,    // HTTP status code (on error)
  registrationId: string, // For registration success
}
```

### Example Usage in Components:

```javascript
// Sending OTP
const result = await apiService.sendOTP(name, email, studentNumber);

if (result.success) {
  toast.success('OTP sent to your email');
  // Show OTP input screen
} else {
  toast.error(result.message);
  // Show error to user
}

// Verifying OTP
const verifyResult = await apiService.verifyOTP(email, otp);

if (verifyResult.success) {
  toast.success('Email verified successfully!');
  // Proceed to payment
} else {
  toast.error(verifyResult.message);
}

// Registering
const registerResult = await apiService.registerStudent(formData);

if (registerResult.success) {
  toast.success('Registration complete!');
  // Redirect to success page
} else {
  toast.error(registerResult.message);
}
```

---

## 🐛 Common Issues & Solutions

### Issue: "OTP verification failed"
**Solution:** Make sure:
- Email matches the OTP email exactly
- OTP hasn't expired (2-minute limit)
- You didn't exceed 5 attempts

### Issue: "Registration failed - email already exists"
**Solution:** The email is already registered. Can't register twice with same email.

### Issue: "Missing recaptchaToken"
**Solution:**
- Check reCAPTCHA site key is correct in `.env`
- Verify `REACT_APP_RECAPTCHA_ENABLED=true`
- Browser might have reCAPTCHA script blocked

### Issue: "Invalid transactionId"
**Solution:**
- transactionId must be unique
- Cannot be empty or null
- Must match payment system ID

### Issue: "Backend not responding"
**Solution:**
- Verify `REACT_APP_API_BASE_URL` is correct
- Check backend server is running
- Check CORS is configured on backend
- Look at browser console for detailed errors

---

## 📞 Backend Requirements

Your backend must implement these endpoints:

### `POST /send-otp`
- Validate name, email, studentNumber
- Check for duplicates (email, studentNumber)
- Generate 6-digit OTP
- Send via email
- Store session data
- Return success/error

### `POST /verify-otp`
- Validate email matches OTP email
- Check OTP correctness
- Track attempts (max 5)
- Check expiry (2 minutes)
- Generate verification token
- Return token or error

### `POST /register`
- Verify OTP was completed
- Validate all required fields
- Verify captcha token with Google
- Check for duplicates (email, phone, studentNumber)
- Validate transactionId exists
- Create registration record
- Return registrationId

---

## 🚀 Deployment Checklist

- [ ] All environment variables set in `.env.production`
- [ ] Backend API Base URL configured
- [ ] reCAPTCHA keys obtained and configured
- [ ] CORS enabled on backend
- [ ] HTTPS enabled on both frontend and backend
- [ ] Rate limiting implemented on backend
- [ ] Error logging set up
- [ ] Payment gateway configured
- [ ] Email service configured
- [ ] Database backups configured

---

## 📚 Additional Resources

- [Axios Documentation](https://axios-http.com/)
- [Google reCAPTCHA Docs](https://developers.google.com/recaptcha/docs/v3)
- [React Hooks Documentation](https://react.dev/reference/react)
- [Environment Variables in Vite](https://vitejs.dev/guide/env-and-mode.html)

---

**Last Updated:** March 19, 2026  
**Status:** Production Ready ✨
