import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { setCourse } from '../../../../../slices/courseSlice';
import { updateSubSection, createSubSection } from '../../../../../services/operations/courseDetailsAPI';
import { RxCross1 } from "react-icons/rx";
import IconBtn from '../../../../common/IconBtn';
import Upload from '../Upload';

const SubSectionModal = ({
    modalData,
    setModalData,
    add = false,
    view = false,
    edit = false,   

}) => {

    const {
        register,
        handleSubmit,
        setValue,
        formState:{errors},
        getValues,

    } = useForm();

    const dispatch = useDispatch();
    const [loading , setLoading] = useState(false);
    const {course} = useSelector((state)=> state.course);
    const {token} = useSelector((state)=> state.auth);

    useEffect(() =>{
        if(view || edit){
            setValue("lectureTitle" , modalData.title)
            setValue("lectureDesc" , modalData.description)
            setValue("lectureVideo" , modalData.videoUrl)

        }
    },[])

    const isFormUpdated =() => {
        const currentValues = getValues();
        if(currentValues.lectureTitle !== modalData.title || 
            currentValues.lectureDesc !== modalData.description ||
            currentValues.lectureVideo !== modalData.videoUrl)
            {
                return true;
            }
        else{
            return false;
        }
    }

    const handleEditSubSection = async () => {
        const currentValues = getValues();
        const formData = new FormData();

        formData.append("sectionId", modalData.sectionId)
        formData.append("subSectionId", modalData._id)

        if(currentValues.lectureTitle !== modalData.title){
            formData.append("title", currentValues.lectureTitle);
        }

        if(currentValues.lectureDesc !== modalData.description){
            formData.append("description", currentValues.lectureDesc);
        }

        if(currentValues.lectureVideo !== modalData.videoUrl){
            formData.append("video", currentValues.lectureVideo);
        }

        setLoading(true);
        const result = await updateSubSection(formData, token);
        if(result){
            const updatedCourseContent = course.courseContent.map((section) => 
            section._id === modalData.sectionId ? result : section);
                
            const updatedCourse = {...course ,courseContent : updatedCourseContent}
            dispatch(setCourse(updatedCourse));
        }
        setModalData(null);
        setLoading(false);

    }


    const onSubmit = async (data) => {
        if(view){
            return;
        }
        if(edit){
            if(!isFormUpdated){
                toast.error("No changes made");
            }
            else{
                handleEditSubSection();
            }
            return;
        }

        const formData = new FormData();
        formData.append("sectionId", modalData)
        formData.append("title", data.lectureTitle)
        formData.append("description", data.lectureDesc)
        formData.append("video", data.lectureVideo)
        setLoading(true);
        // API call
        const result = await createSubSection(formData, token);

        if(result){
            const updatedCourseContent = course.courseContent.map((section) => 
            section._id === modalData ? result : section);
                
            const updatedCourse = {...course ,courseContent : updatedCourseContent}
            dispatch(setCourse(updatedCourse))
        }
        setModalData(null);
        setLoading(false);

    }
  return (
    <div>

        <div className=' top-16 w-[700px] h-full opacity-100 flex flex-col rounded-lg border border-richblack-400 '>
            <div className=' flex flex-row justify-between bg-richblack-800 p-3 rounded-t-lg'>
                <p className=' text-xl font-bold'>{view && "Viewing" }{add && "Adding"} {edit && "Editing"} Lecture</p>
                <button 
                    onClick={()=> (!loading ? setModalData(null) : {})}
                >
                    <RxCross1 />
                </button>
            </div>
            <form 
                onSubmit={handleSubmit(onSubmit)}
                className=' space-y-3 bg-richblack-900 p-5 rounded-b-lg'
            >
                <Upload
                    name="lectureVideo"
                    label="Lecture Video"
                    register={register}
                    setValue={setValue}
                    errors={errors}
                    video={true}
                    viewData={view ? modalData.videoUrl : null}
                    editData={edit ? modalData.videoUrl : null}

                />
                <div>
                    <lable className=' text-[12px] text-richblack-5' htmlFor='lectureTitle'>Lecture Title<sup className='text-pink-300'>*</sup></lable>
                    <input
                        id='lectureTitle'
                        placeholder='Enter Lecture Title'
                        {...register("lectureTitle", {require:true})}
                        className='w-full px-3 py-2  bg-richblack-700 rounded-md '
                    />
                    {
                        errors.lectureTitle && (
                            <span>Lecture Title Required**</span>
                        )
                    }
                </div>
                <div>
                    <lable className=' text-[12px] text-richblack-5' htmlFor="lectureDesc">Lecture Description<sup className='text-pink-300'>*</sup></lable>
                    <textarea
                        id='lectureDesc'
                        placeholder='Enter Lecture Discription'
                        {...register("lectureDesc", {require:true})}
                        className='h-[130px] px-3 py-2 w-full bg-richblack-700 rounded-md'

                    />
                    {
                        errors.lectureDesc && (
                            <span>Description Required**</span>
                        )
                    }
                </div>

                {
                    !view && (
                        <div>
                            <IconBtn
                                text={loading ? "Loading..." : edit ? "Save Changes" : "Save" }
                            />
                        </div>
                    )
                }
            </form>
        </div>

    </div>
  )
}

export default SubSectionModal