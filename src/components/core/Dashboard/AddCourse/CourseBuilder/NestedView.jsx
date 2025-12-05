import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CgMenuBoxed } from "react-icons/cg";
import { MdEdit, MdDelete } from "react-icons/md";
import { FaCaretDown } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import SubSectionModal from "./SubSectionModal";
import ConfirmationModal from "../../../../common/ConfirmationModal";
import {
  deleteSection,
  deleteSubSection,
} from "../../../../../services/operations/courseDetailsAPI";
import { setCourse } from "../../../../../slices/courseSlice";

const NestedView = ({ handleChangeEditSectionName, setIsLectureModalOpen }) => {
  const { course } = useSelector((state) => state.course);
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [addSubSection, setAddSubSection] = useState(null);
  const [editSubSection, setEditSubSection] = useState(null);
  const [viewSubSection, setViewSubSection] = useState(null);

  const [confirmationModal, setConfirmationModal] = useState(null);

  const handleDeleteSection = async (sectionId) => {
    const result = await deleteSection({
      sectionId,
      courseId: course._id,
      token,
    });
    if (result) {
      dispatch(setCourse(result));
    }
    setConfirmationModal(null);
  };

  const handleDeleteSubSection = async (subSectionId, sectionId) => {
    const result = await deleteSubSection({ subSectionId, sectionId, token });
    if (result) {
      const updatedCourseContent = course.courseContent.map((section) =>
        section._id === sectionId ? result : section
      );
      const updatedCourse = { ...course, courseContent: updatedCourseContent };
      dispatch(setCourse(updatedCourse));
    }
    setConfirmationModal(null);
  };

  return (
    <div className="w-full space-y-4 mt-3">
      {/* Empty state */}
      {course?.courseContent?.length === 0 && (
        <p className="text-sm text-richblack-300 text-center py-4">
          No sections yet. Create your first section to start building this
          course.
        </p>
      )}

      {/* Sections */}
      {course?.courseContent?.map((section, sectionIndex) => (
        <details
          key={section._id}
          open
          className={`
            group
            border-b border-white/10 
            pb-3
            ${sectionIndex === 0 ? "pt-1" : "pt-3"}
          `}
        >
          {/* Section header */}
          <summary
            className="
              flex cursor-pointer items-center justify-between gap-x-3
              text-sm
              select-none
            "
          >
            <div className="flex items-center gap-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5">
                <CgMenuBoxed className="text-base text-richblack-50" />
              </div>
              <p className="font-semibold text-richblack-5">
                {section.sectionName}
              </p>
            </div>

            <div className="flex items-center gap-x-2 text-xs md:text-sm">
              <button
                type="button"
                onClick={() =>
                  handleChangeEditSectionName(section._id, section.sectionName)
                }
                className="inline-flex items-center justify-center rounded-full p-1.5 hover:bg-white/10 transition"
              >
                <MdEdit className="text-sm text-richblack-200" />
              </button>

              <button
                type="button"
                onClick={() =>
                  setConfirmationModal({
                    text1: "Delete this section?",
                    text2: "All lectures inside this section will be deleted.",
                    btn1Text: "Delete",
                    btn2Text: "Cancel",
                    btn1Handler: () => handleDeleteSection(section._id),
                    btn2Handler: () => setConfirmationModal(null),
                  })
                }
                className="inline-flex items-center justify-center rounded-full p-1.5 hover:bg-pink-600/20 transition"
              >
                <MdDelete className="text-sm text-pink-200" />
              </button>

              <FaCaretDown className="ml-1 text-sm text-richblack-300 group-open:rotate-180 transition-transform duration-200" />
            </div>
          </summary>

          {/* Subsections */}
          <div className="mt-2 space-y-1.5 pl-11">
            {section?.subSection?.length === 0 && (
              <p className="text-[12px] text-richblack-300">
                No lectures in this section yet.
              </p>
            )}

            {section?.subSection?.map((data) => (
              <div
                key={data?._id}
                onClick={() => {
                  setViewSubSection(data);
                  setIsLectureModalOpen(true);
                }}
                className="
                  flex items-center justify-between gap-x-3
                  py-1.5 pr-1
                  text-[13px]
                  hover:bg-white/5 rounded-md
                  cursor-pointer
                "
              >
                <div className="flex flex-1 items-center gap-x-2">
                  <span className="h-1 w-1 rounded-full bg-richblack-300" />
                  <p className="text-richblack-50 truncate">{data.title}</p>
                </div>

                <div
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-x-2"
                >
                  <button
                    type="button"
                    onClick={() => {
                      setEditSubSection({ ...data, sectionId: section._id });
                      setIsLectureModalOpen(true);
                    }}
                    className="inline-flex items-center justify-center rounded-full p-1 hover:bg-white/10 transition"
                  >
                    <MdEdit className="text-xs text-richblack-200" />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setConfirmationModal({
                        text1: "Delete this lecture?",
                        text2: "Selected video and lecture will be removed.",
                        btn1Text: "Delete",
                        btn2Text: "Cancel",
                        btn1Handler: () =>
                          handleDeleteSubSection(data._id, section._id),
                        btn2Handler: () => setConfirmationModal(null),
                      })
                    }
                    className="inline-flex items-center justify-center rounded-full p-1 hover:bg-pink-600/20 transition"
                  >
                    <MdDelete className="text-xs text-pink-200" />
                  </button>
                </div>
              </div>
            ))}

            {/* Add lecture button */}
            <button
              type="button"
              onClick={() => {
                setAddSubSection(section._id);
                setIsLectureModalOpen(true);
              }}
              className="
                mt-2 inline-flex items-center gap-2
                rounded-full border border-yellow-400/40 
                px-3 py-1.5 text-[12px] font-medium 
                text-yellow-100 hover:bg-yellow-400/10 
                transition
              "
            >
              <FaPlus className="text-xs" />
              <span>Add lecture</span>
            </button>
          </div>
        </details>
      ))}

      {/* Modals */}
      {addSubSection && (
        <SubSectionModal
          modalData={addSubSection}
          setModalData={(val) => {
            if (!val) setIsLectureModalOpen(false);
            setAddSubSection(val);
          }}
          add={true}
        />
      )}

      {viewSubSection && (
        <SubSectionModal
          modalData={viewSubSection}
          setModalData={(val) => {
            if (!val) setIsLectureModalOpen(false);
            setViewSubSection(val);
          }}
          view={true}
        />
      )}

      {editSubSection && (
        <SubSectionModal
          modalData={editSubSection}
          setModalData={(val) => {
            if (!val) setIsLectureModalOpen(false);
            setEditSubSection(val);
          }}
          edit={true}
        />
      )}

      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </div>
  );
};

export default NestedView;
