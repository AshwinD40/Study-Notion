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
    <div>
        <Link to={`/courses/${course._id}`}>
            <div className=' flex flex-col gap-3'>
                <div>
                    <img 
                        src={course?.thumbnail}
                        alt='course Thumbnail'
                        className={`${Height} w-[450px] rounded-xl object-cover`}
                    />
                </div>
                <div className='flex flex-col gap-1'>
                    <p>{course?.courseName}</p>
                    <p>{course?.instructor?.firstName} {course?.instructor?.lastName}</p>
                    <div className=' flex gap-x-3'>
                        <span className=' text-yellow-100'>{avgReviewCount || 4.5}</span>
                        <RatingStars Review_Count={avgReviewCount}/>
                        <span className=' text-sm text-richblack-400'>{course?.ratingAndReview?.length}(Review Count)</span>
                    </div>
                    <p className=' font-bold'>Rs. {course?.price} </p>
                </div>
            </div>
        </Link>
    </div>
  )
}

export default Course_Card