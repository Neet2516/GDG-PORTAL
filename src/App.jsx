/**
 * Main Application Component
 * App routing and layout
 */

import { useEffect, useRef } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Lenis from 'lenis';

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
  const lenisRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.08,
      duration: 1.2,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
    });

    lenisRef.current = lenis;

    let frameId;
    const raf = (time) => {
      lenis.raf(time);
      frameId = window.requestAnimationFrame(raf);
    };

    frameId = window.requestAnimationFrame(raf);

    return () => {
      window.cancelAnimationFrame(frameId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  const handleRegisterClick = () => {
    navigate('/register');
  };

  const handleScrollTo = (target) => {
    if (!target) {
      return;
    }

    if (lenisRef.current) {
      lenisRef.current.scrollTo(target, { offset: -88 });
      return;
    }

    const element = typeof target === 'string' ? document.querySelector(target) : target;
    element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-[#02040b] text-white">
      <Routes>
        <Route
          path="/"
          element={
            <div className="relative min-h-screen overflow-x-hidden bg-[#02040b]">
              <Navbar onRegisterClick={handleRegisterClick} onNavigateTo={handleScrollTo} />
              <main className="relative z-10 overflow-x-hidden">
                <HeroSection onCtaClick={handleRegisterClick} onScrollToNext={() => handleScrollTo('#missions')} />
                <EventDetails />
                <Footer />
              </main>
            </div>
          }
        />

        <Route path="/register" element={<RegistrationLayout />}>
          <Route index element={<RegistrationStep1 />} />
          <Route path="verify" element={<OTPVerification />} />
          <Route path="payment" element={<RegistrationStep3 />} />
          <Route path="success" element={<RegistrationSuccess />} />
        </Route>

        <Route
          path="*"
          element={
            <>
              <Navbar onRegisterClick={handleRegisterClick} onNavigateTo={handleScrollTo} />
              <NotFound />
              <Footer />
            </>
          }
        />
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
