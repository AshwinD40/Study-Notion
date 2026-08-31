import { toast } from "react-hot-toast"
import { setLoading, setToken, setUser } from "../store/auth.slice"
import { resetCart } from "../../cart/store/cart.slice"
import { apiConnector } from "../../../shared/api/client"
import { endpoints } from "../../../shared/api/endpoints"

const {
  SENDOTP_API,
  SIGNUP_API,
  LOGIN_API,
  RESETPASSTOKEN_API,
  RESETPASSWORD_API,
} = endpoints;

export function sendOtp(email, navigate, shouldNavigate = true) {
  return async (dispatch) => {
    const toastId = toast.loading("Sending OTP...")
    dispatch(setLoading(true));

    try {
      const response = await apiConnector("POST", SENDOTP_API, {
        email,
        checkUserPresent: true,
      });
      console.log("SEND OTP API RESPONSE............", response)

      if (!response?.ok || !response?.data?.success) {
        throw new Error(
          response?.data?.message || response?.message || "Failed To Send OTP"
        )
      }

      toast.success(response?.data?.message || "OTP sent successfully")
      if (response?.data?.debugOtp) {
        toast.success(`Dev OTP: ${response.data.debugOtp}`, { duration: 7000 })
      }
      if (shouldNavigate) {
        navigate("/verify-email")
      }
    }
    catch (error) {
      console.log("SEND OTP API ERROR............", error)
      toast.error(
        error?.response?.data?.message ||
        error?.message ||
        "Failed To Send OTP"
      )
    } finally {
      dispatch(setLoading(false))
      toast.dismiss(toastId)
    }
  }
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
    const toastId = toast.loading("Signing Up...")
    dispatch(setLoading(true))
    try {
      const response = await apiConnector("POST", SIGNUP_API, {
        accountType,
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        otp,
      })

      console.log("SIGNUP API RESPONSE............", response)

      if (!response?.ok || !response?.data?.success) {
        throw new Error(response?.data?.message || response?.message || "Signup Failed")
      }
      toast.success("Signup Successful")
      navigate("/dashboard/my-profile")
    } catch (error) {
      console.log("SIGNUP API ERROR............", error)
      toast.error("Signup Failed")
      navigate("/signup")
    } finally {
      dispatch(setLoading(false))
      toast.dismiss(toastId)
    }
  }
}

export function login(email, password, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true))
    try {
      const response = await apiConnector("POST", LOGIN_API, {
        email,
        password,
      })

      console.log("LOGIN API RESPONSE............", response)

      if (!response?.ok || !response?.data?.success) {
        throw new Error(response?.data?.message || response?.message || "Login Failed")
      }

      toast.success("Login Successful")
      dispatch(setToken(response.data.token))
      const userImage = response.data?.user?.image
        ? response.data.user.image
        : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.user.firstName}${response.data.user.lastName}`
      dispatch(setUser({ ...response.data.user, image: userImage }))
      localStorage.setItem("token", response.data.token)
      localStorage.setItem("user", JSON.stringify({ ...response.data.user, image: userImage }))
      navigate("/dashboard/my-profile")
    } catch (error) {
      console.log("LOGIN API ERROR............", error)
      toast.error("Login Failed")
    }
    dispatch(setLoading(false))
    toast.dismiss(toastId)
  }
}

export function getPasswordResetToken(email, setEmailSent) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true))
    try {
      const frontendUrl =
        typeof window !== "undefined" ? window.location.origin : undefined

      const response = await apiConnector("POST", RESETPASSTOKEN_API, {
        email,
        frontendUrl,
      })

      console.log("RESETPASSTOKEN RESPONSE............", response)

      if (!response?.ok || !response?.data?.success) {
        throw new Error(
          response?.data?.message ||
          response?.message ||
          "Failed To Send Reset Email"
        )
      }

      toast.success(response?.data?.message || "Reset Email Sent")

      if (response?.data?.debugResetLink && typeof window !== "undefined") {
        toast.success("Opening password reset page")
        window.location.assign(response.data.debugResetLink)
        return
      }

      setEmailSent(true)
    } catch (error) {
      console.log("RESETPASSTOKEN ERROR............", error)
      toast.error(
        error?.response?.data?.message ||
        error?.data?.message ||
        error?.message ||
        "Failed To Send Reset Email"
      )
    } finally {
      toast.dismiss(toastId)
      dispatch(setLoading(false))
    }
  }
}

export function resetPassword(password, confirmPassword, token, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true))

    try {
      const response = await apiConnector("POST", RESETPASSWORD_API, {
        password,
        confirmPassword,
        token,
      })

      console.log("RESETPASSWORD RESPONSE............", response)

      if (!response?.ok || !response?.data?.success) {
        throw new Error(
          response?.data?.message ||
          response?.message ||
          "Failed to reset password"
        )
      }

      toast.success("Password Reset Successfully")
      navigate('/login')

    } catch (error) {
      console.log("RESETPASSWORD ERROR............", error)
      toast.error(
        error?.response?.data?.message ||
        error?.data?.message ||
        error?.message ||
        "Failed To Reset Password"
      )

    } finally {
      toast.dismiss(toastId)
      dispatch(setLoading(false))
    }
  }
}

export function logout(navigate) {
  return (dispatch) => {
    dispatch(setToken(null))
    dispatch(setUser(null))
    dispatch(resetCart())
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    toast.success("Logged Out")
    navigate("/")
  }
}
