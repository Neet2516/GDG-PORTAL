/**
 * Main Application Component
 * App routing and layout
 */

import { useRef } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { Navbar, Footer } from './components';
import {
  HeroSection,
  EventDetails,
  RegistrationForm,
  OTPVerification,
  RegistrationSuccess,
  NotFound,
} from './pages';

export const App = () => {
  const registerRef = useRef(null);

  const scrollToRegister = () => {
    registerRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleRegisterClick = () => {
    if (window.location.pathname === '/') {
      scrollToRegister();
    } else {
      window.location.href = '/#register-section';
    }
  };

  return (
    <div className="editorial-shell">
      <Navbar onRegisterClick={handleRegisterClick} />
      <main className="relative z-10 min-h-screen overflow-x-hidden">
        <Routes>
          <Route
            path="/"
            element={
              <div className="pt-16">
                <HeroSection onCtaClick={scrollToRegister} />
                <EventDetails />
                <div ref={registerRef}>
                  <RegistrationForm onSuccess={scrollToRegister} />
                </div>
              </div>
            }
          />
          <Route path="/verify-otp" element={<OTPVerification />} />
          <Route path="/registration-success" element={<RegistrationSuccess />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#ffffff',
            color: '#1a1c1e',
            borderRadius: '1rem',
            boxShadow: '0 24px 60px -36px rgba(26,28,30,0.18)',
          },
        }}
      />
    </div>
  );
};

export default App;
