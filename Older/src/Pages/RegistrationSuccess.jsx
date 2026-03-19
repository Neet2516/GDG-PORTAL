import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";

const RegistrationSuccess = () => {
  const { state } = useLocation();
  const name = state?.name || "Participant";
  const email = state?.email || "";
  const studentId = state?.studentId;
  const isValidGate =
    Boolean(state?.gateToken) &&
    sessionStorage.getItem("payment_success_gate") === state?.gateToken;

  useEffect(() => {
    if (isValidGate) {
      sessionStorage.removeItem("payment_success_gate");
    }
  }, [isValidGate]);

  if (!isValidGate) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-md shadow-2xl"
        >
          <h2 className="text-3xl md:text-4xl font-poppins font-bold text-white text-center mb-3">
            Session Expired
          </h2>
          <p className="text-gray-300 text-center mb-8">
            This page is available only right after successful payment. Please check your email for payment status or contact support.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link
              to="/"
              className="w-full text-center px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all"
            >
              Go To Home
            </Link>
            <Link
              to="/contact-us"
              className="w-full text-center px-6 py-3 rounded-xl border border-white/20 text-gray-200 hover:bg-white/10 font-semibold transition-all"
            >
              Contact Support
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto bg-white/5 border border-emerald-400/30 rounded-3xl p-8 md:p-12 backdrop-blur-md shadow-2xl"
      >
        <div className="flex items-center justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-emerald-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        <h2 className="text-3xl md:text-4xl font-poppins font-bold text-white text-center mb-3">
          Registration Confirmed
        </h2>
        <p className="text-gray-300 text-center mb-8">
          Payment has been received successfully.
        </p>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
          <p className="text-sm text-gray-300">
            <span className="text-gray-400">Name:</span> {name}
          </p>
          {email && (
            <p className="text-sm text-gray-300">
              <span className="text-gray-400">Email:</span> {email}
            </p>
          )}
          {studentId && (
            <p className="text-sm text-gray-300">
              <span className="text-gray-400">Registration ID:</span> {studentId}
            </p>
          )}
          <p className="text-sm text-emerald-300 font-semibold">
            Status: SUCCESS
          </p>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <Link
            to="/"
            className="w-full text-center px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all"
          >
            Go To Home
          </Link>
          <Link
            to="/contact-us"
            className="w-full text-center px-6 py-3 rounded-xl border border-white/20 text-gray-200 hover:bg-white/10 font-semibold transition-all"
          >
            Contact Support
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default RegistrationSuccess;
