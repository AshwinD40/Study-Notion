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
import CategorySelect from './CategorySelector';
import {setCourse, setStep} from "../../../../../slices/courseSlice"
import IconBtn from "../../../../common/IconBtn"
import Upload from "../Upload"
import {toast} from 'react-hot-toast';
import {COURSE_STATUS} from "../../../../../utils/constants"

const CourseInformationForm = () => {

  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    formState:{ errors },
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
    className=" mt-4 space-y-6 rounded-2xl border border-richblack-700/80  bg-richblack-800/80  backdrop-blur-xl  px-4 py-5 md:px-6 md:py-6  shadow-[0_18px_60px_rgba(0,0,0,0.85)]"
  >
    {/* Title */}
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor="courseTitle"
        className="text-xs font-medium uppercase tracking-wide text-richblack-200"
      >
        Course Title <sup className="text-pink-300">*</sup>
      </label>
      <input
        id="courseTitle"
        placeholder="Enter course title"
        {...register("courseTitle", { required: true })}
        className="form-style w-full "
      />
      {errors.courseTitle && (
        <span className="ml-1 text-xs tracking-wide text-pink-200">
          Course title is required
        </span>
      )}
    </div>

    {/* Short Description */}
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor="courseDescription"
        className="text-xs font-medium uppercase tracking-wide text-richblack-200"
      >
        Course Short Description <sup className="text-pink-300">*</sup>
      </label>
      <textarea
        id="courseDescription"
        placeholder="Enter a short description"
        {...register("courseShortDesc", { required: true })}
        className=" form-style w-full min-h-[120px] "
      />
      {errors.courseShortDesc && (
        <span className="ml-1 text-xs tracking-wide text-pink-200">
          Course description is required
        </span>
      )}
    </div>

    {/* Price */}
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor="coursePrice"
        className="text-xs font-medium uppercase tracking-wide text-richblack-200"
      >
        Course Price <sup className="text-pink-300">*</sup>
      </label>
      <div className="relative">
        <input
          id="coursePrice"
          placeholder="Enter price"
          {...register("coursePrice", {
            required: true,
            valueAsNumber: true,
            pattern: {
              value: /^(0|[1-9]\d*)(\.\d+)?$/,
            },
          })}
          className="form-style w-full !pl-11"
        />
        <TbCoinRupee
          className=" pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xl text-richblack-400"
        />
      </div>
      {errors.coursePrice && (
        <span className="ml-1 text-xs tracking-wide text-pink-200">
          Course price is required
        </span>
      )}
    </div>

    {/* Category */}
    <CategorySelect
      name="courseCategory"
      control={control}
      label="Category"
      options={courseCategories}
      loading={loading}
      rules={{ required: "Course category is required" }}
      error={errors.courseCategory}
    />


    {/* Tags */}
    <ChipInput
      label="Tags"
      name="courseTags"
      placeholder="Enter tag and press Enter"
      register={register}
      errors={errors}
      setValue={setValue}
      getValues={getValues}
    />

    {/* Thumbnail */}
    <Upload
      label="Course Thumbnail"
      name="courseImage"
      register={register}
      errors={errors}
      setValue={setValue}
      editData={editCourse ? course?.thumbnail : null}
    />

    {/* Benefits */}
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor="courseBenefits"
        className="text-xs font-medium uppercase tracking-wide text-richblack-200"
      >
        Benefits of the course <sup className="text-pink-300">*</sup>
      </label>
      <textarea
        id="courseBenefits"
        placeholder="What will students gain from this course?"
        {...register("courseBenefits", { required: true })}
        className=" form-style w-full min-h-[130px]"
      />
      {errors.courseBenefits && (
        <span className="ml-1 text-xs tracking-wide text-pink-200">
          Course benefits are required
        </span>
      )}
    </div>

    {/* Requirements */}
    <RequirementField
      name="courseRequirements"
      label="Requirements / Instructions"
      register={register}
      errors={errors}
      setValue={setValue}
      getValues={getValues}
    />

    {/* Footer buttons */}
    <div className="flex justify-end gap-2 pt-2">
      {editCourse && (
        <button
          onClick={() => dispatch(setStep(2))}
          disabled={loading}
          type="button"
          className=" flex items-center gap-2  rounded-md border border-richblack-500  bg-richblack-700/70  px-4 py-2 text-xs md:text-sm font-semibold  text-richblack-50 hover:bg-richblack-600/80  disabled:opacity-60 disabled:cursor-not-allowed transition-all"
        >
          Continue without saving
        </button>
      )}

      <IconBtn disabled={loading} text={!editCourse ? "Next" : "Save Changes"}>
        <MdNavigateNext />
      </IconBtn>
    </div>
  </form>
);

}

export default CourseInformationForm