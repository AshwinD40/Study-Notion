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
        <div className=' flex flex-row gap-20 items-center '>
                <div className=' flex flex-col w-[40%] gap-12 -ml-14'>
                    {
                        timeline.map((element, index) => {
                            return (
                                <div className=' flex flex-row gap-6' key={index}>

                                    <div className='w-[50px] h-[50px] rounded-full justify-center bg-white flex items-center '>
                                        <img src={element.Logo} alt='logo'/>
                                    </div>
                                    <div>
                                        <h2 className=' font-semibold text-[18px]'>{element.heading}</h2>
                                        <p>{element.Description}</p>
                                    </div>
                                </div>
                            )
                        })
                    }

                </div>

                <div className=' relative  '>
                    <div className='absolute mt-28  rounded-full h-[200px] w-full bg-blue-200 blur-3xl '></div>
                    <img src={Timelineimg}
                        alt='timelineimg'
                        className=' relative shadow-[15px_15px] shadow-white object-covor'
                    />

                    <div className=' absolute bg-caribbeangreen-700 flex flex-row text-white uppercase py-6 left-[50%] translate-x-[-50%] translate-y-[-50%]'>

                        <div className=' flex flex-row gap-5 items-center border-r border-caribbeangreen-300 px-7'>
                            <p className=' text-3xl font-bold'>10</p>
                            <p className=' text-sm text-caribbeangreen-300'>years of<br/> experience</p>
                        </div>
                        
                        <div className=' flex flex-row items-center gap-5 px-7'>
                            <p className=' text-3xl font-bold'>250</p>
                            <p className=' text-sm text-caribbeangreen-300'>Type of<br/>Courses</p>
                         </div>
                    </div>
                </div>
        </div>
    </div>
  )
}

export default TimelineSection