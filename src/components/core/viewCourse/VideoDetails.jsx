import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { markLectureAsComplete } from "../../../services/operations/courseDetailsAPI";
import { updateCompletedLectures } from "../../../slices/viewCourseSlice";
import CustomPlayer from "../../common/CustomPlayer";

const VideoDetails = () => {
  const { courseId, sectionId, subSectionId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const { token } = useSelector((state) => state.auth);
  const {
    courseSectionData,
    courseEntireData,
    completedLectures,
  } = useSelector((state) => state.viewCourse);

  const [videoData, setVideoData] = useState(null);
  const [previewSource, setPreviewSource] = useState("");

  const [loading, setLoading] = useState(false);

  // Load video details
  useEffect(() => {
    if (!courseSectionData.length) return;

    const section = courseSectionData.find((s) => s._id === sectionId);
    const video =
      section?.subSection.find((v) => v._id === subSectionId) || null;

    setVideoData(video);
    setPreviewSource(courseEntireData?.thumbnail);
  }, [
    courseSectionData,
    courseEntireData,
    location.pathname,
    courseId,
    sectionId,
    subSectionId,
  ]);

  const isFirstVideo = () => {
    if (!courseSectionData?.length) return true;

    const sectionIdx = courseSectionData.findIndex((s) => s._id === sectionId);
    if (sectionIdx < 0) return true;

    const subIdx = courseSectionData[sectionIdx]?.subSection?.findIndex(
      (v) => v._id === subSectionId
    );

    return sectionIdx === 0 && subIdx === 0;
  };


  const isLastVideo = () => {
    if (!courseSectionData?.length) return true;

    const sectionIdx = courseSectionData.findIndex((s) => s._id === sectionId);
    if (sectionIdx < 0) return true;

    const section = courseSectionData[sectionIdx];
    if (!section?.subSection?.length) return true;

    const subIdx = section.subSection.findIndex((v) => v._id === subSectionId);

    return (
      sectionIdx === courseSectionData.length - 1 &&
      subIdx === section.subSection.length - 1
    );
  };


  const goToNextVideo = () => {
    if (!courseSectionData?.length) return;

    const sectionIdx = courseSectionData.findIndex((s) => s._id === sectionId);
    if (sectionIdx < 0) return;

    const section = courseSectionData[sectionIdx];
    if (!section?.subSection?.length) return;

    const subIdx = section.subSection.findIndex((v) => v._id === subSectionId);

    // next
    if (subIdx < section.subSection.length - 1) {
      const nextId = section.subSection[subIdx + 1]._id;
      navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${nextId}`);
    } else if (courseSectionData[sectionIdx + 1]) {
      // move to next section
      const nextSection = courseSectionData[sectionIdx + 1];
      navigate(
        `/view-course/${courseId}/section/${nextSection._id}/sub-section/${nextSection.subSection[0]._id}`
      );
    }
  };


  const goToPrevVideo = () => {
    if (!courseSectionData?.length) return;

    const sectionIdx = courseSectionData.findIndex((s) => s._id === sectionId);
    if (sectionIdx < 0) return;

    const section = courseSectionData[sectionIdx];
    const subIdx = section?.subSection?.findIndex((v) => v._id === subSectionId);

    if (subIdx > 0) {
      const prevId = section.subSection[subIdx - 1]._id;
      navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${prevId}`);
    } else if (courseSectionData[sectionIdx - 1]) {
      const prevSection = courseSectionData[sectionIdx - 1];
      const lastVideo = prevSection.subSection[prevSection.subSection.length - 1]._id;

      navigate(
        `/view-course/${courseId}/section/${prevSection._id}/sub-section/${lastVideo}`
      );
    }
  };


  // Mark video as completed
  const handleLectureCompletion = async () => {
    setLoading(true);
    const res = await markLectureAsComplete(
      { courseId, subSectionId },
      token
    );
    if (res) dispatch(updateCompletedLectures(subSectionId));
    setLoading(false);
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-10 py-6">
      <div className="mx-auto w-full max-w-5xl flex flex-col gap-8">
        <div
          className="
            relative 
            rounded-2xl overflow-hidden 
            backdrop-blur-xl
            bg-richblack-900/70 
            border border-white/10 
            shadow-[0_20px_40px_rgba(0,0,0,0.7)]
          "
        >
          <CustomPlayer
            src={videoData?.videoUrl}
            poster={videoData?.thumbnail || previewSource}
            autoPlay={false}
            onPrev={!isFirstVideo() ? goToPrevVideo : null}
            onNext={!isLastVideo() ? goToNextVideo : null}
            onComplete={async () => {
              if (!completedLectures.includes(subSectionId)) {
                await handleLectureCompletion();
              }
            }}
          />
        </div>

        <div
          className="
            rounded-2xl 
            bg-richblack-900/70 
            backdrop-blur-xl 
            border border-white/10
            shadow-[0_10px_30px_rgba(0,0,0,0.6)]
            px-6 py-6 sm:px-8 sm:py-8
          "
        >
          <h1 className="text-3xl font-semibold text-white leading-tight">
            {videoData?.title}
          </h1>

          <p className="mt-4 text-richblack-200 text-base sm:text-lg leading-relaxed">
            {videoData?.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default VideoDetails;
