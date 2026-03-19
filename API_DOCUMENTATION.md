# API Documentation - GDG Event Portal

## Overview
This document outlines the API endpoints required to replace the mock API with a real backend.

## Base URL
```
Production: https://api.gdg-event.com/v1
Development: http://localhost:3000/v1
```

## Authentication
Currently uses simple token-based authentication. Token is verified at each endpoint.

---

## Endpoints

### 1. Send OTP

**POST** `/auth/otp/send`

Send OTP to user's email address.

**Request:**
```json
{
  "email": "john25001@akgec.ac.in"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "OTP sent to your email",
  "data": {
    "sessionId": "session_123456789",
    "expiresIn": 120
  },
  "statusCode": 200
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "Invalid email format",
  "statusCode": 400
}
```

**Status Codes:**
- `200` - OTP sent successfully
- `400` - Invalid request
- `429` - Too many requests
- `500` - Server error

---

### 2. Verify OTP

**POST** `/auth/otp/verify`

Verify OTP sent to user's email.

**Request:**
```json
{
  "email": "john25001@akgec.ac.in",
  "otp": "123456"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Email verified successfully",
  "data": {
    "verificationToken": "token_abc123xyz789",
    "expiresIn": 3600
  },
  "statusCode": 200
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "Invalid OTP",
  "statusCode": 400
}
```

**Validations:**
- OTP must be 6 digits
- OTP must not be expired (120 seconds)
- Maximum 5 attempts
- Email must exist in recent OTP request

---

### 3. Create Registration

**POST** `/registrations`

Create a new event registration.

**Headers:**
```
Authorization: Bearer {verificationToken}
Content-Type: application/json
```

**Request:**
```json
{
  "name": "John Doe",
  "email": "john25001@akgec.ac.in",
  "phone": "9876543210",
  "studentNumber": "25001",
  "branch": "CSE",
  "residence": true,
  "gender": "MALE",
  "verificationToken": "token_abc123xyz789"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Registration created successfully",
  "data": {
    "registrationId": "REG20250319001",
    "status": "REGISTERED",
    "createdAt": "2025-03-19T10:30:00Z",
    "registration": {
      "name": "John Doe",
      "email": "john25001@akgec.ac.in",
      "registrationId": "REG20250319001",
      "status": "REGISTERED"
    }
  },
  "statusCode": 201
}
```

**Response (Error - Duplicate):**
```json
{
  "success": false,
  "message": "Email already registered",
  "statusCode": 409
}
```

**Validations:**
- All fields required
- Email must be valid AKGEC format
- Phone must be 10 digits
- Student number format: 25XXXX (6-9 digits total)
- Branch must be from allowed list
- Verification token must be valid and not expired

---

### 4. Initiate Payment (Optional)

**POST** `/payments/initiate`

Create a payment order for registration.

**Request:**
```json
{
  "registrationId": "REG20250319001",
  "amount": 500,
  "currency": "INR"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Payment initiated",
  "data": {
    "paymentId": "pay_123456",
    "orderId": "order_abc123",
    "amount": 500,
    "currency": "INR",
    "status": "INITIATED"
  },
  "statusCode": 200
}
```

---

### 5. Verify Payment (Optional)

**POST** `/payments/verify`

Verify payment completion from payment gateway.

**Request:**
```json
{
  "paymentId": "pay_123456",
  "orderId": "order_abc123",
  "transactionId": "txn_xyz789"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Payment verified successfully",
  "data": {
    "registrationId": "REG20250319001",
    "status": "COMPLETED",
    "paymentId": "pay_123456"
  },
  "statusCode": 200
}
```

---

### 6. Get Registration (Optional)

**GET** `/registrations/{registrationId}`

Fetch registration details.

**Request:**
```
GET /registrations/REG20250319001
```

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "registrationId": "REG20250319001",
    "name": "John Doe",
    "email": "john25001@akgec.ac.in",
    "phone": "9876543210",
    "branch": "CSE",
    "status": "REGISTERED",
    "createdAt": "2025-03-19T10:30:00Z",
    "verifiedAt": "2025-03-19T10:35:00Z"
  },
  "statusCode": 200
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "message": "Error description",
  "statusCode": 400,
  "errors": {
    "fieldName": "Field-specific error"
  }
}
```

### Common Status Codes

| Code | Meaning | Action |
|------|---------|--------|
| 200 | OK | Request succeeded |
| 201 | Created | Resource created |
| 400 | Bad Request | Validation error, check fields |
| 401 | Unauthorized | Invalid or expired token |
| 409 | Conflict | Duplicate entry |
| 429 | Too Many Requests | Rate limited, retry later |
| 500 | Server Error | Try again later |

---

## Validation Rules

### Email
```javascript
// Must match format: name25xxxx@akgec.ac.in
/^([a-zA-Z]+)(25\d{4,7})@akgec\.ac\.in$/
```

### Phone
```javascript
// Must be 10 digits
/^\d{10}$/
```

### Student Number
```javascript
// Must start with 25, total 6-9 digits
/^25\d{4,7}$/
```

### Name
- Minimum 2 characters
- Maximum 100 characters
- Only letters and spaces

### Gender
- MALE
- FEMALE
- PREFER_NOT_TO_SAY

### Branches
- AIML
- CSE
- CSE-AIML
- CSE-DS
- CS
- CS-HINDI
- CS-IT
- CIVIL
- EN
- ECE
- IT
- ME

### Residence
- true (Hosteller)
- false (Dayscholar)

---

## Rate Limiting

All endpoints are rate limited:

- **OTP Send**: 3 requests per 5 minutes per email
- **OTP Verify**: 5 attempts per session
- **Registration**: 1 per email lifetime
- **General**: 100 requests per minute per IP

**Rate Limit Headers:**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1234567890
```

