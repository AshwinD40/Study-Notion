import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import RatingStars from "../../../shared/components/RatingStars";
import GetAvgRating from "../../../utils/avgRating";

const Course_Card = ({ course }) => {
  const [avgReviewCount, setAvgReviewCount] = useState(0);

  useEffect(() => {
    const count = GetAvgRating(course?.ratingAndReview);
    setAvgReviewCount(count);
  }, [course]);

  if (!course) return null;

  const instructorName =
    `${course?.instructor?.firstName || ""} ${course?.instructor?.lastName || ""}`.trim() ||
    "Instructor";

  const ratingCount = course?.ratingAndReview?.length || 0;
  const categoryName = course?.category?.name || "";

  return (
    <Link
      to={`/courses/${course?._id}`}
      className="group flex flex-col justify-between rounded-2xl border border-white/10 bg-richblack-800/40 p-3.5 transition-all duration-200 hover:border-white/20 hover:bg-richblack-800/70 hover:shadow-xl hover:shadow-black/30"
    >
      <div>
        {/* Course Thumbnail */}
        <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-richblack-900 border border-white/5">
          {course?.thumbnail ? (
            <img
              src={course.thumbnail}
              alt={course?.courseName || "Course thumbnail"}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-richblack-400">
              No Preview
            </div>
          )}

          {categoryName && (
            <span className="absolute top-2.5 left-2.5 rounded-full border border-white/10 bg-richblack-900/80 px-2.5 py-0.5 text-[11px] font-medium text-richblack-200 backdrop-blur-sm">
              {categoryName}
            </span>
          )}
        </div>

        {/* Info */}
        <div className="pt-3 pb-2 space-y-1.5">
          <h3 className="text-base font-semibold text-white group-hover:text-yellow-50 transition line-clamp-1">
            {course?.courseName}
          </h3>

          <p className="text-xs text-richblack-300 line-clamp-1">
            By <span className="text-richblack-200">{instructorName}</span>
          </p>

          {/* Ratings */}
          <div className="flex items-center gap-2 pt-0.5">
            <span className="text-xs font-semibold text-yellow-50">
              {Number(avgReviewCount || 0).toFixed(1)}
            </span>
            <RatingStars Review_Count={avgReviewCount} Star_Size={14} />
            <span className="text-[11px] text-richblack-400">
              ({ratingCount} {ratingCount === 1 ? "review" : "reviews"})
            </span>
          </div>
        </div>
      </div>

      {/* Footer / Price & Action */}
      <div className="flex items-center justify-between border-t border-white/5 pt-3 mt-1">
        <span className="text-base font-bold text-white">
          ₹{Number(course?.price || 0).toLocaleString("en-IN")}
        </span>

        <span className="flex items-center gap-1 text-xs font-medium text-richblack-300 group-hover:text-yellow-50 transition-colors">
          View details
          <FiArrowRight className="text-xs transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
};

export default Course_Card;