import React, { useState } from "react";
import { useForm } from "react-hook-form";
import IconBtn from "../../../../common/IconBtn";
import { IoMdAddCircleOutline } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { FaChevronRight } from "react-icons/fa";
import {
  setCourse,
  setEditCourse,
  setStep,
} from "../../../../../slices/courseSlice";
import { toast } from "react-hot-toast";
import NestedView from "./NestedView";
import {
  createSection,
  updateSection,
} from "../../../../../services/operations/courseDetailsAPI";

const CourseBuilderForm = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const { course } = useSelector((state) => state.course);
  const { token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [editSectionName, setEditSectionName] = useState(null);
  const [isLectureModalOpen, setIsLectureModalOpen] = useState(false);

  const dispatch = useDispatch();

  const onSubmit = async (data) => {
    setLoading(true);
    let result;

    if (editSectionName) {
      result = await updateSection(
        {
          sectionName: data.sectionName,
          sectionId: editSectionName,
          courseId: course._id,
        },
        token
      );
    } else {
      result = await createSection(
        {
          sectionName: data.sectionName,
          courseId: course._id,
        },
        token
      );
    }

    if (result) {
      dispatch(setCourse(result));
      setEditSectionName(null);
      setValue("sectionName", "");
    }
    setLoading(false);
  };

  const cancelEdit = () => {
    setEditSectionName(null);
    setValue("sectionName", "");
  };

  const goBack = () => {
    dispatch(setStep(1));
    dispatch(setEditCourse(true));
  };

  const goToNext = () => {
    if (course.courseContent.length === 0) {
      toast.error("Please add at least one section");
      return;
    }
    if (
      course.courseContent.some((section) => section.subSection.length === 0)
    ) {
      toast.error("Please add at least one lecture in each section");
      return;
    }
    dispatch(setStep(3));
  };

  const handleChangeEditSectionName = (sectionId, sectionName) => {
    if (editSectionName === sectionId) {
      cancelEdit();
      return;
    }
    setEditSectionName(sectionId);
    setValue("sectionName", sectionName);
  };

  return (
    <div className="w-full">
      {/* main glassy card */}
      <div className="mt-5 rounded-2xl border border-white/10 bg-richblack-900/70 px-4 py-5 text-white shadow-[0_18px_60px_rgba(0,0,0,0.85)] backdrop-blur-xl md:px-8 md:py-7 space-y-6">
        {/* header */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xl font-semibold md:text-2xl">Course Builder</p>
            <p className="mt-1 text-xs text-richblack-200 md:text-sm">
              Add sections and lectures to structure your course content.
            </p>
          </div>

          {course?.courseName && (
            <div className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[11px] text-richblack-50 md:text-xs">
              Building:{" "}
              <span className="font-semibold text-yellow-50">
                {course.courseName}
              </span>
            </div>
          )}
        </div>

        {/* nested view – no extra card wrapper */}
        {course.courseContent.length > 0 && (
          <div className="mt-1">
            <NestedView
              handleChangeEditSectionName={handleChangeEditSectionName}
              setIsLectureModalOpen={setIsLectureModalOpen}
            />
          </div>
        )}

        {/* section form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-2 space-y-3 md:space-y-4"
        >
          <div className="space-y-1">
            <label
              htmlFor="sectionName"
              className="text-xs font-medium uppercase tracking-wide text-richblack-200"
            >
              Section Name <sup className="text-pink-300">*</sup>
            </label>

            <div className="relative w-full">
              <input
                id="sectionName"
                disabled={loading}
                placeholder="Add a section to build your course"
                {...register("sectionName", { required: true })}
                className="form-style w-full pr-36"
              />

              <button
                type="submit"
                disabled={loading}
                className={`
                  absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1.5 rounded-lg 
                  border border-white/20 bg-white/15 px-3 py-1.5 text-[11px] font-semibold 
                  text-white shadow-[0_0_18px_rgba(255,255,255,0.18)]
                  hover:bg-white/25 hover:shadow-[0_0_26px_rgba(255,255,255,0.28)]
                  transition-all
                  disabled:cursor-not-allowed disabled:opacity-60
                `}
              >
                <IoMdAddCircleOutline className="text-sm" />
                {editSectionName ? "Save Section Name" : "Create Section"}
              </button>
            </div>

            {errors.sectionName && (
              <span className="ml-1 text-xs tracking-wide text-pink-200">
                Section name is required
              </span>
            )}

            {editSectionName && (
              <button
                type="button"
                onClick={cancelEdit}
                className="mt-1 text-xs text-richblack-300 underline underline-offset-2 hover:text-richblack-100 transition"
              >
                Cancel edit
              </button>
            )}
          </div>
        </form>
      </div>

      {/* footer actions – hidden while lecture modal open */}
      {!isLectureModalOpen && (
        <div className="mt-8 flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center sm:justify-end">
          <button
            onClick={goBack}
            type="button"
            className="
              flex items-center justify-center gap-2 rounded-lg 
              border border-white/15 bg-white/10 
              px-4 py-2 text-sm font-semibold text-richblack-900
              hover:bg-white/20 hover:shadow-[0_0_20px_rgba(255,255,255,0.20)]
              transition-all
            "
          >
            Back
          </button>

          <IconBtn disabled={loading} text={"Next"} onClick={goToNext}>
            <FaChevronRight />
          </IconBtn>
        </div>
      )}
    </div>
  );
};

export default CourseBuilderForm;
