import React, { useEffect, useState } from "react";
import ReactStars from "react-rating-stars-component";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import "../../App.css";
import { FaStar, FaRegStar } from "react-icons/fa";
import { Autoplay, FreeMode, Pagination } from "swiper";
import { apiConnector } from "../../services/apiconnector";
import { ratingsEndpoints } from "../../services/apis";

const ReviewSlider = () => {
  const [reviews, setReviews] = useState([]);
  const truncateWords = 15;

  useEffect(() => {
    (async () => {
      const { data } = await apiConnector(
        "GET",
        ratingsEndpoints.REVIEWS_DETAILS_API
      );
      if (data?.success) {
        setReviews(data?.data);
      }
    })();
  }, []);

  return (
    <div className="text-white flex justify-center">
      <div className="my-12 w-full max-w-maxContentTab lg:max-w-maxContent">
        <Swiper
          slidesPerView={3}
          spaceBetween={25}
          loop={true}
          freeMode={true}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          modules={[FreeMode, Autoplay, Pagination]}
          className="w-full"
          breakpoints={{
            200: { slidesPerView: 1 },
            450: { slidesPerView: 2 },
            640: { slidesPerView: 2 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
          }}
        >
          {reviews.map((review, index) => (
            <SwiperSlide key={index}>
              <div
                className="
                  flex flex-col gap-3 
                  rounded-2xl 
                  bg-night-200/85 
                  border border-glass-300 
                  backdrop-blur-2xl 
                  p-4 
                  text-[13px] text-pure-greys-5 
                  
                  transition-all
                "
              >
                {/* User + course */}
                <div className="flex items-center gap-3">
                  <img
                    src={
                      review?.user?.image
                        ? review?.user?.image
                        : `https://api.dicebear.com/5.x/initials/svg?seed=${review.user.firstName} ${review.user.lastName}`
                    }
                    alt="Profile"
                    className="h-9 w-9 rounded-full object-cover border border-glass-300"
                  />
                  <div className="flex flex-col">
                    <h1 className="text-[14px] font-semibold text-pure-greys-5">
                      {review.user.firstName} {review.user.lastName}
                    </h1>
                    <h2 className="text-[11px] font-medium text-pure-greys-200">
                      {review?.course?.courseName}
                    </h2>
                  </div>
                </div>

                {/* Review text */}
                <p className="font-medium text-pure-greys-25 leading-relaxed">
                  {review?.review.split(" ").length > truncateWords
                    ? `${review.review
                      .split(" ")
                      .slice(0, truncateWords)
                      .join(" ")} ...`
                    : `${review.review}`}
                </p>

                {/* Rating */}
                <div className="flex items-center gap-2 mt-1">
                  <h3 className="font-semibold text-yellow-50 text-[13px]">
                    {review?.rating?.toFixed(1)}
                  </h3>
                  <ReactStars
                    count={5}
                    value={review?.rating}
                    size={18}
                    edit={false}
                    activeColor="#FACC15"
                    emptyIcon={<FaRegStar />}
                    fullIcon={<FaStar />}
                  />
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default ReviewSlider;
