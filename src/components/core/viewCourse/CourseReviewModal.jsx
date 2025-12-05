import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form';
import { CgClose } from "react-icons/cg";
import { useSelector } from 'react-redux';
import ReactStars from "react-rating-stars-component";
import IconBtn from '../../common/IconBtn';
import { createRating } from '../../../services/operations/courseDetailsAPI';

const CourseReviewModal = ({ setReviewModal }) => {

    const { user } = useSelector((state) => state.profile);
    const { token } = useSelector((state) => state.auth);
    const { courseEntireData } = useSelector((state) => state.viewCourse);


    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors }
    } = useForm();

    useEffect(() => {
        setValue("courseExperience", "")
        setValue("courseRating", 0)
    }, [setValue])

    const ratingChange = (newRating) => {
        setValue("courseRating", newRating);
    }

    const onSubmit = async (data) => {
        await createRating(
            {
                courseId: courseEntireData._id,
                rating: data.courseRating,
                review: data.courseExperience,

            },
            token
        )
        setReviewModal(false);
    }

    return (
        <div className='fixed inset-0 z-[1000] !mt-0 grid place-items-center overflow-auto bg-white bg-opacity-10 backdrop-blur-sm'>
            <div className='w-11/12 max-w-[700px] rounded-lg border border-richblack-400 bg-richblack-800'>
                {/* modal header*/}
                <div className=' flex justify-between p-5 bg-richblack-700 rounded-t-lg border-b-[1px] border-richblack-25'>
                    <p className=' text-xl font-semibold text-richblack-5'>Add Review</p>
                    <button
                        onClick={() => setReviewModal(false)}
                    >
                        <CgClose size={24} className='text-richblack-5' />
                    </button>
                </div>

                {/*Modal body */}
                <div className=' p-6'>
                    <div className=' flex items-center justify-center gap-x-4'>
                        <img
                            src={user?.image}
                            alt={`profile-${user.firstName}`}
                            className=' aspect-square w-[50px] rounded-full object-cover'
                        />
                        <div className=''>
                            <p className='text-richblack-5 font-semibold'>{user?.firstName} {user?.lastName}</p>
                            <p className='text-sm text-richblack-5'>Posting Publicly</p>
                        </div>
                    </div>

                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className=' flex flex-col items-center mt-6'
                    >
                        <ReactStars
                            count={5}
                            onChange={ratingChange}
                            size={24}
                            activeColor={'#ffd700'}
                        />

                        <div className=' flex w-11/12 flex-col space-y-2'>
                            <label htmlFor='courseExperience' className=' text-sm text-richblack-5'>Add your experience <span className=' text-pink-200'>*</span></label>
                            <textarea
                                id='courseExperience'
                                placeholder='Add your experience here'
                                {...register("courseExperience", { required: true })}
                                className=' form-style resize-x-none min-h-[130px] w-full'
                            />
                            {
                                errors.courseExperience && (
                                    <span className=' text-sm text-pink-200'>Please add your experience</span>
                                )
                            }
                        </div>
                        <div className=' flex w-11/12 justify-end gap-x-2 mt-4'>
                            <button
                                onClick={() => setReviewModal(false)}
                                className=' rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900 '
                            >
                                Cancel
                            </button>
                            <IconBtn
                                text="Save" />
                        </div>



                    </form>
                </div>
            </div>
        </div>
    )
}

export default CourseReviewModal