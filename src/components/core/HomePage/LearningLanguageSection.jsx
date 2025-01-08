import React from 'react'
import HighlightText from './HighlightText';
import CTAButton from './Button'
import know_your_progress from "../../../assets/Images/Know_your_progress.png";
import compare_with_other from "../../../assets/Images/Compare_with_others.png";
import plan_your_lessons from "../../../assets/Images/Plan_your_lessons.png";

const LearningLanguageSection = () => {
  return (
    
    <div>
      <div className=' text-4xl font-semibold text-center my-10'>
        Your swiss knife for {" "}
        <HighlightText text={"learning any language"}/>
          <div className=' text-center font-medium  text-richblack-700 lg:w-[75%] mx-auto text-base leading-6'>
            Using spin making learning multiple languages easy. with 20+ languages realistic voice-over, progress tracking, custom schedule and more.
          </div>   
      </div>     
        <div className=' flex flex-col lg:flex-row  items-center justify-center mt-8 lg:mt-0'>
          <img
            src={know_your_progress}
            alt='Know your progress'
            className='onject-contain lg:-mr-32'
          />
          <img
              src={compare_with_other}
              alt='Compare with others'
              className='onject-contain lg:-mb-10 lg:-mt-0'
            />
          <img
            src={plan_your_lessons}
            alt='Plan your lessons'
            className='onject-contain lg:-ml-32 lg:-mt-5 -mt-16 '
          />  
        </div>

            <div className=' w-fit mx-auto lg:mb-20 mb-8 '>
                <CTAButton active={true} linkto={'/signUp'}>
                    Learn More
                </CTAButton>
            </div>
    </div>
    
  )
}

export default LearningLanguageSection