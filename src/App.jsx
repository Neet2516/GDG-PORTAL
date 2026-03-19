/**
 * Main Application Component
 * App routing and layout
 */

import { useRef } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { Navbar, Footer, RegistrationLayout } from './components';
import {
  HeroSection,
  EventDetails,
  OTPVerification,
  RegistrationSuccess,
  NotFound,
  RegistrationStep1,
  RegistrationStep3,
} from './pages';

export const App = () => {
  const navigate = useNavigate();

  const handleRegisterClick = () => {
    navigate('/register');
  };

  return (
    <div className="editorial-shell">
      {/* Main Routes with original layout */}
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Navbar onRegisterClick={handleRegisterClick} />
              <main className="relative z-10 min-h-screen overflow-x-hidden pt-16">
                <HeroSection onCtaClick={handleRegisterClick} />
                <EventDetails />
              </main>
              <Footer />
            </>
          }
        />
        
        {/* Registration Flow Layout */}
        <Route path="/register" element={<RegistrationLayout />}>
          <Route index element={<RegistrationStep1 />} />
          <Route path="verify" element={<OTPVerification />} />
          <Route path="payment" element={<RegistrationStep3 />} />
          <Route path="success" element={<RegistrationSuccess />} />
        </Route>

        <Route path="*" element={<><Navbar onRegisterClick={handleRegisterClick}/><NotFound /><Footer/></>} />
      </Routes>
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
