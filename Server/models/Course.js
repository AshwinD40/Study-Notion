const mongoose = require('mongoose');

const coursesSchema = new mongoose.Schema({

    courseName:{type:String,},
    courseDescription:{type:String,},
    instructor:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User',
    },
    whatYouWillLearn:{
        type:String,
    },
    courseContent:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Section'
        },
    ],
    ratingAndReview:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'RatingAndReview',
        }
    ],
    price:{
        type:Number,
    },
    thumbnail:{
        type:String,
    },
    tag:{
        type:[String],
        required:true,
    },
    createdAt:{
        type:Date,
         
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        // required:true,
        ref:'Category',
    },
    studentsEnrolled:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            required:true,
        },
    ],
    instructions:{
        type:[String],
        
    },
    status:{
        type:String,
        enum: ["Draft", "Published"]
    }

 
})

module.exports = mongoose.model("Course" , coursesSchema);