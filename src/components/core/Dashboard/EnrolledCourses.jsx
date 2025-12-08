import { useEffect, useState } from 'react'
import ProgressBar from '@ramonak/react-progress-bar';
import { useSelector } from 'react-redux'
import { getUserEnrolledCourses } from '../../../services/operations/profileAPI';
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
  }, []);


  return (
    <div className="px-2 sm:px-0">
      <h1 className="text-3xl font-semibold text-white mb-6">
        Enrolled Courses
      </h1>

      {!enrolledCourses ? (
        <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
          <div className="spinner"></div>
        </div>
      ) : !enrolledCourses.length ? (
        <p className="grid h-[10vh] w-full place-content-center text-white/70">
          You haven’t enrolled in any courses yet.
        </p>
      ) : (
        <div className="my-8 text-white/90">

          {/* Header Row */}
          <div className="
            hidden sm:flex
            rounded-t-xl 
            backdrop-blur-xl 
            bg-white/10 
            border border-white/20
          ">
            <p className="w-[45%] px-5 py-3 font-semibold">Course</p>
            <p className="w-1/4 px-2 py-3 font-semibold">Duration</p>
            <p className="flex-1 px-2 py-3 font-semibold">Progress</p>
          </div>

          {/* Course List */}
          {enrolledCourses.map((course, i, arr) => (
            <div
              key={i}
              className={`
                flex flex-col sm:flex-row items-start sm:items-center
                gap-4 sm:gap-0
                p-4 sm:px-5 sm:py-3
                border border-white/10
                backdrop-blur-xl bg-white/5
                transition-all duration-300
                hover:bg-white/10 hover:border-white/20
                ${i === arr.length - 1 ? "rounded-b-xl" : ""}
              `}
            >
              {/* Course Thumbnail + Info */}
              <div
                className="flex w-full sm:w-[45%] gap-4 items-center cursor-pointer"
                onClick={() => {
                  navigate(
                    `/view-course/${course?._id}/section/${course.courseContent?.[0]?._id}/sub-section/${course.courseContent?.[0]?.subSection?.[0]?._id}`
                  );
                }}
              >
                <img
                  src={course.thumbnail}
                  alt="course_img"
                  className="h-14 w-14 rounded-lg object-cover shadow-lg"
                />

                <div className="flex flex-col gap-1 max-w-xs">
                  <p className="font-semibold text-white">
                    {course.courseName}
                  </p>
                  <p className="text-xs text-white/60">
                    {course.courseDescription.length > 50
                      ? `${course.courseDescription.slice(0, 50)}...`
                      : course.courseDescription}
                  </p>
                </div>
              </div>

              {/* Duration */}
              <div className="w-full sm:w-1/4 text-white/70 text-sm sm:text-base">
                {course?.totalDuration}
              </div>

              {/* Progress */}
              <div className="flex w-full sm:w-1/5 flex-col gap-1">
                <p className="text-sm">
                  Progress: {course.progressPercentage || 0}%
                </p>
                <ProgressBar
                  completed={course.progressPercentage || 0}
                  height="8px"
                  isLabelVisible={false}
                  bgColor="#22c55e"
                  baseBgColor="rgba(255,255,255,0.15)"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

}
