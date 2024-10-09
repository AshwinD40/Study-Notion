import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form';
import { CgClose } from "react-icons/cg";
import { useSelector } from 'react-redux';
import ReactStars from "react-rating-stars-component";
import IconBtn from '../../common/IconBtn';
import { createRating } from '../../../services/operations/courseDetailsAPI';

const CourseReviewModal = ({setReviewModal}) => {

    const {user} = useSelector((state)=>state.profile);
    const {token} = useSelector((state) => state.auth);
    const {courseEntireData} = useSelector((state)=> state.viewCourse);


    const {
        register,
        handleSubmit,
        setValue,
        formState:{errors}
    }= useForm();

    useEffect( () => {
        setValue("courseExperience", "")
        setValue("courseRating", 0)
    },[])

    const ratingChange = (newRating) => {
        setValue("courseRating", newRating);
    }

    const onSubmit= async (data) => {
        await createRating(
            {
                courseId:courseEntireData._id,
                rating:data.courseRating,
                review:data.courseExperience,
                
            },
            token
        )
        setReviewModal(false);
    }

  return (
    <div className=' h-[400px] w-[600px] mx-auto absolute top-20 left-[30%] '>
        <div className=' text-white'>
            {/* modal header*/}
            <div className=' flex justify-between p-3 bg-richblack-700 rounded-t-md border-b-[1px]'>
                <p className=' font-bold'>Add Review</p>
                <button
                    onClick={() => setReviewModal(false)}
                >
                    <CgClose size={24} />
                </button>
            </div>

            {/*Modal body */}
            <div className=' flex flex-col bg-richblack-800 items-center  rounded-b-md py-5'>
                <div className=' flex flex-row gap-3'>
                    <img 
                        src={user?.image}
                        alt='user image'
                        className=' aspect-square w-[50px] rounded-full object-cover'
                    
                    />
                    <div className=''>
                        <p className='text-richblack-5 font-bold'>{user?.firstName} {user?.lastName}</p>
                        <p>Posting Publicly</p>
                    </div>
                </div>

                <form 
                    onSubmit={handleSubmit(onSubmit)}
                    className=' flex flex-col mt-6 items-center'
                >
                    <ReactStars
                        count={5}
                        onChange={ratingChange}
                        size={24}
                        color2={'#ffd700'}
                    />

                    <div className=' px-4'>
                        <label htmlFor='courseExperience' className=' text-sm'>Add your experience <span className=' text-pink-300'>*</span></label>
                        <textarea 
                         id='courseExperience'
                         placeholder='Enter your experince'
                         {...register("courseExperience",{required:true})}
                         className=' form-style min-h-[130px] w-full'
                        />
                        {
                            errors.courseExperience && (
                                <span className=' text-sm text-pink-200'>Please add your experience</span>
                            )
                        }
                    </div>
                    <div className=' flex flex-row gap-3 py-3'>
                        <button 
                            onClick={() => setReviewModal(false)}
                            className=' py-3 px-4 text-richblack-5 font-bold rounded-md bg-richblack-700 '
                        >
                            Cancle
                        </button>
                        <IconBtn 
                         text="Save"/>
                    </div>



                </form>
            </div>
        </div>
    </div>
  )
}

export default CourseReviewModal