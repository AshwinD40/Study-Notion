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

//                  Authentication Route
// ***************************************************************

// route for signUp
router.post('/signup', signup);


// router for login
router.post('/login', login);

// router for sendotp
router.post('/sendotp', sendotp);

// router for change password
router.post('/changePassword', auth, changedPassword);

// ********************************************************************
//                      Reset Password
// ********************************************************************

// router for generating a reset password token
router.post('/reset-password-token', resetPasswordToken);
// router for resseting user password
router.post('/reset-password', resetPassword);

module.exports = router