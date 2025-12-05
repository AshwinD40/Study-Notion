const { instance } = require('../config/razorpay');
const Course = require('../models/Course');
const crypto = require("crypto");
const User = require('../models/User');
const mailSender = require('../utils/mailSender');
const mongoose = require('mongoose');
const { courseEnrollmentEmail } = require('../mail/template/courseEnrollmentEmail');
const { paymentSuccessEmail } = require("../mail/template/paymentSuccessEmail");
const CourseProgress = require('../models/CourseProgress');

exports.capturePayment = async (req, res) => {

  const { courses } = req.body;
  const userId = req.user.id;

  if (!Array.isArray(courses) || courses.length === 0) {
    return res.status(400).json({
      success: false,
      message: "please provide Course Id",
    })
  }

  let total_amount = 0;

  try {
    for (const course_id of courses) {
      const course = await Course.findById(course_id);

      if (!course) {
        return res.status(400).json({
          success: false,
          message: "Course not found"
        })
      }

      // check if user have this course or not
      const uid = new mongoose.Types.ObjectId(userId);
      if (course.studentsEnrolled.includes(uid)) {
        return res.status(400).json({
          success: false,
          message: "You have already enrolled in this course",
        })
      }
      total_amount += course.price;
    }
    const currency = "INR";
    const options = {
      amount: Math.round(total_amount * 100),
      currency,
      receipt: `rcpt_${Date.now()}`,
    };

    const paymentResponse = await instance.orders.create(options);

    return res.json({
      success: true,
      key: process.env.RAZORPAY_KEY,
      message: {
        id: paymentResponse.id,
        currency: paymentResponse.currency,
        amount: paymentResponse.amount
      },
    })
  } catch (error) {
    console.log("capturePayment error", error)
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// payment verification
exports.verifyPayment = async (req, res) => {
  const razorpay_order_id = req.body?.razorpay_order_id;
  const razorpay_payment_id = req.body?.razorpay_payment_id;
  const razorpay_signature = req.body?.razorpay_signature;
  const courses = req.body?.courses;

  const userId = req.user.id;

  if (!razorpay_order_id ||
    !razorpay_payment_id ||
    !razorpay_signature ||
    !courses ||
    !userId
  ) {
    return res.status(200).json({ success: false, message: "Payment Failed" });
  }

  let body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(body.toString())
    .digest("hex");

  if (expectedSignature === razorpay_signature) {
    //enroll karwao student ko
    await enrollStudents(courses, userId, res);
    //return res
    return res.status(200).json({ success: true, message: "Payment Verified" });
  }
  return res.status(200).json({ success: "false", message: "Payment Failed" });

}

// send payment success email
exports.sendPaymentSuccessEmail = async (req, res) => {
  const { orderId, paymentId, amount } = req.body;

  const userId = req.user.id;

  if (!orderId || !paymentId || !amount || !userId) {
    return res.status(400).json({
      success: false,
      message: "Please provide the all the fields"
    })
  }

  try {
    const enrolledStudent = await User.findById(userId);

    const mailResponse = await mailSender(
      enrolledStudent.email,
      `Payment Recieved`,
      paymentSuccessEmail(
        `${enrolledStudent.firstName} ${enrolledStudent.lastName} `,
        amount / 100,
        orderId,
        paymentId
      )
    )
    if (!mailResponse.success) {
      throw new Error(mailResponse.error ? mailResponse.error.message : "Email sending failed");
    }
  } catch (error) {
    console.log("Error in sending Email", error)
    return res.status(400).json({
      success: false,
      message: "Could not send Email"
    })
  }
}

// enroll student
const enrollStudents = async (courses, userId, res) => {

  if (!courses || !userId) {
    return res.status(400).json({
      success: false,
      message: "Please provide CourseID and userID"
    })
  }

  for (const courseId of courses) {
    // find the course and enroll the student in it
    try {
      const uidObj = new mongoose.Types.ObjectId(userId);

      const enrolledCourse = await Course.findOneAndUpdate(
        { _id: courseId },
        { $push: { studentsEnrolled: uidObj } },
        { new: true },
      );

      if (!enrolledCourse) {
        return res.status(404).json({
          success: false,
          message: "Course not found"
        })
      }

      const courseProgress = await CourseProgress.create({
        courseID: courseId,
        userId: uidObj,
        completedVideos: [],
      })

      // find the student and add the course to their list of enrollCourses
      const enrolledStudent = await User.findByIdAndUpdate(
        userId,
        {
          $push: {
            courses: courseId,
            courseProgress: courseProgress._id
          }
        },
        { new: true }
      )
      console.log("Enrolled student:", enrolledStudent);

      ///bachhe ko mail send kardo
      const mailResponse = await mailSender(
        enrolledStudent.email,
        `Successfully Enrolled into ${enrolledCourse.courseName}`,
        courseEnrollmentEmail(
          enrolledCourse.courseName,
          `${enrolledStudent.firstName} ${enrolledStudent.lastName}`
        )
      )
      if (!mailResponse.success) {
        throw new Error(mailResponse.error ? mailResponse.error.message : "Email sending failed");
      }
    } catch (error) {
      console.log("Error while enrolling student", error);
      return res.status(500).json({
        success: false,
        message: "Error while enrolling student",
      })
    }
  }

  return res.json({
    success: true,
    message: "Successfully Enrolled into the course"
  })
}
