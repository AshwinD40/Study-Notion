import React from 'react'
import HighlightText from '../HomePage/HighlightText';
import CTAButton from "../../../components/core/HomePage/Button"

const learningGridArray = [
    {
        order: -1,
        heading:"World-Class Learning for",
        highlightText:"Anyone, Anywhere",
        description:
        "Studynotion partners with more than 275+ leading universities and companies to bring flexible, affordable, job-relevant online learning to individuals and organizations worldwide.",
        btnText:"Learn More",
        BtnLink: "/"
    },
    {
        order:1,
        heading:"Curriculum Based on Industry Needs",
        description:"Save time and money! The Belajar curriculum is made to be easier to understand and in line with industry needs."
    },
    {
        order:2,
        heading:"Our Learning Methods",
        description:"The learning process uses the namely online and offline."
    },
    {
        order:3,
        heading:"Certification",
        description:"You will get a certificate that can be used as a certification during job hunting."
    },
    {
        order:4,
        heading:`Rating "Auto-grading"`,
        description:"You will immediately get feedback during the learning process without having to wait for an answer or response from the mentor."
    },
    {
        order:5,
        heading:"Ready to Work",
        description:"Connected with over 150+ hiring partners, you will have the opportunity to find a job after graduating from our program."
    }
]


const LearningGrid = () => {

    
  return (
    <div className=' w-11/12 max-w-maxContent grid my-20 mx-auto mb-10 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-col-1 '>
        {
            learningGridArray.map((card, index) => {
                return (
                    <div key={index} 
                    className={`
                        ${index === 0 && "lg:col-span-2  bg-richblack-900 lg:h-[250px] px-5 py-2" }
                        ${card.order % 2 === 1 ? "bg-richblack-700 lg:h-[250px]" : "bg-richblack-800 lg:h-[250px]"}
                        ${card.order === 3 && " lg:col-start-2"}
                    `}
                    >
                        {
                            card.order < 0 ?
                            (
                                <div className=' flex flex-col gap-4 lg:w-[90%]'>
                                    <div className='text-4xl font-bold'>
                                        {card.heading} <br/>
                                        <HighlightText text={card.highlightText}/>
                                    </div>
                                    <p className=' text-sm text-richblack-500'>{card.description}</p>
                                    <div className='  mt-6 w-fit'>
                                        <CTAButton active={true} linkto={card.BtnLink}>
                                            {card.btnText}
                                        </CTAButton>
                                    </div>
                                </div>
                            ) : (
                                <div className=' flex flex-col gap-8 px-8 pt-8'>
                                    <h1 className=' text-xl font-bold'>{card.heading}</h1>
                                    <p className=' text-sm text-richblack-400'>{card.description}</p>
                                </div>
                            )
                        }
                    </div>
                )
            })

        }
    </div>
  )
}

export default LearningGrid