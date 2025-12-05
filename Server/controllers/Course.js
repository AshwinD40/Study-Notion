const mongoose = require('mongoose');
const Course = require('../models/Course');
const Category = require('../models/Category');
const Section = require('../models/Section')
const SubSection = require('../models/SubSection');
const User = require('../models/User');
const { uploadImageToCloudinary } = require('../utils/imageUploader');
const CourseProgress = require('../models/CourseProgress')
const { convertSecondsToDuration } = require("../utils/secToDuration")

// create course
exports.createCourse = async (req, res) => {
  try {

    const userId = req.user.id;

    // fetch data
    let {
      courseName,
      courseDescription,
      whatYouWillLearn,
      price,
      tag: _tag,
      category,
      status,
      instructions: _instructions,
    } = req.body;

    // get thumbnail
    const thumbnail = req.files.thumbnailImage;

    const tag = JSON.parse(_tag)
    const instructions = JSON.parse(_instructions);

    console.log("tag", tag)
    console.log("instructions", instructions)

    // velidaition
    if (
      !courseName ||
      !courseDescription ||
      !whatYouWillLearn ||
      !price ||
      !tag.length ||
      !category ||
      !thumbnail ||
      !instructions.length
    ) {
      return res.status(400).json({
        success: false,
        message: 'Please fill all the fields'
      });
    };

    if (!status || status === undefined) {
      status = "Draft";
    }
    // validation instructor
    const instructorDetails = await User.findById(userId, {
      accountType: "Instructor",
    });

    if (!instructorDetails) {
      return res.status(404).json({
        success: false,
        message: "Instructor Details Not found",
      })
    };

    // validation category
    const categoryDetails = await Category.findById(category);
    if (!categoryDetails) {
      return res.status(404).json({
        success: false,
        message: "Category Details Not found",
      })
    };

    // upload image to cloudinary
    const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME);

    // create an entry for new course
    const newCourse = await Course.create({
      courseName,
      courseDescription,
      instructor: instructorDetails._id,
      whatYouWillLearn: whatYouWillLearn,
      price,
      tag,
      category: categoryDetails._id,
      thumbnail: thumbnailImage.secure_url,
      status: status,
      instructions,

    });



    // update the category schema
    await Category.findByIdAndUpdate(
      { _id: category },
      {
        $push: { courses: newCourse._id }
      },
      { new: true },
    );

    // return res
    res.status(200).json({
      success: true,
      message: "Course created successfully",
      data: newCourse,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to create course",
      error: error.message,
    })

  }
}

// Edit Course Details
exports.editCourse = async (req, res) => {
  try {
    console.log("EDIT COURSE CALLED")
    const { courseId } = req.body
    const updates = req.body
    const course = await Course.findById(courseId)

    if (!course) {
      return res.status(404).json({ error: "Course not found" })
    }

    // If Thumbnail Image is found, update it
    if (req.files) {
      console.log("thumbnail update")
      const thumbnail = req.files.thumbnailImage
      const thumbnailImage = await uploadImageToCloudinary(
        thumbnail,
        process.env.FOLDER_NAME
      )
      course.thumbnail = thumbnailImage.secure_url
    }

    // Update only the fields that are present in the request body
    for (const key in updates) {
      if (updates.hasOwnProperty(key)) {
        if (key === "tag" || key === "instructions") {
          course[key] = JSON.parse(updates[key])
        } else {
          course[key] = updates[key]
        }
      }
    }

    await course.save()

    const updatedCourse = await Course.findOne({
      _id: courseId,
    })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReview")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec()

    res.json({
      success: true,
      message: "Course updated successfully",
      data: updatedCourse,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}
// getAllCourse handler function

exports.getAllCourses = async (req, res) => {
  try {
    // fetch all courses
    const allCourses = await Course.find(
      { status: "Published" },
      {
        courseName: true,
        thumbnail: true,
        price: true,
        instructor: true,
        ratingAndReview: true,
        studentsEnrolls: true,

      }).populate("Instructor")
      .exec();

    return res.status(200).json({
      success: true,
      message: "All courses fetched successfully",
      data: allCourses,
    });

  }
  catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to get all courses",
      error: error.message,
    })
  }
}

