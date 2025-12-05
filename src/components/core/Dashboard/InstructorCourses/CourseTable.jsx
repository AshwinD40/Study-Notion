import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Table, Tbody, Thead, Td, Th, Tr } from "react-super-responsive-table"

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
import { COURSE_STATUS } from "../../../../utils/constants"
import ConfirmationModal from "../../../common/ConfirmationModal"

const TRUNCATE_LENGTH = 30

// ----- helpers for duration from subsections -----

// timeDuration from backend is like "72.652381" (seconds as string)
// or might be "300" or number. Convert safely to seconds.
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
    <div>
      <Table className="border rounded border-richblack-800 w-full">
        <Thead>
          <Tr className="flex gap-x-10 border-b border-b-richblack-800 px-6 py-2">
            <Th className="flex-1 text-left text-sm font-medium uppercase text-richblack-100">
              Courses
            </Th>
            <Th className="text-left text-sm font-medium uppercase text-richblack-100">
              Duration
            </Th>
            <Th className="text-left text-sm font-medium uppercase text-richblack-100">
              Price
            </Th>
            <Th className="text-left text-sm font-medium uppercase text-richblack-100">
              Action
            </Th>
          </Tr>
        </Thead>

        <Tbody>
          {!courses || courses.length === 0 ? (
            <Tr>
              <Td className="py-10 text-center text-2xl font-medium text-richblack-100 w-full">
                No Courses Found
              </Td>
            </Tr>
          ) : (
            courses.map((course, i, arr) => (
              <Tr
                key={course._id}
                className="flex gap-x-10 px-6 py-8 border-b border-richblack-800 last:border-b-0"
              >
                {/* Course info */}
                <Td className="flex flex-1 gap-x-4">
                  <img
                    src={course?.thumbnail}
                    alt={course?.courseName}
                    className="h-[148px] w-[220px] rounded-lg object-cover"
                  />
                  <div className="flex flex-col justify-between">
                    {/* Title */}
                    <p className="text-lg font-semibold text-richblack-5">
                      {course.courseName}
                    </p>

                    {/* Description */}
                    <p className="text-xs text-richblack-300">
                      {course.courseDescription?.split(" ").length >
                        TRUNCATE_LENGTH
                        ? course.courseDescription
                          .split(" ")
                          .slice(0, TRUNCATE_LENGTH)
                          .join(" ") + "..."
                        : course.courseDescription}
                    </p>

                    {/* Created At */}
                    <p className="text-[12px] text-white">
                      Created:{" "}
                      {course.createdAt ? formatDate(course.createdAt) : "N/A"}
                    </p>

                    {/* Status pill */}
                    {course.status === COURSE_STATUS.DRAFT ? (
                      <p className="flex w-fit flex-row items-center gap-2 rounded-full bg-richblack-700 px-2 py-[2px] text-[12px] font-medium text-pink-100">
                        <HiClock size={14} />
                        Drafted
                      </p>
                    ) : (
                      <div className="flex w-fit flex-row items-center gap-2 rounded-full bg-richblack-700 px-2 py-[2px] text-[12px] font-medium text-yellow-100">
                        <p className="flex h-3 w-3 items-center justify-center rounded-full bg-yellow-100 text-richblack-700">
                          <FaCheck size={8} />
                        </p>
                        Published
                      </div>
                    )}
                  </div>
                </Td>

                {/* Duration (sum of subsection timeDuration) */}
                <Td className="text-sm font-medium text-richblack-100 min-w-[80px]">
                  {getCourseDuration(course)}
                </Td>

                {/* Price */}
                <Td className="text-sm font-medium text-richblack-100 min-w-[80px]">
                  ₹{course.price}
                </Td>

                {/* Actions */}
                <Td className="text-sm font-medium text-richblack-100 min-w-[90px]">
                  <button
                    disabled={loading}
                    onClick={() => {
                      navigate(`/dashboard/edit-course/${course._id}`)
                    }}
                    title="Edit"
                    className="px-2 transition-all duration-200 hover:scale-110 hover:text-caribbeangreen-300 disabled:opacity-50"
                  >
                    <FaEdit size={20} />
                  </button>

                  <button
                    disabled={loading}
                    onClick={() => {
                      setConfirmationModal({
                        text1: "Do you want to delete this course?",
                        text2:
                          "All the data related to this course will be deleted.",
                        btn1Text: "Delete",
                        btn2Text: "Cancel",
                        btn1Handler: !loading
                          ? () => handleCourseDelete(course._id)
                          : () => { },
                        btn2Handler: !loading
                          ? () => setConfirmationModal(null)
                          : () => { },
                      })
                    }}
                    title="Delete"
                    className="px-1 transition-all duration-200 hover:scale-110 hover:text-[#ff0000] disabled:opacity-50"
                  >
                    <MdDelete size={20} />
                  </button>
                </Td>
              </Tr>
            ))
          )}
        </Tbody>
      </Table>

      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </div>
  )
}

export default CourseTable
