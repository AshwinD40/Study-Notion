import { toast } from "react-hot-toast";

import { setUser as setProfileUser } from "../../slices/profileSlice";
import { setUser as setAuthUser } from "../../slices/authSlice";
import { apiConnector } from "../apiconnector";
import { settingsEndpoints } from "../apis";
import { logout } from "./authAPI";

const {
  UPDATE_DISPLAY_PICTURE_API,
  UPDATE_PROFILE_API,
  CHANGE_PASSWORD_API,
  DELETE_PROFILE_API,
} = settingsEndpoints;

export function updateDisplayPicture(token, formData) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    try {
      const response = await apiConnector(
        "PUT",
        UPDATE_DISPLAY_PICTURE_API,
        formData,
        {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        }
      )

      console.log(
        "UPDATE_DISPLAY_PICTURE_API API RESPONSE............",
        response
      )

      if (!response.data.success) {
        throw new Error(response.data.message)
      }

      const updatedUser = response.data.data

      // ✅ update both slices
      dispatch(setProfileUser(updatedUser))
      dispatch(setAuthUser(updatedUser))

      // ✅ sync localStorage
      localStorage.setItem("user", JSON.stringify(updatedUser))

      toast.success("Display Picture Updated Successfully")
    } catch (error) {
      console.log("UPDATE_DISPLAY_PICTURE_API API ERROR............", error)
      toast.error("Could Not Update Display Picture")
    }
    toast.dismiss(toastId)
  }
}


export function updateProfile(token, formData) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    try {
      const response = await apiConnector("PUT", UPDATE_PROFILE_API, formData, {
        Authorization: `Bearer ${token}`,
      })

      console.log("UPDATE_PROFILE_API API RESPONSE............", response)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }

      const details = response.data.updatedUserDetails

      const userImage = details.image
        ? details.image
        : `https://api.dicebear.com/5.x/initials/svg?seed=${details.firstName} ${details.lastName}`

      const updatedUser = { ...details, image: userImage }

      // ✅ update both slices
      dispatch(setProfileUser(updatedUser))
      dispatch(setAuthUser(updatedUser))

      // ✅ sync localStorage
      localStorage.setItem("user", JSON.stringify(updatedUser))

      toast.success("Profile Updated Successfully")
    } catch (error) {
      console.log("UPDATE_PROFILE_API API ERROR............", error)
      toast.error("Could Not Update Profile")
    }
    toast.dismiss(toastId)
  }
}

export async function changePassword(token, formData) {
  const toastId = toast.loading("Loading...")
  try {
    const response = await apiConnector("POST", CHANGE_PASSWORD_API, formData, {
      Authorization: `Bearer ${token}`,
    })
    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Could not change password")
    }

    toast.success("Password Changed Successfully")
    return true
  } catch (error) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Could not change password"

    toast.error(message)
    return false
  } finally {
    toast.dismiss(toastId)
  }
}

export function deleteProfile(token, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Deleting account...")

    try {
      const response = await apiConnector("DELETE", DELETE_PROFILE_API, null, {
        Authorization: `Bearer ${token}`,
      })

      console.log("DELETE_PROFILE_API RESPONSE............", response)

      if (!response?.data?.success) {
        throw new Error(response?.data?.message || "Could not delete profile")
      }

      toast.success("Profile deleted successfully")

      // logout will clear redux + localStorage and navigate
      dispatch(logout(navigate))

      return true
    } catch (error) {
      console.log("DELETE_PROFILE_API ERROR............", error)

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Could not delete profile"

      toast.error(message)
      return false
    } finally {
      toast.dismiss(toastId)
    }
  }
}
