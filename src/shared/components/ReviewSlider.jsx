import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import { FaStar } from "react-icons/fa";
import { VscCheck } from "react-icons/vsc";
import { apiConnector } from "../api/client";
import { ratingsEndpoints } from "../api/endpoints";

const ReviewSlider = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const { data } = await apiConnector(
          "GET",
          ratingsEndpoints.REVIEWS_DETAILS_API
        );
        if (data?.success && Array.isArray(data?.data)) {
          setReviews(data.data);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex h-36 w-full items-center justify-center text-xs text-richblack-400">
        Loading reviews...
      </div>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className="flex h-36 w-full items-center justify-center rounded-2xl border border-white/10 bg-richblack-800/20 text-xs text-richblack-400">
        No reviews yet. Be the first learner to leave a review!
      </div>
    );
  }

  return (
    <div className="w-full">
      <Swiper
        slidesPerView={1}
        spaceBetween={20}
        loop={reviews.length > 3}
        freeMode={true}
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        modules={[FreeMode, Autoplay, Pagination]}
        className="w-full !py-2"
        breakpoints={{
          640: { slidesPerView: 2, spaceBetween: 20 },
          1024: { slidesPerView: 3, spaceBetween: 24 },
          1280: { slidesPerView: 4, spaceBetween: 24 },
        }}
      >
        {reviews.map((item, index) => {
          const firstName = item?.user?.firstName || "Student";
          const lastName = item?.user?.lastName || "";
          const fullName = `${firstName} ${lastName}`.trim();
          const avatarUrl =
            item?.user?.image ||
            `https://api.dicebear.com/5.x/initials/svg?seed=${encodeURIComponent(
              fullName
            )}`;
          const courseName =
            item?.course?.courseName || "Enrolled Course";
          const ratingVal = Number(item?.rating) || 5;
          const reviewText = item?.review || "";

          return (
            <SwiperSlide key={index} className="!h-auto">
              <div className="group flex h-[190px] flex-col justify-between rounded-2xl border border-white/10 bg-richblack-800/40 p-5 backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-richblack-800/70 hover:shadow-xl hover:shadow-black/30">
                {/* Header: User details */}
                <div className="flex items-center gap-3">
                  <img
                    src={avatarUrl}
                    alt={fullName}
                    className="h-10 w-10 shrink-0 rounded-full border border-white/10 object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <h4 className="truncate text-sm font-semibold tracking-tight text-white group-hover:text-richblack-5">
                      {fullName}
                    </h4>
                    <p className="truncate text-xs font-medium text-cyan-400/90">
                      {courseName}
                    </p>
                  </div>
                </div>

                {/* Review body */}
                <p className="line-clamp-3 text-xs sm:text-[13px] leading-relaxed text-richblack-200">
                  “{reviewText}”
                </p>

                {/* Footer: Rating stars & verified pill */}
                <div className="flex items-center justify-between border-t border-white/5 pt-3">
                  <div className="flex items-center gap-1.5">
                    <div className="flex items-center gap-0.5 text-yellow-50">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar
                          key={star}
                          className={`text-xs ${
                            star <= Math.round(ratingVal)
                              ? "text-yellow-50"
                              : "text-richblack-600"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-semibold text-white">
                      {ratingVal.toFixed(1)}
                    </span>
                  </div>

                  <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] px-2 py-0.5 text-[10px] font-medium text-richblack-300">
                    <VscCheck className="text-cyan-400" />
                    Verified
                  </span>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default ReviewSlider;
