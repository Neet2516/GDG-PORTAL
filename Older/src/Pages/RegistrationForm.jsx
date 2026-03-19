import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

const BRANCHES = [
  "AIML",
  "CSE",
  "CSE-AIML",
  "CSE-DS",
  "CS",
  "CS-HINDI",
  "CS-IT",
  "CIVIL",
  "EN",
  "ECE",
  "IT",
  "ME",
];

const normalizePhoneNumber = (value) => {
  const digits = (value || "").replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("0")) {
    return digits.slice(1);
  }
  return digits;
};

const RegistrationForm = () => {
  const baseUrl = (import.meta.env.VITE_BASE_URL || "").replace(/\/+$/, "");
  const OTP_REQUEST_TIMEOUT_MS = 120000;
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    studentNumber: "",
    branch: "",
    residence: "",
    gender: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const newErrors = {};


    if (formData.name && formData.name.length < 2) {
      newErrors.name = "Name is too short";
    }

    if (formData.studentNumber) {
      if (
        !/^25\d+$/.test(formData.studentNumber) ||
        formData.studentNumber.length >= 10
      ) {
        newErrors.studentNumber =
          "Student number must start with 25 and be less than 10 digits";
      }
    }

    if (formData.email) {
      const emailRegex = /^([a-zA-Z]+)(25\d+)@akgec\.ac\.in$/;
      const match = formData.email.match(emailRegex);

      if (!match) {
        newErrors.email = "Email must be like: name25xxxx@akgec.ac.in";
      } else {
        const emailStudentNumber = match[2];

        if (
          formData.studentNumber &&
          emailStudentNumber !== formData.studentNumber
        ) {
          newErrors.email =
            "Student number in email must match Student Number field";
        }
      }
    }

    const normalizedPhone = normalizePhoneNumber(formData.phone);
    if (formData.phone && !/^\d{10}$/.test(normalizedPhone)) {
      newErrors.phone = "Enter a valid 10-digit phone number";
    }

    setErrors(newErrors);
  }, [formData]);

  const isFormValid = useMemo(() => {
    return (
      formData.name.length >= 2 &&
      /^[a-zA-Z]+25\d+@akgec\.ac\.in$/.test(formData.email) &&
      /^\d{10}$/.test(normalizePhoneNumber(formData.phone)) &&
      /^25\d+$/.test(formData.studentNumber) &&
      formData.branch !== "" &&
      formData.residence !== "" &&
      formData.gender !== "" &&
      Object.keys(errors).length === 0
    );
  }, [formData, errors]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsSubmitting(true);

    try {
      if (!window.grecaptcha) {
        toast.error("Captcha not loaded. Refresh page.");
        return;
      }

      const token = await new Promise((resolve, reject) => {
        window.grecaptcha.ready(() => {
          window.grecaptcha
            .execute(import.meta.env.VITE_RECAPTCHA_SITE_KEY, { action: "send_otp" })
            .then(resolve)
            .catch(reject);
        });
      });
      
      console.log(token);
      const response = await axios.post(
        `${baseUrl}/api/users/send-otp/`,
        {
          email: formData.email.trim().toLowerCase(),
          recaptcha_token: token,
        }
      );
      

      if (response.data.success) {
        const normalizedEmail = formData.email.trim().toLowerCase();
        const normalizedPhone = normalizePhoneNumber(formData.phone);
        sessionStorage.setItem("otp_flow_email", normalizedEmail);
        sessionStorage.setItem("otp_flow_started_at", String(Date.now()));
        sessionStorage.removeItem("payment_success_gate");
        navigate("/verify-otp", {
          state: {
            ...formData,
            phone: normalizedPhone,
          },
        });
      }

    } catch (error) {
      console.log("FULL ERROR:", error.response?.data);
      console.log(error.message);
      toast.error(error.response.data.message || "Server error");


    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-poppins font-bold text-white mb-4">
          Reserve Your Seat
        </h2>
        <p className="text-gray-400">
          Fill out the form accurately and verify your OTP before payment.
        </p>
      </div>

      <motion.form
        onSubmit={handleSubmit}
        className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-md shadow-2xl space-y-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-300 ml-1">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Emma Watson"
              className={`w-full bg-white/5 border ${errors.name ? "border-red-500/50" : "border-white/10"
                } focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none rounded-xl px-4 py-3 text-white transition-all`}
            />
            <AnimatePresence>
              {errors.name && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-red-400 text-xs ml-1 font-medium"
                >
                  {errors.name}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-300 ml-1">
              College Email
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              placeholder="nameStdno@akgec.ac.in"
              className={`w-full bg-white/5 border ${errors.email ? "border-red-500/50" : "border-white/10"
                } focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none rounded-xl px-4 py-3 text-white transition-all`}
            />
            <AnimatePresence>
              {errors.email && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-red-400 text-xs ml-1 font-medium"
                >
                  {errors.email}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-300 ml-1">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              required
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="x x x x x x x x x x"
              className={`w-full bg-white/5 border ${errors.phone ? "border-red-500/50" : "border-white/10"
                } focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none rounded-xl px-4 py-3 text-white transition-all`}
            />
            <AnimatePresence>
              {errors.phone && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-red-400 text-xs ml-1 font-medium"
                >
                  {errors.phone}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-300 ml-1">
              Student Number
            </label>
            <input
              type="text"
              name="studentNumber"
              required
              value={formData.studentNumber}
              onChange={handleInputChange}
              placeholder="25*****"
              className={`w-full bg-white/5 border ${errors.studentNumber ? "border-red-500/50" : "border-white/10"
                } focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none rounded-xl px-4 py-3 text-white transition-all`}
            />
            <AnimatePresence>
              {errors.studentNumber && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-red-400 text-xs ml-1 font-medium"
                >
                  {errors.studentNumber}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="block text-sm font-semibold text-gray-300 ml-1">
              Gender
            </label>
            <div className="flex gap-6">
              {["MALE", "FEMALE"].map((option) => (
                <label key={option} className="flex items-center gap-2 text-white">
                  <input
                    type="radio"
                    name="gender"
                    value={option}
                    checked={formData.gender === option}
                    onChange={handleInputChange}
                    className="accent-indigo-500"
                    required
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="block text-sm font-semibold text-gray-300 ml-1">
              Residence
            </label>
            <div className="flex gap-6">
              {[
                { label: "Hosteller", value: true },
                { label: "Dayscholar", value: false },
              ].map((option) => (
                <label key={option.label} className="flex items-center gap-2 text-white">
                  <input
                    type="radio"
                    name="residence"
                    value={option.value}
                    checked={formData.residence === option.value}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        residence: e.target.value === "true",
                      }))
                    }
                    className="accent-indigo-500"
                    required
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="block text-sm font-semibold text-gray-300 ml-1">
              Branch
            </label>
            <select
              name="branch"
              required
              value={formData.branch}
              onChange={handleInputChange}
              className="w-full bg-[#1a1f2e] border border-white/10 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none rounded-xl px-4 py-3 text-white transition-all appearance-none"
            >
              <option value="" disabled>
                Select your branch
              </option>
              {BRANCHES.map((branch) => (
                <option key={branch} value={branch}>
                  {branch}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="text-xs text-gray-500 uppercase tracking-widest font-semibold">
              Next Step <br /> Verify Your Email OTP
            </div>
          </div>

          <button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            className={`w-full md:w-auto px-10 py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-3 ${isFormValid && !isSubmitting
              ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.3)]"
              : "bg-gray-800 text-gray-500 cursor-not-allowed opacity-50"
              }`}
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Redirecting...
              </>
            ) : (
              <>
                CONTINUE TO OTP
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </>
            )}
          </button>
        </div>
      </motion.form>
    </div>
  );
};

export default RegistrationForm;
