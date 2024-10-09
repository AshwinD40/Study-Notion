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
    <div className=' mt-40'>

        <div className=' font-semibold text-4xl text-center'>
            Unlock The {" "}
            <HighlightText text={"Power Of Code"}/>
        </div>
        <p className=' text-center text-richblack-300 text-[16px] font-medium mt-6 '>Learn to Build Anything You can Imagine</p>
        
        <div className='w-[650px] ml-[300px] flex flex-row bg-richblack-800 rounded-full px-2 py-1 gap-4 my-10 shadow-sm shadow-pink-200'>
            {
                tabName.map((element, index) => {
                    return (
                        <div 
                        className={`text-[16px] flex flex-row items-center gap-2
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

        <div className=' lg:h-[200px]'>
            {/*course card group*/}
            <div className=' flex flex-row justify-between '>
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
    </div>
  )
}

export default ExploreMore