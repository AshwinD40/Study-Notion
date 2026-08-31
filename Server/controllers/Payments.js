const { instance } = require("../config/razorpay");
const Course = require("../models/Course");
const crypto = require("crypto");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const mongoose = require("mongoose");
const { courseEnrollmentEmail } = require("../mail/template/courseEnrollmentEmail");
const { paymentSuccessEmail } = require("../mail/template/paymentSuccessEmail");
const CourseProgress = require("../models/CourseProgress");

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

async function resolveOrderAmountInPaise(orderId, fallbackAmount) {
  const amountFromBody = Number(fallbackAmount);
  if (Number.isFinite(amountFromBody) && amountFromBody > 0) {
    return amountFromBody;
  }

  if (!orderId) return null;

  try {
    const order = await instance.orders.fetch(orderId);
    const amount = Number(order?.amount);
    return Number.isFinite(amount) && amount > 0 ? amount : null;
  } catch (error) {
    console.warn("[payment] could not fetch order amount:", error.message);
    return null;
  }
}

async function sendPaymentReceiptEmail({ userId, orderId, paymentId, amountInPaise }) {
  const enrolledStudent = await User.findById(userId).select(
    "firstName lastName email"
  );

  if (!enrolledStudent) {
    return { success: false, error: { message: "User not found", code: "ENOUSER" } };
  }

  const amountInRupees = Number(amountInPaise) / 100;
  const fullName = `${enrolledStudent.firstName || ""} ${enrolledStudent.lastName || ""}`.trim();

  const mailResponse = await mailSender(
    enrolledStudent.email,
    "Payment Received",
    paymentSuccessEmail(fullName || "Learner", amountInRupees, orderId, paymentId)
  );

  if (!mailResponse.success) {
    return {
      success: false,
      error: mailResponse.error || { message: "Email sending failed", code: "EMAIL_FAIL" },
    };
  }

  return { success: true, info: mailResponse.info };
}

exports.capturePayment = async (req, res) => {
  const { courses } = req.body;
  const userId = req.user.id;

  if (!Array.isArray(courses) || courses.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Please provide at least one course ID",
    });
  }

  let totalAmount = 0;

  try {
    for (const courseId of courses) {
      if (!isValidObjectId(courseId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid course ID",
        });
      }

      const course = await Course.findById(courseId).select(
        "price studentsEnrolled courseName"
      );

      if (!course) {
        return res.status(404).json({
          success: false,
          message: "Course not found",
        });
      }

      const alreadyEnrolled = course.studentsEnrolled.some(
        (studentId) => String(studentId) === String(userId)
      );
      if (alreadyEnrolled) {
        return res.status(400).json({
          success: false,
          message: `Already enrolled in ${course.courseName}`,
        });
      }

      totalAmount += Number(course.price) || 0;
    }

    if (totalAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid course pricing",
      });
    }

    const options = {
      amount: Math.round(totalAmount * 100),
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
    };

    const paymentResponse = await instance.orders.create(options);

    return res.status(200).json({
      success: true,
      key: process.env.RAZORPAY_KEY,
      message: {
        id: paymentResponse.id,
        currency: paymentResponse.currency,
        amount: paymentResponse.amount,
      },
    });
  } catch (error) {
    console.error("[capturePayment] error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Could not create payment order",
    });
  }
};

// payment verification
exports.verifyPayment = async (req, res) => {
  const razorpay_order_id = req.body?.razorpay_order_id;
  const razorpay_payment_id = req.body?.razorpay_payment_id;
  const razorpay_signature = req.body?.razorpay_signature;
  const courses = req.body?.courses;
  const userId = req.user.id;

  if (
    !razorpay_order_id ||
    !razorpay_payment_id ||
    !razorpay_signature ||
    !Array.isArray(courses) ||
    courses.length === 0 ||
    !userId
  ) {
    return res.status(400).json({ success: false, message: "Payment verification payload is invalid" });
  }

  const body = `${razorpay_order_id}|${razorpay_payment_id}`;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(body)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return res.status(400).json({ success: false, message: "Invalid payment signature" });
  }

  try {
    await enrollStudents(courses, userId);

    const amountInPaise = await resolveOrderAmountInPaise(razorpay_order_id);
    if (amountInPaise) {
      const emailResult = await sendPaymentReceiptEmail({
        userId,
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        amountInPaise,
      });
      if (!emailResult.success) {
        console.warn("[verifyPayment] payment receipt email failed:", emailResult.error);
      }
    }

    return res.status(200).json({ success: true, message: "Payment verified and enrollment completed" });
  } catch (error) {
    console.error("[verifyPayment] enrollment error:", error);
    return res.status(500).json({ success: false, message: "Enrollment failed after payment verification" });
  }
};

