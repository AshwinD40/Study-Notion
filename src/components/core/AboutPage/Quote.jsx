import React from 'react'
import HighlightText from '../HomePage/HighlightText'

const Quote = () => {
  return (
    <div className=' py-20 text-4xl font-bold text-center mx-auto w-[97%]'>
         We are passionate about revolutionizing the way we learn. Our <br/> innovative platform {" "}
        <HighlightText text={" combines technology "}/> ,{" "}
        <span className='inline-block text-transparent text-4xl bg-clip-text bg-gradient-to-r from-[#FF512F]  to-[#F09819]'>    
         expertise
        </span>
         , and community to create an {" "}
        <span className=' inline-block text-transparent text-4xl bg-clip-text bg-gradient-to-r from-[#E65C00]  to-[#F9D423]'> 
          unparalleled educational experience.
        </span>
        
        
    </div>
  )
  
} 

export default Quote