const mongoose = require('mongoose');
const mailSender = require('../utils/mailSender');
const emailTemplate = require('../mail/template/emailVerificationTemplate');

const OTPSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    otp:{
        type:String,
        unique:true,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        expires: 5*60,
    },
});

// a function that send email
async function sendVerificationEmail(email , otp){
    try{
        const mailResponse = await mailSender(
            email , 
            "Verification email from StudyNotion" , 
            emailTemplate(otp)
        );
        console.log("Email Send Successfully",mailResponse.response);
    }
    catch(error){
        console.log("error occured while sending email",error);
        throw error;
    }
}

OTPSchema.pre("save" , async function(next){
    console.log("New document saved to database");

    // only send an email when a new documnt is created
    if(this.isNew){
        await sendVerificationEmail(this.email , this.otp);
    }
    next();
})

const OTP = mongoose.model("OTP",OTPSchema)

module.exports = OTP;