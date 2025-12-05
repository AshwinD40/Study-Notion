import React from 'react'
import FoundingStory from "../assets/Images/FoundingStory.png"
import BannerImage1 from "../assets/Images/aboutus1.webp"
import BannerImage2 from "../assets/Images/aboutus2.webp"
import BannerImage3 from "../assets/Images/aboutus3.webp"
import Quote from '../components/core/AboutPage/Quote'
import StatsComponent from '../components/core/AboutPage/StatsComponent'
import HighlightText from '../components/core/HomePage/HighlightText'
import LearningGrid from '../components/core/AboutPage/LearningGrid'
import ContactFormSection from '../components/core/AboutPage/ContactFormSection'
import Footer from "../components/common/Footer"
import ReviewSlider from "../components/common/ReviewSlider"

const About = () => {
  return (
    <div>
      {/*section 01*/}
      <section className='bg-richblack-800'>
        <div className=' relative flex w-11/12 mx-auto max-w-maxContent flex-col justify-between text-center text-white gap-10 '>
          <header className=' mx-auto py-20 text-4xl font-bold lg:w-[70%] '>
            Driving Innovation in Online Education for a
            <HighlightText text={" Brighter Future"}/>
            <p className=' text-base text-center mx-auto font-medium lg:w-[95%] text-richblack-300 mt-3'>
              Studynotion is at the forefront of driving innovation in online education. We are passionate about creating a brighter future by offering cutting-edge courses, leveraging emerging technologies, and nurturing a vibrant learning community.
            </p>
          </header>
          <div className=' sm:h-[70px] lg:h-[150px]'></div>
          <div className=' absolute bottom-0 left-[50%] grid w-[100%] translate-x-[-50%] translate-y-[30%] grid-cols-3 gap-3 lg:gap-5 '>
            <img src={BannerImage1} alt="about us 01" className=' rounded-md'/>
            <img src={BannerImage2} alt="about us 02" className=' rounded-md'/>
            <img src={BannerImage3} alt="about us 02"    className=' rounded-md' />
          </div>
        </div>
      </section>

      {/*section 02*/}
      <section className='border-b border-richblack-700'>
        <div className=' w-11/12 mx-auto flex max-w-maxContent flex-col justify-between gap-10 text-richblack-500 '>
          <div className=' h-[100px]'></div>
          <Quote/>      
        </div>
      </section>

      {/* Section 03*/}
      <section>
        <div className=' w-11/12 flex flex-col mx-auto max-w-maxContent justify-between gap-10 text-richblack-500'>
          <div className=' flex flex-col items-center justify-between gap-6 lg:flex-row '>
            <div className='lg:w-[50%] my-24 flex flex-col gap-10'>
              <h1 className=' font-semibold lg:w-[70%] text-transparent text-4xl bg-clip-text bg-gradient-to-r from-[#833AB4] via-[#FD1D1D]  to-[#FCB045]'>
                Our Founding Story 
              </h1>
              <p className=' text-base font-semibold text-richblack-300 lg:w-[95%]'>
                Our e-learning platform was born out of a shared vision and passion for transforming education. It all began with a group of educators, technologists, and lifelong learners who recognized the need for accessible, flexible, and high-quality learning opportunities in a rapidly evolving digital world.
              </p>
              <p className=' text-base font-semibold text-richblack-300 lg:w-[95%]'>
                As experienced educators ourselves, we witnessed firsthand the limitations and challenges of traditional education systems. We believed that education should not be confined to the walls of a classroom or restricted by geographical boundaries. We envisioned a platform that could bridge these gaps and empower individuals from all walks of life to unlock their full potential.
              </p>
            </div>
            <div>
              <img 
                src={FoundingStory}
                alt='founding story'
                className=' rounded-md shadow-[0_0_20px_0] shadow-[#FC6767]'
              />
            </div>
          </div>
          <div className=' flex flex-col items-center lg:gap-10 lg:flex-row justify-between'>
            <div className='lg:w-[40%] flex flex-col gap-10 my-24'>
              <h1 className=' font-bold text-transparent text-4xl bg-clip-text bg-gradient-to-r from-[#E65C00] to-[#F9D423] lg:w-[70%]'>
                Our Vision
              </h1>
              <p className=' text-base font-medium text-richblack-300 lg:w-[95%]'>
                With this vision in mind, we set out on a journey to create an e-learning platform that would revolutionize the way people learn. Our team of dedicated experts worked tirelessly to develop a robust and intuitive platform that combines cutting-edge technology with engaging content, fostering a dynamic and interactive learning experience.
            </p>
                
            </div>
              <div className=' my-24 lg:w-[40%] flex flex-col gap-10'>
                <HighlightText text={"Our Mission"}/>
                <p className=' text-base font-medium text-richblack-300 lg:w-[95%]'>
                  our mission goes beyond just delivering courses online. We wanted to create a vibrant community of learners, where individuals can connect, collaborate, and learn from one another. We believe that knowledge thrives in an environment of sharing and dialogue, and we foster this spirit of collaboration through forums, live sessions, and networking opportunities.
                </p>
              </div>
          </div>
        </div>
      </section>

      {/*section 04*/}
      <section>
        <StatsComponent/>
      </section>

      {/*section 05*/}
      <section className=' w-11/12 max-w-maxContent mx-auto flex flex-col gap-10  justify-between text-white '>
        <LearningGrid/>
        <ContactFormSection/>
      </section>

      {/*section 03*/}
      <div className=' relative my-20 w-11/12 mx-auto max-w-maxContent   justify-between gap-8 bg-richblack-900 text-white items-center'>
        {/*Review from Other Learner */}
        <h1 className=' text-center text-4xl font-semibold mt-10'>
          Reviews from other learners
        </h1> 
        {/*Reviews slider*/}
        <ReviewSlider/>
      </div>

      <Footer/>
    </div>
  )
}

export default About