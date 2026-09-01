import React from 'react'

const HighlightText = ({text}) => {
  return (
    <span className=' font-bold inline-block text-transparent text-4xl bg-clip-text bg-gradient-to-r from-cyan-300 via-cyan-500 to-cyan-300'>
      {text}
    </span>
    
  )
}

export default HighlightText