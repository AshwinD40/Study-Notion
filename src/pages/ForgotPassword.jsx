import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FiArrowLeft, FiCheckCircle, FiMail } from "react-icons/fi";
import { getPasswordResetToken } from "../features/auth/api/auth.api";

export default function ForgotPassword() {
  const [emailSent, setEmailSent] = useState(false);
  const [email, setEmail] = useState("");
  const [cooldown, setCooldown] = useState(0);

  const { loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  // 60-second cooldown timer on resend
  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setTimeout(() => setCooldown((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleOnSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    dispatch(getPasswordResetToken(email.trim(), setEmailSent));
    setCooldown(60);
  };

  const handleResend = () => {
    if (cooldown > 0 || !email.trim()) return;
    dispatch(getPasswordResetToken(email.trim(), setEmailSent));
    setCooldown(60);
  };

  return (
    <div className="min-h-screen bg-richblack-900 text-richblack-50 flex items-center justify-center px-4 pt-28 sm:pt-36 pb-20 relative overflow-hidden">
      {/* Subtle Ambient Light */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-[350px] w-[600px] rounded-full bg-gradient-to-b from-yellow-500/10 via-cyan-500/5 to-transparent blur-[120px] -z-10" />

      <div className="w-full max-w-[440px] rounded-2xl border border-white/10 bg-[#161a23] p-6 sm:p-8 shadow-2xl backdrop-blur-sm">
        {!emailSent ? (
          /* State 1: Request Reset Link */
          <div className="space-y-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-50/10 text-yellow-50 border border-yellow-50/20">
              <FiMail className="text-xl" />
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Reset your password
              </h1>
              <p className="text-xs sm:text-sm text-richblack-300 leading-relaxed">
                Enter your registered email address. We will send you a secure, single-use link to reset your password. The link expires in 15 minutes.
              </p>
            </div>

            <form onSubmit={handleOnSubmit} className="space-y-4">
              <div className="space-y-1.5 text-left">
                <label
                  htmlFor="forgot-email"
                  className="text-xs font-medium text-richblack-200"
                >
                  Email address <span className="text-red-400">*</span>
                </label>
                <input
                  id="forgot-email"
                  required
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full rounded-2xl border border-white/10 bg-richblack-900 px-4 py-3 text-sm text-white placeholder-richblack-400 focus:border-white/30 focus:outline-none transition shadow-inner"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-yellow-50 py-3 text-sm font-semibold text-richblack-900 hover:bg-yellow-100 transition active:scale-95 disabled:opacity-50"
              >
                {loading ? "Sending link..." : "Send Reset Link"}
              </button>
            </form>

            <div className="border-t border-white/5 pt-4">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-xs font-medium text-richblack-300 hover:text-white transition"
              >
                <FiArrowLeft className="text-sm" />
                Back to Login
              </Link>
            </div>
          </div>
        ) : (
          /* State 2: Confirmation Screen (Check Email) */
          <div className="space-y-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <FiCheckCircle className="text-xl" />
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Check your email
              </h1>
              <p className="text-xs sm:text-sm text-richblack-300 leading-relaxed">
                We have dispatched a password reset link to{" "}
                <span className="font-semibold text-white">{email}</span>.
              </p>
            </div>

            <div className="rounded-xl border border-white/5 bg-richblack-900/60 p-3.5 text-xs text-richblack-300 space-y-1 text-left">
              <p className="font-medium text-white">Important Security Notice:</p>
              <ul className="list-disc pl-4 space-y-1 text-[11px] text-richblack-400">
                <li>The reset link is single-use and will expire in 15 minutes.</li>
                <li>If you don&apos;t see the email, check your spam or junk folder.</li>
              </ul>
            </div>

            <button
              type="button"
              onClick={handleResend}
              disabled={loading || cooldown > 0}
              className="w-full rounded-2xl border border-white/10 bg-richblack-900/80 py-3 text-sm font-medium text-white hover:border-white/20 transition active:scale-95 disabled:opacity-50"
            >
              {cooldown > 0
                ? `Resend available in ${cooldown}s`
                : loading
                ? "Sending..."
                : "Resend Email"}
            </button>

            <div className="border-t border-white/5 pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setEmailSent(false)}
                className="text-xs text-yellow-50 hover:underline"
              >
                Use different email
              </button>

              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-xs font-medium text-richblack-300 hover:text-white transition"
              >
                <FiArrowLeft className="text-sm" />
                Back to Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}