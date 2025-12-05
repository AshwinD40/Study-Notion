import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { setCourse } from "../../../../../slices/courseSlice";
import {
  updateSubSection,
  createSubSection,
} from "../../../../../services/operations/courseDetailsAPI";
import { RxCross1 } from "react-icons/rx";
import IconBtn from "../../../../common/IconBtn";
import Upload from "../Upload";

const SubSectionModal = ({
  modalData,
  setModalData,
  add = false,
  view = false,
  edit = false,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    getValues,
  } = useForm();

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { course } = useSelector((state) => state.course);
  const { token } = useSelector((state) => state.auth);

  // lock background scroll
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  // populate fields for edit/view
  useEffect(() => {
    if ((view || edit) && modalData) {
      setValue("lectureTitle", modalData.title);
      setValue("lectureDesc", modalData.description);
      setValue("lectureVideo", modalData.videoUrl);
    }
  }, [modalData, view, edit, setValue]);

  const isFormUpdated = () => {
    if (!modalData) return false;
    const v = getValues();
    return (
      v.lectureTitle !== modalData.title ||
      v.lectureDesc !== modalData.description ||
      v.lectureVideo !== modalData.videoUrl
    );
  };

  const handleEditSubSection = async () => {
    const v = getValues();
    const fd = new FormData();

    fd.append("sectionId", modalData.sectionId);
    fd.append("subSectionId", modalData._id);

    if (v.lectureTitle !== modalData.title) fd.append("title", v.lectureTitle);
    if (v.lectureDesc !== modalData.description)
      fd.append("description", v.lectureDesc);
    if (v.lectureVideo !== modalData.videoUrl)
      fd.append("video", v.lectureVideo);

    setLoading(true);
    const result = await updateSubSection(fd, token);
    if (result) {
      const updated = course.courseContent.map((section) =>
        section._id === modalData.sectionId ? result : section
      );
      dispatch(setCourse({ ...course, courseContent: updated }));
    }
    setLoading(false);
    setModalData(null);
  };

  const onSubmit = async (data) => {
    if (view) return;

    if (edit) {
      if (!isFormUpdated()) return toast.error("No changes made");
      return handleEditSubSection();
    }

    const fd = new FormData();
    fd.append("sectionId", modalData);
    fd.append("title", data.lectureTitle);
    fd.append("description", data.lectureDesc);
    fd.append("video", data.lectureVideo);

    setLoading(true);
    const result = await createSubSection(fd, token);

    if (result) {
      const updated = course.courseContent.map((section) =>
        section._id === modalData ? result : section
      );
      dispatch(setCourse({ ...course, courseContent: updated }));
    }
    setLoading(false);
    setModalData(null);
  };

  const close = () => !loading && setModalData(null);

  const title = view ? "Viewing" : edit ? "Editing" : "Adding";

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-xl p-4">
      {/* Modal */}
      <div
        className="
          w-full max-w-2xl 
          max-h-[90vh] 
          overflow-y-auto 
          rounded-2xl 
          border border-white/15 
          bg-richblack-900/95 
          shadow-[0_24px_80px_rgba(0,0,0,0.9)]
          
          /* HIDE SCROLLBAR */
          scrollbar-hide
        "
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {/* also hide scrollbar in WebKit */}
        <style>
          {`
            .scrollbar-hide::-webkit-scrollbar {
              display: none;
            }
          `}
        </style>

        {/* header */}
        <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-4 py-3 md:px-5 rounded-t-2xl">
          <p className="text-sm md:text-base font-semibold text-richblack-5">
            {title} Lecture
          </p>
          <button
            onClick={close}
            className="rounded-full p-1.5 hover:bg-white/10 transition"
          >
            <RxCross1 className="text-sm text-richblack-200" />
          </button>
        </div>

        {/* body */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-4 md:p-5 space-y-4 rounded-b-2xl"
        >
          <Upload
            name="lectureVideo"
            label="Lecture Video"
            register={register}
            setValue={setValue}
            errors={errors}
            video={true}
            viewData={view ? modalData?.videoUrl : null}
            editData={edit ? modalData?.videoUrl : null}
          />

          <div className="space-y-1">
            <label className="text-xs font-medium uppercase tracking-wide text-richblack-200">
              Lecture Title <sup className="text-pink-300">*</sup>
            </label>
            <input
              disabled={view}
              {...register("lectureTitle", { required: true })}
              className="form-style w-full"
              placeholder="Enter lecture title"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium uppercase tracking-wide text-richblack-200">
              Lecture Description <sup className="text-pink-300">*</sup>
            </label>
            <textarea
              disabled={view}
              {...register("lectureDesc", { required: true })}
              className="form-style w-full min-h-[130px] resize-none"
              placeholder="Enter lecture description"
            />
          </div>

          {!view ? (
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={close}
                className="rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm text-richblack-50 hover:bg-white/10 transition"
              >
                Cancel
              </button>

              <IconBtn
                disabled={loading}
                text={
                  loading ? "Saving..." : edit ? "Save Changes" : "Save Lecture"
                }
              />
            </div>
          ) : (
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={close}
                className="rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm text-richblack-50 hover:bg-white/10 transition"
              >
                Close
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default SubSectionModal;
