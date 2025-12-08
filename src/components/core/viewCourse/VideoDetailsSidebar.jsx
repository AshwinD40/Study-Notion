import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { BsChevronDown } from "react-icons/bs";
import IconBtn from "../../common/IconBtn";

const VideoDetailsSidebar = ({ setReviewModal }) => {
  const {
    courseSectionData = [],
    courseEntireData,
    totalNoOfLectures = 0,
    completedLectures = [],
  } = useSelector((state) => state.viewCourse);

  const navigate = useNavigate();
  const location = useLocation();
  const { sectionId, subSectionId } = useParams();

  const [activeSection, setActiveSection] = useState("");
  const [activeVideo, setActiveVideo] = useState("");

  useEffect(() => {
    if (!courseSectionData.length) return;

    const secIndex = courseSectionData.findIndex(
      (sec) => sec._id === sectionId
    );
    if (secIndex === -1) return;

    const videoIndex = courseSectionData[secIndex]?.subSection.findIndex(
      (sub) => sub._id === subSectionId
    );

    setActiveSection(courseSectionData[secIndex]?._id);
    setActiveVideo(
      courseSectionData[secIndex]?.subSection?.[videoIndex]?._id || ""
    );
  }, [location.pathname, courseSectionData, sectionId, subSectionId]);

  const progress =
    totalNoOfLectures > 0
      ? Math.round((completedLectures.length / totalNoOfLectures) * 100)
      : 0;

  return (
    <aside
      className="
        w-full
        text-sm text-white
        bg-richblack-900/95
        backdrop-blur-2xl
        border-r border-white/5
        shadow-[0_0_40px_rgba(0,0,0,0.8)]
        flex flex-col
      "
    >
      {/* Top bar */}
      <div
        className="
          sticky top-0 z-20
          flex items-center justify-between
          px-4 py-3
          bg-gradient-to-r from-richblack-900 via-richblack-900/95 to-richblack-900
          border-b border-white/10
        "
      >
        <button
          onClick={() => navigate("/dashboard/enrolled-courses")}
          className="
            flex items-center gap-1.5
            text-richblack-200 hover:text-white
            transition
          "
        >
          <IoArrowBack size={20} />
          <span className="hidden md:inline text-[11px] tracking-wide uppercase">
            Back
          </span>
        </button>

        <IconBtn
          text="Add Review"
          onclick={() => setReviewModal(true)}
          customClasses="!py-1.5 !px-4 !text-[11px]"
        />
      </div>

      {/* Course info */}
      <div
        className="
          px-4 py-3
          border-b border-white/5
          bg-gradient-to-br from-white/[0.08] via-white/[0.02] to-transparent
        "
      >
        <p className="font-semibold text-richblack-5 line-clamp-2 text-[13px]">
          {courseEntireData?.courseName || "Course title"}
        </p>

        <div className="mt-2 flex items-center justify-between gap-3">
          <div className="flex flex-col gap-0.5">
            <p className="text-[11px] text-richblack-200">
              Progress{" "}
              <span className="text-caribbeangreen-100 font-semibold">
                {completedLectures.length} / {totalNoOfLectures}
              </span>
            </p>
            <p className="text-[10px] text-richblack-400">
              {progress}% completed
            </p>
          </div>

          <div className="h-1.5 w-28 bg-richblack-700/80 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-caribbeangreen-200 to-caribbeangreen-400 transition-[width] duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Sections list */}
      <div className="flex-1 overflow-y-auto">
        {courseSectionData.map((section) => (
          <div
            key={section._id}
            className="border-b border-richblack-800/70 last:border-b-0"
          >
            {/* Section header */}
            <button
              type="button"
              onClick={() =>
                setActiveSection(
                  activeSection === section._id ? "" : section._id
                )
              }
              className={`
                w-full flex items-center justify-between
                px-4 py-3
                transition
                ${activeSection === section._id
                  ? "bg-white/[0.06]"
                  : "bg-richblack-800/70 hover:bg-richblack-700/80"
                }
              `}
            >
              <div className="flex flex-col gap-0.5">
                <span className="text-left font-semibold text-richblack-5 text-[13px]">
                  {section.sectionName}
                </span>
                <span className="text-[10px] text-richblack-300">
                  {section.subSection?.length || 0} lessons
                </span>
              </div>
              <BsChevronDown
                className={`text-richblack-200 transition-transform ${activeSection === section._id ? "rotate-0" : "rotate-180"
                  }`}
              />
            </button>

            {/* Subsections */}
            {activeSection === section._id && (
              <div className="bg-richblack-900/95">
                {section.subSection.map((topic) => {
                  const done = completedLectures.includes(topic._id);
                  const isActive = activeVideo === topic._id;

                  return (
                    <button
                      key={topic._id}
                      type="button"
                      onClick={() => {
                        navigate(
                          `/view-course/${courseEntireData._id}/section/${section._id}/sub-section/${topic._id}`
                        );
                        setActiveVideo(topic._id);
                      }}
                      className={`
                        w-full flex items-center gap-3
                        px-4 py-2.5 text-left text-[12px]
                        transition
                        relative
                        ${isActive
                          ? "bg-yellow-50 text-richblack-900 shadow-[0_0_20px_rgba(250,204,21,0.25)]"
                          : "text-richblack-100 hover:bg-white/[0.04]"
                        }
                      `}
                    >
                      {/* Left accent border for active lesson */}
                      {isActive && (
                        <span className="absolute left-0 top-0 h-full w-[3px] bg-yellow-400" />
                      )}

                      <input
                        type="checkbox"
                        readOnly
                        checked={done}
                        className="
                          h-3.5 w-3.5
                          accent-caribbeangreen-200
                          rounded-[4px]
                          border border-richblack-700
                        "
                      />
                      <div className="flex flex-col flex-1 gap-0.5">
                        <span
                          className={`line-clamp-2 ${isActive ? "font-semibold" : "font-medium"
                            }`}
                        >
                          {topic.title}
                        </span>

                        {/* If you ever add duration field, it slots here */}
                        {/* {topic.timeDuration && (
                          <span className="text-[10px] text-richblack-400">
                            {topic.timeDuration}
                          </span>
                        )} */}
                      </div>

                      {done && !isActive && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-caribbeangreen-900/40 text-caribbeangreen-200">
                          Done
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
};

export default VideoDetailsSidebar;
