import { toast } from "react-hot-toast";
import { apiConnector } from "../../../shared/api/client";
import {
  courseEndpoints,
  purchaseEndpoints,
} from "../../../shared/api/endpoints";

const {
  COURSE_DETAILS_API,
  COURSE_CATEGORIES_API,
  GET_ALL_COURSE_API,
  CREATE_COURSE_API,
  EDIT_COURSE_API,
  CREATE_SECTION_API,
  CREATE_SUBSECTION_API,
  UPDATE_SECTION_API,
  UPDATE_SUBSECTION_API,
  DELETE_SECTION_API,
  DELETE_SUBSECTION_API,
  GET_ALL_INSTRUCTOR_COURSES_API,
  DELETE_COURSE_API,
  GET_FULL_COURSE_DETAILS_AUTHENTICATED,
  CREATE_RATING_API,
  LECTURE_COMPLETION_API,
} = courseEndpoints;

const { GET_USER_PURCHASES_API } = purchaseEndpoints;

// Fetching all courses (Read-only, no toast popup)
export const getAllCourses = async () => {
  let result = [];
  try {
    const response = await apiConnector("GET", GET_ALL_COURSE_API);
    if (!response?.data?.success) {
      throw new Error("Could not fetch courses");
    }
    result = response?.data?.data || [];
  } catch (error) {
    console.error("GET_ALL_COURSE_API ERROR", error);
  }
  return result;
};

// Fetching single course details (Read-only, no toast popup)
export const fetchCourseDetails = async (courseId) => {
  let result = null;
  try {
    const response = await apiConnector("POST", COURSE_DETAILS_API, {
      courseId,
    });
    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    result = response.data;
  } catch (error) {
    console.error("COURSE_DETAILS_API ERROR", error);
    result = error.response?.data;
  }
  return result;
};

// Fetching available course categories (Read-only, no toast popup)
export const fetchCourseCategories = async () => {
  let result = [];
  try {
    const response = await apiConnector("GET", COURSE_CATEGORIES_API);
    if (!response?.data?.success) {
      throw new Error("Could not fetch course categories");
    }
    result = response?.data?.data || [];
  } catch (error) {
    console.error("COURSE_CATEGORY_API ERROR", error);
  }
  return result;
};

// Add course details (Action)
export const addCourseDetails = async (data, token) => {
  let result = null;
  const toastId = toast.loading("Saving course details...");
  try {
    const response = await apiConnector("POST", CREATE_COURSE_API, data, {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    });
    if (!response?.data?.success) {
      throw new Error("Could not create course");
    }
    toast.success("Course details saved");
    result = response?.data?.data;
  } catch (error) {
    console.error("CREATE COURSE API ERROR", error);
    toast.error(error.response?.data?.message || error.message);
  } finally {
    toast.dismiss(toastId);
  }
  return result;
};

// Edit course details (Action)
export const editCourseDetails = async (data, token) => {
  let result = null;
  const toastId = toast.loading("Updating course...");
  try {
    const response = await apiConnector("PUT", EDIT_COURSE_API, data, {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    });
    if (!response?.data?.success) {
      throw new Error("Could not update course details");
    }
    toast.success("Course updated successfully");
    result = response?.data?.data;
  } catch (error) {
    console.error("EDIT COURSE API ERROR", error);
    toast.error(error.response?.data?.message || error.message);
  } finally {
    toast.dismiss(toastId);
  }
  return result;
};

// Create section (Action)
export const createSection = async (data, token) => {
  let result = null;
  const toastId = toast.loading("Adding section...");
  try {
    const response = await apiConnector("POST", CREATE_SECTION_API, data, {
      Authorization: `Bearer ${token}`,
    });
    if (!response?.data?.success) {
      throw new Error("Could not create section");
    }
    toast.success("Section created");
    result = response?.data?.updatedCourse;
  } catch (error) {
    console.error("CREATE SECTION API ERROR", error);
    toast.error(error.response?.data?.message || error.message);
  } finally {
    toast.dismiss(toastId);
  }
  return result;
};

// Create subsection / lecture (Action)
export const createSubSection = async (data, token) => {
  let result = null;
  const toastId = toast.loading("Uploading lecture...");
  try {
    const response = await apiConnector("POST", CREATE_SUBSECTION_API, data, {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    });
    if (!response?.data?.success) {
      throw new Error("Could not add lecture");
    }
    toast.success("Lecture uploaded");
    result = response?.data?.data;
  } catch (error) {
    console.error("CREATE SUB-SECTION API ERROR", error);
    toast.error(error.response?.data?.message || error.message);
  } finally {
    toast.dismiss(toastId);
  }
  return result;
};

// Update section (Action)
export const updateSection = async (data, token) => {
  let result = null;
  const toastId = toast.loading("Updating section...");
  try {
    const response = await apiConnector("PUT", UPDATE_SECTION_API, data, {
      Authorization: `Bearer ${token}`,
    });
    if (!response?.data?.success) {
      throw new Error("Could not update section");
    }
    toast.success("Section updated");
    result = response?.data?.data;
  } catch (error) {
    console.error("UPDATE SECTION API ERROR", error);
    toast.error(error.response?.data?.message || error.message);
  } finally {
    toast.dismiss(toastId);
  }
  return result;
};

