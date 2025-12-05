import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css"

import { FaEdit, FaCheck } from "react-icons/fa"
import { MdDelete } from "react-icons/md"
import { HiClock } from "react-icons/hi"
import { useNavigate } from "react-router-dom"

import { formatDate } from "../../../../services/formatDate"
import {
  deleteCourse,
  fetchInstructorCourses,
} from "../../../../services/operations/courseDetailsAPI"
import ConfirmationModal from "../../../common/ConfirmationModal"



const parseTimeDurationToSeconds = (value) => {
  if (!value) return 0
  const n = Number(value)
  if (Number.isNaN(n)) return 0
  return n
}

// convert seconds to "Xh Ym" / "Xm"
const formatSecondsToDuration = (seconds) => {
  if (!seconds || Number.isNaN(seconds)) return "0m"
  const total = Math.floor(seconds)
  const hours = Math.floor(total / 3600)
  const minutes = Math.floor((total % 3600) / 60)

  if (hours > 0) return `${hours}h ${minutes}m`
  return `${minutes}m`
}

// Get course duration from:
// 1) course.totalDuration if backend sent it
// 2) otherwise compute from courseContent.subSection.timeDuration
const getCourseDuration = (course) => {
  if (course?.totalDuration) return course.totalDuration

  if (Array.isArray(course?.courseContent)) {
    let totalSeconds = 0

    course.courseContent.forEach((section) => {
      section?.subSection?.forEach((lecture) => {
        totalSeconds += parseTimeDurationToSeconds(lecture?.timeDuration)
      })
    })

    return formatSecondsToDuration(totalSeconds)
  }

  return "N/A"
}

// -------------------------------------------------

const CourseTable = ({ courses, setCourses }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { token } = useSelector((state) => state.auth)
  const [loading, setLoading] = useState(false)
  const [confirmationModal, setConfirmationModal] = useState(null)

  const handleCourseDelete = async (courseId) => {
    try {
      setLoading(true)
      await deleteCourse({ courseId }, token)
      const result = await fetchInstructorCourses(token)
      if (result) {
        setCourses(result)
      }
    } catch (err) {
      console.error("DELETE COURSE ERROR:", err)
    } finally {
      setConfirmationModal(null)
      setLoading(false)
    }
  }

  // sanity check: see what data this table actually gets
  console.log("COURSES IN TABLE >>>", courses)

  return (
    <div
      className=" w-full  rounded-3xl  bg-white/10  backdrop-blur-2xl  border border-white/10 shadow-[0_18px_60px_rgba(0,0,0,0.55)] overflow-hidden p-0"
    >
      {/* Header */}
      <div
        className=" hidden  md:grid  grid-cols-12  px-6 py-4  text-xs  font-semibold  tracking-wider  text-richblack-200  uppercase  border-b border-white/10 bg-white/5"
      >
        <div className="col-span-6">Course</div>
        <div className="col-span-2 text-center">Duration</div>
        <div className="col-span-2 text-center">Price</div>
        <div className="col-span-2 text-center">Actions</div>
      </div>

      {/* Body */}
      <div className="divide-y divide-white/5">
        {(!courses || courses.length === 0) && (
          <div className="py-10 text-center text-xl text-richblack-200">
            No Courses Found
          </div>
        )}

        {courses?.map((course) => (
          <div
            key={course._id}
            className=" md:grid  grid-cols-12  gap-6  p-4  md:p-6  hover:bg-white/5  transition duration-300 rounded-lg"
          >
            {/* Course Card — mobile stacked */}
            <div className="col-span-6 flex flex-col gap-3 md:flex-row">
              
              {/* Thumbnail */}
              <img
                src={course.thumbnail}
                alt={course.courseName}
                className=" w-full  md:w-[180px]  h-[120px]  object-cover  rounded-xl  shadow-[0_4px_20px_rgba(0,0,0,0.4)] hover:scale-[1.02]  transition-transform mb-3 md:mb-0 "
              />

              {/* Info */}
              <div className="flex flex-col justify-between w-full">
                <p className="text-lg font-semibold text-white">
                  {course.courseName}
                </p>

                <p className="text-sm text-richblack-300 leading-relaxed">
                  {course.courseDescription?.length > 120
                    ? `${course.courseDescription.slice(0, 120)}...`
                    : course.courseDescription}
                </p>

                <p className="text-xs text-richblack-300">
                  Created: {course.createdAt ? formatDate(course.createdAt) : "N/A"}
                </p>

                {/* Status */}
                {course.status === "Draft" ? (
                  <span 
                    className="mt-2 w-fit flex items-center gap-2 text-xs font-medium  text-pink-200  bg-white/10 backdrop-blur border border-pink-300/30px-3 py-1  rounded-full "
                  >
                    <HiClock size={13} />
                    Draft
                  </span>
                ) : (
                  <span 
                    className=" mt-2 w-fit  flex items-center gap-2  text-xs  font-medium  text-yellow-200  bg-white/10  backdrop-blur border-yellow-300/30 px-3 py-1  rounded-full"
                  >
                    <FaCheck size={10} />
                    Published
                  </span>
                )}
              </div>
            </div>

            {/* Duration */}
            <div className=" hidden md:flex  items-center  justify-center  col-span-2  text-sm text-richblack-200"
            >
              {getCourseDuration(course)}
            </div>

            {/* Price */}
            <div className=" hidden md:flex  items-center  justify-center  col-span-2  text-sm text-richblack-200"
            >
              ₹{course.price}
            </div>

            {/* Actions */}
            <div className=" hidden md:flex  items-center  justify-center gap-4  col-span-2"
              >
              <button
                onClick={() => navigate(`/dashboard/edit-course/${course._id}`)}
                className=" hover:scale-110  hover:text-caribbeangreen-300 transition "
              >
                <FaEdit size={20} />
              </button>

              <button
                onClick={() =>
                  setConfirmationModal({
                    text1: "Delete this course?",
                    text2: "This action cannot be undone.",
                    btn1Text: "Delete",
                    btn2Text: "Cancel",
                    btn1Handler: () => handleCourseDelete(course._id),
                    btn2Handler: () => setConfirmationModal(null),
                  })
                }
                className=" hover:scale-110  hover:text-red-400  transition"
              >
                <MdDelete size={20} />
              </button>
            </div>

            {/* Mobile Actions */}
            <div className=" flex md:hidden  justify-end  gap-4  mt-3"
            >
              <button
                onClick={() => navigate(`/dashboard/edit-course/${course._id}`)}
                className="hover:scale-110  hover:text-caribbeangreen-300 transition"
              >
                <FaEdit size={20} />
              </button>

              <button
                onClick={() =>
                  setConfirmationModal({
                    text1: "Delete this course?",
                    text2: "This cannot be undone.",
                    btn1Text: "Delete",
                    btn2Text: "Cancel",
                    btn1Handler: () => handleCourseDelete(course._id),
                    btn2Handler: () => setConfirmationModal(null),
                  })
                }
                className=" hover:scale-110  hover:text-red-400  transition"
              >
                <MdDelete size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </div>


  )
}

export default CourseTable
