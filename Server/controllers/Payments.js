const {instance} = require('../config/razorpay');
const Course = require('../models/Course');
const CourseProgress = require('../models/CourseProgress')
const User = require('../models/User');
const mailSender = require('../utils/mailSender');
const {courseEnrollmentEmail} = require('../mail/template/courseEnrollmentEmail');
const {default:mongoose} = require('mongoose');
const {paymentSuccessEmail} = require("../mail/template/paymentSuccessEmail")
const crypto = require("crypto");

exports.capturePayment = async(req, res) => {

    const {courses} = req.body;
    const userId = req.user.id;

    if(courses.length === 0) {
        return res.json({
            success:false,
            message:"please provide Course Id",

        })
    }

    let totalAmount = 0;

    for(const course_id of courses){
        let course ;
        try{
               
                course = await Course.findById(course_id);
                if(!course){
                    return res.status(500).json({
                        success:false,
                        message:"Course not found"
                    })
                }


                const uid = new mongoose.Types.ObjectId(userId);
                if(course.studentsEnrolled.includes(uid)){
                    return res.status(200).json({
                        success:false,
                        message:"Course already enrolled",
                    })
                }

                totalAmount += course.price;
        }
        catch(error){
            console.log(error)
                return res.status(500).json({
                    success:false,
                    message:error.message,
                })

        }
    }
    const currency = "INR";
    const options = {
        amount: totalAmount * 100,
        currency,
        receipt:Math.random(Date.now()).toString()
    }

    try{
        const paymentResponse = await instance.orders.create(options);
        res.json({
            success:true,
            message:paymentResponse,
        })
    }
    catch(error){
        console.log(error)
        res.status(500).json({
            success:false,
            message:"Could not Initiate Order",
        })
    }
    
}

// payment verification

exports.verifyPayment = async(req, res) => {
    const razorpay_order_id = req.body?.razorpay_order_id;
    const razorpay_payment_id = req.body?.razorpay_payment_id;
    const razorpay_signature = req.body?.razorpay_signature;
    const courses = req.body?.courses;
    const userId = req.user.id;

    if(!razorpay_order_id ||
        !razorpay_payment_id ||
        !razorpay_signature || !courses || !userId) {
            return res.status(200).json({success:false, message:"Payment Failed"});
    }

    let body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_SECRET)
        .update(body.toString())
        .digest("hex");

        if(expectedSignature === razorpay_signature) {
            //enroll karwao student ko
            await enrollStudents(courses, userId, res);
            //return res
            return res.status(200).json({success:true, message:"Payment Verified"});
        }
        return res.status(200).json({success:"false", message:"Payment Failed"});

}

const enrollStudents = async(courses, userId, res) => {

    if(!courses || !userId){
        return res.status(400).json({
            success:false,
            message:"Please provide data for courses or user"
        })
    }

    for(const courseId of courses){
        // find the course and enroll the student in it
        try{
            const enrolledCourse = await Course.findOneAndUpdate(
                {_id:courseId},
                {$push:{
                    studentsEnrolled:userId
                }},
                {new:true},
            )
    
            if(!enrolledCourse){
                return res.status(500).json({
                    success:false,
                    message:"Course not found"
                })
            }
            const courseProgress = await CourseProgress.create({
                courseID:courseId,
                userId:userId,
                completedVideos: [],
            })
    
            // find the student and add the course to their list of enrollCourses
            const enrolledStudent = await User.findByIdAndUpdate(userId,
                {$push:{
                    courses: courseId,
                    courseProgress:courseProgress._id
                }},{new:true})
                
            ///bachhe ko mail send kardo
            const emailResponse = await mailSender(
                enrollStudents.email,
                `Successfully Enrolled into ${enrolledCourse.courseName}`,
                courseEnrollmentEmail(enrolledCourse.courseName, `${enrolledStudent.firstName}`)
            )    
            
        }
        catch(error){
            console.log(error);
            return res.status(500).json({
                success:false,
                message:"Error while enrolling student",
            })
        }

    }
}

exports.sendPaymentSuccessEmail = async (req, res) => {
    const {orderId, paymentId , amount} = req.body;

    const userId = req.user.id;

    if(!orderId || !paymentId || !amount || !userId ){
        return res.status(400).json({
            success:false,
            message:"Please provide the all the fields"
        })
    }

    try{

        const enrolledStudent = await User.findById(userId);
        await mailSender(
            enrolledStudent.email,
            `Payment Recieved`,
            paymentSuccessEmail(`${enrolledStudent.firstName} `,amount/100 , orderId, paymentId)
        )
    }catch(error){
        console.log("Error in sending Email", error)
        return res.status(500).json({
            success:false,
            message:"Could not send Email"
        })
    }
}

