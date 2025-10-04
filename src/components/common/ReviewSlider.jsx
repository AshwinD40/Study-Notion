import React, { useEffect, useState } from 'react'
import ReactStars from "react-rating-stars-component";
import { Swiper, SwiperSlide } from 'swiper/react'
import "swiper/css"
import "swiper/css/free-mode"
import "swiper/css/pagination"
import "../../App.css"
import { FaStar } from 'react-icons/fa'
import {Autoplay, FreeMode , Pagination} from "swiper";
import { apiConnector } from '../../services/apiconnector';
import {ratingsEndpoints} from "../../services/apis";

const ReviewSlider = () => {

  const [reviews , setReviews] = useState([]);
  const truncateWords = 15;

  useEffect(() => {
    ;(async () => {
      const { data } = await apiConnector(
        "GET",
        ratingsEndpoints.REVIEWS_DETAILS_API
      )
      if (data?.success) {
        setReviews(data?.data)
      }
    })()
  },[])

  return (
    <div className=' text-white '>
      <div className=' my-[50px] h-[184px] max-w-maxContentTab lg:max-w-maxContent   '>
        <Swiper
          slidesPerView={3}
          spaceBetween={25}
          loop={true}
          freeMode={true}
          autoplay={{
            delay:2500, 
            disableOnInteraction:false
          }}
          modules={[FreeMode,Autoplay, Pagination]}
          className='w-full  '
          breakpoints={{
            //when window width is >= 200px (mobile)
            200: {
              slidesPerView: 1,
            },
            // when window width is >= 320px (mobile)
            450: {
              slidesPerView: 2,
            },
            // when window width is >= 640px (small tablets)
            640: {
              slidesPerView: 2,
            },
            // when window width is >= 768px (tablets)
            768: {
              slidesPerView: 2,
            },
            // when window width is >= 1024px (laptops)
            1024: {
              slidesPerView: 3,
            },
            // when window width is >= 1280px (large screens)
            1280: {
              slidesPerView: 4,
            },
          }}
        >
        {reviews.map((review , index) =>{
          return (
          <SwiperSlide key={index} >
            <div className=' flex flex-col gap-3 rounded-lg bg-richblack-800 p-3 text-[14px] text-richblack-25 '>
              <div className=' flex items-center gap-4'>
                <img  
                  src = {review?.user?.image 
                    ? review?.user?.image 
                    : `https://api.dicebear.com/5.x/initials/svg?seed=${review.user.firstName} 
                    ${review.user.lastName}`
                  }
                  alt=' Profile'
                  className=' h-9 w-9 rounded-full object-cover'
                />
                <div className=' flex flex-col'>
                  <h1 className=' text-richblack-5 font-semibold'>{review.user.firstName} {review.user.lastName}</h1>
                  <h2 className=' text-[12px] font-medium text-richblack-500'>{review?.course?.courseName}</h2>
                </div>
              </div>  
              <p className=' font-medium text-richblack-25'>
                {review?.review.split(" ").length>
                truncateWords
                ? `${review.review
                  .split(" ")
                  .slice(0, truncateWords)
                  .join(" ")} ...`
                : `${review.review}`}
              </p>
              <div className=' flex items-center gap-2'>
                <h3 className=' font-semibold text-yellow-100'>
                  {review?.rating.toFixed(1)} 
                </h3>
                <ReactStars 
                  count={5}
                  value={review?.rating}
                  size={20}
                  edit={false}
                  activeColor="#ffd700"
                  emptyIcon={<FaStar />}
                  fullIcon={<FaStar />}
                  />
              </div>
            </div>   
          </SwiperSlide>
          )
        })}
    
        </Swiper>
      </div>
    </div>
  )
}

export default ReviewSlider