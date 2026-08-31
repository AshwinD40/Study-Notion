import React from "react";
import { useSelector } from "react-redux";
import RenderCartCourses from "./RenderCartCourses";
import RenderTotalAmount from "./RenderTotalAmount";

export default function Cart() {
  const { total, totalItems } = useSelector((state) => state.cart);

  const hasItems = total > 0;

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-0">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-6">
        <div>
          <h1
            className="
              text-3xl font-semibold 
              bg-clip-text text-transparent 
              bg-gradient-to-r from-white to-gray-300
            "
          >
            Cart
          </h1>
          <p className="text-xs text-white/50 mt-1">
            Review your selected courses before checkout.
          </p>
        </div>

        {/* Items pill */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/60">Courses</span>
          <span
            className="
              px-3 py-1 rounded-full text-xs font-semibold
              bg-white/10 border border-white/20 text-white/90
              backdrop-blur-xl
            "
          >
            {totalItems || 0}
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-white/30 to-transparent mb-6" />

      {/* Content */}
      {hasItems ? (
        <div
          className="
            mt-4 flex flex-col-reverse lg:flex-row 
            gap-6 items-start
          "
        >
          {/* Course list */}
          <div
            className="
              flex-1 w-full
              rounded-2xl border border-white/15 
              bg-white/5 backdrop-blur-2xl
              p-4 sm:p-5
              shadow-[0_10px_35px_rgba(0,0,0,0.5)]
            "
          >
            <RenderCartCourses />
          </div>

          {/* Summary */}
          <div
            className="
              w-full lg:w-[32%]
              rounded-2xl border border-white/15 
              bg-white/5 backdrop-blur-2xl
              p-4 sm:p-5
              shadow-[0_10px_35px_rgba(0,0,0,0.5)]
              lg:sticky lg:top-20
            "
          >
            <RenderTotalAmount />
          </div>
        </div>
      ) : (
        <div className="mt-16 flex flex-col items-center text-center gap-3">
          <p className="text-2xl font-semibold text-white/90">
            Your cart is empty
          </p>
          <p className="text-sm text-white/50 max-w-sm">
            Add some courses to your cart and they&apos;ll show up here. Time
            to learn something instead of just refreshing dashboards.
          </p>
        </div>
      )}
    </div>
  );
}
