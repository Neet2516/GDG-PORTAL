# GDG Event Portal 2025

A modern, production-ready event registration portal for Google Developer Groups built with React 19, Vite, and Tailwind CSS.

## ✨ Features

- ✨ Modern, clean, and responsive UI/UX
- 🎯 Complete registration workflow with email validation
- 📧 OTP-based email verification with 2-minute countdown
- 🔐 Google reCAPTCHA v3 integration
- 💳 Payment integration ready
- 🔌 Real backend API support + mock API for development
- 🏗️ Scalable, feature-based architecture
- 🎨 Beautiful component library with variants
- 📱 Mobile-first responsive design
- ⚡ Lightning-fast performance with Vite
- 🔒 Robust input validation with cross-field checks
- 🎭 Smooth animations with Framer Motion
- 💾 Session-based state management
- 🚀 Production-ready & deployment guides included

## 🚀 Quick Start

### Development (with Mock API)

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:5173
```

### With Real Backend API

```bash
# 1. Copy environment template
cp .env.example .env

# 2. Edit .env and fill in:
#    - REACT_APP_API_BASE_URL=your_backend_url
#    - REACT_APP_RECAPTCHA_SITE_KEY=your_recaptcha_key
#    - REACT_APP_USE_REAL_API=true

# 3. Start development server
npm run dev
```

For detailed setup instructions, see [SETUP_GUIDE.md](./SETUP_GUIDE.md)

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| [SETUP_GUIDE.md](./SETUP_GUIDE.md) | Environment setup & configuration |
| [BACKEND_INTEGRATION.md](./BACKEND_INTEGRATION.md) | Backend API specs & flow |
| [START_HERE.md](./START_HERE.md) | Quick navigation guide |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Technical architecture details |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | Production deployment guides |

## 🔧 Tech Stack

| Technology | Purpose | Version |
|-----------|---------|---------|
| **React** | UI Framework | 19.0.0 |
| **Vite** | Build tool & bundler | 7.0.0 |
| **Tailwind CSS** | Styling | 4.0.0 |
| **Framer Motion** | Animations | 11.0.0 |
| **React Router** | Navigation | 7.0.0 |
| **Axios** | HTTP client | 1.7.0 |
| **React Hot Toast** | Notifications | 2.4.1 |
| **React Icons** | Icon library | 6.0.0 |

## 📁 Project Structure

```
src/
├── assets/              # Static files & images
├── components/          # Reusable UI components
│   ├── Button.jsx       # CTA buttons (primary, secondary, outline, ghost)
│   ├── Input.jsx        # Text inputs with validation
│   ├── Select.jsx       # Dropdown selects
│   ├── RadioGroup.jsx   # Radio button groups
│   ├── Card.jsx         # Container cards
│   ├── Navbar.jsx       # Top navigation
│   ├── Footer.jsx       # Footer with links
│   └── index.js         # Export all
├── pages/              # Page components
│   ├── HeroSection.jsx       # Landing hero
│   ├── EventDetails.jsx      # Event features
│   ├── RegistrationForm.jsx  # Main form
│   ├── OTPVerification.jsx   # OTP input
│   ├── RegistrationSuccess.jsx # Success
│   ├── NotFound.jsx          # 404 page
│   └── index.js              # Export all
├── services/           # API & business logic
│   ├── api.js          # API wrapper (real or mock)
│   ├── realApi.js      # Real backend API
│   └── mockApi.js      # Mock API for development
├── hooks/              # Custom React hooks
│   ├── useFormState.js   # Form state & validation
│   ├── useOTP.js        # OTP workflow
│   ├── useRecaptcha.js  # reCAPTCHA integration
│   ├── useRegistration.js # Registration flow
│   ├── useSessionStorage.js # Session management
│   └── index.js         # Export all
├── utils/              # Utility functions
│   ├── validators.js    # Form validators
│   ├── formatter.js     # Data formatters
│   ├── helpers.js       # Helper functions
│   └── index.js         # Export all
├── constants/          # Configuration
│   └── index.js        # API config, event details, rules
├── config/             # Configuration files
├── context/            # React context (for future)
├── App.jsx             # Main app component
├── main.jsx            # React entry point
├── index.css           # Global styles
└── .env.example        # Example environment variables

public/
└── index.html          # HTML template with reCAPTCHA

config/
├── vite.config.js      # Vite configuration
├── tailwind.config.js  # Tailwind theme
├── eslint.config.js    # Linting rules
└── package.json        # Dependencies & scripts

docs/
├── README.md           # This file
├── SETUP_GUIDE.md      # Setup & configuration
├── BACKEND_INTEGRATION.md # API specs
├── START_HERE.md       # Quick start
├── ARCHITECTURE.md     # Technical details
├── DEPLOYMENT.md       # Deployment guides
└── PROJECT_SUMMARY.md  # Project overview
```

## 🔌 Backend Integration

The portal supports both **Mock API** (development) and **Real Backend API** (production).

### Registration Flow

```
1. Fill Form
    ↓
2. Send OTP → Backend sends to email
    ↓
3. Verify OTP → User enters 6-digit code
    ↓
4. Payment → Complete payment (get transactionId)
    ↓
5. reCAPTCHA → Generate token for bot protection
    ↓
6. Register → Submit with all data + tokens
    ↓
