import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useParams } from "react-router-dom";
import { getFullDetailsOfCourse } from "../services/operations/courseDetailsAPI";
import {
  setCompletedLectures,
  setCourseSectionData,
  setEntireCourseData,
  setTotalNoOfLectures,
} from "../slices/viewCourseSlice";
import VideoDetailsSidebar from "../components/core/viewCourse/VideoDetailsSidebar";
import CourseReviewModal from "../components/core/viewCourse/CourseReviewModal";

const ViewCourse = () => {
  const [reviewModal, setReviewModal] = useState(false);
  const { courseId } = useParams();
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const setCourseSpecificDetails = async () => {
      const courseData = await getFullDetailsOfCourse(courseId, token);
      dispatch(setCourseSectionData(courseData.courseDetails.courseContent));
      dispatch(setEntireCourseData(courseData.courseDetails));
      dispatch(setCompletedLectures(courseData.completedVideos));

      let lectures = 0;
      courseData?.courseDetails?.courseContent?.forEach((sec) => {
        lectures += sec.subSection.length;
      });
      dispatch(setTotalNoOfLectures(lectures));
    };
    setCourseSpecificDetails();
  }, [courseId, token, dispatch]);

  return (
    <>
      {/* push everything below sticky navbar (3.5rem ≈ 14) */}
      <div className="pt-14 min-h-screen bg-richblack-900 text-white">
        <div
          className="
            flex flex-col lg:flex-row
            min-h-[calc(100vh-3.5rem)]
          "
        >
          {/* Sidebar */}
          <div
            className="
              w-full
              lg:w-[320px] lg:min-w-[320px]
              border-r border-richblack-800
              bg-richblack-900
              lg:h-[calc(100vh-3.5rem)]
              overflow-y-auto
            "
          >
            <VideoDetailsSidebar setReviewModal={setReviewModal} />
          </div>

          {/* Video / Outlet area */}
          <div
            className="
              flex-1
              bg-richblack-900
              lg:h-[calc(100vh-3.5rem)]
              overflow-y-auto
            "
          >
            <Outlet />
          </div>
        </div>

        {reviewModal && <CourseReviewModal setReviewModal={setReviewModal} />}
      </div>
    </>
  );
};

export default ViewCourse;
