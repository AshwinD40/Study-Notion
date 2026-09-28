import { useEffect, useState } from 'react'
import ProgressBar from '@ramonak/react-progress-bar';
import { useSelector } from 'react-redux'
import { getUserEnrolledCourses } from '../../profile/api/profile.api';
import { useNavigate } from 'react-router-dom';

export default function EnrolledCourses() {
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [enrolledCourses, setEnrolledCourses] = useState(null);

  useEffect(() => {
    ; (async () => {
      try {
        const res = await getUserEnrolledCourses(token)

        const filterPublishCourse = res.filter((ele) => ele.status !== "Draft")

        setEnrolledCourses(filterPublishCourse)
      } catch (error) {
        console.log("Could not fetch enrolled courses.")
      }
    })()
  }, [token]);


  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-richblack-5">
          Enrolled Courses
        </h1>
        <p className="text-sm text-richblack-300 mt-1">
          Pick up right where you left off and track your learning progress.
        </p>
      </div>

      {!enrolledCourses ? (
        <div className="grid min-h-[40vh] place-items-center">
          <div className="spinner" />
        </div>
      ) : !enrolledCourses.length ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/[0.02] p-8 text-center sm:p-12">
          <p className="text-base font-medium text-richblack-200">
            You haven’t enrolled in any courses yet.
          </p>
          <p className="text-xs text-richblack-400 mt-1">
            Explore our catalog to find your next course.
          </p>
          <button
            onClick={() => navigate("/catalog")}
            className="mt-4 rounded-xl bg-yellow-50 px-4 py-2 text-xs font-semibold text-richblack-900 shadow-sm hover:bg-yellow-100 transition active:scale-95"
          >
            Explore Courses
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Desktop Table Header */}
          <div className="hidden sm:grid grid-cols-12 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-richblack-300">
            <p className="col-span-6">Course</p>
            <p className="col-span-3 text-center">Duration</p>
            <p className="col-span-3 text-right">Progress</p>
          </div>

          {/* Courses List */}
          <div className="space-y-3 sm:space-y-0 sm:divide-y sm:divide-white/10 sm:rounded-2xl sm:border sm:border-white/10 sm:bg-white/[0.02] overflow-hidden">
            {enrolledCourses.map((course, i) => (
              <div
                key={course._id || i}
                onClick={() => {
                  navigate(
                    `/view-course/${course?._id}/section/${course.courseContent?.[0]?._id}/sub-section/${course.courseContent?.[0]?.subSection?.[0]?._id}`
                  );
                }}
                className="group flex flex-col sm:grid sm:grid-cols-12 items-start sm:items-center gap-3 sm:gap-4 p-4 sm:px-5 sm:py-4 rounded-2xl sm:rounded-none border border-white/10 sm:border-none bg-richblack-800/40 sm:bg-transparent hover:bg-white/[0.04] transition cursor-pointer"
              >
                {/* Course Thumbnail + Title */}
                <div className="flex items-center gap-3.5 sm:col-span-6 w-full">
                  <img
                    src={course.thumbnail}
                    alt={course.courseName}
                    className="h-14 w-14 sm:h-12 sm:w-12 rounded-xl object-cover border border-white/10 shrink-0"
                  />
                  <div className="flex flex-col overflow-hidden">
                    <p className="font-semibold text-sm sm:text-base text-richblack-5 group-hover:text-yellow-50 transition truncate">
                      {course.courseName}
                    </p>
                    <p className="text-xs text-richblack-400 line-clamp-1 mt-0.5">
                      {course.courseDescription}
                    </p>
                  </div>
                </div>

                {/* Duration */}
                <div className="sm:col-span-3 w-full sm:text-center text-xs text-richblack-300">
                  <span className="sm:hidden font-medium text-richblack-400 mr-1.5">Duration:</span>
                  {course?.totalDuration || "Self-paced"}
                </div>

                {/* Progress Bar */}
                <div className="sm:col-span-3 w-full flex flex-col gap-1.5 sm:items-end">
                  <div className="flex items-center justify-between sm:justify-end gap-2 w-full text-xs">
                    <span className="text-richblack-400 font-medium">Progress</span>
                    <span className="font-semibold text-richblack-50">{course.progressPercentage || 0}%</span>
                  </div>
                  <div className="w-full sm:max-w-[140px]">
                    <ProgressBar
                      completed={course.progressPercentage || 0}
                      height="6px"
                      isLabelVisible={false}
                      bgColor="#eab308"
                      baseBgColor="rgba(255,255,255,0.1)"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
