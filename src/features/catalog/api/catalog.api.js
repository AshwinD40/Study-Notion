import { apiConnector } from "../../../shared/api/client";
import { catalogData } from "../../../shared/api/endpoints";

export const getCatalogPageData = async (categoryId, categoryName) => {
  let result = null;

  try {
    const payload = {};
    if (categoryId) payload.categoryId = categoryId;
    if (categoryName) payload.categoryName = categoryName;

    const response = await apiConnector(
      "POST",
      catalogData.CATALOGPAGEDATA_API,
      payload
    );

    if (!response?.data?.success) {
      throw new Error(
        response?.data?.message || "Could not fetch category page data"
      );
    }
    result = response?.data;
  } catch (error) {
    console.error("CATALOG PAGE DATA API ERROR", error);
    result = error.response?.data || {
      success: false,
      message: error.message || "Failed to load catalog data",
    };
  }

  return result;
};
