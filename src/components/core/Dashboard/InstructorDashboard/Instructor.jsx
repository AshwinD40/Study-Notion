import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getInstructorData } from "../../../../services/operations/profileAPI";
import { fetchInstructorCourses } from "../../../../services/operations/courseDetailsAPI";
import InstructorChart from "./InstructorChart";
import { Link } from "react-router-dom";

export default function Instructor() {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);

  const [loading, setLoading] = useState(false);
  const [instructorData, setInstructorData] = useState([]);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    if (!token) return;

    const getCourseDataWithState = async () => {
      try {
        setLoading(true);

        const instructorApiData = await getInstructorData(token);
        const result = await fetchInstructorCourses(token);

        console.log("instructorApiData:", instructorApiData);
        console.log("courses result:", result);

        if (Array.isArray(instructorApiData)) {
          setInstructorData(instructorApiData);
        } else {
          setInstructorData([]);
        }

        if (Array.isArray(result)) {
          setCourses(result);
        } else {
          setCourses([]);
        }
      } catch (error) {
        console.error("Error fetching instructor data:", error);
        setInstructorData([]);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    getCourseDataWithState();
  }, [token]);

  const totalAmount = instructorData.reduce(
    (acc, curr) => acc + (curr.totalAmountGenerated || 0),
    0
  );

  const totalStudents = instructorData.reduce(
    (acc, curr) => acc + (curr.totalStudentEnrolled || 0),
    0
  );

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-richblack-900 via-richblack-800 to-richblack-900 text-richblack-5">
      {/* Glow background accents */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-24 -left-16 h-72 w-72 rounded-full bg-caribbeangreen-400/10 blur-3xl" />
        <div className="absolute top-32 right-0 h-80 w-80 rounded-full bg-yellow-300/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-pink-400/10 blur-3xl" />
      </div>

      <div className="mx-auto flex max-w-6xl flex-col px-4 py-6 md:px-6 lg:px-8 lg:py-10 gap-6 md:gap-8">
        {/* HEADER */}
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-richblack-5">
              Hi {user?.firstName} 👋
            </h1>
            <p className="mt-1 text-sm md:text-base text-richblack-200">
              Let{"'"}s build something amazing today.
            </p>
          </div>

          
        </header>

        {/* MAIN CONTENT */}
        {loading ? (
          <div className="flex flex-1 items-center justify-center py-16">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-yellow-200 border-t-transparent" />
          </div>
        ) : courses.length > 0 ? (
          <>
            {/* VISUALIZATION + STATS SECTION */}
            <section className="flex flex-col gap-6 xl:flex-row">
              {/* Chart card */}
              <div className="flex-1 rounded-3xl bg-white/10 backdrop-blur-2xl border border-white/15 shadow-[0_18px_60px_rgba(0,0,0,0.55)] p-4 md:p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-richblack-300">
                      Performance
                    </p>
                    <h2 className="text-lg md:text-xl font-semibold text-richblack-5">
                      Revenue & Students
                    </h2>
                  </div>
                  <div className="flex items-center gap-2 text-[0.65rem] md:text-xs text-richblack-200">
                    <span className="h-2 w-2 rounded-full bg-caribbeangreen-300" />
                    <span>Active</span>
                  </div>
                </div>

                {totalAmount > 0 || totalStudents > 0 ? (
                  <div className="h-[260px] md:h-[320px]">
                    <InstructorChart courses={instructorData} />
                  </div>
                ) : (
                  <div className="flex h-[260px] flex-col items-center justify-center text-center">
                    <p className="text-lg font-semibold text-richblack-5">
                      Not Enough Data
                    </p>
                    <p className="mt-2 text-sm text-richblack-200 max-w-sm">
                      Start enrolling students into your courses to see insights
                      and trends here.
                    </p>
                  </div>
                )}
              </div>

              {/* Stats card */}
              <aside className="w-full xl:w-[300px] 2xl:w-[320px] flex-shrink-0 rounded-3xl bg-white/10 backdrop-blur-2xl border border-white/15 shadow-[0_18px_60px_rgba(0,0,0,0.55)] p-5 md:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg md:text-xl font-semibold text-richblack-5">
                    Statistics
                  </h2>
                  <span className="rounded-full bg-richblack-900/70 px-3 py-1 text-[0.65rem] md:text-xs text-richblack-100 border border-white/10">
                    Live overview
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="rounded-2xl bg-white/5 border border-white/10 px-4 py-3">
                    <p className="text-xs text-pink-200 font-medium">
                      Total Courses
                    </p>
                    <p className="mt-1 text-2xl md:text-3xl font-bold text-richblack-5">
                      {courses.length}
                    </p>
                    <p className="mt-1 text-[0.7rem] text-richblack-200">
                      Keep publishing to grow your catalog.
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white/5 border border-white/10 px-4 py-3">
                    <p className="text-xs text-yellow-200 font-medium">
                      Total Students
                    </p>
                    <p className="mt-1 text-2xl md:text-3xl font-bold text-richblack-5">
                      {totalStudents}
                    </p>
                    <p className="mt-1 text-[0.7rem] text-richblack-200">
                      Represents all unique enrollments across courses.
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white/5 border border-white/10 px-4 py-3">
                    <p className="text-xs text-caribbeangreen-200 font-medium">
                      Total Revenue
                    </p>
                    <p className="mt-1 text-2xl md:text-3xl font-bold text-richblack-5">
                      ₹{totalAmount}
                    </p>
                    <p className="mt-1 text-[0.7rem] text-richblack-200">
                      Based on completed purchases of your courses.
                    </p>
                  </div>
                </div>
              </aside>
            </section>

            {/* COURSES SECTION */}
            <section className="rounded-3xl bg-white/10 backdrop-blur-2xl border border-white/15 shadow-[0_18px_60px_rgba(0,0,0,0.55)] p-4 md:p-6">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-richblack-300">
                    Courses
                  </p>
                  <h2 className="text-lg md:text-xl font-semibold text-richblack-5">
                    Your Top Courses
                  </h2>
                  <p className="mt-1 text-xs md:text-sm text-richblack-200">
                    Showing up to 3 of your published courses.
                  </p>
                </div>

                <Link to="/dashboard/my-courses">
                  <button className="rounded-full border border-yellow-200/60 bg-yellow-100/10 px-4 py-2 text-xs md:text-sm font-semibold text-yellow-50 hover:bg-yellow-100/20 transition">
                    View all courses
                  </button>
                </Link>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {courses.slice(0, 3).map((course) => (
                  <div
                    key={course._id}
                    className="group rounded-2xl bg-richblack-900/60 border border-white/10 overflow-hidden flex flex-col shadow-[0_12px_40px_rgba(0,0,0,0.6)]"
                  >
                    <div className="relative h-40 sm:h-44 md:h-48 overflow-hidden">
                      <img
                        src={course.thumbnail}
                        alt={course.courseName}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-richblack-900/80 via-transparent to-transparent" />
                    </div>

                    <div className="flex flex-1 flex-col px-4 py-3 gap-2">
                      <p className="text-sm md:text-base font-semibold text-caribbeangreen-200 line-clamp-2">
                        {course.courseName}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 text-[0.75rem] md:text-xs text-richblack-200">
                        <span>
                          {(course.studentsEnrolled?.length ?? 0)} Students
                        </span>
                        <span className="text-richblack-400">•</span>
                        <span>Price: ₹{course.price}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        ) : (
          // EMPTY STATE
          <section className="mt-6 flex flex-1 items-center justify-center">
            <div className="w-full max-w-xl rounded-3xl bg-white/10 backdrop-blur-2xl border border-white/15 px-6 py-10 md:px-8 md:py-12 text-center shadow-[0_18px_60px_rgba(0,0,0,0.55)]">
              <p className="text-xs uppercase tracking-[0.25em] text-richblack-300">
                Getting Started
              </p>
              <h2 className="mt-2 text-2xl md:text-3xl font-bold text-richblack-5">
                You haven{"'"}t created any courses yet
              </h2>
              <p className="mt-3 text-sm md:text-base text-richblack-200">
                Start by creating your first course and you&apos;ll see your
                stats, revenue, and student insights appear here.
              </p>
              <Link to="/dashboard/add-course">
                <button className="mt-6 rounded-full bg-yellow-100/10 border border-yellow-200/70 px-6 py-2.5 text-sm md:text-base font-semibold text-yellow-50 hover:bg-yellow-100/20 transition">
                  Create a new course
                </button>
              </Link>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
