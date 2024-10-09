import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom';
import {buyCourse} from "../services/operations/StudentFeatureAPI"
import { fetchCourseDetails } from "../services/operations/courseDetailsAPI";
import GetAvgRating from "../utils/avgRating"
import { MdOutlineInfo } from "react-icons/md";
import { MdLanguage } from "react-icons/md";
import Error from "./Error"
import {formatDate} from "../services/formatDate"
import ConfirmationModal from "../components/common/ConfirmationModal"
import RatingStars from "../components/common/RatingStars"
import CourseDetailCard from "../components/core/Course/CourseDetailsCard"
import CourseAccordionBar from '../components/core/Course/CourseAccordionBar';
import Footer from '../components/common/Footer';

const CourseDetails = () => {

    const {user} = useSelector((state) => state.profile);
    const {token} = useSelector((state) => state.auth);
    const {loading} = useSelector( (state) => state.profile)
    const {paymentLoading} = useSelector((state)=> state.course);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {courseId} = useParams();

    const [response , setResponse] = useState(null)
    const [confirmationModal, setConfirmationModal] = useState(null);

    useEffect( () => {
        const getCourseFullDetails = async() => {
            try{
                const res = await fetchCourseDetails(courseId);
                setResponse(res)
            }catch(error){
                console.log("Could not fetch course details");
            }
        }
        getCourseFullDetails();
    },[courseId])

    // Claculate Avg Value
    const [avgReviewCount, setAverageReviewCount] = useState(0)
    useEffect(()=> {
        const count = GetAvgRating(response?.data?.courseDetails.ratingAndReview);
        setAverageReviewCount(count);
    },[response])

    //Collapse All
    const [isActive, setIsActive] = useState(Array(0))
    const handleActive = (id) => {
    // console.log("called", id)
        setIsActive(
         !isActive.includes(id)
            ? isActive.concat([id])
            : isActive.filter((e) => e !== id)
        )
    }

    // Total No of Lectures
    const [totalNoOfLectures, setTotalNoOfLectures] = useState(0);
    useEffect(()=> {
        let lectures = 0;
        response?.data?.courseDetails?.courseContent?.forEach((sec) => {
            lectures += sec.subSection.length || 0
        })
        setTotalNoOfLectures(lectures);

    },[response]);

    if(loading || !response) {
        return (
            <div className=' grid min-h-[clac(100vh-3.5rem)] place-items-center'>
                <div className=' spinner'></div>
            </div>
        )
    }
    if(!response.success) {
        return (<Error />)
    }

    const {
        _id: course_id,
        courseName,
        courseDescription,
        thumbnail,
        price,
        whatYouWillLearn,
        courseContent,
        ratingAndReview,
        instructor,
        studentsEnrolled,
        createdAt,
    } = response.data?.courseDetails;

    const handleBuyCourse = () => {
        
        if(token) {
            buyCourse(token, [courseId], user, navigate, dispatch);
            return;
        }
        setConfirmationModal({
            text1:"you are not Logged in",
            text2:"Please login to purchase the course",
            btn1Text:"Login",
            btn2Text:"Cancel",
            btn1Handler:() => navigate("/login"),
            btn2Handler:()=>setConfirmationModal(null),
        })
    }

    if (paymentLoading) {
    // console.log("payment loading")
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner"></div>
      </div>
    )
  }

   return (
    <>
        <div className={`relative w-full bg-richblack-800`}>
         {/* Hero Section */}
            <div className="mx-auto box-content px-4 lg:w-[1260px] 2xl:relative">
                <div className=' mx-auto grid min-h-[450px] max-w-maxContentTab justify-center py-8 lg:mx-0 lg:justify-items-start lg:py-0 xl:max-w-[810px] '>
                    <div  className="relative block max-h-[30rem] lg:hidden">
                        <div className=' absolute bottom-0 left-0 h-full w-full shadow-[#161D29_0px_-64px_36px_-28px_inset]'>
                        </div>
                        <img 
                            src={thumbnail}
                            alt='course thumbnail'
                            className='aspect-auto w-full'
                        />
                    </div>
                    <div className={`z-30 my-5 flex flex-col justify-center gap-4 py-5 text-lg text-richblack-5`}
                    >
                        <div>
                            <p className='text-4xl font-bold text-richblack-5 sm:text-[42px]'>{courseName}</p>
                        </div>
                        
                        <p className='text-richblack-400' >{courseDescription}</p>
                        <div className='flex  text-mdflex-wrap items-center gap-x-2'>
                            <span 
                                className=' text-yellow-100 text-lg'>
                                {avgReviewCount}
                            </span>
                            <RatingStars 
                                Review_Count={avgReviewCount} Star_Size={24} 
                            />
                            <span 
                                className=' text-md text-richblack-100'
                            >
                                {`(${ratingAndReview.length}  Rating ) `}
                            </span>
                            <span 
                                className=' text-md text-richblack-100'
                            >
                                {`${studentsEnrolled.length} Students enrolled`}
                            </span>
                        </div>

                        <div>
                            <p className=''>
                                Created By : {`${instructor.firstName}
                                ${instructor.lastName}`}
                            </p>
                        </div>
                        <div className='flex flex-wrap gap-5 text-lg'>
                            <p className=' flex items-center gap-2'>
                                {" "}
                                <MdOutlineInfo size={18} />
                                Created At:{formatDate(createdAt)}
                            </p>
                            <p className=' flex items-center gap-1'>
                                <MdLanguage size={18} />
                                {" "} English
                            </p>
                        </div>
                    </div>  
                    <div className=' flex w-full flex-col gap-4 border-y border-y-richblack-500 py-4 lg:hidden' >
                        <p className=' space-x-3 pb-4 text-3xl font-semibold text-richblack-5'>
                            Rs. {price}
                        </p>
                        <button className=' yellowButton' onClick={handleBuyCourse}>
                            Buy Now
                        </button>
                        <button className=' blackButton'>
                            Add to Cart
                        </button>
                    </div>
                </div>
            
                {/* Courses Card */}
                <div className="right-[1rem] top-[60px] mx-auto hidden min-h-[600px] w-1/3 max-w-[410px] translate-y-24 md:translate-y-0 lg:absolute  lg:block">
                    <CourseDetailCard 
                        course = {response?.data?.courseDetails}
                        setConfirmationModal = {setConfirmationModal}
                        handleBuyCourse = {handleBuyCourse}
                    />
                </div>   
            </div>
        </div>
           


        <div className="mx-auto box-content px-4 text-start text-richblack-5 bg-richblack-900 lg:w-[1260px]">
            <div className="mx-auto max-w-maxContentTab lg:mx-0 xl:max-w-[810px]">
                {/* What will you learn section */}
                <div className=' my-8 border border-richblack-600 p-8 '>
                    <p className=' text-3xl font-semibold'>What you will learn</p>
                    <div className=' mt-5'>
                        {whatYouWillLearn}
                    </div>
                </div>
                {/* Course Content Section */}
                <div className='max-w-[830px] '>
                    <div className=' flex flex-col gap-3'>
                        <p className='text-[28px] font-semibold'>Course content</p>
                        <div className=' flex flex-wrap gap-2 justify-between'>
                            <div className=' flex gap-2'>
                                <span>
                                    {courseContent.length} sections • 
                                </span>
                                <span>
                                    {totalNoOfLectures}lectures •
                                </span>
                                <span>
                                    {response?.data?.totalDuration} total length
                                </span>
                            </div>
                            <div>
                                <button 
                                    onClick={() => setIsActive([])}
                                    className=' text-yellow-100'
                                >
                                    Collapse all section
                                </button>
                            </div>
                        </div>  
                    </div>
                     
                    {/* Course Details Accordion */}
                    <div className='py-4'>
                        {courseContent?.map((course, index) => (
                            <CourseAccordionBar
                                course={course}
                                key={index}
                                isActive={isActive}
                                handleActive={handleActive}
                            />
                        ))}
                    </div>

                    {/* Author Details */}
                    <div className=' mb-12 py-4'>
                        <p className='text-[28px] font-semibold'>Author</p>
                        <div className=' flex items-center gap-4 py-4'>
                            <img 
                                src={
                                    instructor.image 
                                    ? instructor.image
                                    : `https://api.dicebear.com/5.x/initials/svg?seed=${instructor.firstName} ${instructor.lastName}`
                                }
                                alt='Author'
                                className='h-14 w-14 rounded-full object-cover'
                            />
                            <p className=' text-lg'>{`${instructor.firstName} ${instructor.lastName}`}</p>
                        </div>
                        <p className=' text-richblack-50'>{instructor?.additionalDetails?.about}</p>
                    </div>
                </div>
            </div>    
        </div>

        <Footer/>
        {confirmationModal && <ConfirmationModal ModalData={confirmationModal} />}
    </>
  )
}

export default CourseDetails