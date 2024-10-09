const mongoose = require('mongoose');


const userSchema = new mongoose.Schema(
    {

        firstName:{
            type:String,
            required:true,
            trim:true,
        },
        lastName:{
            type:String,
            required:true,
            trim:true,
        },
        email:{
            type:String,
            required:true,
            trim:true,
        },
        password:{
            type:String,
            required:true,
        },
        accountType:{
            type:String,
            enum:["Admin","Student","Instructor"],
            require:true,
        },
        active:{
            type:Boolean,
            default: true,
        },
        additionalDetails:{
            type:mongoose.Schema.Types.ObjectId,
            require:true,
            ref:"Profile",
        },
        courses:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"Course",
            }
        ],
        token:{
            type:String,
        },
        resetPasswordExpires:{
            type:Date,
        },
        image:{
            type:String,
            require:true,

        },
        courseProgress: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "courseProgress",
			},
		],
    },
    {
        timestamps:true,
    }
);

module.exports = mongoose.model("User" , userSchema);