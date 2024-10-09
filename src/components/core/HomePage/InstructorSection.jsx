import React from 'react'
import Instructor from '../../../assets/Images/Instructor.png'
import HighlightText from './HighlightText'
import CTAButton from "./Button"
import { IoMdArrowRoundForward } from "react-icons/io";


const InstructorSection = () => {
  return (
    <div className=' flex flex-row w-full items-center gap-20 my-16'>
        <div className=' w-[55%] '>
            <img
               src={Instructor}
               alt='Instructor'
               className=''
            />
        </div>
        <div className='flex flex-col w-[45%] gap-8'>
            <div className=' text-4xl font-bold '>
                Become an <br/>
                <HighlightText text={" Instructor"}/>
            </div>

            <p className=' text-base font-semibold text-richblack-300 w-[90%]'>Instructors from around the world teach millions of students on StudyNotion. We provide the tools and skills to teach what you love.</p>

            <div className=' w-fit'>
                <CTAButton active={true} linkto={'/signUp'}>
                    <div className=' flex font-bold gap-2 justify-start items-center'>
                        Start Teaching Today
                        <IoMdArrowRoundForward/>
                    </div> 
                </CTAButton>
            </div>
                
            
           
           

        </div>
    </div>
  )
}

export default InstructorSection