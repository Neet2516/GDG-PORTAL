# GDG Event Portal - Architecture & Development Guide

## Architecture Overview

### Layered Architecture

```
┌─────────────────────────────────────┐
│         UI Components               │
│  (Button, Input, Card, etc.)       │
├─────────────────────────────────────┤
│         Page Components             │
│  (Hero, Form, OTP, Success)        │
├─────────────────────────────────────┤
│      Custom Hooks Layer             │
│  (useFormState, useOTP, etc.)      │
├─────────────────────────────────────┤
│      Services / API Layer           │
│  (mockApi, apiService)             │
├─────────────────────────────────────┤
│  Utilities & Constants              │
│  (validators, formatter, helpers)   │
└─────────────────────────────────────┘
```

## Design Patterns Used

### 1. Custom Hooks
Encapsulates complex state logic into reusable hooks:
- `useFormState`: Handles form data, validation, and touched state
- `useOTP`: Manages OTP sending, verification, and timer
- `useRegistration`: Manages complete registration workflow
- `useSessionStorage`: Persists data across page reloads

### 2. Component Composition
- Small, focused components
- Clear prop interfaces
- Variant patterns (Button, Card variants)
- Compound components where needed

### 3. Separation of Concerns
- Components handle UI only
- Hooks handle state management
- Services handle API communication
- Utils handle data transformation

### 4. Error Handling
- Try-catch in API calls
- Validation before submission
- User-friendly error messages
- Console logging for debugging

## Data Flow

### Registration Flow

```
1. User fills form
   ↓
2. Form validation (real-time)
   ↓
3. User submits → Data stored in sessionStorage
   ↓
4. Navigate to OTP page
   ↓
5. OTP sent to email (mock API)
   ↓
6. User enters OTP
   ↓
7. OTP verification
   ↓
8. Success page with registration details
   ↓
9. Optionally: Payment integration
```

### State Management

**Current (Light-weight):**
- Component state with useState
- Custom hooks for logic
- sessionStorage for persistence
- React context ready

**Future (if needed):**
- Redux/Zustand for global state
- Context API for theme/auth
- Persisted store with middleware

## Validation Strategy

### Multi-level Validation

1. **Field-level validation**
   - Real-time as user types
   - Touched state for error display
   - Detailed error messages

2. **Form-level validation**
   - Complete form validation
   - Cross-field validation (email ↔ student number)
   - Prevents submission of invalid data

3. **Backend validation** (when API integrates)
   - Re-validate on server
   - Check for duplicates
   - Verify tokens

## API Integration Points

### Mock API (Dev/Demo)
- Located in `src/services/mockApi.js`
- Simulates real endpoints
- Includes realistic delays
- Perfect for development

### Real API (Production)
Replace in `src/services/api.js`:
```javascript
// Before
const api = mockApi;

// After
const api = new AxiosApiService();
```

## Performance Considerations

### Code Splitting
- Pages use lazy loading (ready in App.jsx)
- Only load component when needed

### Optimization
- Memoization for computed values (useMemo)
- Callback functions (useCallback)
- Avoid unnecessary re-renders
- Efficient form validation

### Bundle Size
- No heavy dependencies
- Tree-shakeable imports
- Vite minification
- CSS purging with Tailwind

## Security Considerations

### Current
- Email validation
- Input sanitization (basic)
- Session token generation
- XSS protection via React

### Production Checklist
- [ ] CSRF tokens
- [ ] Rate limiting
- [ ] Input validation on server
- [ ] HTTPS enforced
- [ ] Secure session cookies
- [ ] SQL injection prevention
- [ ] API key rotation

## Testing Strategy

### Unit Tests (To Add)
```javascript
// Example test structure
describe('validators', () => {
  test('validateEmail should accept valid email', () => {
    const result = validators.validateEmail('user2511@akgec.ac.in');
    expect(result.valid).toBe(true);
  });
});
```

### Integration Tests (To Add)
- Form submission flow
- OTP verification flow
- Session persistence

### E2E Tests (To Add)
- Complete registration journey
- Error scenarios
- Edge cases

## Deployment Checklist

- [ ] Environment variables set
- [ ] API endpoints configured
- [ ] Build passes (npm run build)
- [ ] No console errors
- [ ] Mobile responsive tested
- [ ] All routes work
- [ ] Error boundaries added
- [ ] Analytics integrated
- [ ] SEO optimized
- [ ] Security headers set

## Common Development Tasks

### Add New Form Field
1. Add to `FORM_DEFAULTS` in constants
2. Create validator in `useFormState.js`
3. Add field to form JSX
4. Update API payload if needed

### Add New Page
1. Create component in `src/pages/`
2. Export from `src/pages/index.js`
3. Add route in `App.jsx`
4. Update navigation links

### Change Colors/Theme
1. Edit `tailwind.config.js`
2. Update CSS variables if used
3. Test on all pages

### Integrate Real API
1. Create service in `src/services/`
2. Implement error handling
3. Update API calls in hooks
4. Test with mock data first

## Debugging Tips

### See Mock OTP
- Check browser console
- Printed for demo: "Demo OTP: 123456"

### Check Form State
```javascript
// Add in component
console.log('Form Data:', formData);
console.log('Validation Errors:', errors);
console.log('Is Valid:', isValid);
```

### Session Storage
- Open DevTools → Application → Session Storage
- View stored registration data

### Network Requests
- DevTools → Network tab
- Simulate slow network for testing
- Check API responses

## Troubleshooting

### Form not submitting
- Check isValid state
- Look at validation errors
- Verify all required fields filled

### OTP not appearing
- Check mock API logic
- Look at console for demo OTP
- Check email in form

### Styling issues
- Clear browser cache
- Rebuild with `npm run build`
- Check Tailwind config
- Verify class names

### Page not loading
- Check route in App.jsx
- Verify component export
- Look at console errors

## Future Improvements

1. **Analytics** - Track user journey
2. **Accessibility** - WCAG 2.1 AA compliance
3. **PWA** - Offline support
4. **i18n** - Multi-language support
5. **Performance** - Metrics tracking
6. **Admin Panel** - Event management
7. **Email Service** - SendGrid/AWS integration
8. **Payment** - Razorpay/Stripe integration

---

This architecture is designed for scalability, maintainability, and developer experience.
