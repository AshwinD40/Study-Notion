import React from 'react'

const HighlightText = ({text}) => {
  return (
    <span className=' font-bold inline-block text-transparent text-4xl bg-clip-text bg-gradient-to-r from-[#1FA2FF] via-[#12D8FA] to-[#A6FFCB]'>
        {text}
    </span>
    
  )
}

export default HighlightText