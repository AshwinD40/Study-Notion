import React, { useState } from 'react'
import {HomePageExplore} from "../../../data/homepage-explore";
import HighlightText from './HighlightText';
import CourseCard from './CourseCard';

const tabName = [
    "Free",
    "New to coding",
    "Most popular",
    "Skills paths",
    "Career paths"
]

const ExploreMore = () => {

    const [currentTab , setCurrentTab] = useState(tabName[0]);
    const [courses , setCourses] = useState(HomePageExplore[0].courses);
    const [currentCard , setCurrentCard] = useState(HomePageExplore[0].courses[0].heading);

    const setMyCard = (value) =>{
        setCurrentTab(value);
        const result = HomePageExplore.filter((courses)=> courses.tag === value);
        setCourses(result[0].courses);
        setCurrentCard(result[0].heading)
    }

  return (
    <div>
        {/* Explore more section */}
        <div>
            <div className=' font-semibold text-4xl text-center my-10'>
                Unlock The{' '}
                <HighlightText text={"Power Of Code"}/>
                <p className=' text-center text-richblack-300 text-[16px] font-semibold mt-1 '>Learn to Build Anything You can Imagine</p>
            </div>
        </div>
        
        
        {/*Tabs Section */}
        <div className='hidden lg:flex gap-5 -mt-5  mx-auto w-max  bg-richblack-800 rounded-full font-medium  p-1 drop-shadow-[0_1.5px_rgba(255,255,255,0.25)]'>
            {
                tabName.map((element, index) => {
                    return (
                        <div 
                        className={`text-[16px] flex flex-row  items-center gap-2
                            ${currentTab === element 
                            ? "bg-richblack-900 text-richblack-5 font-medium shadow-sm shadow-richblack-500" 
                            :"text-richblack-300"}
                            rounded-full transition-all duration-200 cursor-pointer
                            hover:bg-richblack-900 hover:text-richblack-5 hover:scale-95 px-4 py-2
                             `}
                            key={index}
                            onClick={() => setMyCard(element)}>
                            {element}
                        </div>
                    )
                })
            }

        </div>

        <div className=' hidden lg:block lg:h-[200px]'></div>

        {/*course card group*/}
        <div className='flex lg:absolute gap-10 justify-center lg:gap-0 lg:justify-between flex-wrap w-full lg:bottom-0 lg:left-[50%] lg:translate-x-[-50%] lg:translate-y-[50%] text-black lg:mb-0 mb-7 lg:px-0 px-3 '>
            {
                courses.map( (element, index)=>{
                    return(
                        <CourseCard
                        key={index}
                        cardData = {element}
                        currentCard = {currentCard}
                        setCurrentCard = {setCurrentCard}
                        />
                    )
                    } )
                }
        </div>
            
        
    </div>
  )
}

export default ExploreMore