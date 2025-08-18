import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux';
import { TbCoinRupee } from "react-icons/tb";
import { MdNavigateNext } from "react-icons/md"
import { 
  addCourseDetails, 
  editCourseDetails, 
  fetchCourseCategories 
} from '../../../../../services/operations/courseDetailsAPI';
import ChipInput from './ChipInput';
import RequirementField from './RequirementField'
import {setCourse, setStep} from "../../../../../slices/courseSlice"
import IconBtn from "../../../../common/IconBtn"
import Upload from "../Upload"
import {toast} from 'react-hot-toast';
import {COURSE_STATUS} from "../../../../../utils/constants"

const CourseInformationForm = () => {

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState:{errors},
  } = useForm();
  
  const dispatch = useDispatch();
  const {token} =  useSelector((state)=> state.auth)
  const {course , editCourse} = useSelector((state) => state.course);
  const [loading , setLoading] = useState(false);
  const [courseCategories , setCourseCategories] = useState([]);

  useEffect(()=>{
    const getCategories = async() => {
      setLoading(true);
      const categories = await fetchCourseCategories();
      if(categories.length > 0){
        setCourseCategories(categories);
      }
      setLoading(false);
    }

    if(editCourse){
      setValue("courseTitle", course.courseName);
      setValue("courseShortDesc", course.courseDescription);
      setValue("coursePrice", course.price);
      setValue("courseTags", course.tag);
      setValue("courseBenefits", course.whatYouWillLearn);
      setValue("courseCategory", course.category);
      setValue("courseRequirements", course.instructions);
      setValue("courseImage", course.thumbnail);
    }

    getCategories();

  },[])

  const isFormUpdated = () =>{
    const currentValues = getValues();


    if(currentValues.courseTitle !== course.courseName ||
      currentValues.courseShortDesc !== course.courseDescription ||
      currentValues.coursePrice !== course.price ||
      currentValues.courseTags !== course.tag ||
      currentValues.courseBenefits !== course.whatYouWillLearn ||
      currentValues.courseCategory._id !== course.category._id ||
      currentValues.courseImage !== course.thumbnail ||
      currentValues.courseRequirements.toString() !== course.instructions.toString() )
      return true;
    else
      return false;

  }

  const onSubmit = async(data) =>{
    if(editCourse){

      if(isFormUpdated()){
        const currentValues = getValues();
        const formData = new FormData();

        formData.append("courseId",course._id)
        if(currentValues.courseTitle !== course.courseName){
          formData.append("courseName", data.courseTitle);
        }

        if(currentValues.courseShortDesc !== course.courseDescription){
          formData.append("courseDescription", data.courseShortDesk);
        }

        if(currentValues.coursePrice !== course.price){
          formData.append("price", data.coursePrice);
        }

        if (currentValues.courseTags.toString() !== course.tag.toString()) {
          formData.append("tag", JSON.stringify(data.courseTags))
        }

        if(currentValues.courseBenefits !== course.whatYouWillLearn){
         formData.append("whatYouWillLearn", data.courseBenefits);
        }
 
        if(currentValues.courseCategory._id !== course.category._id){
          formData.append("category", data.courseCategory)
        }

        if(currentValues.courseRequirements.toString() !== course.instructions.toString()
        ){
          formData.append(
            "instruction", 
            JSON.stringify(data.courseRequirements)
          )
        }

        if (currentValues.courseImage !== course.thumbnail) {
          formData.append("thumbnailImage", data.courseImage)
        }

        setLoading(true);
        const result = await editCourseDetails(formData, token )
        setLoading(false);
        if(result){
          dispatch(setStep(2));
          dispatch(setCourse(result))
        }  
      }
      else{
        toast.error("No changes made to this form ")
      }

      return;

    }

    // create new course

    const formData = new FormData()
    formData.append("courseName", data.courseTitle)
    formData.append("courseDescription", data.courseShortDesc)
    formData.append("price", data.coursePrice)
    formData.append("tag", JSON.stringify(data.courseTags))
    formData.append("whatYouWillLearn", data.courseBenefits)
    formData.append("category", data.courseCategory)
    formData.append("instructions", JSON.stringify(data.courseRequirements))
    formData.append("status", COURSE_STATUS.DRAFT)
    formData.append("thumbnailImage", data.courseImage)
    setLoading(true)

    setLoading(true);
    const result = await addCourseDetails(formData , token);
    if(result){
      dispatch(setStep(2))
      dispatch(setCourse(result))
    }
    setLoading(false);
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className=' rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6 space-y-8 mt-5'
    >
      <div className="flex flex-col space-y-2">
        <label htmlFor='courseTitle' className=' text-sm text-richblack-100'>Course Title <sup className='text-pink-300'>*</sup></label>
        <input 
          id='courseTitle'
          placeholder='Enter course title'
          {...register("courseTitle", {required:true})}
          className=' form-style w-full'
        
        />
        {
          errors.courseTitle && (
            <span className="ml-2 text-xs tracking-wide text-pink-200">Course Title is required **</span>
          )
        }

      </div>
      <div className="flex flex-col space-y-2">
        <label htmlFor='courseDescription' className=' text-sm text-richblack-100'>
          Course Short Description <sup className='text-pink-300'>*</sup></label>
        <textarea 
          id='courseDescription'
          placeholder='Enter Description'
          {...register("courseShortDesc", {required:true})}
          className="form-style resize-x-none min-h-[130px] w-full"
        
        />
        {
          errors.courseDescription && (
            <span  className="ml-2 text-xs tracking-wide text-pink-200">Course Description is required **</span>
          )
        }

      </div>
      <div className="flex flex-col space-y-2">
        <label htmlFor='coursePrice' className=' text-sm text-richblack-100'>
          Course Price <sup className='text-pink-300'>*</sup>
        </label>
        <div className="relative">
          <input 
            id='coursePrice'
            placeholder='Enter Price'
            {...register("coursePrice", {
              required:true,
              valueAsNumber:true,
              pattern: {
                value: /^(0|[1-9]\d*)(\.\d+)?$/,
              },
            
            })}
            className=' form-style w-full !pl-12'
        
          />
          <TbCoinRupee className="absolute left-3 top-1/2   inline-block -translate-y-1/2 text-2xl text-richblack-400"
          />
        </div>  
        {
          errors.coursePrice && (
            <span className="ml-2 text-xs tracking-wide text-pink-200">Course Price is required **</span>
          )
        }

      </div>
      <div className="flex flex-col space-y-2">
        <label htmlFor='courseCategory' className=' text-sm text-richblack-100'>Category<sup className='text-pink-300'>*</sup></label>
        <select
          id='courseCategory'
          defaultValue={''}
          {...register("courseCategory",{required:true})}
          className=' bg-richblack-700 rounded-md shadow-sm shadow-richblack-300 form-style text-richblack-200 py-2 px-3 w-full'
        >
          <option value="" disabled>
            Choose a Category
          </option>
          {
            !loading && 
              courseCategories.map( (category , index) =>(
                <option key={index} value={category?._id}>
                  {
                  category?.name
                  }
                </option> 
              ))
          }
        </select>
        {
          errors.courseCategory && (
            <span className="ml-2 text-xs tracking-wide text-pink-200">
              Course Category is Required **
            </span>
          )
        }
      </div>

      {/* create custom component for handling tags input*/}
      {<ChipInput
         label= "Tags"
         name="courseTags"
         placeholder="Enter tag and press Enter"
         register={register}
         errors={errors}
         setValue={setValue}
         getValues={getValues}

      />}

      {/* create component for uploading and showing preview of media*/}
      {<Upload
         label= "Course Thumbnail"
         name="courseImage"
         register={register}
         errors={errors}
         setValue={setValue}
         editData={editCourse ? course?.thumbnail : null}
         
      />}

      <div className="flex flex-col space-y-2">
        <label htmlFor='courseBenefits' className=' text-sm text-richblack-100'>
          Benefits of the course<sup className='text-pink-300'>*</sup></label>
        <textarea
          id='courseBenefits'
          placeholder='Enter Benefits of the course'
          {...register("courseBenefits", {required:true})}
          className=' min-h-[130px] form-style bg-richblack-700 rounded-md shadow-sm shadow-richblack-300 resize-x-none py-2 px-3 w-full'
        />
        {
          errors.courseBenefits && (
            <span className="ml-2 text-xs tracking-wide text-pink-200">Benefits of the course is Required **</span>
          )
        }
      
      </div>
      
      <RequirementField
        name="courseRequirements"
        label="Requirements/Instruction"
        register={register}
        errors={errors}
        setValue={setValue}
        getValues={getValues}
      />

      <div className="flex justify-end gap-x-2">
        {
          editCourse && (
            <button
              onClick={()=> dispatch(setStep(2))}
              disabled={loading}
              className={`flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900`}
            >
              Continue without saving
            </button>
          )
        }
        <IconBtn
          disabled={loading}
          text={!editCourse ? "Next" : "Save Changes"}
        >
          <MdNavigateNext />
        </IconBtn>

      </div>
      
    </form>
  )
}

export default CourseInformationForm