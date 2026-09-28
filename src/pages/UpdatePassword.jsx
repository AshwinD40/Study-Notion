import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FiAlertTriangle, FiArrowLeft, FiCheck, FiKey, FiLock } from "react-icons/fi";
import toast from "react-hot-toast";

import { resetPassword, verifyResetToken } from "../features/auth/api/auth.api";

export default function UpdatePassword() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const params = useParams();

  const { loading } = useSelector((state) => state.auth);

  const token = params?.id || location.pathname.split("/").filter(Boolean).pop() || "";

  const [tokenStatus, setTokenStatus] = useState("verifying");
  const [tokenErrorMessage, setTokenErrorMessage] = useState("");
  const [userEmail, setUserEmail] = useState("");

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { password, confirmPassword } = formData;

  useEffect(() => {
    let isMounted = true;

    async function checkToken() {
      if (!token || !/^[a-f0-9]{64}$/i.test(token.trim())) {
        if (isMounted) {
          setTokenStatus("invalid");
          setTokenErrorMessage("The reset link format is invalid.");
        }
        return;
      }

      setTokenStatus("verifying");
      const result = await verifyResetToken(token.trim());

      if (!isMounted) return;

      if (result.success) {
        setTokenStatus("valid");
        if (result.email) setUserEmail(result.email);
      } else {
        setTokenStatus("invalid");
        setTokenErrorMessage(
          result.message || "This password reset link is invalid or has expired."
        );
      }
    }

    checkToken();

    return () => {
      isMounted = false;
    };
  }, [token]);

  const handleOnChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      toast.error("Please enter both password fields.");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    dispatch(resetPassword(password, confirmPassword, token.trim(), navigate));
  };

  const isMinLength = password.length >= 8;
  const isMatching = password.length > 0 && password === confirmPassword;

  return (
    <div className="min-h-screen bg-richblack-900 text-richblack-50 flex items-center justify-center px-4 pt-28 sm:pt-36 pb-20 relative overflow-hidden">
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-[350px] w-[600px] rounded-full bg-gradient-to-b from-yellow-500/10 via-cyan-500/5 to-transparent blur-[120px] -z-10" />

      <div className="w-full max-w-[440px] rounded-2xl border border-white/10 bg-[#161a23] p-6 sm:p-8 shadow-2xl backdrop-blur-sm">
        {tokenStatus === "verifying" && (
          <div className="py-12 flex flex-col items-center justify-center space-y-4 text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-yellow-50 border-t-transparent" />
            <p className="text-sm text-richblack-300">Verifying secure reset link...</p>
          </div>
        )}

        {tokenStatus === "invalid" && (
          <div className="space-y-6 text-left">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10 text-red-400 border border-red-500/20">
              <FiAlertTriangle className="text-xl" />
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-bold tracking-tight text-white">
                Link Expired or Invalid
              </h1>
              <p className="text-xs sm:text-sm text-richblack-300 leading-relaxed">
                {tokenErrorMessage ||
                  "This password reset link is invalid or has already expired. Reset links expire after 15 minutes and can only be used once."}
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <Link
                to="/forgot-password"
                className="block w-full text-center rounded-2xl bg-yellow-50 py-3 text-sm font-semibold text-richblack-900 hover:bg-yellow-100 transition active:scale-95"
              >
                Request New Reset Link
              </Link>
              <Link
                to="/login"
                className="block w-full text-center rounded-2xl border border-white/10 bg-richblack-900/60 py-3 text-sm font-medium text-richblack-200 hover:text-white transition"
              >
                Back to Login
              </Link>
            </div>
          </div>
        )}

        {tokenStatus === "valid" && (
          <div className="space-y-6 text-left">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-50/10 text-yellow-50 border border-yellow-50/20">
              <FiKey className="text-xl" />
            </div>

            <div className="space-y-1.5">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Choose New Password
              </h1>
              <p className="text-xs sm:text-sm text-richblack-300 leading-relaxed">
                {userEmail ? (
                  <>
                    Resetting password for{" "}
                    <span className="font-semibold text-white">{userEmail}</span>.
                  </>
                ) : (
                  "Create a strong, unique password with at least 8 characters."
                )}
              </p>
            </div>

            <form onSubmit={handleOnSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="new-password"
                  className="text-xs font-medium text-richblack-200 flex items-center gap-1.5"
                >
                  <FiLock className="text-richblack-400" />
                  New Password <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    id="new-password"
                    required
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={password}
                    onChange={handleOnChange}
                    placeholder="Enter new password (min. 8 characters)"
                    className="w-full rounded-2xl border border-white/10 bg-richblack-900 px-4 py-3 pr-11 text-sm text-white placeholder-richblack-400 focus:border-white/30 focus:outline-none transition shadow-inner"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-richblack-400 hover:text-white transition p-1"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <AiOutlineEyeInvisible className="text-lg" />
                    ) : (
                      <AiOutlineEye className="text-lg" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="confirm-new-password"
                  className="text-xs font-medium text-richblack-200 flex items-center gap-1.5"
                >
                  <FiLock className="text-richblack-400" />
                  Confirm Password <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    id="confirm-new-password"
                    required
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={handleOnChange}
                    placeholder="Confirm new password"
                    className="w-full rounded-2xl border border-white/10 bg-richblack-900 px-4 py-3 pr-11 text-sm text-white placeholder-richblack-400 focus:border-white/30 focus:outline-none transition shadow-inner"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-richblack-400 hover:text-white transition p-1"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? (
                      <AiOutlineEyeInvisible className="text-lg" />
                    ) : (
                      <AiOutlineEye className="text-lg" />
                    )}
                  </button>
                </div>
              </div>

              <div className="rounded-xl border border-white/5 bg-richblack-900/60 p-3 space-y-1.5 text-xs text-richblack-400">
                <div className="flex items-center gap-2">
                  <span
                    className={`h-4 w-4 rounded-full flex items-center justify-center text-[10px] ${
                      isMinLength
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-white/10 text-richblack-500"
                    }`}
                  >
                    <FiCheck />
                  </span>
                  <span className={isMinLength ? "text-richblack-200 font-medium" : ""}>
                    At least 8 characters
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`h-4 w-4 rounded-full flex items-center justify-center text-[10px] ${
                      isMatching
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-white/10 text-richblack-500"
                    }`}
                  >
                    <FiCheck />
                  </span>
                  <span className={isMatching ? "text-richblack-200 font-medium" : ""}>
                    Passwords match
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-yellow-50 py-3 text-sm font-semibold text-richblack-900 hover:bg-yellow-100 transition active:scale-95 disabled:opacity-50"
              >
                {loading ? "Resetting Password..." : "Reset Password"}
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
        )}
      </div>
    </div>
  );
}
