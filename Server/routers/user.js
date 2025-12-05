const express = require('express');
const router = express.Router()

const {
    signUp,
    login,
    sendotp,
    changedPassword,
} = require("../controllers/Auth");

const {
    resetPasswordToken,
    resetPassword,
} = require("../controllers/ResetPasseord")

const {auth} = require("../middlewares/auth");

// Router for login SIgnUp , and Authentication

// ***************************************************************
//                  Authentication Route
// ***************************************************************

// route for signUp
router.post('/signup', signUp);

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