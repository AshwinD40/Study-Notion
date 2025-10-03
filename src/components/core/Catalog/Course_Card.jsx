import React, { useEffect, useState } from 'react'
import RatingStars from "../../common/RatingStars"
import GetAvgRating from '../../../utils/avgRating';
import { Link } from 'react-router-dom';

const Course_Card = ({course, Height}) => {

    const [avgReviewCount , setAvgReviewCount] = useState(0);

    useEffect( () => {
        const count = GetAvgRating(course.ratingAndReview);
        setAvgReviewCount(count);
    },[course])


  return (
  <>
    <Link to={`/courses/${course._id}`}>
      <div className=''>
        <div className="rounded-lg">
          <img 
            src={course?.thumbnail}
            alt='course Thumbnail'
            className={`${Height} w-[450px] rounded-xl object-cover`}
          />
        </div>
        <div className='flex flex-col gap-1 px-1 py-3"'>
          <p  className="text-xl text-richblack-5">{course?.courseName}</p>
          <p className="text-sm text-richblack-50">{course?.instructor?.firstName} {course?.instructor?.lastName}</p>
          <div className=' flex items-center gap-3'>
            <span className=' text-yellow-100'>{avgReviewCount || 0}</span>
            <RatingStars Review_Count={avgReviewCount}/>
            <span className=' text-richblack-400'>{course?.ratingAndReview?.length} Ratings</span>
          </div>
          <p className="text-xl text-richblack-5">Rs. {course?.price} </p>
        </div>
      </div>
    </Link>
  </>
  )
}

export default Course_Card