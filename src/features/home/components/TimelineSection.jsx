import React from 'react'

import Logo1 from "../../../assets/TimeLineLogo/Logo1.svg";
import Logo2 from "../../../assets/TimeLineLogo/Logo2.svg";
import Logo3 from "../../../assets/TimeLineLogo/Logo3.svg";
import Logo4 from "../../../assets/TimeLineLogo/Logo4.svg";
import Timelineimg from "../../../assets/Images/TimelineImage.png"

const timeline = [
    {
        Logo:Logo1,
        heading:"Leadership",
        Description:"Fully committed to the success company",
    },
    {
        Logo:Logo2,
        heading:"Responsibility",
        Description:"Students will always be our top priority",
    },
    {
        Logo:Logo3,
        heading:"Flexibility",
        Description:"The ability to switch is an important skills ",
    },
    {
        Logo:Logo4,
        heading:"Solve the problem",
        Description:"Code your way to a solution",
    }
]
const TimelineSection = () => {
  return (
    <div>
        <div className=' flex flex-col lg:flex-row gap-20 mb-20 items-center '>
            <div className=' flex flex-col lg:w-[45%] gap-14 lg:gap-3'>
                {timeline.map((element, index) => {
                    return (
                        <div className=' flex flex-col lg:gap-3' key={index}>
                            <div className=' flex gap-6' key={index}>
                                <div className='w-[52px] h-[52px] rounded-full justify-center bg-white flex items-center shadow-[#00000012] shadow-[0_0_62px_0] '>
                                    <img src={element.Logo} alt='logo'/>
                                </div>
                                <div>
                                    <h2 className=' font-semibold text-[18px]'>{element.heading}</h2>
                                    <p className=' text-base'>{element.Description}</p>
                                </div>
                            </div>  
                            <div
                                className={` hidden ${
                                    timeline.length - 1 === index 
                                    ? "hidden" : "lg:block"
                                    } h-14 border-dotted border-r border-richblue-100 bg-richblack-400/0 w-[26px]`}
                            ></div> 
                        </div>    
                    );
                })}
                </div>

                <div className=' relative w-fit h-fit shadow-blue-200 shadow-[0px_0px_30px_0px]   '>
                    <div className=' absolute lg:left-[50%]  lg:bottom-0 lg:translate-x-[-50%] lg:translate-y-[50%] bg-caribbeangreen-700 flex lg:flex-row  flex-col text-white uppercase py-5 gap-4 lg:gap-0 lg:py-10'>
                        {/* Section 01 */}
                        <div className=' flex gap-5 items-center lg:border-r border-caribbeangreen-300 px-7 lg:px-14'>
                            <h1 className=' text-3xl font-bold w-[75px]'>10</h1>
                            <h1 className=' text-sm text-caribbeangreen-300 w-[75px]'>
                                years experience
                            </h1>
                        </div>
                         {/* Section 02 */}
                        <div className=' flex items-center  gap-5 px-7 lg:px-14'>
                            <h1 className=' text-3xl font-bold w-[75px]'>250</h1>
                            <h1 className=' text-sm text-caribbeangreen-300 w-[75px]'>
                                Type of Courses
                            </h1>
                        </div>
                    </div>
                    <img src={Timelineimg}
                        alt='timelineimg'
                        className=' h-[400px] lg:h-fit shadow-[15px_15px_0px_0px] rounded-lg shadow-white object-covor'
                    />
            </div>
        </div>
    </div>
  )
}

export default TimelineSection