// retained for compatibility with old frontend flow
exports.sendPaymentSuccessEmail = async (req, res) => {
  const { orderId, paymentId, amount } = req.body;
  const userId = req.user.id;

  if (!orderId || !paymentId || !userId) {
    return res.status(400).json({
      success: false,
      message: "Please provide orderId and paymentId",
    });
  }

  try {
    const amountInPaise = await resolveOrderAmountInPaise(orderId, amount);
    if (!amountInPaise) {
      return res.status(400).json({
        success: false,
        message: "Unable to determine payment amount",
      });
    }

    const emailResult = await sendPaymentReceiptEmail({
      userId,
      orderId,
      paymentId,
      amountInPaise,
    });

    if (!emailResult.success) {
      console.error("[sendPaymentSuccessEmail] email failed:", emailResult.error);
      return res.status(502).json({
        success: false,
        message: "Could not send payment confirmation email",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Payment confirmation email sent successfully",
    });
  } catch (error) {
    console.error("[sendPaymentSuccessEmail] error:", error);
    return res.status(500).json({
      success: false,
      message: "Could not send payment confirmation email",
    });
  }
};

// enroll student
const enrollStudents = async (courses, userId) => {
  if (!Array.isArray(courses) || courses.length === 0 || !userId) {
    throw new Error("Please provide valid course IDs and user ID");
  }

  const uidObj = new mongoose.Types.ObjectId(userId);

  for (const courseId of courses) {
    if (!isValidObjectId(courseId)) {
      throw new Error("Invalid course ID");
    }

    try {
      // Idempotency for payment retries/webhook retries.
      const alreadyEnrolled = await Course.exists({
        _id: courseId,
        studentsEnrolled: uidObj,
      });
      if (alreadyEnrolled) {
        continue;
      }

      const enrolledCourse = await Course.findOneAndUpdate(
        { _id: courseId },
        { $addToSet: { studentsEnrolled: uidObj } },
        { new: true }
      ).select("courseName");

      if (!enrolledCourse) {
        throw new Error("Course not found");
      }

      let courseProgress = await CourseProgress.findOne({
        courseID: courseId,
        userId: uidObj,
      });

      if (!courseProgress) {
        courseProgress = await CourseProgress.create({
          courseID: courseId,
          userId: uidObj,
          completedVideos: [],
        });
      }

      const enrolledStudent = await User.findByIdAndUpdate(
        userId,
        {
          $addToSet: {
            courses: courseId,
            courseProgress: courseProgress._id,
          },
        },
        { new: true }
      ).select("firstName lastName email");

      if (!enrolledStudent) {
        throw new Error("User not found");
      }

      try {
        const mailResponse = await mailSender(
          enrolledStudent.email,
          `Successfully enrolled in ${enrolledCourse.courseName}`,
          courseEnrollmentEmail(
            enrolledCourse.courseName,
            `${enrolledStudent.firstName || ""} ${enrolledStudent.lastName || ""}`.trim()
          )
        );

        if (!mailResponse.success) {
          console.warn(
            "[enrollStudents] enrollment email failed, enrollment still successful:",
            mailResponse.error
          );
        }
      } catch (emailError) {
        console.warn(
          "[enrollStudents] enrollment email exception, enrollment still successful:",
          emailError
        );
      }
    } catch (error) {
      console.error("[enrollStudents] error:", error);
      throw new Error(error.message || "Error while enrolling student");
    }
  }
};
