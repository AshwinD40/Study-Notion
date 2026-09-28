import { toast } from "react-hot-toast";
import { setUser } from "../../auth/store/auth.slice";
import { apiConnector } from "../../../shared/api/client";
import { settingsEndpoints } from "../../../shared/api/endpoints";
import { logout } from "../../auth/api/auth.api";

const {
  UPDATE_DISPLAY_PICTURE_API,
  UPDATE_PROFILE_API,
  CHANGE_PASSWORD_API,
  DELETE_PROFILE_API,
} = settingsEndpoints;

export function updateDisplayPicture(token, formData) {
  return async (dispatch) => {
    const toastId = toast.loading("Uploading image...");
    try {
      const response = await apiConnector(
        "PUT",
        UPDATE_DISPLAY_PICTURE_API,
        formData,
        {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      const updatedUser = response.data.data;
      dispatch(setUser(updatedUser));
      localStorage.setItem("user", JSON.stringify(updatedUser));
      toast.success("Profile picture updated");
    } catch (error) {
      console.error("UPDATE_DISPLAY_PICTURE_API ERROR", error);
      toast.error("Could not update display picture");
    } finally {
      toast.dismiss(toastId);
    }
  };
}

export function updateProfile(token, formData) {
  return async (dispatch) => {
    const toastId = toast.loading("Saving profile...");
    try {
      const response = await apiConnector("PUT", UPDATE_PROFILE_API, formData, {
        Authorization: `Bearer ${token}`,
      });

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      const details = response.data.updatedUserDetails;
      const userImage = details.image
        ? details.image
        : `https://api.dicebear.com/5.x/initials/svg?seed=${details.firstName} ${details.lastName}`;

      const updatedUser = { ...details, image: userImage };
      dispatch(setUser(updatedUser));
      localStorage.setItem("user", JSON.stringify(updatedUser));
      toast.success("Profile updated");
    } catch (error) {
      console.error("UPDATE_PROFILE_API ERROR", error);
      toast.error("Could not update profile");
    } finally {
      toast.dismiss(toastId);
    }
  };
}

export async function changePassword(token, formData) {
  const toastId = toast.loading("Updating password...");
  try {
    const response = await apiConnector("POST", CHANGE_PASSWORD_API, formData, {
      Authorization: `Bearer ${token}`,
    });
    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Could not change password");
    }

    toast.success("Password changed successfully");
    return true;
  } catch (error) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Could not change password";

    toast.error(message);
    return false;
  } finally {
    toast.dismiss(toastId);
  }
}

export function deleteProfile(token, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Deleting account...");

    try {
      const response = await apiConnector("DELETE", DELETE_PROFILE_API, null, {
        Authorization: `Bearer ${token}`,
      });

      if (!response?.data?.success) {
        throw new Error(response?.data?.message || "Could not delete profile");
      }

      toast.success("Account deleted");
      dispatch(logout(navigate));
      return true;
    } catch (error) {
      console.error("DELETE_PROFILE_API ERROR", error);
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Could not delete profile";
      toast.error(message);
    } finally {
      toast.dismiss(toastId);
    }
  };
}
