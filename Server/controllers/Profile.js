const Profile = require('../models/Profile');
const Course = require("../models/Course");
const CourseProgress = require("../models/CourseProgress");
const User = require('../models/User');
const {uploadImageToCloudinary} = require('../utils/imageUploader');
const {convertSecondsToDuration} = require("../utils/secToDuration")

exports.updateProfile = async (req , res) =>{
    try{

        // get data with user Id
        const {dateOfBirth = "" , about = "",contactNumber, gender } = req.body

        // find userId
        const id = req.user.id

        // find user detail
        const userDetails = await User.findById(id).populate("additionalDetails");

        const profile = await Profile.findById(userDetails.additionalDetails._id);
       
        // update
        profile.dateOfBirth = dateOfBirth;
        profile.about = about;
        profile.contactNumber = contactNumber;
        profile.gender = gender;

        await profile.save();

        // populate latest user data again
        const updatedUser = await User.findById(id)
            .populate("additionalDetails")
            .exec();

        // return res
        return res.status(200).json({
            success:true,
            message:"Profile updated successfully",
            updatedUserDetails:updatedUser,
        });
    }
    catch(error){
        console.log(error.message);
        return res.status(500).json({
            success:false,
            message:"Server error",
        })
    }
}

// Explore ==>>> how can we schedule deletion function
exports.deleteAccount = async (req, res) =>{

    try{
        // get userId
        const id = req.user.id;

        // velidation
        const user = await User.findById({_id:id});
        if(!user){
            return res.status(404).json({
                success:false,
                message:"User not found",
            });
        }

        // delete profile first
        await Profile.findByIdAndDelete({_id:user.additionalDetails});
        // HW: how to unroll user from enroll courses

        // delete user
        await User.findByIdAndDelete({_id:id});

        // return res
        return res.status(200).json({
            success:true,
            message:"Account deleted successfully",
        })

    }
    catch(error){
        console.log(error.message);
        return res.status(500).json({
            success:false,
            message:"Sorry Account is not deleted, please try again later",
        })
    }
}

// user details
exports.getAllUserDetails = async (req, res) =>{
    try{
        
        // get user Id
        const id = req.user.id;

        // get id and velidation
        const userDetails = await User.findById(id)
        .populate("additionalDetails")
        .exec();
        console.log(userDetails);
        // return res
        return res.status(200).json({
            success:true,
            message:"User Data fetch successfully",
            data:userDetails,
        })
    }
    catch(error){
        console.log(error.message);
        return res.status(500).json({
            success:false,
            message:"Server error",
        })
    }
}

// update Display Picture
exports.updateDisplayPicture = async (req, res) =>{
    try{
        const displayPicture = req.files.displayPicture
        const userId = req.user.id
        const image = await uploadImageToCloudinary(
            displayPicture,
            process.env.FOLDER_NAME,
            1000,
            1000
        )
        console.log(image)
        const updateProfile = await User.findByIdAndUpdate(
            {_id:userId},
            {image : image.secure_url},
            {new:true},
        )
        res.send({
            success:true,
            message:"Display Picture updated successfully",
            data:updateProfile,
        })
    } catch(error){
        return res.status(500).json({
            success:false,
            message:"Server error",
        })
    }
};

// enroll course
exports.getEnrolledCourses = async (req, res) =>{
    try{
        const userId = req.user.id
        let userDetails = await User.findOne({
            _id:userId,
        })
        .populate({
            path:"courses",
            populate: {
                path: "courseContent",
                populate: {
                    path: "subSection",
                },
            },
        })        
        .exec()

        userDetails = userDetails.toObject()
	    var SubsectionLength = 0
	    for (var i = 0; i < userDetails.courses.length; i++) {
		    let totalDurationInSeconds = 0
		    SubsectionLength = 0
		    for (var j = 0; j < userDetails.courses[i].courseContent.length; j++) {
		        totalDurationInSeconds += userDetails.courses[i].courseContent[
			        j
		        ].subSection.reduce((acc, curr) => acc + parseInt(curr.timeDuration), 0)
		        userDetails.courses[i].totalDuration = convertSecondsToDuration(
			        totalDurationInSeconds
		        )
		        SubsectionLength +=
			        userDetails.courses[i].courseContent[j].subSection.length
		    }
		    let courseProgressCount = await CourseProgress.findOne({
		        courseID: userDetails.courses[i]._id,
		        userId: userId,
		    })
		    courseProgressCount = courseProgressCount?.completedVideos.length
		    if (SubsectionLength === 0) {
		        userDetails.courses[i].progressPercentage = 100
		    } else {
		    // To make it up to 2 decimal point
		        const multiplier = Math.pow(10, 2)
		        userDetails.courses[i].progressPercentage =
			        Math.round(
			            (courseProgressCount / SubsectionLength) * 100 * multiplier
			        ) / multiplier
		    }
	    }

        if(!userDetails){
            return res.status(404).json({
                success:false,
                message:` User not found : ${userDetails}`,
            })
        }
        return res.status(200).json({
            success:true,
            message:"Courses enrolled successfully",
            data:userDetails.courses
        })
    } catch(error){
        return res.status(500).json({
            success:false,
            message:error.message,
        })

    }
};

exports.instructorDashboard = async (req, res) =>  {

    try{
        const courseDetails = await Course.find({instructor:req.user.id});

        const courseData = courseDetails.map((course)=>{
             const totalStudentEnrolled = course.studentsEnrolled.length
             const totalAmountGenerated = totalStudentEnrolled * course.price

            //  create a new object with the additional field
            const courseDataWithState = {
                _id :course._id,
                courseName:course.courseName,
                courseDescription:course.courseDescription,
                totalAmountGenerated,
                totalStudentEnrolled,
            } 
            return courseDataWithState
        })

        return res.status(200).json({
            courses:courseData
        })

    } catch(error){
        console.error(error.message);
        return res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
    }
}