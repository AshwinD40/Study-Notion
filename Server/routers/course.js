const express = require('express');
const router = express.Router();

// important middleware
const {auth , isAdmin , isStudent , isInstructor} = require('../middlewares/auth')

// course controller
const{
    createCourse,
    getAllCourses,
    getCourseDetails,
    getFullCourseDetails,
    editCourse,
    getInstructorCourses,
    deleteCourse,
} = require('../controllers/Course');

// Categories Controllers Import
const {
    showAllCategories,
    createCategory,
    categoryPageDetails,
  } = require("../controllers/Category")

// section controller
const {
    createSection,
    updateSection,
    deleteSection
} = require('../controllers/Section')

// subsection controller
const {
    createSubSection,
    updateSubSection,
    deleteSubSection
} = require('../controllers/SubSection');

// rating and review controller
const {
    createRating,
    getAverageRating,
    getAllRating
} = require('../controllers/RatingAndReview');

const {
    updateCourseProgress
} = require("../controllers/courseProgress");


// ************************************************************************
//                         Course Router
// ************************************************************************
// course can only created by instructor
router.post('/createCourse', auth, isInstructor, createCourse)
// Add section in course
router.post('/addSection', auth, isInstructor, createSection)
// update a section
router.put('/updateSection', auth, isInstructor, updateSection)
// delete section
router.delete('/deleteSection', auth, isInstructor, deleteSection)
// create subsection
router.post('/addSubSection', auth, isInstructor, createSubSection)
// edit subsection
router.put('/updateSubSection', auth, isInstructor, updateSubSection)
// delete subsection
router.delete('/deleteSubSection', auth, isInstructor, deleteSubSection)
// Edit Course routes
router.put("/editCourse", auth, isInstructor, editCourse)
// Get all Courses Under a Specific Instructor
router.get("/getInstructorCourses", auth, isInstructor, getInstructorCourses)
// get all registerd courses
router.get('/getAllCourses', getAllCourses)
// get Details for a specific course
router.post("/getCourseDetails", getCourseDetails)
// Get Details for a Specific Courses
router.post("/getFullCourseDetails", auth, getFullCourseDetails)
// Delete a Course
router.delete("/deleteCourse", deleteCourse)
// courseProgress
router.post("/updateCourseProgress" ,auth , isStudent, updateCourseProgress)

// ************************************************************************
//                                 category route (Only by Admin)
// ************************************************************************

// category can only created by Admin
router.post("/createCategory", auth, isAdmin, createCategory)
router.get("/showAllCategories", showAllCategories)
router.post("/getCategoryPageDetails", categoryPageDetails)

// *************************************************************************
//                               Rating and Review
// *************************************************************************

router.post("/createRating", auth , isStudent ,createRating)
router.get("/getAverageRating", getAverageRating)
router.get("/getReviews", getAllRating)

module.exports = router