import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import IconBtn from '../../../../common/IconBtn';
import { IoMdAddCircleOutline } from "react-icons/io";
import { useDispatch, useSelector } from 'react-redux';
import { FaChevronRight } from "react-icons/fa";
import { 
  setCourse, 
  setEditCourse, 
  setStep 
} from '../../../../../slices/courseSlice';
import {toast} from 'react-hot-toast';
import NestedView from "./NestedView"
import { 
  createSection, 
  updateSection 
} from '../../../../../services/operations/courseDetailsAPI';


const CourseBuilderForm = () => {

  const { 
    register , 
    handleSubmit , 
    setValue, 
    formState: {errors},
  } = useForm();

  const {course} = useSelector((state) => state.course)
  const {token} = useSelector((state) => state.auth)
  const [loading , setLoading] = useState(false)
  const [editSectionName , setEditSectionName] = useState(null);
  const dispatch = useDispatch();

  // handle form submission
  const onSubmit = async (data) =>  {

    setLoading(true);

    let result;

    if(editSectionName){
      result = await updateSection (
        {
           sectionName: data.sectionName,
           sectionId: editSectionName,
           courseId: course._id,
        },
        token)
    }
    else{
      result = await createSection(
        {
          sectionName: data.sectionName,
          courseId: course._id,
        },
        token)
    }

    // values update karni hai
    if(result){
      dispatch(setCourse(result))
      setEditSectionName(null)
      setValue("sectionName", "")
    }
    setLoading(false);
    // loading false
  }

  const cancleEdit = () =>{
      setEditSectionName(null)
      setValue("sectionName" , "");
    }

  const GoBack = () => {
    dispatch(setStep(1))
    dispatch(setEditCourse(true))
  }

  const goToNext = () => {
    if (course.courseContent.length === 0) {
      toast.error("Please add atleast one section")
      return
    }
    if (
      course.courseContent.some((section) => section.subSection.length === 0)
    ) {
      toast.error("Please add atleast one lecture in each section")
      return
    }
    dispatch(setStep(3))
  }

  

  const handleChangeEditSectionName = (sectionId, sectionName) => {
    if (editSectionName === sectionId) {
      cancleEdit()
      return
    }
    setEditSectionName(sectionId)
    setValue("sectionName", sectionName)
  }


  return (
    <div >
      <div className=' text-white mt-5 bg-richblack-800 rounded-lg p-8 space-y-8'>
        <p className=' text-2xl font-bold'>Course Builder</p>

        {course.courseContent.length > 0 && (
          <NestedView  handleChangeEditSectionName={handleChangeEditSectionName}/>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
           <div>
              
              <input
                id='sectionName'
                disabled={loading}
                placeholder='Add a section to build your course'
                {...register('sectionName', {required: true})}
                className='w-full form-style'
              />
              {
                errors.sectionName && (
                  <span className="ml-2 text-xs tracking-wide text-pink-200">
                    SectionName is required**
                  </span>
                )
              }
           </div>
           <div className=' mt-4 flex gap-3'>
              <IconBtn
                disabled={loading}
                text={editSectionName ? "Edit Section Name" : "Create Section"}
                outline={true}
                type="submit"
                customClasses={" text-yellow-50"}
                >
                <IoMdAddCircleOutline size={20}lassName="text-yellow-50" />
              </IconBtn>
              {editSectionName && (
                <button 
                  type='button'
                  onClick={cancleEdit}
                  className=' text-sm text-richblack-300 underline'
                >
                  Cancle Edit
                </button>
              )}
           </div>
        </form>
    </div>
        

    <div className=' flex gap-3 justify-end mt-10 '>
      <button
        onClick={GoBack}
        className={`flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900`}
      >
        Back
      </button>
      <IconBtn
        disabled={loading}
        text={"Next"}
        onclick={goToNext}
      >
        <FaChevronRight />
      </IconBtn>
              
    </div>
  </div>


  )
}

export default CourseBuilderForm 