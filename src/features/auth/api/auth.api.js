import { toast } from "react-hot-toast";
import { setLoading, setToken, setUser } from "../store/auth.slice";
import { resetCart } from "../../cart/store/cart.slice";
import { apiConnector } from "../../../shared/api/client";
import { endpoints } from "../../../shared/api/endpoints";

const {
  SENDOTP_API,
  SIGNUP_API,
  LOGIN_API,
  RESETPASSTOKEN_API,
  VERIFY_RESET_TOKEN_API,
  RESETPASSWORD_API,
} = endpoints;

export function sendOtp(email, navigate, shouldNavigate = true) {
  return async (dispatch) => {
    const toastId = toast.loading("Sending OTP...");
    dispatch(setLoading(true));

    try {
      const response = await apiConnector("POST", SENDOTP_API, {
        email,
        checkUserPresent: true,
      });

      if (!response?.ok || !response?.data?.success) {
        throw new Error(
          response?.data?.message || response?.message || "Failed to send OTP"
        );
      }

      toast.success(response?.data?.message || "OTP sent successfully");
      if (response?.data?.debugOtp) {
        toast.success(`Dev OTP: ${response.data.debugOtp}`, { duration: 7000 });
      }
      if (shouldNavigate) {
        navigate("/verify-email");
      }
    } catch (error) {
      console.error("SEND OTP API ERROR", error);
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to send OTP"
      );
    } finally {
      dispatch(setLoading(false));
      toast.dismiss(toastId);
    }
  };
}

export function signUp(
  accountType,
  firstName,
  lastName,
  email,
  password,
  confirmPassword,
  otp,
  navigate
) {
  return async (dispatch) => {
    const toastId = toast.loading("Creating account...");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", SIGNUP_API, {
        accountType,
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        otp,
      });

      if (!response?.ok || !response?.data?.success) {
        throw new Error(
          response?.data?.message || response?.message || "Signup failed"
        );
      }
      toast.success("Account created successfully");
      navigate("/login");
    } catch (error) {
      console.error("SIGNUP API ERROR", error);
      toast.error(error?.response?.data?.message || "Signup failed");
      navigate("/signup");
    } finally {
      dispatch(setLoading(false));
      toast.dismiss(toastId);
    }
  };
}

export function login(email, password, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Signing in...");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", LOGIN_API, {
        email,
        password,
      });

      if (!response?.ok || !response?.data?.success) {
        throw new Error(
          response?.data?.message || response?.message || "Login failed"
        );
      }

      toast.success("Welcome back!");
      dispatch(setToken(response.data.token));
      const userImage = response.data?.user?.image
        ? response.data.user.image
        : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.user.firstName}${response.data.user.lastName}`;
      dispatch(setUser({ ...response.data.user, image: userImage }));
      localStorage.setItem("token", response.data.token);
      localStorage.setItem(
        "user",
        JSON.stringify({ ...response.data.user, image: userImage })
      );

      const targetDashboard =
        response.data?.user?.accountType === "Instructor"
          ? "/dashboard/instructor"
          : "/dashboard/enrolled-courses";
      navigate(targetDashboard);
    } catch (error) {
      console.error("LOGIN API ERROR", error);
      toast.error(error?.response?.data?.message || "Login failed");
    } finally {
      dispatch(setLoading(false));
      toast.dismiss(toastId);
    }
  };
}

export function getPasswordResetToken(email, setEmailSent) {
  return async (dispatch) => {
    const toastId = toast.loading("Sending reset link...");
    dispatch(setLoading(true));
    try {
      const frontendUrl =
        typeof window !== "undefined" ? window.location.origin : undefined;

      const response = await apiConnector("POST", RESETPASSTOKEN_API, {
        email,
        frontendUrl,
      });

      if (!response?.ok || !response?.data?.success) {
        throw new Error(
          response?.data?.message ||
            response?.message ||
            "Failed to send reset email"
        );
      }

      toast.success(response?.data?.message || "Reset email sent");

      setEmailSent(true);
    } catch (error) {
      console.error("RESETPASSTOKEN ERROR", error);
      toast.error(
        error?.response?.data?.message ||
          error?.data?.message ||
          error?.message ||
          "Failed to send reset email"
      );
    } finally {
      toast.dismiss(toastId);
      dispatch(setLoading(false));
    }
  };
}

export async function verifyResetToken(token) {
  try {
    const response = await apiConnector("POST", VERIFY_RESET_TOKEN_API, {
      token,
    });

    if (!response?.ok || !response?.data?.success) {
      return {
        success: false,
        message:
          response?.data?.message ||
          response?.message ||
          "Invalid or expired reset link",
      };
    }

    return {
      success: true,
      message: response.data.message || "Token is valid",
      email: response.data.email,
    };
  } catch (error) {
    return {
      success: false,
      message: error?.message || "Invalid or expired reset link",
    };
  }
}

export function resetPassword(password, confirmPassword, token, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Resetting password...");
    dispatch(setLoading(true));

    try {
      const response = await apiConnector("POST", RESETPASSWORD_API, {
        password,
        confirmPassword,
        token,
      });

      if (!response?.ok || !response?.data?.success) {
        throw new Error(
          response?.data?.message ||
            response?.message ||
            "Failed to reset password"
        );
      }

      toast.success("Password reset successfully");
      navigate("/login");
    } catch (error) {
      console.error("RESETPASSWORD ERROR", error);
      toast.error(
        error?.response?.data?.message ||
          error?.data?.message ||
          error?.message ||
          "Failed to reset password"
      );
    } finally {
      toast.dismiss(toastId);
      dispatch(setLoading(false));
    }
  };
}

export function logout(navigate) {
  return (dispatch) => {
    dispatch(setToken(null));
    dispatch(setUser(null));
    dispatch(resetCart());
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    navigate("/");
  };
}