// exports.capturePayment = async(req, res) =>{
//     try{
//         // getCourse Id
//         const {course_id} = req.body
//         const userId = req.user.body;
        
//         // velidation
//         // velid courseid
//         if(!course_id){
//             return res.status(400).json({
//                 success:false,
//                 message: "Course Id is required"
//             })
//         } 
        
//         // valid course details
//         let course;
//         try{
//             course = await Course.findById(course_id);
//             if(!course){
//                 return res.status(400).json({
//                     success:false,
//                     message: "Course not found",
//                 });
//             };

//             // user already pay for the same course
//             const uid = new mongoose.Types.ObjectId(userId);
//             if(course.studentsEnrolled.includes(uid)){
//                 return res.status(200).json({
//                     success:false,
//                     message: "Student is already enrollerd",
//                 })
//             }
//         }
//         catch(error){
//             console.log(error);
//             return res.status(500).json({
//                 success:false,
//                 message: "Internal Server Error"
//             })
//         };

//         // order create karo
//         const amount = course.price;
//         const currency = "INR";


//         const options ={
//             amount:amount *100,
//             currency,
//             receipt: Math.random(Date.now()).toString(),
//             notes:{
//                 courseId: course_id,
//                 userId,
//             }
//         };

//         try{
//             // initiate the payment using razorpay
//             const paymentResponse = await instance.orders.create(options);
//             console.log(paymentResponse);

//             // return res
//             return res.status(200).json({
//                 success:true,
//                 courseName:course.courseName,
//                 courseDescription:course.courseDescription,
//                 thumbnail:course.thumbnail,
//                 orderId:paymentResponse.id,
//                 currency:paymentResponse.currency,
//                 amount:paymentResponse.amount/100,
//             })
            
//         }
//         catch(err){
//             console.log(err);
//             return res.status(500).json({
//                 success:false,
//                 message:"Could not initiate order"
//             })

//         }
//         // return response

//     }
//     catch(error){
//         console.log(error);
//         return res.json({
//             success:false,
//             message:"Could not find course",
//         })
//     }
// }

// // verify signature

// exports.verifySignature = async (req , res) =>{
//     try{

//         // server secret
//         const webhookSecret = "12345678";

//         const signature = req.headers["x-razorpay-signature"];

//         const shasum = crypto.createHmac("sha256" , webhookSecret)
//         shasum.update(JSON.stringify(req.body));
//         const digest = shasum.digest("hex");
        
//         if (signature !== digest) {
//             console.log("Payment is Authorized");

//             const {courseId , userId} = req.body.payload.payment.entity.notes;

//             try{    
//                 // fullfill the action

//                 // find the course and enroll the student in it
//                 const enrolledCourse = await Course.findOneAndUpdate(
//                                                                 {_id:courseId},
//                                                                 {
//                                                                     $push:{studentsEnrolls:userId}
//                                                                 },
//                                                                 {new:true},
//                 );
//                 if(!enrolledCourse){
//                     return res.status(500).json({
//                         success:false,
//                         message:"Could not find course",
//                     });
//                 };

//                 console.log(enrolledCourse);

//                 // find the student and add course in listofcourse

//                 const enrolledStudent = await User.findOneAndUpdate(
//                                                             {_id:userId},
//                                                             { 
//                                                                 $push:{courses:courseId}
//                                                             },
//                                                             {new:true},

//                 );

//                 console.log(enrolledStudent);

//                 // mail send karenge

//                 const emailResponse = await mailSender(
//                                         enrolledStudent.email,
//                                         "Congratulation from Ashwin",
//                                         "You have been enrolled in the course",
//                 );

//                 console.log(emailResponse);
//                 return res.json({
//                     success:true,
//                     message:"Course Enrolled Successfully",
//                 })


//             }
//             catch(error){
//                 console.log(error);
//                 return res.status(500).json({
//                     success:false,
//                     message:error.message,
//                 })
//             }


//         }
//         else{
//             return res.status(400).json({
//                 success:false,
//                 message:"Invalid Request",
//             });
//         }
//     }
//     catch(error){
//         console.log(error);
//         return res.status(500).json({
//             success:false,
//             message:"something went wrong while verifying Signature",
//         })
//     }
// }
 