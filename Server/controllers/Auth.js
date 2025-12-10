const User = require('../models/User');
const OTP = require('../models/OTP');
const otpGenerator = require('otp-generator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mailSender = require('../utils/mailSender');
const { passwordUpdated } = require('../mail/template/passwordUpdate');
const Profile = require('../models/Profile');
require('dotenv').config();

// signUp handler
exports.signup = async (req, res) => {
  try {
    // fetch data fron req ki body
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
      contactNumber,
      otp,
    } = req.body;

    // validate  data
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !otp
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the fields",
      })
    }

    // match password
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password does not match",
      })
    }


    // check user already exist or not
    const existinUser = await User.findOne({ email });
    if (existinUser) {
      return res.status(400).json({
        success: false,
        message: "User already exist",
      })
    }

    // find most recent otp for user
    const recentOtpDoc = await OTP.findOne({ email, used: false }).sort({ createdAt: -1 });

    // validate otp
    if (!recentOtpDoc) {
      return res.status(400).json({
        success: false,
        message: "OTP not found",
      })
    }
    if (recentOtpDoc.expiresAt && recentOtpDoc.expiresAt < new Date()) {
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      })
    }

    if (recentOtpDoc.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      })
    }

    recentOtpDoc.used = true;
    await recentOtpDoc.save();

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create the user
    let approved = true;
    if (accountType === "Instructor") approved = false;

    // create the Additional profile for user
    const profileDetails = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber: null,
    })

    // create entry in DB
    const user = await User.create({
      firstName,
      lastName,
      email,
      contactNumber,
      password: hashedPassword,
      accountType,
      approved,
      additionalDetails: profileDetails._id,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
    })

    // return res
    return res.status(200).json({
      success: true,
      message: "User created successfully",
      user,
    })
  }
  catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong , User cannot registerd",
    })
  }
}

// Login Handler
exports.login = async (req, res) => {
  try {
    // fetch data from req ki body
    const { email, password } = req.body;

    // validation of data
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please enter all the fields",
      })
    }

    // check user exist or not
    const user = await User.findOne({ email }).populate("additionalDetails");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User does not exist,please signUp",
      })
    }
    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      return res.status(401).json({
        success: false,
        message: "Password is incorrect",
      })
    }

    const payload = {
      email: user.email,
      id: user._id,
      accountType: user.accountType,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    const safeUser = user.toObject();
    safeUser.password = undefined;

    const cookieOptions = {
      expiresIn: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    }

    res.cookie("token", token, cookieOptions).status(200).json({
      success: true,
      token,
      user: safeUser,
      message: "Loged In successfully",
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong ,Please try again later",
    })
  }
}

// Send OTP For Email Verification
exports.sendotp = async (req, res) => {
  try {
    const { email } = req.body;

    const checkUserPresent = await User.findOne({ email });
    if (checkUserPresent) {
      return res.status(401).json({
        success: false,
        message: "User is Already Registered",
      });
    }

    let otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    // ensure OTP not duplicated (basic, but fine)
    let existing = await OTP.findOne({ otp });
    while (existing) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      existing = await OTP.findOne({ otp });
    }

    const otpBody = await OTP.create({
      email,
      otp,
      used: false,
      // if your schema has timestamps, fine; else add expiresAt here if needed
    });

    console.log("OTP created:", otpBody);

    // email handled by OTP model pre-save hook

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      // don’t send otp back in prod; keep it only in email
      // otp,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: "Could not send OTP",
      error: error.message,
    });
  }
};

// Change password
exports.changedPassword = async (req, res) => {
  try {
    const userDetails = await User.findById(req.user.id);
    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const { oldPassword, newPassword } = req.body;

    const isPasswordMatch = await bcrypt.compare(
      oldPassword,
      userDetails.password
    );
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Old password is incorrect",
      });
    }

    const encryptedPassword = await bcrypt.hash(newPassword, 10);
    const updatedUserDetails = await User.findByIdAndUpdate(
      req.user.id,
      { password: encryptedPassword },
      { new: true }
    );

    // fire email, but don't fail password update just because email fails
    try {
      const html = passwordUpdated(
        updatedUserDetails.email,
        `Hello ${updatedUserDetails.firstName} ${updatedUserDetails.lastName},
        <br><br>
        Your password has been changed successfully. If you did not perform this action, please contact our support team immediately.
        <br><br>
        Regards,<br>Team Support`
      );

      const emailResponse = await mailSender(
        updatedUserDetails.email,
        "Your password has been updated successfully",
        html
      );

      if (!emailResponse.success) {
        console.error("Password update email failed:", emailResponse.error);
        // but don't throw; password is already changed
      } else {
        console.log("Password updated email sent:", emailResponse.info.messageId);
      }
    } catch (err) {
      console.error("Error while sending password update email:", err);
      // again, don't break the main flow
    }

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.log("Error occurred while updating password", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while updating password",
      error: error.message,
    });
  }
};

