import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {toast} from 'react-hot-toast';
import copy from 'copy-to-clipboard';
import { FaShareSquare } from "react-icons/fa"
import {ACCOUNT_TYPE} from "../../../utils/constants"
import { addToCart } from '../../../slices/cartSlice';

function CourseDetailsCard({course , setConfirmationModal , handleBuyCourse}){

  const {user} = useSelector((state) => state.profile);
  const {token} = useSelector((state) => state.auth)
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    thumbnail:ThumbnailImage,
    price:CurrentPrice,

  } = course

  const handleAddToCart = () => {
    if(user && user?.accounttype === ACCOUNT_TYPE.INSTRUCTOR){
      toast.error("You are instructor, you can not cart courses");
      return
    }

    if(token){
      dispatch(addToCart(course));
      toast.success("Course added in Cart")
      return;
    }

    setConfirmationModal({
      text1:"You are not logged in",
      text2:"Please login first",
      btn1Text:"Login",
      btn2text:"Cancle",
      btn1Handler:() => navigate("/login"),
      btn2Handler:() => setConfirmationModal(null),
    })
  }

  const handleShare = () => {
    copy(window.location.href);
    toast.success("Link Copy to Clipboard")
  }
  return (
    <>
      <div 
        className={`flex flex-col gap-4 rounded-md bg-richblack-700 p-4 text-richblack-5`}
      >
        {/* Course Image */}
        <img 
          src={ThumbnailImage}
          alt={course?.courseName}
          className=' max-h-[300px] min-h-[180px] w-[400px] rounded-t-xl overflow-hidden object-cover md:max-w-full'
        />
        <div className=' px-4'>
          <div className=' px-5 pt-5 font-bold text-2xl '>
              Rs. {CurrentPrice}
          </div>
          <div className=' px-5 py-3 gap-y-2 '>
            <button
              className=' py-3 mb-3 rounded-lg bg-yellow-100 shadow-sm shadow-richblack-50 w-full text-black font-semibold'
              onClick={
                user && course?.studentsEnrolled.includes(user?._id) ? () => navigate("/dashboard/enrolled-courses")  : handleBuyCourse
              }
            >
            {
              user && course?.studentsEnrolled.includes(user?._id) ? "Go to Course" : "Buy Now"
            }
            </button>
            { (!course?.studentsEnrolled.includes(user?._id)) && (
              <button
                className=' py-3 rounded-lg bg-richblack-800 shadow-sm shadow-richblack-50 w-full text-richblack-5 font-semibold'
                onClick={handleAddToCart}
              >
                Add To Cart
              </button>
            )}
          </div>
          <div>
            <p className=' text-sm text-richblack-50 text-center pb-5'> 
              30-Day Money-Back Guarantee
            </p>
            <p className=' px-5 text-md font-semibold'>
              This course includes:
            </p>
            <div className=' flex flex-col gap-y-3 px-5'>
              {
                course?.instructions?.map((item , index) => (
                  <p key={index} className=' flex gap-2 text-caribbeangreen-200'>
                    <span>{item}</span>
                  </p>
                ))
              }
            </div>
          </div>
            <div className=' text-center'>
              <button
                className=' mx-auto flex items-center gap-2 py-6  text-yellow-200 text-xl font-bold '
                onClick={handleShare}
              >
                <FaShareSquare size={15} /> Share
              </button>
            </div>
        </div>
      </div>
    </>  
  )
}
export default CourseDetailsCard;