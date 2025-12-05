import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { getFullDetailsOfCourse } from "../../../../services/operations/courseDetailsAPI";
import { setCourse, setEditCourse } from "../../../../slices/courseSlice";
import RenderSteps from "../AddCourse/RenderSteps";

export default function EditCourse() {
  const dispatch = useDispatch();
  const { courseId } = useParams();
  const { course } = useSelector((state) => state.course);
  const { token } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const result = await getFullDetailsOfCourse(courseId, token);
        if (result?.courseDetails) {
          dispatch(setEditCourse(true));
          dispatch(setCourse(result.courseDetails));
        }
      } catch (error) {
        console.error("Failed to fetch course details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (courseId && token) {
      fetchCourse();
    }
  }, [courseId, token, dispatch]);

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center py-20">
        <div className="spinner" />
      </div>
    );
  }

  return (
  <div className="w-full min-h-[calc(100vh-4rem)] bg-richblack-900">
    <div className="mx-auto w-11/12 max-w-[1200px] ">
      <h1 className="text-xl md:text-3xl lg:text-4xl font-semibold text-richblack-5 mb-4 md:mb-6">
        Edit Course
      </h1>

      <div className="flex flex-col lg:flex-row gap-10 lg:items-start">
        
        {/* Left card */}
        <div className="w-full rounded-3xl bg-richblack-800/90 border border-richblack-700 shadow-[0_18px_60px_rgba(0,0,0,0.6)] px-4 py-5 md:px-8 md:py-8">
          {course ? (
            <RenderSteps />
          ) : (
            <p className="mt-10 text-center text-2xl font-semibold text-richblack-300">
              Course not found
            </p>
          )}
        </div>

        {/* Right tips card (only laptop and up) */}
        <aside className="hidden xl:block w-full max-w-[360px] sticky top-20">
          <div
            className=" rounded-3xl  bg-white/20 backdrop-blur-xl border border-white/30 shadow-[0_20px_60px_rgba(255,255,255,0.1)] px-6 py-7"
          >
            <p className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <span className="text-neon-300 text-2xl">⚡</span>
              Upload Tips
            </p>
            <ul className="list-disc ml-4 space-y-3 text-sm text-white/90">
              <li>Set a price or make the course free.</li>
              <li>Thumbnail recommended size: 1024×576.</li>
              <li>The overview video is controlled in the Video section.</li>
              <li>Build & organize content in the Course Builder.</li>
              <li>Add topics to unlock lessons, quizzes & assignments.</li>
              <li>Additional Data affects the public course page.</li>
              <li>Use Announcements for important updates.</li>
              <li>Send Notes to all enrolled students instantly.</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  </div>

);
}
