import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux'
import { FaChevronLeft } from "react-icons/fa";
import IconBtn from "../../../../common/IconBtn"
import {setStep, resetCourseState} from "../../../../../slices/courseSlice"
import {editCourseDetails} from "../../../../../services/operations/courseDetailsAPI";
import {COURSE_STATUS} from "../../../../../utils/constants"
import { useNavigate } from 'react-router-dom';


const PublishCourse = () => {

  const {register, handleSubmit, setValue, getValues} = useForm()
  const {course} = useSelector((state)=>state.course);
  const {token} = useSelector((state)=>state.auth);
  const [loading , setLoading] = useState(false);
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    if (course?.status === COURSE_STATUS.PUBLISHED){
      setValue("public", true)
    }
  }, [])

  const goBack = () => {
    dispatch(setStep(2))
  }

  const goToCourses = () => {
    dispatch(resetCourseState());
    navigate("/dashboard/my-courses")
  }

  const handleCoursePublish = async () => {
    if(
      (course?.status === COURSE_STATUS.PUBLISHED && 
      getValues("public") === true) || 
      (course?.status === COURSE_STATUS.DRAFT && 
      getValues("public") === false)
    ){
      // no updation in form
      // no need to make api call
      goToCourses();
      return
    }
    // if form is updated

    const formData = new FormData();
    formData.append("courseId" , course._id)
    const courseStatus = getValues("public") 
      ? COURSE_STATUS.PUBLISHED 
      : COURSE_STATUS.DRAFT
    formData.append("status", courseStatus)

    setLoading(true)
    const result = await editCourseDetails(formData , token); 

    if(result){
      goToCourses()
    }

    setLoading(false)
  }

  const onSubmit=(data)=> {
    handleCoursePublish()
  }

  return (
    <div className=' flex flex-col'>
      <div className=' text-richblack-25 rounded-md p-6 space-y-5  border-[1px] border-richblack-700 bg-richblack-800  '>
        <p className=' text-2xl font-bold'>
          Publish Settings
        </p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="my-4 ">
            <label htmlFor="public" className="inline-flex items-center text-lg">
              <input
                type="checkbox"
                id="public"
                {...register("public")}
                className="border-gray-300 h-4 w-4 rounded bg-richblack-500 text-richblack-400 focus:ring-2 focus:ring-richblack-5"
              />
              <span className="ml-2 text-richblack-400">
                Make this course as public
              </span>
            </label>
          </div>
          <div className="ml-auto flex max-w-max items-center gap-x-4">
            <button
              disabled={loading}
              type="button"
              onClick={goBack}
              className="flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900"
            >
              Back
            </button>
            <IconBtn  disabled={loading} text="Save Changes" />
        </div>
        </form>

      </div>
      
    </div>
    
    
  )
}

export default PublishCourse