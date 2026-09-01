const express = require('express');
const router = express.Router()

const { 
  signup, 
  login, 
  sendotp, 
  changedPassword,  
} = require('../controllers/Auth');

const {
  resetPassword,
  resetPasswordToken
} = require('../controllers/ResetPassword')


const { auth } = require('../middlewares/auth')
const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10
});

const otpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5
});

const resetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5
});

//                  Authentication Route
// ***************************************************************

// route for signUp
router.post('/signup', authLimiter, signup);


// router for login
router.post('/login', authLimiter, login);

// router for sendotp
router.post('/sendotp', otpLimiter, sendotp);

// router for change password
router.post('/changePassword', auth, changedPassword);

// ********************************************************************
//                      Reset Password
// ********************************************************************

// router for generating a reset password token
router.post('/reset-password-token', resetLimiter, resetPasswordToken);
// router for resseting user password
router.post('/reset-password', resetPassword);

module.exports = router