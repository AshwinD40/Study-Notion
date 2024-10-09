import React from 'react'
import HighlightText from './HighlightText';
import CTAButton from './Button'
import know_your_progress from "../../../assets/Images/Know_your_progress.png";
import compare_with_other from "../../../assets/Images/Compare_with_others.png";
import plan_your_lessons from "../../../assets/Images/Plan_your_lessons.png";

const LearningLanguageSection = () => {
  return (
    <div>
        <div className=' flex flex-col w-full gap-6 mt-24 mb-16 items-center justify-center'>
            <div className=' text-4xl font-semibold text-center'>
                  Your swiss knife for {" "}
                  <HighlightText text={"learning any language"}/>
                 
            </div>
            <div className=' text-center font-medium  text-richblack-700 mx-auto text-base w-[65%]'>
                  Using spin making learning multiple languages easy. with 20+ languages realistic voice-over, progress tracking, custom schedule and more.
            </div>
            <div className=' flex flex-row items-center justify-center mt-5'>
                  <img
                      src={know_your_progress}
                      alt='Know your progress'
                      className='onject-contain -mr-32'
                  />
                  <img
                      src={compare_with_other}
                      alt='Compare with others'
                      className='onject-contain'
                    />
                  <img
                      src={plan_your_lessons}
                      alt='Plan your lessons'
                      className='onject-contain -ml-32 '
                    />  
            </div>

            <div className=' w-fit'>
                <CTAButton active={true} linkto={'/signUp'}>
                    Learn More
                </CTAButton>
            </div>
        </div>
    </div>
  )
}

export default LearningLanguageSection