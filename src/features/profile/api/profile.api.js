import { setLoading, setUser } from "../../auth/store/auth.slice";
import { apiConnector } from "../../../shared/api/client";
import { profileEndpoints } from "../../../shared/api/endpoints";
import { logout } from "../../auth/api/auth.api";

const {
  GET_USER_DETAILS_API,
  GET_USER_ENROLLED_COURSES_API,
  GET_INSTRUCTOR_DATA_API,
} = profileEndpoints;

export function getUserDetails(token, navigate) {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("GET", GET_USER_DETAILS_API, null, {
        Authorization: `Bearer ${token}`,
      });

      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      const userImage = response.data.data.image
        ? response.data.data.image
        : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.data.firstName} ${response.data.data.lastName}`;
      const user = { ...response.data.data, image: userImage };
      dispatch(setUser(user));
      localStorage.setItem("user", JSON.stringify(user));
    } catch (error) {
      dispatch(logout(navigate));
      console.error("GET_USER_DETAILS API ERROR", error);
    } finally {
      dispatch(setLoading(false));
    }
  };
}

export async function getUserEnrolledCourses(token) {
  let result = [];
  try {
    const response = await apiConnector(
      "GET",
      GET_USER_ENROLLED_COURSES_API,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    result = response.data.data;
  } catch (error) {
    console.error("GET_USER_ENROLLED_COURSES_API ERROR", error);
  }
  return result;
}

export async function getInstructorData(token) {
  let result = [];

  try {
    const response = await apiConnector("GET", GET_INSTRUCTOR_DATA_API, null, {
      Authorization: `Bearer ${token}`,
    });
    result = response?.data?.courses || [];
  } catch (error) {
    console.error("GET_INSTRUCTOR_API ERROR", error);
  }
  return result;
}
