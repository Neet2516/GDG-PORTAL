import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "react-hot-toast";
import csiLogo from "../assets/CSI.png";

const OtpVerification = () => {
  const baseUrl = (import.meta.env.VITE_BASE_URL || "").replace(/\/+$/, "");
  const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
  const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
  const PAYMENT_STATUS_INITIAL_DELAY_MS = 4500;
  const PAYMENT_STATUS_RETRY_DELAY_MS = 2000;
  const PAYMENT_STATUS_MAX_RETRIES = 6;
  const PAYMENT_STATUS_PENDING_MESSAGE =
    "Don't worry, we have received your order. You can check your email for payment status or contact us.";
  const navigate = useNavigate();
  const { state } = useLocation();
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [statusText, setStatusText] = useState("");

  const email = state?.email || "your email";
  const OTP_FLOW_MAX_AGE_MS = 30 * 60 * 1000;
  const normalizedPhone = (() => {
    const digits = (state?.phone || "").replace(/\D/g, "");
    if (digits.length === 11 && digits.startsWith("0")) {
      return digits.slice(1);
    }
    return digits;
  })();

  useEffect(() => {
    const flowEmail = sessionStorage.getItem("otp_flow_email");
    const flowStartedAt = Number(sessionStorage.getItem("otp_flow_started_at") || 0);
    const isExpired = !flowStartedAt || Date.now() - flowStartedAt > OTP_FLOW_MAX_AGE_MS;
    const stateEmail = state?.email?.trim().toLowerCase();

    if (!stateEmail || !flowEmail || isExpired || flowEmail !== stateEmail) {
      toast.error("Unauthorized access. Please start from registration.");
      navigate("/");
    }
  }, [navigate, state]);

  const pollPaymentStatus = async (studentId) => {
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    let firstRateLimitAttempt = null;

    // Start polling only after a short wait from payment callback event.
    await sleep(PAYMENT_STATUS_INITIAL_DELAY_MS);

    for (let attempt = 1; attempt <= PAYMENT_STATUS_MAX_RETRIES; attempt += 1) {
      console.log(`[payment-status] attempt ${attempt}/${PAYMENT_STATUS_MAX_RETRIES}`);
      try {
        const token = await getRecaptchaToken("payment_status");
        const statusResponse = await axios.post(
          `${baseUrl}/api/users/payment-status/`,
          {
            student_id: studentId,
            recaptcha_token: token,
          }
        );

        const status = statusResponse.data?.payment_status;
        console.log(`[payment-status] attempt ${attempt} -> ${status || "NO_STATUS"}`);
        if (status === "SUCCESS") {
          return "SUCCESS";
        }
        if (status === "FAILED") {
          return "FAILED";
        }
      } catch (error) {
        const statusCode = error.response?.status;
        console.log(
          `[payment-status] attempt ${attempt} failed with status ${statusCode || "NETWORK_ERROR"}`
        );

        if (statusCode === 429) {
          if (!firstRateLimitAttempt) {
            firstRateLimitAttempt = attempt;
            console.log(`[payment-status] rate-limit started at attempt ${attempt}`);
          }
          // Stop early after second 429 to avoid hammering the endpoint.
          if (attempt - firstRateLimitAttempt >= 1) {
            console.log("[payment-status] stopping retries early due to repeated rate-limit");
            break;
          }
        } else {
          throw error;
        }
      }

      if (attempt < PAYMENT_STATUS_MAX_RETRIES) {
        await sleep(PAYMENT_STATUS_RETRY_DELAY_MS);
      }
    }

    return "PENDING";
  };

  const navigateToSuccess = (studentId) => {
    const gateToken = `${studentId}:${Date.now()}`;
    sessionStorage.setItem("payment_success_gate", gateToken);
    sessionStorage.removeItem("otp_flow_email");
    sessionStorage.removeItem("otp_flow_started_at");

    navigate("/registration-success", {
      state: {
        studentId,
        name: state?.name || "",
        email: state?.email || "",
        paymentStatus: "SUCCESS",
        gateToken,
      },
    });
  };

  const openRazorpayCheckout = (order, studentId) => {
    if (!window.Razorpay) {
      toast.error("Razorpay SDK not loaded");
      return;
    }

    const options = {
      key: razorpayKey || "rzp_test_mock_key",
      amount: order.amount,
      currency: order.currency,
      order_id: order.id,
      name: "RENDER",
      description: "Workshop Registration Fee",
      image: csiLogo,
      prefill: {
        name: state?.name || "",
        email: (state?.email || "").toLowerCase(),
        contact: state?.phone || "",
      },
      handler: async () => {
        setStatusText("Verifying payment status...");
        try {
          const finalStatus = await pollPaymentStatus(studentId);
          if (finalStatus === "SUCCESS") {
            toast.success("Payment successful. Registration completed.");
            navigateToSuccess(studentId);
            return;
          }
          if (finalStatus === "FAILED") {
            toast.error("Payment failed. Please try again.");
            setStatusText("");
            setIsPaying(false);
            return;
          }
          setStatusText(PAYMENT_STATUS_PENDING_MESSAGE);
          toast(PAYMENT_STATUS_PENDING_MESSAGE);
        } catch (error) {
          toast.error(
            error.response?.data?.detail ||
            error.response?.data?.message ||
            "Payment status check failed"
          );
          setStatusText("");
        }
        setIsPaying(false);
      },
      modal: {
        ondismiss: () => {
          setIsPaying(false);
          setStatusText("");
        },
      },
      theme: {
        color: "#6366F1",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.on("payment.failed", async () => {
      setStatusText("Checking payment status...");
      try {
        const finalStatus = await pollPaymentStatus(studentId);
        if (finalStatus === "SUCCESS") {
          toast.success("Payment successful. Registration completed.");
          navigateToSuccess(studentId);
          return;
        }
        if (finalStatus === "FAILED") {
          toast.error("Payment failed. Please try again.");
          setStatusText("");
          setIsPaying(false);
          return;
        }
        setStatusText(PAYMENT_STATUS_PENDING_MESSAGE);
        toast(PAYMENT_STATUS_PENDING_MESSAGE);
      } catch (error) {
        toast.error(
          error.response?.data?.detail ||
          error.response?.data?.message ||
          "Payment status check failed"
        );
        setStatusText("");
      }
      setIsPaying(false);
    });
    rzp.open();
  };

  const getRecaptchaToken = async (action) => {
    if (!window.grecaptcha) {
      toast.error("Captcha not loaded. Refresh page.");
      throw new Error("Captcha not loaded");
    }

    const token = await new Promise((resolve, reject) => {
      window.grecaptcha.ready(() => {
        window.grecaptcha
          .execute(recaptchaSiteKey, { action })
          .then(resolve)
          .catch(reject);
      });
    })
    return token ;
  };

  const handleVerify = async () => {
    if (!otp || otp.length < 4) {
      toast.error("Enter a valid OTP.");
      return;
    }
    if (!state) {
      toast.error("Session expired. Please start registration again.");
      return;
    }

    setIsVerifying(true);
    try {
      if (!window.grecaptcha) {
        throw new Error("Captcha not loaded. Refresh page.");
      }

      const token = await new Promise((resolve, reject) => {
        window.grecaptcha.ready(() => {
          window.grecaptcha
            .execute(import.meta.env.VITE_RECAPTCHA_SITE_KEY, { action: "verify_otp" })
            .then(resolve)
            .catch(reject);
        });
      });

      const verifyPayload = {
        name: state.name,
        email: state.email.trim().toLowerCase(),
        phone: normalizedPhone,
        student_number: state.studentNumber,
        branch: state.branch,
        hostler: state.residence,
        gender: state.gender,
        otp: otp,
        recaptcha_token: token,
      };
      console.log(verifyPayload);

      const verifyResponse = await axios.post(
        `${baseUrl}/api/users/verify-otp/`,
        verifyPayload
      );
      console.log(verifyResponse);

      const studentId = verifyResponse.data?.id;
      if (!studentId) {
        toast.error("Student ID not returned after OTP verification");
        return;
      }
      

      setIsPaying(true);
      setStatusText("Creating payment order...");
      const recaptchaToken = await getRecaptchaToken("payment_initiation");
      const paymentInitResponse = await axios.post(
        `${baseUrl}/api/users/payment-initiation/`,
        {
          student_id: studentId,
          recaptcha_token: recaptchaToken,
        }
      );

      openRazorpayCheckout(paymentInitResponse.data, studentId);
    } catch (error) {
      console.log(error);
      if (error.response) {
        toast.error(
          error.response.data?.message ||
          error.response.data?.detail ||
          "OTP or payment initiation failed"
        );
      } else {
        toast.error("Server not reachable");
      }
      setIsPaying(false);
      setStatusText("");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl mx-auto bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-md shadow-2xl"
      >
        <h2 className="text-3xl font-poppins font-bold text-white mb-3">
          Verify OTP
        </h2>
        <p className="text-gray-400 mb-8">
          Enter the OTP sent to <span className="text-indigo-300">{email}</span>.
        </p>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-300 ml-1">
              OTP Code
            </label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              placeholder="Enter 4-6 digit OTP"
              className="w-full bg-white/5 border border-white/10 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none rounded-xl px-4 py-3 text-white transition-all"
              required
            />
          </div>

          {statusText && (
            <p className="text-sm text-indigo-300">{statusText}</p>
          )}

          <button
            type="button"
            onClick={handleVerify}
            disabled={isVerifying || isPaying || !state}
            className={`w-full px-10 py-4 rounded-2xl font-bold transition-all ${isVerifying || isPaying || !state
                ? "bg-gray-800 text-gray-500 cursor-not-allowed opacity-50"
                : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.3)]"
              }`}
          >
            {isVerifying ? "VERIFYING OTP..." : isPaying ? "OPENING PAYMENT..." : "VERIFY OTP"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default OtpVerification;

