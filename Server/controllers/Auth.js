const User = require('../models/User');
const OTP = require('../models/OTP');
const otpGenerator = require('otp-generator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); 
const mailSender = require('../utils/mailSender');
const { passwordUpdated } = require('../mail/template/passwordUpdate');
const Profile = require('../models/Profile');
require('dotenv').config();

// OTP send
exports.sendotp = async (req, res) => {

    try{   
            // fetch email from req.bod
            const {email} = req.body;

            // check if user already exist
            const checkUserPresent = await User.findOne({email});

            // if user found with provided email
            if(checkUserPresent){
                return res.status(401).json({
                    success:false,
                    message: 'User already exist',
                });
            }
            
            // generate OTP
            var otp = otpGenerator.generate(6, { 
                upperCaseAlphabets: false, 
                lowerCaseAlphabets: false,
                specialChars: false,
            });
            const result =await OTP.findOne({otp:otp});
            console.log("Result is generate OTP Func")
            console.log("OTP" ,otp);
            console.log("Result", result);

            while(result){
                otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false, 
                });
            }
            // save otp in db
            const otpPayload = {email,otp};
            const otpBody = await OTP.create(otpPayload);
            console.log("OTP Body",otpBody); 

            res.status(200).json({
                success:true,
                message:"OTP sent Successfully ",
                otp,
            })
    }
    catch(error){
            console.log(error);
            return res.status(500).json({
                success:false,
                message:error.message,
            })
    }
    
   
}

// signUp handler
exports.signUp = async (req , res) =>{
    try{
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
        if(
            !firstName || 
            !lastName || 
            !email  || 
            !password || 
            !confirmPassword || 
            !otp
        ) {
            return res.status(403).json({
                success:false,
                message:"Please fill all the fields",
            })
        }

        // match password
        if(password !== confirmPassword){
            return res.status(400).json({
                success:false,
                message:"Password does not match",
            })
        }


        // check user already exist or not
        const existinUser = await User.findOne({email});
        if(existinUser){
            return res.status(400).json({
                success:false,
                message:"User already exist",
            })
        }

        // find most recent otp for user
        const recentOtp = await OTP.find({email}).sort({createdAt: -1}).limit(1);
        console.log(recentOtp);

        // validate otp
        if(recentOtp.length == 0){
            return res.status(400).json({
                success:false,
                message:"OTP not found",
            })
        }else if(otp !== recentOtp[0].otp){
            return res.status(400).json({
                success:false,
                message:"Please enter valid otp",
            })
        }
 

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // create the user
        let approved = "";
        approved === "Instructor" ? (approved = false) : (approved = true);

        // create the Additional profile for user
        const profileDetails = await Profile.create({
            gender:null,
            dateOfBirth:null,
            about:null,
            contactNumber:null,
        })

        // create entry in DB
        const user = await User.create({
            firstName,
            lastName,
            email,
            contactNumber,
            password:hashedPassword,
            accountType:accountType,
            approved:approved,
            additionalDetails:profileDetails._id,
            image:`https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,

        })

        // return res
        return res.status(200).json({
            success:true,
            message:"User created successfully",
            user,
        })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Something went wrong , User cannot registerd",
        })    
    }
}

// Login Handler
exports.login = async (req, res) =>{
    try{

        // fetch data from req ki body
        const {email, password} = req.body;

        // validation of data
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:"Please enter all the fields",
            })
        }

        // check user exist or not
        const user = await User.findOne({email}).lean().populate("additionalDetails");
        if(!user){
            return res.status(401).json({
                success:false,
                message:"User does not exist,please signUp",
            })
        }

        //generate JWT after  match password
        if(await bcrypt.compare(password , user.password )){

            const payload = {
                email:user.email,
                id:user._id,
                accountType:user.accountType,
            }
            const token = jwt.sign(payload , process.env.JWT_SECRET,{
                expiresIn:"24h"
            });
            // save token to user document in db
            user.token = token;
            user.password = undefined;
        

            // create cookie and send res
            const options = {
                expiresIn:new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 ),
                httpOnly:true
            }
            res.cookie("token", token, options).status(200).json({
                success:true,
                token,
                user,
                message:"Loged In successfully"
            })

        }
        else{
            return res.status(401).json({
                success:false,
                message:"Password is incorrect",
            })
        }
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Something went wrong ,Please try again later",
        })
    }
}

// Change password
exports.changedPassword = async (req, res) => {

    try{
        // get user details
        const userDetails = await User.findById(req.user.id);

        // get data from req.body
        const {oldPassword, newPassword } = req.body


        // validation
        const isPasswordMatch = await bcrypt.compare(
            oldPassword,
            userDetails.password
        )
        if(!isPasswordMatch){
            // if old password does not match , return 401(unauthorized)
            return res.status(401).json({
                success:false,
                message:"Old password is incorrect",
            })
        }
    
        // update password 
        const encryptedPassword = await bcrypt.hash(newPassword, 10);
        const updatedUserDetails = await User.findByIdAndUpdate(
            req.user.id,
            {password:encryptedPassword},
            {new:true}
        )

        // send mail - password Updated successfully
        
        try{
            const emailResponse = await mailSender(
                updatedUserDetails.email , 
                "Your Password has been updated successfully",
                passwordUpdated(
                    updatedUserDetails.email,
                    `Hello ${updatedUserDetails.firstName} ${updatedUserDetails.lastName},
                    <br><br>
                    Your password has been changed successfully. If you did not perform this action, please contact our support team immediately.
                    <br><br>
                    Regards,<br>Team Support`
                )
                
            )
            console.log("Password updated email send:",emailResponse.response);

            }catch(error){
                console.error("Failed to send Password change email",error)
                return res.status(500).jaon({
                    success:false,
                    message:"Failed to send change password mail to user",
                    error:error.message
                })
                
            }
        // return success res
        return res.status(200).json({
            success:true,
            message:"password updated successfully",
        })
    }
    catch(error){
        console.log("Error occurred while updating password" ,error);
        return res.status(500).json({
            success:false,
            message:"something went wrong while updating password",
            error:error.message
        });
    };

};
