import React from 'react'
import Instructor from '../../../assets/Images/Instructor.png'
import HighlightText from './HighlightText'
import CTAButton from "./Button"
import { IoMdArrowRoundForward } from "react-icons/io";


const InstructorSection = () => {
  return (
    <div>
        <div className=' flex mt-10 flex-col lg:flex-row items-center gap-20'>
            <div className=' lg:w-[50%] '>
                <img
                src={Instructor}
                alt='Instructor'
                className=' shadow-white rounded-md  shadow-[10px_10px]'
                />
            </div>
            <div className='lg:w-[50%] flex flex-col gap-10'>
                <div className=' lg:w-[50%] text-4xl font-bold '>
                    Become an {' '}
                    <HighlightText text={"Instructor"}/>
                </div>

                <p className=' text-[16px] text-justify font-semibold text-richblack-300 w-[90%]'>Instructors from around the world teach millions of students on StudyNotion. We provide the tools and skills to teach what you love.</p>

                <div className=' w-fit'>
                    <CTAButton active={true} linkto={'/signUp'}>
                        <div className=' flex gap-3 items-center'>
                            Start Teaching Today
                            <IoMdArrowRoundForward/>
                        </div> 
                    </CTAButton>
                </div>
            </div>
        </div>
    </div>
    
  )
}

export default InstructorSection