const mongoose = require("mongoose");
// Ensure referenced models are registered
require("../models/User");
require("../models/RatingAndReview");
const Course = require("../models/Course");
const Category = require("../models/Category");

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    await Category.create({
      name,
      description,
    });
    return res.status(200).json({
      success: true,
      message: "Category Created Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.showAllCategories = async (req, res) => {
  try {
    const allCategories = await Category.find({})
      .populate({
        path: "courses",
        match: { status: "Published" },
        select: "_id",
      })
      .exec();

    res.status(200).json({
      success: true,
      data: allCategories,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.categoryPageDetails = async (req, res) => {
  try {
    const { categoryId, categoryName } = req.body;

    let selectedCategory = null;

    // 1. Try finding by categoryId if valid ObjectId
    if (categoryId && mongoose.Types.ObjectId.isValid(categoryId)) {
      selectedCategory = await Category.findById(categoryId)
        .populate({
          path: "courses",
          match: { status: "Published" },
          populate: [
            { path: "instructor", select: "firstName lastName image email" },
            { path: "ratingAndReview" },
          ],
        })
        .exec();
    }

    // 2. Fallback: try finding by name or slug if not found
    if (!selectedCategory && (categoryName || categoryId)) {
      const searchTarget = String(categoryName || categoryId).trim();
      const slugRegex = new RegExp(searchTarget.replace(/[-_]/g, "\\s*"), "i");

      selectedCategory = await Category.findOne({ name: slugRegex })
        .populate({
          path: "courses",
          match: { status: "Published" },
          populate: [
            { path: "instructor", select: "firstName lastName image email" },
            { path: "ratingAndReview" },
          ],
        })
        .exec();
    }

    // 3. Fallback: if still not found, load the first available category
    if (!selectedCategory) {
      selectedCategory = await Category.findOne({})
        .populate({
          path: "courses",
          match: { status: "Published" },
          populate: [
            { path: "instructor", select: "firstName lastName image email" },
            { path: "ratingAndReview" },
          ],
        })
        .exec();
    }

    if (!selectedCategory) {
      return res.status(404).json({
        success: false,
        message: "No categories found in the system.",
      });
    }

    // 4. Get a different category for recommendations
    const otherCategories = await Category.find({
      _id: { $ne: selectedCategory._id },
    })
      .populate({
        path: "courses",
        match: { status: "Published" },
        populate: [
          { path: "instructor", select: "firstName lastName image email" },
          { path: "ratingAndReview" },
        ],
      })
      .exec();

    let differentCategory = null;
    if (otherCategories.length > 0) {
      // Pick another category that actually has published courses if possible
      const withCourses = otherCategories.filter(
        (cat) => cat.courses && cat.courses.length > 0
      );
      differentCategory =
        withCourses.length > 0
          ? withCourses[getRandomInt(withCourses.length)]
          : otherCategories[getRandomInt(otherCategories.length)];
    }

    // 5. Get top-selling / popular courses across all categories
    const mostSellingCourses = await Course.find({ status: "Published" })
      .populate("instructor", "firstName lastName image email")
      .populate("ratingAndReview")
      .populate("category", "name")
      .lean();

    // Sort by number of enrolled students descending
    mostSellingCourses.sort(
      (a, b) =>
        (b.studentsEnrolled?.length || 0) - (a.studentsEnrolled?.length || 0)
    );

    return res.status(200).json({
      success: true,
      data: {
        selectedCategory,
        differentCategory,
        mostSellingCourses: mostSellingCourses.slice(0, 8),
      },
    });
  } catch (error) {
    console.error("[categoryPageDetails] Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while fetching catalog details.",
      error: error.message,
    });
  }
};