// Update subsection / lecture (Action)
export const updateSubSection = async (data, token) => {
  let result = null;
  const toastId = toast.loading("Updating lecture...");
  try {
    const response = await apiConnector("PUT", UPDATE_SUBSECTION_API, data, {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    });
    if (!response?.data?.success) {
      throw new Error("Could not update lecture");
    }
    toast.success("Lecture updated");
    result = response?.data?.data;
  } catch (error) {
    console.error("UPDATE SUB-SECTION API ERROR", error);
    toast.error(error.response?.data?.message || error.message);
  } finally {
    toast.dismiss(toastId);
  }
  return result;
};

// Delete section (Action)
export const deleteSection = async (data, token) => {
  let result = null;
  const toastId = toast.loading("Deleting section...");
  try {
    const response = await apiConnector("DELETE", DELETE_SECTION_API, data, {
      Authorization: `Bearer ${token}`,
    });
    if (!response?.data?.success) {
      throw new Error("Could not delete section");
    }
    toast.success("Section deleted");
    result = response?.data?.data;
  } catch (error) {
    console.error("DELETE SECTION API ERROR", error);
    toast.error(error.response?.data?.message || error.message);
  } finally {
    toast.dismiss(toastId);
  }
  return result;
};

// Delete subsection / lecture (Action)
export const deleteSubSection = async (data, token) => {
  let result = null;
  const toastId = toast.loading("Deleting lecture...");
  try {
    const response = await apiConnector(
      "DELETE",
      DELETE_SUBSECTION_API,
      data,
      {
        Authorization: `Bearer ${token}`,
      }
    );
    if (!response?.data?.success) {
      throw new Error("Could not delete lecture");
    }
    toast.success("Lecture deleted");
    result = response?.data?.data;
  } catch (error) {
    console.error("DELETE SUB-SECTION API ERROR", error);
    toast.error(error.response?.data?.message || error.message);
  } finally {
    toast.dismiss(toastId);
  }
  return result;
};

// Fetching all courses under instructor (Read-only, no toast popup)
export const fetchInstructorCourses = async (token) => {
  let result = [];
  try {
    const response = await apiConnector(
      "GET",
      GET_ALL_INSTRUCTOR_COURSES_API,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    if (!response?.data?.success) {
      throw new Error("Could not fetch instructor courses");
    }
    result = response?.data?.data || [];
  } catch (error) {
    console.error("INSTRUCTOR COURSES API ERROR", error);
  }
  return result;
};

// Delete course (Action)
export const deleteCourse = async (data, token) => {
  const toastId = toast.loading("Deleting course...");
  try {
    const response = await apiConnector("DELETE", DELETE_COURSE_API, data, {
      Authorization: `Bearer ${token}`,
    });

    if (!response?.data?.success) {
      throw new Error("Could not delete course");
    }
    toast.success("Course deleted");
  } catch (error) {
    console.error("DELETE COURSE API ERROR", error);
    toast.error(error.message);
  } finally {
    toast.dismiss(toastId);
  }
};

// Get full details of course (Read-only, no toast popup)
export const getFullDetailsOfCourse = async (courseId, token) => {
  let result = null;
  try {
    const response = await apiConnector(
      "POST",
      GET_FULL_COURSE_DETAILS_AUTHENTICATED,
      {
        courseId,
      },
      {
        Authorization: `Bearer ${token}`,
      }
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    result = response?.data?.data;
  } catch (error) {
    console.error("COURSE_FULL_DETAILS_API ERROR", error);
    result = error.response?.data;
  }
  return result;
};

// Mark lecture as complete (Action)
export const markLectureAsComplete = async (data, token) => {
  let result = null;
  const toastId = toast.loading("Saving progress...");
  try {
    const response = await apiConnector(
      "POST",
      LECTURE_COMPLETION_API,
      data,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    if (!response.data.message) {
      throw new Error(response.data.error);
    }
    toast.success("Lecture marked complete");
    result = true;
  } catch (error) {
    console.error("MARK_LECTURE_AS_COMPLETE_API ERROR", error);
    toast.error(error.message);
    result = false;
  } finally {
    toast.dismiss(toastId);
  }
  return result;
};

// Create rating (Action)
export const createRating = async (data, token) => {
  const toastId = toast.loading("Submitting rating...");
  let success = false;
  try {
    const response = await apiConnector("POST", CREATE_RATING_API, data, {
      Authorization: `Bearer ${token}`,
    });
    if (!response?.data?.success) {
      throw new Error("Could not create rating");
    }
    toast.success("Rating submitted");
    success = true;
  } catch (error) {
    success = false;
    console.error("CREATE RATING API ERROR", error);
    toast.error(error.message);
  } finally {
    toast.dismiss(toastId);
  }
  return success;
};

// Get user purchases (Read-only, no toast popup)
export const getUserPurchases = async (token) => {
  let result = [];
  try {
    const response = await apiConnector(
      "GET",
      GET_USER_PURCHASES_API,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    if (!response?.data?.success) {
      throw new Error("Could not get user purchases");
    }
    result = response?.data?.data || [];
  } catch (error) {
    console.error("GET_USER_PURCHASES_API ERROR", error);
  }
  return result;
};
