const mongoose = require('mongoose');

const coursesSchema = new mongoose.Schema(
  {
    courseName: String,
    courseDescription: String,
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    whatYouWillLearn: String,
    courseContent: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Section"
      }
    ],
    ratingAndReview: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "RatingAndReview"
      }
    ],
    price: Number,
    thumbnail: String,
    tag: [String],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category"
    },
    studentsEnrolled: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    instructions: [String],
    status: {
      type: String,
      enum: ["Draft", "Published"]
    }
  },
  {
    timestamps: true
  }
)


module.exports = mongoose.model("Course" , coursesSchema);