---

## CORS Policy

Allowed origins:
- http://localhost:5173 (dev)
- https://gdg-event.com (prod)

Allowed methods:
- GET
- POST
- OPTIONS

Allowed headers:
- Content-Type
- Authorization

---

## Security Notes

1. **HTTPS Only**: All production requests must use HTTPS
2. **CORS**: Properly configured for your domain
3. **CSRF Protection**: Include CSRF token in headers
4. **SQL Injection**: Use parameterized queries
5. **Input Validation**: Always validate server-side
6. **Token Expiration**: Tokens expire after 1 hour (3600 seconds)
7. **Sensitive Data**: Never return passwords or sensitive info

---

## Implementation Examples

### Using Axios (Frontend)

```javascript
import axios from 'axios';

const API_BASE_URL = 'https://api.gdg-event.com/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Send OTP
export const sendOTP = async (email) => {
  try {
    const response = await api.post('/auth/otp/send', { email });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Verify OTP
export const verifyOTP = async (email, otp) => {
  try {
    const response = await api.post('/auth/otp/verify', { email, otp });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Create Registration
export const createRegistration = async (formData, token) => {
  try {
    const response = await api.post('/registrations', formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
```

### Using Express.js (Backend)

```javascript
const express = require('express');
const app = express();

app.post('/v1/auth/otp/send', async (req, res) => {
  const { email } = req.body;

  // Validate email
  if (!email.match(/^[a-zA-Z]+25\d+@akgec\.ac\.in$/)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid email format',
      statusCode: 400,
    });
  }

  // Generate and send OTP
  const otp = generateOTP();
  await sendEmailOTP(email, otp);

  // Store OTP (in Redis or DB)
  await storeOTP(email, otp, 120); // 2 minutes

  res.json({
    success: true,
    message: 'OTP sent to your email',
    data: {
      sessionId: `session_${Date.now()}`,
      expiresIn: 120,
    },
    statusCode: 200,
  });
});

// Similar implementations for other endpoints
```

---

## Database Schema (Recommended)

### Registrations Table
```sql
CREATE TABLE registrations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  registration_id VARCHAR(50) UNIQUE,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  phone VARCHAR(10),
  student_number VARCHAR(10),
  branch VARCHAR(50),
  residence BOOLEAN,
  gender VARCHAR(20),
  status ENUM('REGISTERED', 'VERIFIED', 'PAID', 'CHECKED_IN'),
  created_at TIMESTAMP,
  verified_at TIMESTAMP,
  paid_at TIMESTAMP,
  updated_at TIMESTAMP
);

CREATE TABLE otp_sessions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(100),
  otp VARCHAR(6),
  session_id VARCHAR(100),
  attempts INT DEFAULT 0,
  is_verified BOOLEAN DEFAULT FALSE,
  expires_at TIMESTAMP,
  created_at TIMESTAMP
);

CREATE TABLE payments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  registration_id VARCHAR(50),
  payment_id VARCHAR(50),
  order_id VARCHAR(50),
  amount DECIMAL(10, 2),
  currency VARCHAR(3),
  status VARCHAR(20),
  transaction_id VARCHAR(100),
  created_at TIMESTAMP,
  verified_at TIMESTAMP
);
```

---

## Testing with cURL

```bash
# Send OTP
curl -X POST http://localhost:3000/v1/auth/otp/send \
  -H "Content-Type: application/json" \
  -d '{"email":"john25001@akgec.ac.in"}'

# Verify OTP
curl -X POST http://localhost:3000/v1/auth/otp/verify \
  -H "Content-Type: application/json" \
  -d '{"email":"john25001@akgec.ac.in","otp":"123456"}'

# Create Registration
curl -X POST http://localhost:3000/v1/registrations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer token_abc123" \
  -d '{
    "name":"John Doe",
    "email":"john25001@akgec.ac.in",
    "phone":"9876543210",
    "studentNumber":"25001",
    "branch":"CSE",
    "residence":true,
    "gender":"MALE"
  }'
```

---

## Integration Checklist

- [ ] All endpoints implemented
- [ ] Validation rules applied
- [ ] Error handling complete
- [ ] Rate limiting configured
- [ ] CORS properly setup
- [ ] Database tables created
- [ ] Logging implemented
- [ ] Tests written and passing
- [ ] API documentation updated
- [ ] Security review completed
- [ ] Load testing done
- [ ] Monitoring setup
- [ ] Backup strategy defined

---

For more details on integration, refer to `ARCHITECTURE.md` section on "API Integration Points".