// getCourseDetails
exports.getCourseDetails = async (req, res) => {

  try {
    const { courseId } = req.body;
    const courseDetails = await Course.findOne({
      _id: courseId,
    })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReview")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
          select: "-videoUrl",
        },
      })
      .exec()

    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find course with id: ${courseId}`,
      })
    }


    let totalDurationInSeconds = 0
    courseDetails.courseContent.forEach((content) => {
      content.subSection.forEach((subSection) => {
        const timeDurationInSeconds = parseFloat(subSection.timeDuration)
        totalDurationInSeconds += timeDurationInSeconds
      })
    })

    const totalDuration = convertSecondsToDuration(totalDurationInSeconds)

    return res.status(200).json({
      success: true,
      data: {
        courseDetails,
        totalDuration
      },
    })

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

exports.getFullCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.body
    const userId = req.user.id
    const courseDetails = await Course.findOne({
      _id: courseId,
    })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReview")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec()

    let courseProgressCount = await CourseProgress.findOne({
      courseID: courseId,
      userId: userId,
    })

    console.log("courseProgressCount : ", courseProgressCount)

    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find course with id: ${courseId}`,
      })
    }

    // if (courseDetails.status === "Draft") {
    //   return res.status(403).json({
    //     success: false,
    //     message: `Accessing a draft course is forbidden`,
    //   });
    // }

    let totalDurationInSeconds = 0
    courseDetails.courseContent.forEach((content) => {
      content.subSection.forEach((subSection) => {
        const timeDurationInSeconds = parseFloat(subSection.timeDuration)
        totalDurationInSeconds += timeDurationInSeconds
      })
    })

    const totalDuration = convertSecondsToDuration(totalDurationInSeconds)

    return res.status(200).json({
      success: true,
      data: {
        courseDetails,
        totalDuration,
        completedVideos: courseProgressCount?.completedVideos
          ? courseProgressCount?.completedVideos
          : [],
      },
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// Get a list of Course for a given Instructor
exports.getInstructorCourses = async (req, res) => {
  try {
    const instructorId = req.user.id

    // 1. Get basic list of instructor courses
    const rawCourses = await Course.find(
      { instructor: instructorId },
      {
        courseName: 1,
        thumbnail: 1,
        price: 1,
        status: 1,
        createdAt: 1,
      }
    )
      .sort({ createdAt: -1 })
      .exec()

    // 2. For each course, fetch populated content & compute duration
    const coursesWithDuration = await Promise.all(
      rawCourses.map(async (course) => {
        const populatedCourse = await Course.findById(course._id)
          .populate({
            path: "courseContent",
            populate: {
              path: "subSection",
            },
          })
          .exec()

        let totalDurationInSeconds = 0

        populatedCourse.courseContent?.forEach((section) => {
          section.subSection?.forEach((subSection) => {
            const timeDurationInSeconds =
              parseInt(subSection.timeDuration) || 0
            totalDurationInSeconds += timeDurationInSeconds
          })
        })

        const totalDuration = convertSecondsToDuration(totalDurationInSeconds)

        return {
          ...course.toObject(), // only basic fields
          totalDuration,        // add duration
        }
      })
    )

    return res.status(200).json({
      success: true,
      data: coursesWithDuration,
    })
  } catch (error) {
    console.error("getInstructorCourses ERROR:", error)
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve instructor courses",
      error: error.message,
    })
  }
}

// Delete the Course
exports.deleteCourse = async (req, res) => {
  try {
    console.log("DELETE COURSE BODY:", req.body)

    const { courseId } = req.body

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "courseId is required",
      })
    }

    console.log("DELETE COURSE ID:", courseId)

    // Find the course
    const course = await Course.findById(courseId)

    if (!course) {
      console.log("COURSE NOT FOUND FOR ID:", courseId)
      return res.status(404).json({
        success: false,
        message: "Course not found"
      })
    }

    // Unenroll students from the course
    const studentsEnrolled = course.studentsEnrolled || []
    for (const studentId of studentsEnrolled) {
      await User.findByIdAndUpdate(studentId, {
        $pull: { courses: courseId },
      })
    }

    // Delete sections and sub-sections
    const courseSections = course.courseContent || []
    for (const sectionId of courseSections) {
      const section = await Section.findById(sectionId)
      if (section) {
        const subSections = section.subSection || []
        for (const subSectionId of subSections) {
          await SubSection.findByIdAndDelete(subSectionId)
        }
      }
      await Section.findByIdAndDelete(sectionId)
    }

    await Course.findByIdAndDelete(courseId)

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    })
  } catch (error) {
    console.error("DELETE COURSE ERROR:", error)
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}
