import React, { useEffect, useState } from 'react'
import { Swiper } from 'swiper/react'
import { SwiperSlide } from 'swiper/react'
import "swiper/css"
import "swiper/css/free-mode"
import "swiper/css/pagination"
import {Autoplay, FreeMode , Pagination} from "swiper";
import { apiConnector } from '../../services/apiconnector';
import {ratingsEndpoints} from "../../services/apis";
import ReactStars from "react-rating-stars-component";
import { FaStar } from 'react-icons/fa'

const ReviewSlider = () => {

    const [reviews , setReviews] = useState([]);
    const truncateWords = 15;

    useEffect(() => {
        const fetchAllReviews = async() =>{
            const {data} =  await apiConnector(
                "GET" ,
                ratingsEndpoints.REVIEWS_DETAILS_API
            )

           if(data?.success){
            setReviews(data?.data)
           }
        }
        fetchAllReviews();
    },[])

  return (
    <div className=' text-white '>
        <div className=' my-[50px] h-[184px] max-w-maxContentTab lg:max-w-maxContent'>
            <Swiper
                slidesPerView={3}
                spaceBetween={24}
                loop={true}
                freeMode={true}
                autoplay={
                    {delay:1500, disableOnInteraction:false}
                }
                modules={[FreeMode,Autoplay, Pagination]}
                className='w-full '
            >
                {
                    reviews.map((review , index) =>(
                        <SwiperSlide key={index} className='flex flex-col gap-3  p-3 bg-richblack-800 rounded-lg'>
                            <div className=' flex gap-4 items-center '>
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
                                    <h1 className=' text-richblack-25 font-semibold'>{review?.user?.firstName} {review?.user?.lastName}</h1>
                                    <p className=' text-sm font-semibold text-richblack-600'>{review?.user?.email}</p>
                                </div>
                            </div>
                            <p className=' text-caribbeangreen-400'>{review?.course?.courseName}</p>
                            <p className=' text-richblack-100'>
                                {review?.review.split(" ").length>
                                truncateWords
                                ? `${review.review
                                    .split(" ")
                                    .slice(0, truncateWords)
                                    .join(" ")} ...`
                                    : `${review.review}`}
                            </p>
                            <div className=' flex items-center gap-3'>
                                <h3 className='text-[20px] text-yellow-100'>
                                    {review?.rating.toFixed(1)} 
                                </h3>
                                <ReactStars 
                                    count={5}
                                    value={review?.rating}
                                    size={24}
                                    edit={false}
                                    activeColor="#ffd700"
                                    emptyIcon={<FaStar />}
                                    fullIcon={<FaStar />}
                                />
                            </div>
                        </SwiperSlide>
                    ))
                }
            
            </Swiper>
        </div>
    </div>
  )
}

export default ReviewSlider