import React from "react";
import { useDispatch, useSelector } from "react-redux";
import ReactStars from "react-rating-stars-component";
import { MdDelete } from "react-icons/md";
import { FaStar, FaRegStar } from "react-icons/fa";
import { removeFromCart } from "../../../../slices/cartSlice";

export default function RenderCartCourses() {
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  if (!cart?.length) return null;

  return (
    <div className="flex flex-1 flex-col gap-4">
      {cart.map((course, index) => {
        const ratingCount = course?.ratingAndReview?.length || 0;

        return (
          <div
            key={course._id}
            className={`
              flex flex-col xl:flex-row w-full items-start justify-between
              gap-4 xl:gap-6 pb-4
              ${index !== cart.length - 1 ? "border-b border-white/15" : ""}
            `}
          >
            {/* Left: Thumbnail + info */}
            <div className="flex flex-col sm:flex-row flex-1 gap-4">
              <img
                src={course?.thumbnail}
                alt={course?.courseName}
                className="
                  h-32 w-full sm:w-48 
                  rounded-xl object-cover 
                  shadow-[0_6px_18px_rgba(0,0,0,0.5)]
                "
              />

              <div className="flex flex-col gap-1">
                <p className="text-base sm:text-lg font-semibold text-white">
                  {course?.courseName}
                </p>

                <p className="text-xs sm:text-sm text-white/75">
                  {course?.category?.name || "Uncategorized"}
                </p>

                {/* Rating */}
                <div className="mt-1">
                  {ratingCount > 0 ? (
                    <div className="flex items-center gap-2">
                      <ReactStars
                        count={5}
                        value={Math.min(ratingCount, 5)} // temp: using count as value if you don't have avg
                        size={18}
                        edit={false}
                        activeColor="#facc15"
                        emptyIcon={<FaRegStar />}
                        fullIcon={<FaStar />}
                      />
                      <span className="text-[11px] text-white/70">
                        {ratingCount} rating{ratingCount > 1 ? "s" : ""}
                      </span>
                    </div>
                  ) : (
                    <span className="text-[11px] text-white/60">
                      No ratings yet
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Remove + Price */}
            <div className="flex flex-row xl:flex-col items-center xl:items-end gap-3 xl:gap-2 w-full xl:w-auto justify-between">
              <button
                onClick={() => dispatch(removeFromCart(course._id))}
                className="
                  flex items-center gap-1.5
                  rounded-full px-3.5 py-1.5 text-xs font-medium
                  border border-red-400/60
                  bg-red-500/15 text-red-200
                  hover:bg-red-500/25 hover:border-red-300
                  transition-all
                "
              >
                <MdDelete className="text-sm" />
                <span>Remove</span>
              </button>

              <p className="text-xl sm:text-2xl font-semibold text-white">
                ₹ {course?.price}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
