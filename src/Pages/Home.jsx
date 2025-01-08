import React from 'react'
import { IoMdArrowRoundForward } from "react-icons/io";
import { Link } from 'react-router-dom';
import HighlightText from '../components/core/HomePage/HighlightText';
import CTAButton from '../components/core/HomePage/Button';
import Banner from '../assets/Images/banner.mp4'
import CodeBlocks from '../components/core/HomePage/CodeBlocks';
import TimelineSection from '../components/core/HomePage/TimelineSection';
import LearningLanguageSection from '../components/core/HomePage/LearningLanguageSection';
import InstructorSection from '../components/core/HomePage/InstructorSection';
import ExploreMore from "../components/core/HomePage/ExploreMore";
import ReviewSlider from "../components/common/ReviewSlider"
import Footer from '../components/common/Footer';

const Home = () => {
  return (
    <div>
         {/*section 01*/}
            <div className=' relative mx-auto flex flex-col w-11/12 max-w-maxContent items-center text-white justify-between'>

            
                <Link to={"/signUp"}>

                    <div className=' group  mt-16 p-1 mx-auto  justify-center rounded-full bg-[#161D29] font-semibold text-richblack-100 transition-all duration-200 hover:scale-95 shadow-md w-fit shadow-richblack-600'>
                        <div className='group-hover:bg-richblack-900 flex flex-row rounded-full justify-center items-center gap-2 px-7 py-[6px]'>
                            <p>Become an Instructor</p>
                            <IoMdArrowRoundForward/>
                        </div>
                    </div>
                </Link>

                <div className=' text-center text-4xl font-semibold mt-8'>
                    Empower Your Future with {" "}
                    <HighlightText text={" Coding Skills"}/>
                </div>
                <div className='mt-4 w-[90%] text-center text-lg font-semibold text-richblack-300'>
                    With our online coding courses, you can learn at your own pace, from anywhere in the world, and get access to a <br/>wealth of resources, including hands-on projects, quizzes, and personalized feedback from instructors.  
                </div>

                <div className='flex flex-row gap-6 mt-8'>
                    <CTAButton active={true} linkto={'/signUp'}>
                        Learn More
                    </CTAButton>

                    <CTAButton active={false} linkto={'/signUp'}>
                        Book a Demo
                    </CTAButton>

                </div>
                <div className='absolute -ml-20 mt-96 -z-0 lg:h-[600px] lg:w-[80%] bg-blue-200 blur-3xl '></div>
                <div className=' z-10  mx-10 mt-14 mb-3 rounded-lg'>
                    <video 
                        muted
                        loop
                        autoPlay
                       className=' rounded-xl shadow-[12px_12px] shadow-white'
                    >
                    <source src={Banner} type='video/mp4'/>
                    </video>
                </div>
                {/* code section 01*/}
                <div>
                    <CodeBlocks           
                        position={"lg:flex-row"}
                        heading={
                            <div className=' text-4xl font-semibold'>
                                Unlock your {" "}
                                <HighlightText text={" coding potential "}/>
                                with our online courses.   
                            </div>
                        }
                        subheading={
                            "Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."
                        }
                        ctabtn1={
                            {
                                btnText:"Try it Yourself",
                                linkto:'/signUp',
                                active:true,
                            }
                        }
                        ctabtn2={
                            {
                                btnText:"Learn More",
                                linkto:'/login',
                                active:false,
                            }
                        }
                        backgroundGradient={<div className='absolute codeblock1'></div>  }

                        codeblock={`<!DOCTYPE html>\n<html>\n<head><title>Example</title>\n<linkrel="stylesheet"href="styles.css">\n</head>\n<body>\n<h1><ahref="/">Header</a>\n</h1>\n<nav><ahref="one/">One</a><ahref="two/">Two</>\n<a><ahref="three/">Three</a>\n</nav>`}
                        codeColor={"text-yellow-25"}
                        
                    
                    />
                </div>

                {/* code section 02*/}
                <div> 
                    <CodeBlocks
                        position={"lg:flex-row-reverse"}
                        heading={
                            <div className="w-[100%] text-4xl font-semibold lg:w-[50%]">
                                Start {" "}
                                <HighlightText text={` coding`}/> 
                                <br/>
                                <HighlightText text={"in seconds"}/>
                            </div>
                        }
                        subheading={
                            "Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."
                        }
                        ctabtn1={
                            {
                                btnText:"Continue Lesson",
                                linkto:'/signUp',
                                active:true,
                            }
                        }
                        ctabtn2={
                            {
                                btnText:"Learn More",
                                linkto:'/login',
                                active:false,
                            }
                        }

                        backgroundGradient={<div className="codeblock2 absolute"></div>  }
                        codeColor={"text-pink-200"}
                        codeblock={`<!DOCTYPE html>\n<html>\n<head><title>Example</title>\n<linkrel="stylesheet"href="styles.css">\n</head>\n<body>\n<h1><ahref="/">Header</a>\n</h1>\n<nav><ahref="one/">One</a><ahref="two/">Two</>\n<a><ahref="three/">Three</a>\n</nav>`}
                        
                    />
                </div>

                <ExploreMore/>
            </div>


         {/*section 02*/}
         <div className=' bg-pure-greys-5 text-richblack-700'>

            <div className=' homepage_bg h-[333px]'>
                     <div className=' w-11/12 max-w-maxContent flex flex-col items-center justify-between gap-5 mx-auto'>

                        <div className='lg:h-[150px]'></div>
                        <div className=' flex flex-row gap-7 text-whitelg:mt-8 '>
                            <CTAButton active={true} linkto={"/signUp"}>
                                <div className=' flex items-center gap-3'>
                                    Exploore Full Catlog
                                    <IoMdArrowRoundForward/>
                                </div>  
                            </CTAButton>
                            <CTAButton active={false} linkto={"/login"}>
                                <div>
                                    Learn More
                                </div>  
                            </CTAButton>

                        </div>
                     </div>       
            </div>
                        
            <div className=' mx-auto w-11/12 max-w-maxContent flex flex-col items-center justify-between gap-8'>

                <div className="mb-10 mt-[-100px] flex flex-col justify-between gap-7 lg:mt-20 lg:flex-row lg:gap-0">
                        <div className=' text-4xl font-semibold w-[50%]'>
                            Get the skills you need for a 
                            <HighlightText text={" job that is in demand."}/>
                        </div>
                        <div className=' flex flex-col gap-10 pr-6 w-[50%] items-start'>
                            <div className=' text-[16px]'>
                                The modern StudyNotion is the dictates its own terms. Today, to be a competitive specialist requires more than professional skills.
                            </div>
                            <CTAButton active={true} linkto={"/signUp"}>
                                <div>
                                    Learn More
                                </div>
                            </CTAButton>
                        </div>
                </div>

            <TimelineSection/>

            <LearningLanguageSection/>
            </div>

           
         </div>

         {/*section 03*/}
         <div className=' w-11/12 mx-auto max-w-maxContent fle flex-col justify-between gap-8 bg-richblack-900 text-white items-center'>
            <InstructorSection/>

            <h1 className=' text-center text-3xl font-bold mt-10'>Reviews from other learners</h1>
            
            {/*Reviews slider*/}
            <ReviewSlider/>
         </div>

         {/*footer */}
        <div className=' bg-[#161D29] '>
            <Footer/>
        </div>

    </div>
  )
}

export default Home
