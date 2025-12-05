const RatingAndReview = require('../models/RatingAndReview');
const Course = require('../models/Course');
const {mongo, default: mongoose } = require('mongoose');

// create rating
exports.createRating = async (req, res) =>{
    try{
        // get user is
        const userId = req.user.id;

        // fetch data from req body
        const {rating , review , courseId} = req.body;

        // check if user is enrolled or not
        const courseDetails = await Course.findOne(
                                                { _id: courseId ,
                                                    studentsEnrolled:{$elemMatch: {$eq:userId}}, 
                                                },
                                            
        )
        if(!courseDetails){
            return res.status(400).json({
                success:false,
                message: "You are not enrolled in this course",
            })
        }
        // check if user already revies the course
        const alreadyReviewed = await RatingAndReview.findOne({
                                                    user:userId,
                                                    course:courseId,            
        });
        if(alreadyReviewed){
            return res.status(403).json({
                success:false,
                message: "You already reviewed this course",
            })
        }

        // create review
        const ratingReview = await RatingAndReview.create({
                                            rating, review,
                                            course:courseId, 
                                            user:userId
                                        })
        

        // attach with course vala model
        const updatedCourseDetails = await Course.findByIdAndUpdate({_id:courseId},
                                     {  
                                        $push:{
                                            ratingAndReview:ratingReview._id
                                        }
                                     },
                                     {new:true}
        );
        console.log(updatedCourseDetails);

        // return res
        return res.status(200).json({
            success:true,
            message: "Review created successfully",
            ratingReview,
        })

    }
    catch(error){
        console.log(error);
        return res.status(500).json({   
            success:false,
            message: "Internal server error",
        })

    }
}

// get average rating

exports.getAverageRating = async (req , res)=>{
    try{
        // get course id
        const courseId = req.body.courseId;

        // calculate average rating
        const result = await RatingAndReview.aggregate([
            {
                $match: {
                    course: new mongoose.Types.ObjectId(courseId),
                },
            },
            {
                $group: {
                    _id: null,
                    averageRating :{$avg : "$rating"},
                }
            }

        ])

        // return rating
        if(result.length > 0){

            return res.status(200).json({
                success:true,
                averageRating:result[0].averageRating,
            });
        };

        // if no review rating
        return res.status(200).json({
            success:true,
            averageRating:0,
            message:"This course have no any rating and Review till now",

        })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({   
            success:false,
            message: "Internal server error",
        })
    }
}


// get allrating

exports.getAllRating = async (req, res) =>{
    try{
        
        const allReview = await RatingAndReview.find({})
                                .sort({rating:"desc"})
                                .populate({
                                    path: 'user',
                                    select:"firstName LastName email image",

                                })
                                .populate({
                                    path: 'course',
                                    select:"courseName",
                                })
                                .exec();
        return res.status(200).json({
            success:true,
            data:allReview,
            message:"All reviews fetched successfully",
        });
    }
    catch(err){
        console.log(err);
        return res.status(500).json({   
            success:false,
            message: "Internal server error",
        })
    }
}