import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const AppRoutes = lazy(() => import("./AppRoutes"));
const PrivacyPolicy = lazy(() => import("./components/PrivacyPolicy"));
const RefundPolicy = lazy(() => import("./components/RefundPolicy"));
const TermsAndConditions = lazy(() => import("./components/TermsAndConditions"));
const ContactUs = lazy(() => import("./Pages/ContactUs"));
const OtpVerification = lazy(() => import("./Pages/OtpVerification"));
const RegistrationSuccess = lazy(() => import("./Pages/RegistrationSuccess"));
const NotFound = lazy(() => import("./Pages/NotFound"));

const App = () => {
  return (
    <>
      <Navbar />

      <Suspense
        fallback={
          <div className="min-h-[60vh] flex items-center justify-center px-4">
            <div className="w-full max-w-md h-36 rounded-2xl border border-white/10 bg-white/5 animate-pulse" />
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<AppRoutes />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
          <Route path="/terms" element={<TermsAndConditions />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/verify-otp" element={<OtpVerification />} />
          <Route path="/registration-success" element={<RegistrationSuccess />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
        }}
      />

      <Footer />
    </>
  );
};

export default App;
