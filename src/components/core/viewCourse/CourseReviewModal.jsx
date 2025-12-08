import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { CgClose } from "react-icons/cg";
import { useSelector } from "react-redux";
import ReactStars from "react-rating-stars-component";
import IconBtn from "../../common/IconBtn";
import { createRating } from "../../../services/operations/courseDetailsAPI";

const CourseReviewModal = ({ setReviewModal }) => {
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const { courseEntireData } = useSelector((state) => state.viewCourse);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    setValue("courseExperience", "");
    setValue("courseRating", 0);
  }, [setValue]);

  const ratingChange = (rate) => setValue("courseRating", rate);

  const onSubmit = async (data) => {
    await createRating(
      {
        courseId: courseEntireData._id,
        rating: data.courseRating,
        review: data.courseExperience,
      },
      token
    );
    setReviewModal(false);
  };

  return (
    <div
      className="
        fixed inset-0 z-[1000]
        flex items-center justify-center
        bg-black/75 backdrop-blur-2xl
        px-4
      "
    >
      <div
        className="
          w-full max-w-[520px]
          rounded-2xl
          bg-night-900/80
          backdrop-blur-2xl
          border border-white/15
          shadow-[0_24px_80px_rgba(0,0,0,0.9)]
          text-white
          overflow-hidden
        "
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 bg-white/5">
          <p className="text-base font-semibold bg-clip-text text-transparent bg-gradient-to-r from-caribbeangreen-100 via-neon-100 to-yellow-50">
            Add a Review
          </p>
          <button
            onClick={() => setReviewModal(false)}
            className="p-1 rounded-full hover:bg-white/10 transition"
          >
            <CgClose size={20} className="text-white/80" />
          </button>
        </div>

        {/* Body */}
        <form
          className="px-5 py-5 space-y-5"
          onSubmit={handleSubmit(onSubmit)}
        >
          {/* User info */}
          <div className="flex items-center gap-3">
            <img
              src={user?.image}
              alt="profile"
              className="h-10 w-10 rounded-full object-cover border border-white/25 shadow-[0_0_14px_rgba(255,255,255,0.25)]"
            />
            <div>
              <p className="text-sm font-medium text-white/95">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-[11px] text-white/50">
                Reviewing: {courseEntireData?.courseName}
              </p>
            </div>
          </div>

          {/* Stars */}
          <div
            className="
              flex justify-center items-center gap-3
              py-2 rounded-xl
              bg-white/5 backdrop-blur-xl
              border border-white/10
              shadow-[0_0_20px_rgba(255,255,255,0.08)]
            "
          >
            <ReactStars
              count={5}
              onChange={ratingChange}
              size={28}
              activeColor="#FFD60A"
              color="#555"
            />
          </div>

          {/* Textarea */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-white/80">
              Your experience <span className="text-pink-200">*</span>
            </label>

            <textarea
              {...register("courseExperience", { required: true })}
              placeholder="Share your thoughts about this course..."
              className="
                w-full min-h-[120px] rounded-xl px-3.5 py-2.5
                text-sm bg-white/10 border border-white/15 backdrop-blur-xl
                text-white placeholder:text-white/50
                focus:ring-2 focus:ring-caribbeangreen-100 focus:outline-none
                shadow-[0_4px_20px_rgba(0,0,0,0.35)]
              "
            />

            {errors.courseExperience && (
              <span className="text-[11px] text-pink-200">
                Please write something about your experience.
              </span>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setReviewModal(false)}
              className="
                px-4 py-2 text-xs font-medium rounded-full
                bg-white/10 border border-white/20 text-white/75
                hover:bg-white/20 transition
              "
            >
              Cancel
            </button>

            <IconBtn
              type="submit"
              text="Save Review"
              customClasses="
                !px-5 !py-2 !text-xs !rounded-full
                !bg-caribbeangreen-100 !text-black
                hover:!bg-caribbeangreen-50
                shadow-[0_8px_20px_rgba(6,214,160,0.55)]
              "
            />
          </div>
        </form>

      </div>
    </div>
  );
};

export default CourseReviewModal;
