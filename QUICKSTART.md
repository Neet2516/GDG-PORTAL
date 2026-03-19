# Quick Start Guide - GDG Event Portal

## Project Overview
A production-ready GDG Event Portal built with modern web technologies. Fully functional with mock APIs, comprehensive validation, and beautiful UI/UX.

## What's Included

### ✅ Core Features Implemented
- [x] Modern, responsive UI with Tailwind CSS
- [x] Complete registration workflow
- [x] Email and OTP verification system
- [x] Robust input validation
- [x] Reusable component library
- [x] Custom React hooks for state management
- [x] Mock API service (replaceable)
- [x] Session-based data persistence
- [x] Smooth animations with Framer Motion
- [x] Beautiful form components
- [x] Error handling and user feedback
- [x] Mobile-first responsive design

### 📁 Project Structure
```
GDG/
├── src/
│   ├── components/          # Reusable UI components
│   ├── pages/              # Page components (Hero, Form, OTP, Success)
│   ├── services/           # API and mock API services
│   ├── hooks/              # Custom React hooks
│   ├── utils/              # Validators, formatters, helpers
│   ├── constants/          # Configuration and constants
│   ├── App.jsx             # Main app component
│   ├── main.jsx            # Entry point
│   └── index.css           # Global styles
├── package.json
├── vite.config.js
├── tailwind.config.js
├── eslint.config.js
├── index.html              # HTML template
├── README.md               # Project documentation
└── ARCHITECTURE.md         # Architecture guide
```

## Installation & Setup

### Step 1: Install Dependencies
```bash
cd c:\Users\ASUS\OneDrive\Desktop\GDG
npm install
```

### Step 2: Start Development Server
```bash
npm run dev
```
App will open at `http://localhost:5173`

### Step 3: Build for Production
```bash
npm run build
```
Output in `dist/` folder ready for deployment.

## Using the Application

### Registration Flow Demo
1. **Open the app** - You'll see the hero section and event details
2. **Click "Claim Your Spot"** - Scrolls to registration form
3. **Fill the form** with test data:
   - Name: John Doe
   - Email: john25001@akgec.ac.in
   - Phone: 9876543210
   - Student Number: 25001
   - Branch: CSE
   - Gender: MALE
   - Residence: Hosteller
4. **Submit** - Redirects to OTP verification
5. **Enter OTP**: `123456` (shown in console and page)
6. **Verify** - Completes registration and shows success page

### Demo Credentials
- **Test Email**: john25001@akgec.ac.in (or any format: name25xxx@akgec.ac.in)
- **Test OTP**: 123456
- **Test Phone**: Any 10-digit number
- **Test Student Number**: Must start with 25, total 6-9 digits

## API Integration

### For Development (Current)
Using mock API in `src/services/mockApi.js`
- No backend needed
- Realistic delays simulated
- Perfect for frontend development

### For Production (Real API)
1. Create backend API with these endpoints:
```
POST /api/otp/send
POST /api/otp/verify
POST /api/registrations
```

2. Update in `src/services/api.js`:
```javascript
// Replace mockApi with your service
const response = await axios.post(
  `${API_BASE_URL}/api/otp/send`,
  { email }
);
```

3. Remove mock API usage

## Key Technologies

- **React 19** - Latest React with improved performance
- **Vite 7** - Lightning-fast build tool
- **Tailwind CSS v4** - Utility-first styling
- **Framer Motion** - Smooth animations
- **React Router v7** - Modern routing
- **React Hot Toast** - Beautiful notifications
- **Axios** - HTTP client (ready for API calls)

## Customization Guide

### Change Event Details
Edit `src/constants/index.js`:
```javascript
export const EVENT_CONFIG = {
  name: 'Your Event Name',
  year: 2025,
  eventName: 'Your Event Title',
  eventDate: '2025-05-20',
  eventTime: '10:00 AM - 06:00 PM',
  eventLocation: 'Your Location',
  registrationFee: 500, // or 0 for free
};
```

### Update Colors (GDG Branding)
Edit `tailwind.config.js`:
```javascript
colors: {
  gdg: {
    primary: '#4285F4',      // GDG Blue
    secondary: '#EA4335',    // GDG Red
    accent: '#FBBC04',       // GDG Yellow
    success: '#34A853',      // GDG Green
  }
}
```

### Add/Remove Form Fields
1. Add to `FORM_DEFAULTS` in `src/constants/index.js`
2. Add validation rule to `VALIDATION_RULES`
3. Update form JSX in `src/pages/RegistrationForm.jsx`
4. Add validator function in `src/utils/validators.js`

## File-by-File Architecture

