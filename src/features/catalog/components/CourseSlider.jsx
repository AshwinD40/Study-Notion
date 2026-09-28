import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";

import CourseCard from "./Course_Card";

const CourseSlider = ({ Courses }) => {
  if (!Courses || Courses.length === 0) {
    return (
      <div className="flex h-36 w-full items-center justify-center rounded-2xl border border-white/5 bg-richblack-800/20 text-xs text-richblack-400">
        No courses available yet in this section.
      </div>
    );
  }

  // If 3 or fewer courses, display directly in a responsive grid for perfect alignment
  if (Courses.length <= 3) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Courses.map((course, index) => (
          <CourseCard course={course} key={course?._id || index} />
        ))}
      </div>
    );
  }

  return (
    <Swiper
      slidesPerView={1}
      spaceBetween={24}
      loop={Courses.length >= 4}
      modules={[Pagination, FreeMode]}
      breakpoints={{
        640: {
          slidesPerView: 2,
          spaceBetween: 20,
        },
        1024: {
          slidesPerView: 3,
          spaceBetween: 24,
        },
      }}
      className="w-full !py-2"
    >
      {Courses.map((course, index) => (
        <SwiperSlide key={course?._id || index} className="!h-auto">
          <CourseCard course={course} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default CourseSlider;