✅ Success!
```

### Backend API Endpoints

```
POST /send-otp          - Send OTP to email
POST /verify-otp        - Verify OTP code
POST /register          - Register student
```

See [BACKEND_INTEGRATION.md](./BACKEND_INTEGRATION.md) for complete specs.

### Environment Configuration

```bash
# .env
REACT_APP_API_BASE_URL=http://localhost:5000
REACT_APP_RECAPTCHA_SITE_KEY=your_key_here
REACT_APP_USE_REAL_API=true
```

## 🎯 Available Scripts

```bash
# Development server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Lint code
npm run lint
```

## 📋 Form Fields

| Field | Type | Validation |
|-------|------|-----------|
| Name | Text | 2-100 chars, letters only |
| Email | Email | College email format (name25xxxx@akgec.ac.in) |
| Phone | Phone | 10-digit number |
| Student Number | Text | Starts with 25, 6-9 digits |
| Branch | Select | CSE, IT, Civil, etc. |
| Gender | Radio | Male, Female, Prefer not to say |
| Residence | Radio | Hosteller, Dayscholar |

## 🔐 Security Features

- ✅ Email verification with OTP
- ✅ Google reCAPTCHA v3 protection
- ✅ Input validation & sanitization
- ✅ Session management
- ✅ HTTPS ready
- ✅ CORS configured
- ✅ Rate limiting support
- ✅ Error handling & logging

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🎨 Customization

### Change Event Details

Edit `src/constants/index.js`:

```javascript
export const EVENT_CONFIG = {
  name: 'Your Event Name',
  eventDate: '2025-05-20',
  eventLocation: 'Your Location',
  registrationFee: 0,
};
```

### Change Colors

Edit `tailwind.config.js`:

```javascript
colors: {
  primary: '#42
│   ├── RegistrationSuccess.jsx
│   ├── NotFound.jsx
│   └── index.js
├── services/           # API layer
│   ├── mockApi.js       # Mock backend
│   ├── api.js          # API wrapper
│   └── index.js
├── hooks/              # Custom React hooks
│   ├── useFormState.js
│   ├── useOTP.js
│   ├── useRegistration.js
│   ├── useSessionStorage.js
│   └── index.js
├── utils/              # Utility functions
│   ├── validators.js   # Form validation
│   ├── formatter.js    # Data formatting
│   ├── helpers.js      # Helper functions
│   └── index.js
├── constants/          # Application constants
│   └── index.js
├── config/             # Configuration files
├── context/            # React context (for future state management)
├── App.jsx            # Main app component
├── main.jsx           # Entry point
└── index.css          # Global styles
```

## Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run ESLint
npm run lint
```

The app will start at `http://localhost:5173`

## Key Features Explained

### 1. Form Validation System
- Comprehensive validators for all form fields
- Real-time validation feedback
- Email-to-student number matching
- Phone number normalization
- Custom error messages

### 2. OTP Workflow
- Email-based OTP verification
- 2-minute expiration timer
- Resend functionality
- Multiple attempt protection
- Demo OTP: `123456`

### 3. Custom Hooks
- `useFormState`: Form data and validation management
- `useOTP`: OTP request and verification flow
- `useRegistration`: Registration state management
- `useSessionStorage`: Persistent session data

### 4. Component Library
- Fully typed, reusable components
- Consistent design language
- Accessibility-focused
- Animation support
- Variant support (primary, secondary, outline, etc.)

### 5. Mock API (Replaceable)
- Simulates real backend API
- Realistic delays
- Error handling
- Easy to replace with real API

## Customization Guide

### Change Event Details
Edit `src/constants/index.js`:
```javascript
export const EVENT_CONFIG = {
  name: 'Your Event Name',
  year: 2025,
  eventDate: 'YYYY-MM-DD',
  eventLocation: 'Your Location',
  registrationFee: 500,
};
```

### Update Validation Rules
Edit `src/utils/validators.js` for field-specific validation.

### Modify Colors
Edit `tailwind.config.js`:
```javascript
colors: {
  gdg: {
    primary: '#YOUR_COLOR',
    secondary: '#YOUR_COLOR',
    // ...
  }
}
```

### Replace Mock API
Replace `mockApi` service in `src/services/api.js` with your backend API calls.

## API Integration

When ready to integrate with a real backend:

1. Create API endpoints that match the mock API interface
2. Update `src/services/mockApi.js` or create new service
3. Update service in `src/services/api.js`
4. Keep the calling code unchanged

### Expected API Endpoints

```
POST /api/otp/send
  - Request: { email }
  - Response: { success, message, data: { sessionId, ... } }

POST /api/otp/verify
  - Request: { email, otp }
  - Response: { success, message, data: { verificationToken } }

POST /api/registrations
  - Request: { formData, verificationToken }
  - Response: { success, message, data: { registrationId, ... } }

POST /api/payments/initiate
  - Request: { registrationId, amount }
  - Response: { success, message, data: { paymentId, ... } }

POST /api/payments/verify
  - Request: { paymentId }
  - Response: { success, message, data: { ... } }
```

## Performance Optimizations

- Code splitting with lazy loading
- Optimized images
- Minimal bundle size
- Resource hints (prefetch, preconnect)
- Production build minification
- CSS purging

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
# Drag and drop `dist` folder to Netlify
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## Environment Variables

Create `.env.local`:
```
VITE_BASE_URL=http://your-api.com
VITE_API_KEY=your-api-key
```

## Code Quality

- ESLint configured
- React Hooks best practices
- Proper error handling
- Console logging for debugging
- Type hints in comments for better IDE support

## Contributing

1. Follow the existing code structure
2. Use meaningful component and variable names
3. Add comments for complex logic
4. Test all changes
5. Keep commits atomic

## Future Enhancements

- [ ] Payment gateway integration (Razorpay/Stripe)
- [ ] Email notifications
- [ ] Admin dashboard
- [ ] Attendee management
- [ ] QR code generation
- [ ] Analytics integration
- [ ] Database migration guides
- [ ] Docker setup

## Support

For issues and questions:
- Create an issue in the repository
- Contact: gdg@example.com

## License

MIT License - Feel free to use this for your GDG events

---

Built with ❤️ for GDG community
