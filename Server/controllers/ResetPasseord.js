
const User = require('../models/User');
const mailSender = require('../utils/mailSender');
const bcrypt = require('bcrypt')
const crypto = require('crypto');

//resetPasswordToken

exports.resetPasswordToken = async (req, res)=>{
    try{
        // get email from req ki body
        const {email} = req.body;
        // check user for this email , email velidation
        const user = await User.findOne({email:email});
        if(!user){
            return res.status(400).json({
                success:false,
                message: `This Email :${email} is not Registered With Us Enter a Valid Email`,
            });
        }
        // generate token
        const token = crypto.randomBytes(20).toString("hex");
        // update user by adding token expiration time
        const updatedDetails = await User.findOneAndUpdate(
            {email:email},
            {
                token:token,
                resetPasswordExpires:Date.now() + 3 * 60
            },
            {new:true}
        )
        console.log("DETAILS" , updatedDetails);
        // create url
        const url =`http://study-notion-ashwin40.vercel.app/update-password/${token}`;

        // send main containing the url
        await mailSender(
            email,
            "Reset Your Password - Action Required",
            `Dear User,
            We received a request to reset your password. Please click the link below to proceed:

            Password Reset Link: 
            
                ${url} 
            
            If you did not request this, you can safely ignore this email.

            Thanks & Regards,
            Your Support Team`  
        );
        //return res
        return res.status(200).json({
            success:true,
            message: "Password reset link sent to your email.",
        })
    }catch(error){
        console.log(error);
        return res.status(401).json({
            success:false,
            message: "Something went wrong while reset your Password. Please try again later."
        })
    }
}

// resetPassword 
exports.resetPassword = async (req , res) =>{
    try{
        // fetch data
        const {password , confirmPassword , token} = req.body;
        //velidation
        if(password !== confirmPassword ){
            return res.json({
                success:false,
                message: "Password and Confirm Password does not match.",
            })
        }
        // get user details from db using token
        const userDetails = await User.findOne({token:token});
       // if no entry -- token invalid
        if(!userDetails){
            return res.json({
                success:false,
                message: "Invalid Token. Please try again later.",
            });
        };
        // token time
        if(!(userDetails.resetPasswordExpires < Date.now())){
            return res.status(403).json({
                success:false,
                message: "Token expired. Please regenerate Token.",
            })
        }
        // hash password
        const encryptedPassword = await bcrypt.hash(password , 10);
        // update password
        await User.findOneAndUpdate(
            {token:token},
            {password:encryptedPassword},
            {new:true},
        );
        // return res
        return res.status(200).json({
            success:true,
            message: "Password reset successfully.",
        });
    }
    catch(error){
        console.log(error);
        return res.status(401).json({
            success:false,
            message: "Something went wrong. Please try again later.",
        })
    }
}