### Components (`src/components/`)
- `Button.jsx` - Reusable button with variants
- `Input.jsx` - Text input with validation feedback
- `Select.jsx` - Dropdown select with custom styling
- `RadioGroup.jsx` - Radio buttons with label
- `Card.jsx` - Container card with variants
- `Navbar.jsx` - Navigation bar
- `Footer.jsx` - Footer section

### Pages (`src/pages/`)
- `HeroSection.jsx` - Landing page hero
- `EventDetails.jsx` - Event features showcase
- `RegistrationForm.jsx` - Main registration form
- `OTPVerification.jsx` - Email OTP verification
- `RegistrationSuccess.jsx` - Success confirmation
- `NotFound.jsx` - 404 page

### Services (`src/services/`)
- `mockApi.js` - Mock backend API
- `api.js` - API service wrapper

### Hooks (`src/hooks/`)
- `useFormState.js` - Form management
- `useOTP.js` - OTP workflow
- `useRegistration.js` - Registration flow
- `useSessionStorage.js` - Session persistence

### Utils (`src/utils/`)
- `validators.js` - Form validation logic
- `formatter.js` - Data formatting
- `helpers.js` - General utilities

## Environment Setup (Optional)

Create `c:\Users\ASUS\OneDrive\Desktop\GDG\.env.local`:
```
VITE_BASE_URL=http://localhost:3000
VITE_API_VERSION=v1
VITE_APP_ENV=development
```

Access in code:
```javascript
const baseUrl = import.meta.env.VITE_BASE_URL;
```

## Testing the Features

### Form Validation
- Try invalid email format - shows error
- Try different student numbers - validates pattern
- Try different phone formats - normalizes to 10 digits
- Required fields can't be empty

### OTP System
- OTP expires after 2 minutes
- Can resend OTP if not verified
- Shows countdown timer
- Multiple attempt protection

### Error Handling
- Network errors handled gracefully
- User-friendly error messages
- Validation feedback at every step

## Performance Features

- ✅ Code splitting ready
- ✅ Lazy loading for pages
- ✅ Optimized bundle size
- ✅ Smooth animations with Framer Motion
- ✅ Responsive images ready
- ✅ CSS purging with Tailwind

## Browser Compatibility

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Troubleshooting

### Port Already in Use
```bash
# Use different port
npm run dev -- --port 5174
```

### Clear Cache
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build Errors
```bash
# Clear Vite cache
rm -rf dist node_modules/.vite
npm run build
```

## Next Steps

### Immediate
1. ✅ Explore the application
2. ✅ Test all features
3. ✅ Customize colors and text
4. ✅ Update event details

### Short Term
1. Add payment integration (Razorpay/Stripe)
2. Connect to real backend API
3. Add email notifications
4. Setup error tracking (Sentry)
5. Deploy to hosting

### Long Term
1. Create admin dashboard
2. Add attendee management
3. Generate certificates
4. QR code check-in system
5. Analytics dashboard

## Deployment Options

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
# Deploy dist/ folder
```

### GitHub Pages
```bash
npm run build
git add dist/
git commit -m "Deploy"
git push
```

## Support & Resources

### Documentation
- [React Docs](https://react.dev)
- [Vite Docs](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion)

### Project Files
- `README.md` - Full documentation
- `ARCHITECTURE.md` - Architecture guide
- Code comments throughout

## Key Concepts

### Hooks
- `useState` - Component state
- `useEffect` - Side effects
- `useCallback` - Memoized functions
- `useMemo` - Memoized values
- Custom hooks for complex logic

### Tailwind CSS
- Utility-first styling
- Responsive design (mobile-first)
- Color system (GDG themed)
- Component variants

### Validation Strategy
- Real-time field validation
- Cross-field validation
- Custom error messages
- Form-level validation

## Quick Commands

```bash
# Development
npm run dev

# Production build
npm run build

# Preview build locally
npm run preview

# Lint code
npm run lint

# Clear cache
npm cache clean --force
```

## Important Notes

1. **Mock API** - Currently uses mock API. This is intentional for development. Replace with real API when ready.

2. **OTP Demo** - OTP is shown in browser console. In production, OTP would be sent via email.

3. **Session Storage** - Registration data is stored in browser session. Not suitable for production without proper backend.

4. **Email Validation** - Demo allows any format but requires @akgec.ac.in. Customize in validators.

5. **No Database** - This is frontend only. Add backend database for persistence.

## What's NOT Included (For Future)

- [ ] Backend API server
- [ ] Database setup
- [ ] Email service integration
- [ ] Payment gateway
- [ ] Admin dashboard
- [ ] Analytics
- [ ] Authentication (beyond OTP)
- [ ] CDN setup

These can be added as needed for your organization.

---

**Ready to use!** The application is fully functional for development and demonstration. Customize and extend as needed. 🚀
