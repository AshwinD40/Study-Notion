import React from 'react'
import HighlightText from '../components/core/HomePage/HighlightText'
import img1 from "../assets/Images/aboutus1.webp"
import img2 from "../assets/Images/aboutus2.webp"
import img3 from "../assets/Images/aboutus3.webp"
import Quote from '../components/core/AboutPage/Quote'
import img4 from "../assets/Images/FoundingStory.png"
import StatsComponent from '../components/core/AboutPage/StatsComponent'
import LearningGrid from '../components/core/AboutPage/LearningGrid'
import ContactFormSection from '../components/core/AboutPage/ContactFormSection'
import Footer from "../components/common/Footer"
import ReviewSlider from "../components/common/ReviewSlider"

const About = () => {
  return (
    <div className='w-full  text-white justify-center  '>

        {/*section 01*/}
        <section className='bg-richblack-800 w-full  '>
            <div className=' w-11/12 pt-16 mx-auto max-w-maxContent '>
                <header className=' text-center text-4xl font-bold '>
                    Driving Innovation in Online Education for a <br/>
                    <HighlightText text={" Brighter Future"}/>
                    <p className=' text-sm px-[22%] text-richblack-500 mt-8 -mb-8'>Studynotion is at the forefront of driving innovation in online education. We are passionate about creating a brighter future by offering cutting-edge courses, leveraging emerging technologies, and nurturing a vibrant learning community.
                    </p>
                </header>
                <div className='flex flex-row justify-evenly translate-y-20 '>
                    <img 
                    src={img1}
                     alt="about us image 01"
                     className=' rounded-md'
                     />
                     <img 
                    src={img2}
                     alt="about us image 02"
                     className=' rounded-md'
                     />
                     <img 
                    src={img3}
                     alt="about us image 02"
                     className=' rounded-md'
                     />
                </div>
            </div>
        </section>

        {/*section 02*/}

        <section className='w-full'>
            <div className=' w-11/12 mx-auto max-w-maxContent mt-20'>
                <Quote/>      
            </div>
        </section>

        <div className='h-[1px] w-full bg-richblack-400 '></div>
        {/* Section 03*/}
        <section>
            <div className=' w-11/12 flex flex-col mx-auto max-w-maxContent'>
                <div className=' flex flex-row justify-between gap-6 my-20 '>
                    <div className='w-[50%] flex flex-col gap-5 px-20'>
                        <h1 className='inline-block font-bold text-transparent text-4xl bg-clip-text bg-gradient-to-r from-[#833AB4] via-[#FD1D1D]  to-[#FCB045]'>Our Founding Story </h1>
                        <p className=' text-sm font-semibold text-richblack-600'>Our e-learning platform was born out of a shared vision and passion for transforming education. It all began with a group of educators, technologists, and lifelong learners who recognized the need for accessible, flexible, and high-quality learning opportunities in a rapidly evolving digital world.</p>
                        <p className=' text-sm font-semibold text-richblack-600'>As experienced educators ourselves, we witnessed firsthand the limitations and challenges of traditional education systems. We believed that education should not be confined to the walls of a classroom or restricted by geographical boundaries. We envisioned a platform that could bridge these gaps and empower individuals from all walks of life to unlock their full potential.</p>
                    </div>
                    <div className=' w-[50%]'>
                        <img 
                            src={img4}
                            alt='founding story'
                            className='rounded-md mt-6 mx-10 lg:h-[250px] lg:w-[430px]'
                            />
                    </div>
                </div>
                <div className=' flex flex-row justify-between gap-6 my-20 '>
                    <div className='w-[50%] flex flex-col gap-5 px-20'>
                        <h1 className='inline-block font-bold text-transparent text-4xl bg-clip-text bg-gradient-to-r from-[#E65C00]   to-[#F9D423]'>Our Vision</h1>
                        <p className=' text-sm font-semibold text-richblack-600'>With this vision in mind, we set out on a journey to create an e-learning platform that would revolutionize the way people learn. Our team of dedicated experts worked tirelessly to develop a robust and intuitive platform that combines cutting-edge technology with engaging content, fostering a dynamic and interactive learning experience.</p>
                        
                    </div>
                    <div className='w-[50%] flex flex-col gap-5 px-10'>
                        <HighlightText text={"Our Mission"}/>
                        <p className=' text-sm font-semibold text-richblack-600'>our mission goes beyond just delivering courses online. We wanted to create a vibrant community of learners, where individuals can connect, collaborate, and learn from one another. We believe that knowledge thrives in an environment of sharing and dialogue, and we foster this spirit of collaboration through forums, live sessions, and networking opportunities.</p>
                    </div>
                </div>
            </div>
        </section>

        {/*section 04*/}
        <section>
            <StatsComponent/>
        </section>

        {/*section 05*/}
        <section className=' mx-auto flex flex-col gap-20 items-center justify-between mb-[140px]'>
            <LearningGrid/>
            <ContactFormSection/>
        </section>

        <section className='w-11/12 mx-auto max-w-maxContent'>
            <div className=' font-bold text-3xl text-center my-20'>
                Reviews from other learner
            </div>
            <ReviewSlider/>
        </section>

        <Footer/>
    </div>
  )
}

export default About